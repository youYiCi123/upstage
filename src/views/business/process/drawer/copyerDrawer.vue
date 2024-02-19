<template>
    <el-drawer :append-to-body="true" title="抄送人设置" v-model="visible" class="set_copyer" :show-close="false" :size="550" :before-close="saveCopyer"> 
        <div class="demo-drawer__content">
            <div class="copyer_content drawer_content">
                <el-button type="primary" @click="addCopyer">添加成员</el-button>
                <p class="selected_list">
                    <span v-for="(item,index) in copyerConfig.nodeUserList" :key="index">{{item.name}}
                        <img src="@/assets/images/process/add-close1.png" @click="$func.removeEle(copyerConfig.nodeUserList,item,'targetId')">
                    </span>
                    <a v-if="copyerConfig.nodeUserList&&copyerConfig.nodeUserList.length!=0" @click="copyerConfig.nodeUserList=[]">清除</a>
                </p>
                <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
                    <el-checkbox :label="1">允许发起人自选抄送人</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="demo-drawer__footer clear">
                <el-button type="primary" @click="saveCopyer">确 定</el-button>
                <el-button @click="closeDrawer">取 消</el-button>
            </div>
            <!-- <employees-role-dialog 
                v-model:visible="copyerVisible"
                :data="checkedList"
                @change="sureCopyer"
            /> -->
        </div>
    </el-drawer>
</template>
<script setup lang="ts">
import employeesRoleDialog from '../dialog/employeesRoleDialog.vue'
import $func from "@/utils/process";
import pinia from '@/store/index'
import { useProcessStore } from '@/store/modules/process'

import { ref, watch, computed } from 'vue'
let copyerConfig = ref<any>({})
let ccSelfSelectFlag = ref<any[]>([])
let copyerVisible = ref(false)
let checkedList = ref<any[]>([])
const processStore = useProcessStore(pinia);
let { setCopyerConfig, setCopyer } = processStore
let copyerDrawer = computed(()=> processStore.copyerDrawer)
let copyerConfig1 = computed(()=> processStore.copyerConfig1)
let visible = computed({
    get() {
        return copyerDrawer.value
    },
    set() {
        closeDrawer()
    }
})
watch(copyerConfig1, (val:any) => {
    copyerConfig.value = val.value;
    ccSelfSelectFlag.value = copyerConfig.value.ccSelfSelectFlag == 0 ? [] : [copyerConfig.value.ccSelfSelectFlag]
})

const addCopyer = () => {
    copyerVisible.value = true;
    checkedList.value = copyerConfig.value.nodeUserList
}
const sureCopyer = (data:any) => {
    copyerConfig.value.nodeUserList = data;
    copyerVisible.value = false;
}
const saveCopyer = () => {
    copyerConfig.value.ccSelfSelectFlag = ccSelfSelectFlag.value.length == 0 ? 0 : 1;
    copyerConfig.value.error = !$func.copyerStr(copyerConfig.value);
    setCopyerConfig({
        value: copyerConfig.value,
        flag: true,
        id: copyerConfig1.value.id
    })
    closeDrawer();
}
const closeDrawer = () => {
    setCopyer(false)
}    
</script>

<style lang="scss">
.set_copyer {
    .copyer_content {
        padding: 20px 20px 0;

        .el-button {
            margin-bottom: 20px;
        }

        .el-checkbox {
            margin-bottom: 20px;
        }
    }
}
</style>