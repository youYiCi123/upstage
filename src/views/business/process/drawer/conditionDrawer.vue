<template>
    <el-drawer :append-to-body="true" title="条件设置" v-model="visible" class="condition_copyer" :show-close="false"
        :size="550" :before-close="saveCondition">
        <template #header="{ titleId, titleClass }">
            <h3 :id="titleId" :class="titleClass">条件设置</h3>
            <select v-model="conditionConfig.priorityLevel" class="priority_level">
                <option v-for="item in conditionsConfig.conditionNodes.length" :value="item" :key="item">优先级{{ item }}
                </option>
            </select>
        </template>
        <div class="demo-drawer__content">
            <div class="condition_content drawer_content">
                <p class="tip">当审批单同时满足以下条件时进入此流程</p>
                <ul>
                    <li v-for="(item, index) in conditionConfig.conditionList" :key="index">
                        <span class="ellipsis">{{ item.type == 1 ? '发起人' : item.showName }}：</span>
                        
                        <div v-if="item.type == 1">
                            <p :class="conditionConfig.nodeUserList.length > 0 ? 'selected_list' : ''"
                                @click.self="addConditionPerson" style="cursor:text">
                                <span v-for="(item1, index1) in conditionConfig.nodeUserList" :key="index1">
                                    {{ item1.label }}<img src="@/assets/images/process/add-close1.png"
                                        @click="$func.removeEle(conditionConfig.nodeUserList, item1, 'value')">
                                </span>
                                <input type="text" placeholder="请选择具体人员" v-if="conditionConfig.nodeUserList.length == 0"
                                    @click="addConditionPerson">
                            </p>
                        </div>
                        <!-- 复选框选项 -->
                        <div v-else-if="item.columnType == 'String' && item.showType == 3">
                            <p class="check_box">
                                 <a :class="$func.toggleStrClass(item, item1.id) && 'active'"
                                    @click="toStrChecked(item, item1.id)"
                                    v-for="(item1, index1) in item.child"
                                    :key="index1">{{ item1.value }}</a> 
                            </p>
                        </div>
                        <!-- 设置大小范围 -->
                        <div v-else>
                            <p>
                                <select v-model="item.optType" :style="'width:' + (item.optType == 6 ? 335 : 80) + 'px'"
                                    @change="changeOptType(item)">
                                    <option v-for="({ value, label }) in optTypes" :value="value" :key="value">{{ label }}
                                    </option>
                                </select>
                                <input v-if="item.optType != 6" type="text" :placeholder="'请输入' + item.showName"
                                    v-enter-number="2" v-model="item.zdy1">
                            </p>
                            <!-- 区间值范围设置 -->
                            <p v-if="item.optType == 6">
                                <input type="text" style="width:55px;" class="mr_10" v-enter-number="2" v-model="item.zdy1">
                                <select style="width:60px;" v-model="item.opt1">
                                    <option v-for="({ value, label }) in opt1s" :value="value" :key="value">{{ label }}
                                    </option>
                                </select>
                                <span class="ellipsis"
                                    style="display:inline-block;width:65px;vertical-align: text-bottom;">{{ item.showName }}</span>
                                <select style="width:60px;" class="ml_10" v-model="item.opt2">
                                    <option v-for="({ value, label }) in opt1s" :value="value" :key="value">{{ label }}
                                    </option>
                                </select>
                                <input type="text" style="width:55px;" v-enter-number="2" v-model="item.zdy2">
                            </p>
                        </div>
                        <a v-if="item.type == 1"
                            @click="conditionConfig.nodeUserList = []; $func.removeEle(conditionConfig.conditionList, item, 'columnId')">删除</a>
                        <a v-if="item.type == 2"
                            @click="$func.removeEle(conditionConfig.conditionList, item, 'columnId')">删除</a>
                    </li>
                </ul>
                <el-button type="primary" @click="addCondition">添加条件</el-button>
                <el-dialog title="选择条件" v-model="conditionVisible" :width="480" append-to-body class="condition_list">
                    <p>请选择用来区分审批流程的条件字段</p>
                    <p class="check_box">
                        <a :class="$func.toggleClass(conditionList, { columnId: 0 }, 'columnId') && 'active'"
                            @click="$func.toChecked(conditionList, { columnId: 0 }, 'columnId')">发起人</a>
                            <a v-for="(item, index) in conditions" :key="index"
                            :class="$func.toggleClass(conditionList, item, 'columnId') && 'active'"
                            @click="$func.toChecked(conditionList, item, 'columnId')">{{ item.showName }}</a>
                    </p>
                    <template #footer>
                        <el-button @click="conditionVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureCondition">确 定</el-button>
                    </template>
                </el-dialog>
            </div>
            <employees-dialog v-model:visible="conditionPersonVisible" :data="checkedList"
                @checkedData="sureConditionRole" />
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="saveCondition">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import $func from "@/utils/process"
import pinia from '@/store/index'
import { useProcessStore } from '@/store/modules/process'
const processStore = useProcessStore(pinia);

import { optTypes, opt1s } from '@/utils/const'
import { getConditions } from '@/api/workFlow'
import employeesDialog from '../dialog/employeesDialog.vue'

let conditionVisible = ref(false)
let conditionsConfig = ref<any>({
    conditionNodes: [],
})
let conditionConfig = ref<any>({})
let PriorityLevel = ref<any>('')
let conditions = ref<any[]>([])
let conditionList = ref<any[]>([])
let checkedList = ref<any[]>([])
let conditionPersonVisible = ref(false)

let { setCondition, setConditionsConfig } = processStore
let tableId = computed(() => processStore.tableId)
let conditionsConfig1 = computed(() => processStore.conditionsConfig1)
let conditionDrawer = computed(() => processStore.conditionDrawer)
let visible = computed({
    get() {
        return conditionDrawer.value
    },
    set() {
        closeDrawer()
    }
})
watch(conditionsConfig1, (val: any) => {
    conditionsConfig.value = val.value;
    PriorityLevel.value = val.priorityLevel
    conditionConfig.value = val.priorityLevel
        ? conditionsConfig.value.conditionNodes[val.priorityLevel - 1]
        : { nodeUserList: [], conditionList: [] }
})

const changeOptType = (item: any) => {
    if (item.optType == 1) {
        item.zdy1 = 2;
    } else {
        item.zdy1 = 1;
        item.zdy2 = 2;
    }
}

const toStrChecked = (item: any, key: any) => {
    let a = item.zdy1 ? item.zdy1.split(",") : []
    var isIncludes = $func.toggleStrClass(item, key);
    if (!isIncludes) {
        a.push(key)
        item.zdy1 = a.toString()
    } else {
        removeStrEle(item, key);
    }
}

const removeStrEle = (item: any, key: any) => {
    let a = item.zdy1 ? item.zdy1.split(",") : []
    var includesIndex;
    a.map((item: any, index: any) => {
        if (item == key) {
            includesIndex = index
        }
    });
    a.splice(includesIndex, 1);
    item.zdy1 = a.toString()
}
//打开添加条件对话框
const addCondition = () => {
    conditionList.value = [];
    conditionVisible.value = true;
    // getConditions({ processId: tableId.value }).then((res) => {
    getConditions({ processId: 1 }).then((res) => {
        conditions.value = res.data
    })
    if (conditionConfig.value.conditionList) {
        for (var i = 0; i < conditionConfig.value.conditionList.length; i++) {
            var { columnId } = conditionConfig.value.conditionList[i]
            if (columnId == 0) {
                conditionList.value.push({ columnId: 0 })
            } else {
                conditionList.value.push(conditions.value.filter(item => { return item.columnId == columnId; })[0])
            }
        }
    }
}
//关闭添加条件对话框
const sureCondition = () => {
    //1.弹窗有，外面无+
    //2.弹窗有，外面有不变
    for (var i = 0; i < conditionList.value.length; i++) {
        var { columnId, showName, showType, columnType, child } = conditionList.value[i];
        if ($func.toggleClass(conditionConfig.value.conditionList, conditionList.value[i], "columnId")) {
            continue;
        }
        //没有加上
        if (columnId == 0) {
            conditionConfig.value.nodeUserList = [];
            conditionConfig.value.conditionList.push({
                "type": 1,
                "columnId": columnId,
                "showName": '发起人'
            });
        } else {
            if (columnType == "Double") {
                conditionConfig.value.conditionList.push({
                    "showType": showType,
                    "columnId": columnId,
                    "type": 2,
                    "showName": showName,
                    "optType": "1",
                    "zdy1": "2",
                    "opt1": "<",
                    "zdy2": "",
                    "opt2": "<",
                    "columnType": columnType,
                })
            } else if (columnType == "String" && showType == "3") {
                conditionConfig.value.conditionList.push({
                    "showType": showType,
                    "columnId": columnId,
                    "type": 2,
                    "showName": showName,
                    "zdy1": "",
                    "columnType": columnType,
                    "child":child
                    // "fixedDownBoxValue": fixedDownBoxValue
                })
            }
        }
    }
    //3.弹窗无，外面有-
    for (let i = conditionConfig.value.conditionList.length - 1; i >= 0; i--) {
        if (!$func.toggleClass(conditionList.value, conditionConfig.value.conditionList[i], "columnId")) {
            conditionConfig.value.conditionList.splice(i, 1);
        }
    }
    conditionConfig.value.conditionList.sort(function (a: any, b: any) { return a.columnId - b.columnId; });
    conditionVisible.value = false;
}

//保存并退出该Drawer
const saveCondition = () => {
    closeDrawer()
    var a = conditionsConfig.value.conditionNodes.splice(PriorityLevel.value - 1, 1)//截取旧下标
    conditionsConfig.value.conditionNodes.splice(conditionConfig.value.priorityLevel - 1, 0, a[0])//填充新下标
    conditionsConfig.value.conditionNodes.map((item: any, index: number) => {
        item.priorityLevel = index + 1
    });
    for (var i = 0; i < conditionsConfig.value.conditionNodes.length; i++) {
        conditionsConfig.value.conditionNodes[i].error = $func.conditionStr(conditionsConfig.value, i) == "请设置条件" && i != conditionsConfig.value.conditionNodes.length - 1
    }
    setConditionsConfig({
        value: conditionsConfig.value,
        flag: true,
        id: conditionsConfig1.value.id
    })
}
const addConditionPerson = () => {
    conditionPersonVisible.value = true;
    checkedList.value = conditionConfig.value.nodeUserList
}
const sureConditionRole = (data: any) => {
    conditionConfig.value.nodeUserList = data;
    conditionPersonVisible.value = false;
}
const closeDrawer = () => {
    setCondition(false)
}
</script>
<style lang="scss">
.condition_copyer {
    .priority_level {
        position: absolute;
        top: 11px;
        right: 30px;
        width: 100px;
        height: 32px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(217, 217, 217, 1);
        font-size: 12px;
    }

    .condition_content {
        padding: 20px 20px 0;

        p.tip {
            margin: 20px 0;
            width: 460px;
            text-indent: 17px;
            line-height: 45px;
            background: rgba(241, 249, 255, 1);
            border: 1px solid rgba(64, 163, 247, 1);
            color: #46a6fe;
            font-size: 14px;
        }

        ul {
            max-height: 500px;
            overflow-y: scroll;
            margin-bottom: 20px;

            li {
                &>span {
                    float: left;
                    margin-right: 8px;
                    width: 70px;
                    line-height: 32px;
                    text-align: right;
                }

                &>div {
                    display: inline-block;
                    width: 335px;

                    &>p:not(:last-child) {
                        margin-bottom: 10px;
                    }
                }

                &:not(:last-child)>div>p {
                    margin-bottom: 20px;
                }

                &>a {
                    float: right;
                    margin-right: 10px;
                    margin-top: 7px;
                }

                select,
                input {
                    width: 100%;
                    height: 32px;
                    background: rgba(255, 255, 255, 1);
                    border-radius: 4px;
                    border: 1px solid rgba(217, 217, 217, 1);
                }

                select+input {
                    width: 245px;
                }

                select {
                    margin-right: 10px;
                    width: 100px;
                }

                p.selected_list {
                    padding-left: 10px;
                    border-radius: 4px;
                    min-height: 32px;
                    border: 1px solid rgba(217, 217, 217, 1);
                    word-break: break-word;
                }

                p.check_box {
                    line-height: 32px;
                }
            }
        }

        .el-button {
            margin-bottom: 20px;
        }
    }
}

.condition_list {
    .el-dialog__body {
        padding: 16px 26px;
    }

    p {
        color: #666666;
        margin-bottom: 10px;

        &>.check_box {
            margin-bottom: 0;
            line-height: 36px;
        }
    }
}</style>