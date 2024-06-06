<template>
    <div class="copy-button-content">
        <el-button v-if="roundFlag" :icon="DocumentCopy" :size="size" round @click="copyFile">
            复制到
        </el-button>
        <el-button v-if="circleFlag" :icon="DocumentCopy" :size="size" circle @click="copyFile">
        </el-button>
        <el-dialog title="复制文件" v-model="treeDialogVisible" @open="loadTreeData" @closed="resetTreeData" width="30%"
            :append-to-body=true :modal-append-to-body=false :center=true>
            <div class="tree-content">
                <el-tree class="tree" :data="treeData" empty-text="暂无文件夹数据" highlight-current ref="tree">
                    <template class="custom-tree-node"   #default="{ node, data }">
                        <i class="iconfont  icon-folder"
                            style="margin-right: 15px; font-size: 20px; cursor: pointer;" />
                        <span>{{ node.label }}</span>
                    </template>
                </el-tree>
            </div>
            <template #footer>
                <el-button @click="treeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doChoseTreeNodeCallBack" :loading="loading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import { ElMessage,ElTree} from 'element-plus';
import { DocumentCopy } from '@element-plus/icons-vue'
import {copy,getFolderTree} from '../../../api/file'
import panUtil from '@/utils/fileUtil'
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
const fileStore = useFileStore(pinia);

const props = defineProps({
    isDep: {
        type: Boolean,
        default: false
    },
    roundFlag: {
        type: Boolean,
        default: false
    },
    circleFlag: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: ''
    },
    item: {
        type: Object,
        default: null,
    },
})
const emit = defineEmits(['loadFileList'])

const treeDialogVisible = ref(false);
const treeData = ref<any[]>([]);
const loading = ref(false);
const tree = ref<InstanceType<typeof ElTree>>()
    
function copyFile() {
    if (!props.item && (!fileStore.multipleSelection || fileStore.multipleSelection.length == 0)) {
        ElMessage.error('请选择要复制的文件')
        return
    }
    treeDialogVisible.value = true
}
function doCopyFile(targetParentId:any) {
       let fileIds = ''
    if (props.item) {
        fileIds = props.item.fileId
    } else {
        let fileIdArr = new Array()
        fileStore.multipleSelection.forEach(item => fileIdArr.push(item.fileId))
        fileIds = fileIdArr.join('__,__')
    }
    copy({
        pageType:props.isDep?panUtil.fileFold.DEP:panUtil.fileFold.ENTERPRISE,
        fileIds: fileIds,
        targetParentId: targetParentId
    }).then(()=>{
        loading.value = false
        treeDialogVisible.value = false
        ElMessage.success('文件复制成功')
        emit('loadFileList')
    }).catch((res:any)=>{
        loading.value = false
        ElMessage.error(res.message)
    })
}
function doChoseTreeNodeCallBack() {
    loading.value = true
    let checkNode = tree.value?.getCurrentNode()
    if (!checkNode) {
        ElMessage.error('请选择文件夹')
        loading.value = false
        return
    }
    doCopyFile(checkNode.id)
}
function resetTreeData() {
    treeData.value = new Array()
}
function loadTreeData() {
    getFolderTree({ fileRootId: props.isDep?panUtil.fileFold.DEP:panUtil.fileFold.ENTERPRISE }).then((res:any)=>{
        treeData.value = res.data
    }).catch((res:any)=>{
        ElMessage.error(res.message)
    })
}
</script>

<style>
.copy-button-content {
    display: inline-block;
    margin-right: 10px;
}

.tree-content {
    height: 400px;
}

.tree-content .tree {
    height: 100%;
    overflow: auto;
}
</style>