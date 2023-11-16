<template>
    <el-row class="panel-group" :gutter="20">
        <el-col class="chatLeft" :span="4">
            <div >
                <div class="title">组织</div>
                <el-divider />
                <el-scrollbar class="list">
                    <el-tree ref="tree" accordion :data="deptUserDatas" :props="defaultProps" @node-click="handleNodeClick" />
                </el-scrollbar>
            </div>
        </el-col>
        <el-col  :span="20">
            <Preview v-if="flag" :userId="selectedUserId"></Preview>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { fetchListWithChildren } from '@/api/dep'
import Preview from '@/views/chat/organization/preview.vue'
import { CommonMode } from "@/mode/common/Option";
const defaultProps = { children: 'children', label: 'label' }
const deptUserDatas = ref<CommonMode[]>([])
const flag = ref(false);
const selectedUserId = ref("");
const tree = ref();
getProductCateList()
function getProductCateList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        deptUserDatas.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
                }
            }
            deptUserDatas.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
    });
}

function handleNodeClick(data: any) {
    if(tree.value.getCurrentNode().children==undefined){
        selectedUserId.value=data.value
        flag.value=true
    }else{
        flag.value=false
    }
}

</script>  
<style lang="scss" scoped>
.panel-group {
    height: 93vh;
    
    .chatLeft {
        background-color: #eeeeee;
        .title {
            padding: 10px;
            font-weight: bold;
        }
    }
}

.el-tree {
    background-color: transparent !important;
}
.el-divider--horizontal {
    margin: 5px 0;
}
</style>
