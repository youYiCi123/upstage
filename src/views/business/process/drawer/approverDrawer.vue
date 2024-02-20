<template>
    <el-drawer :append-to-body="true" title="审批人设置" v-model="visible" class="set_promoter" :show-close="false" :size="500" :before-close="saveApprover"> 
        <div class="demo-drawer__content">
            <div class="drawer_content">
                <div class="approver_content">
                    <el-radio-group v-model="approverConfig.settype" class="clear" @change="changeType">
                        <el-radio v-for="({value, label}) in setTypes" :key="value" :label="value">{{label}}</el-radio>
                    </el-radio-group>
                    <br/>
                    <el-button type="primary" @click="addApprover" v-if="approverConfig.settype==1" size="small">添加/修改成员</el-button>
                    <p class="selected_list" v-if="approverConfig.settype==1">
                        <span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.label}}
                            <img src="@/assets/images/process/add-close1.png" @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                        </span>
                        <a v-if="approverConfig.nodeUserList.length!=0" @click="approverConfig.nodeUserList=[]">清除</a>
                    </p>
                </div>
                <div class="approver_self_select" v-show="approverConfig.settype==4">
                    <el-radio-group v-model="approverConfig.selectMode" style="width: 100%;">
                        <el-radio v-for="({value, label}) in selectModes" :label="value" :key="value">{{label}}</el-radio>
                    </el-radio-group>
                    <h3>选择范围</h3>
                    <el-radio-group v-model="approverConfig.selectRange" style="width: 100%;" @change="changeRange">
                        <el-radio v-for="({value, label}) in selectRanges" :label="value" :key="value">{{label}}</el-radio>
                    </el-radio-group>
                    <br/>
                    <template v-if="approverConfig.selectRange==2">
                        <el-button type="primary" @click="addApprover" size="small">添加/修改成员</el-button>
                        <p class="selected_list">
                            <span v-for="(item,index) in approverConfig.nodeUserList" :key="index">{{item.label}}
                                <img src="@/assets/images/process/add-close1.png" @click="$func.removeEle(approverConfig.nodeUserList,item,'targetId')">
                            </span>
                            <a v-if="approverConfig.nodeUserList.length!=0&&approverConfig.selectRange!=1" @click="approverConfig.nodeUserList=[]">清除</a>
                        </p>
                    </template>
                </div>
                <div class="approver_some" v-if="(approverConfig.settype==1&&approverConfig.nodeUserList.length>1)||(approverConfig.settype==4&&approverConfig.selectMode==2)">
                    <p>多人审批时采用的审批方式</p>
                    <el-radio-group v-model="approverConfig.examineMode" class="clear">
                        <el-radio :label="1">依次审批</el-radio>
                        <br/>
                        <el-radio :label="2" v-if="approverConfig.settype!=2">会签(须所有审批人同意)</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="saveApprover">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
            <employees-dialog 
                v-model:visible="approverVisible"
                :data="checkedList"
                @checkedData="sureApprover"
            />
        </div>
    </el-drawer>
</template>
<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import $func from "@/utils/process";
import { setTypes, selectModes, selectRanges } from '@/utils/const'

import pinia from '@/store/index'
import { useProcessStore } from '@/store/modules/process'

import employeesDialog from '../dialog/employeesDialog.vue'

let approverConfig = ref<any>({})
let approverVisible = ref(false)
let checkedList = ref<any[]>([])

const processStore = useProcessStore(pinia);

let { setApproverConfig, setApprover } = processStore
let approverConfig1 = computed(()=> processStore.approverConfig1)
let approverDrawer = computed(()=> processStore.approverDrawer)
let visible = computed({
    get(){
        return approverDrawer.value
    },
    set(){
        closeDrawer()
    }
}) 

watch(approverConfig1, (val:any)=>{
    approverConfig.value = val.value
})
let changeRange = ()=> {
    approverConfig.value.nodeUserList = [];
}
//切换单选框
const changeType = (val:any)=> {
    approverConfig.value.nodeUserList = [];
    approverConfig.value.examineMode = 1;
    if (val == 2) {
        approverConfig.value.selectMode = 1;
        approverConfig.value.selectRange = 1;
    }
}

//打开选择成员对话框
const addApprover = ()=> {
    approverVisible.value = true;
    checkedList.value = approverConfig.value.nodeUserList
}
//关闭选择成员对话框
const sureApprover = (data:any)=> {
    approverConfig.value.nodeUserList = data;
    approverVisible.value = false;
}
const saveApprover = ()=> {
    console.log('2131',$func.setApproverStr(approverConfig.value))
    console.log('2131',approverConfig.value)
    approverConfig.value.error = !$func.setApproverStr(approverConfig.value)
    setApproverConfig({
        value: approverConfig.value,
        flag: true,
        id: approverConfig1.value.id
    })
    closeDrawer()
}
const closeDrawer = ()=> {
    setApprover(false)
}
</script>
<style lang="scss">
.set_promoter{
    .approver_content {
        padding-bottom: 10px;
        border-bottom: 1px solid #f2f2f2;
    }
    .approver_self_select,
    .approver_content{
        .el-button{
            margin-bottom: 20px;
        }
    }
    .approver_content,
    .approver_some,
    .approver_self_select{
        .el-radio-group{
            display: unset;
        }
        .el-radio{
            width: 27%;
            margin-bottom: 20px;
            height: 16px;
        }
    }
    .approver_manager p {
        line-height: 32px;
    }
    .approver_manager select {
        width: 420px;
        height: 32px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(217, 217, 217, 1);
    }
    .approver_manager p.tip {
        margin: 10px 0 22px 0;
        font-size: 12px;
        line-height: 16px;
        color: #f8642d;
    }
    .approver_self {
        padding: 28px 20px;
    }
    .approver_self_select,
    .approver_manager,
    .approver_content,
    .approver_some {
        padding: 20px 20px 0;
    }
    .approver_manager p:first-of-type,
    .approver_some p {
        line-height: 19px;
        font-size: 14px;
        margin-bottom: 14px;
    }
    .approver_self_select h3 {
        margin: 5px 0 20px;
        font-size: 14px;
        font-weight: bold;
        line-height: 19px;
    }
}
</style>