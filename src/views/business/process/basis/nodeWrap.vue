<template>
    <div class="node-wrap" v-if="nodeConfig.type < 3">
        <div class="node-wrap-box"
            :class="(nodeConfig.type == 0 ? 'start-node ' : '') + (isTried && nodeConfig.error ? 'active error' : '')">
            <div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
                <span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
                <template v-else>
                    <i v-if="nodeConfig.type == 1" class="iconfont icon-examine"></i>
                    <i v-else class="iconfont icon-_chaosongwode"></i>
                    <input v-if="isInput" type="text" class="ant-input editable-title-input" @blur="blurEvent()" v-focus
                        v-model="nodeConfig.nodeName" :placeholder="defaultText" />
                    <span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
                    <i class="iconfont icon-guanbi close" @click="delNode"></i>
                </template>
            </div>
            <div class="content" @click="setPerson">
                <div class="text">
                    <span class="placeholder" v-if="!showText">请选择{{ defaultText }}</span>
                    {{ showText }}
                </div>
                <i class="iconfont icon-xiangyoujiantou" style="font-size: 10px;"></i>
            </div>
            <!-- <div class="error_tip" v-if="isTried && nodeConfig.error">
                <i class="anticon anticon-exclamation-circle"></i>
            </div> -->
        </div>
        <addNode v-model:childNodeP="nodeConfig.childNode" />
    </div>
    <div class="branch-wrap" v-if="nodeConfig.type == 4">
        <div class="branch-box-wrap">
            <div class="branch-box">
                <button class="add-branch" @click="addTerm">添加条件</button>
                <div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
                    <div class="condition-node">
                        <div class="condition-node-box">
                            <div class="auto-judge" :class="isTried && item.error ? 'error active' : ''">
                                <div class="sort-left" v-if="index != 0" @click="arrTransfer(index, -1)">&lt;</div>
                                <div class="title-wrapper">
                                    <input v-if="isInputList[index]" type="text" class="ant-input editable-title-input"
                                        @blur="blurEvent(index)" v-focus
                                        v-model="item.nodeName" />
                                    <span v-else class="editable-title" @click="clickEvent(index)">{{ item.nodeName
                                    }}</span>
                                    <span class="priority-title" @click="setPerson(item.priorityLevel)">优先级{{
                                        item.priorityLevel }}</span>
                                    <i class="iconfont icon-guanbi close" @click="delTerm(index)"></i>
                                </div>
                                <div class="sort-right" v-if="index != nodeConfig.conditionNodes.length - 1"
                                    @click="arrTransfer(index)">&gt;</div>
                                <div class="content" @click="setPerson(item.priorityLevel)">{{
                                    $func.conditionStr(nodeConfig, index) }}</div>
                                <!-- <div class="error_tip" v-if="isTried && item.error">
                                    <i class="anticon anticon-exclamation-circle"></i>
                                </div> -->
                            </div>
                            <addNode v-model:childNodeP="item.childNode" />
                        </div>
                    </div>
                    <nodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode" />
                    <template v-if="index == 0">
                        <div class="top-left-cover-line"></div>
                        <div class="bottom-left-cover-line"></div>
                    </template>
                    <template v-if="index == nodeConfig.conditionNodes.length - 1">
                        <div class="top-right-cover-line"></div>
                        <div class="bottom-right-cover-line"></div>
                    </template>
                </div>
            </div>
            <addNode v-model:childNodeP="nodeConfig.childNode" />
        </div>
    </div>
    <nodeWrap v-if="nodeConfig.childNode" v-model:nodeConfig="nodeConfig.childNode" />
</template>
<script setup lang="ts">
import { onMounted, ref, watch, getCurrentInstance, computed } from "vue";
import $func from "@/utils/process";
import addNode from '@/views/business/process/basis/addNode.vue'
import pinia from '@/store/index'
import { useProcessStore } from '@/store/modules/process'
import { bgColors, placeholderList } from '@/utils/const'
let _uid = getCurrentInstance()!.uid;

let props = defineProps({
    nodeConfig: {
        type: Object,
        default: () => ({}),
    }
});

let defaultText = computed(() => {
    return placeholderList[props.nodeConfig.type]
});
let showText = computed(() => {
    console.log('props.nodeConfig',props.nodeConfig)
    if (props.nodeConfig.type == 0) return '所有人'
    if (props.nodeConfig.type == 1) return $func.setApproverStr(props.nodeConfig)
    return $func.copyerStr(props.nodeConfig)
});

let isInputList = ref<boolean[]>([]);
let isInput = ref(false);
const resetConditionNodesErr = () => {
    for (var i = 0; i < props.nodeConfig.conditionNodes.length; i++) {
        props.nodeConfig.conditionNodes[i].error = $func.conditionStr(props.nodeConfig, i) == "请设置条件" && i != props.nodeConfig.conditionNodes.length - 1;
    }
}
onMounted(() => {
    if (props.nodeConfig.type == 1) {
        props.nodeConfig.error = !$func.setApproverStr(props.nodeConfig);
    } else if (props.nodeConfig.type == 2) {
        props.nodeConfig.error = !$func.copyerStr(props.nodeConfig);
    } else if (props.nodeConfig.type == 4) {
        resetConditionNodesErr()
    }
});
let emits = defineEmits(["update:nodeConfig"]);

const processStore = useProcessStore(pinia);
let {
    setPromoter,
    setApprover,
    setCopyer,
    setCondition,
    setApproverConfig,
    setCopyerConfig,
    setConditionsConfig,
} = processStore;
let isTried = computed(() => processStore.isTried)
let approverConfig1 = computed(() => processStore.approverConfig1)
let copyerConfig1 = computed(() => processStore.copyerConfig1)
let conditionsConfig1 = computed(() => processStore.conditionsConfig1)

watch(approverConfig1, (approver: any) => {
    if (approver.flag && approver.id === _uid) {
        emits("update:nodeConfig", approver.value);
    }
});
watch(copyerConfig1, (copyer: any) => {
    if (copyer.flag && copyer.id === _uid) {
        emits("update:nodeConfig", copyer.value);
    }
});
watch(conditionsConfig1, (condition: any) => {
    if (condition.flag && condition.id === _uid) {
        emits("update:nodeConfig", condition.value);
    }
});
//打开节点名称输入框
const clickEvent = (index?: number) => {
    if (index || index === 0) {
        isInputList.value[index] = true;
    } else {
        isInput.value = true;
    }
};
//关闭节点名称输入框
const blurEvent = (index?: number) => {
    if (index || index === 0) {
        isInputList.value[index] = false;
        props.nodeConfig.conditionNodes[index].nodeName = props.nodeConfig.conditionNodes[index].nodeName || "条件";
    } else {
        isInput.value = false;
        props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText
    }
};
const delNode = () => {
    emits("update:nodeConfig", props.nodeConfig.childNode);
};
const addTerm = () => {
    let len = props.nodeConfig.conditionNodes.length + 1;
    props.nodeConfig.conditionNodes.push({
        nodeName: "条件" + len,
        type: 3,
        priorityLevel: len,
        conditionList: [],
        nodeUserList: [],
        childNode: null,
    });
    resetConditionNodesErr()
    emits("update:nodeConfig", props.nodeConfig);
};
const delTerm = (index: number) => {
    props.nodeConfig.conditionNodes.splice(index, 1);
    props.nodeConfig.conditionNodes.map((item: any, index: number) => {
        item.priorityLevel = index + 1;
        item.nodeName = `条件${index + 1}`;
    });
    resetConditionNodesErr()
    emits("update:nodeConfig", props.nodeConfig);
    if (props.nodeConfig.conditionNodes.length == 1) {
        if (props.nodeConfig.childNode) {
            if (props.nodeConfig.conditionNodes[0].childNode) {
                reData(props.nodeConfig.conditionNodes[0].childNode, props.nodeConfig.childNode);
            } else {
                props.nodeConfig.conditionNodes[0].childNode = props.nodeConfig.childNode;
            }
        }
        emits("update:nodeConfig", props.nodeConfig.conditionNodes[0].childNode);
    }
};
const reData = (data: any, addData: any) => {
    if (!data.childNode) {
        data.childNode = addData;
    } else {
        reData(data.childNode, addData);
    }
};
const setPerson = (priorityLevel: any) => {
    var { type } = props.nodeConfig;
    if (type == 0) {
        setPromoter(true);
    } else if (type == 1) {
        setApprover(true);
        setApproverConfig({
            value: {
                ...JSON.parse(JSON.stringify(props.nodeConfig)),
                ...{ setType: props.nodeConfig.setType ? props.nodeConfig.setType : 1 },
            },
            flag: false,
            id: _uid,
        });
    } else if (type == 2) {
        setCopyer(true);
        setCopyerConfig({
            value: JSON.parse(JSON.stringify(props.nodeConfig)),
            flag: false,
            id: _uid,
        });
    } else {
        setCondition(true);
        setConditionsConfig({
            value: JSON.parse(JSON.stringify(props.nodeConfig)),
            priorityLevel,
            flag: false,
            id: _uid,
        });
    }
};
const arrTransfer = (index: number, type = 1) => {
    //向左-1,向右1
    props.nodeConfig.conditionNodes[index] = props.nodeConfig.conditionNodes.splice(
        index + type,
        1,
        props.nodeConfig.conditionNodes[index]
    )[0];
    props.nodeConfig.conditionNodes.map((item: any, index: number) => {
        item.priorityLevel = index + 1;
    });
    resetConditionNodesErr()
    emits("update:nodeConfig", props.nodeConfig);
};
</script>
<style>
.error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
}

.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
}

.selected_list {
    margin-bottom: 20px;
    line-height: 30px;
}

.selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
}
</style>