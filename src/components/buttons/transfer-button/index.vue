<template>
    <div class="transfer-button-content">
        <el-button v-if="roundFlag" :size="size" round @click="transferFile">
            移动到
        </el-button>
        <el-button v-if="circleFlag" icon="el-icon-position" :size="size" circle @click="transferFile">
        </el-button>
        <el-dialog title="移动文件" :visible.sync="treeDialogVisible" @open="loadTreeData" @closed="resetTreeData" width="30%"
            :append-to-body=true :modal-append-to-body=false :center=true>
            <div class="tree-content">
                <el-tree class="tree" :data="treeData" empty-text="暂无文件夹数据" highlight-current ref="tree">
                    <template class="custom-tree-node"  #default="{ node, data }">
                        <i class="iconfont  icon-folder-open"
                            style="margin-right: 15px; font-size: 20px; cursor: pointer;" />
                        <span>{{ node.label }}</span>
                    </template>
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="treeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doChoseTreeNodeCallBack" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { transfer, getFolderTree } from '../../../api/file'
import { ElMessage,ElTree } from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
const fileStore = useFileStore(pinia);

const props = defineProps({
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
const treeData = ref<any[]>([]);
const treeDialogVisible = ref(false);
const loading = ref(false);
const tree = ref<InstanceType<typeof ElTree>>()

function transferFile() {
    if (!props.item && (!fileStore.multipleSelection || fileStore.multipleSelection.length == 0)) {
        ElMessage.error('请选择要移动的文件')
        return
    }
    treeDialogVisible.value = true
}

function doTransferFile(targetParentId: any) {
    let fileIds = ''
    if (props.item) {
        fileIds = props.item.fileId
    } else {
        let fileIdArr = new Array()
        fileStore.multipleSelection.forEach(item => fileIdArr.push(item.fileId))
        fileIds = fileIdArr.join('__,__')
    }
    transfer({
        fileIds: fileIds,
        targetParentId: targetParentId
    }).then(()=>{
        loading.value = false
        treeDialogVisible.value = false
        ElMessage.success('文件移动成功')
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
    doTransferFile(checkNode.id)
}

function resetTreeData() {
    treeData.value = new Array()
}

function loadTreeData() {
    getFolderTree().then((res)=>{
        treeData.value = res.data
    }).catch((res)=>{
        ElMessage.error(res.message)
    })
}

</script>

<style>
.el-tree-node:focus>.el-tree-node__content {
    background-color: rgba(135, 206, 235, 0.3);
    color: #409eff;
    font-weight: bold;
}

.transfer-button-content {
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