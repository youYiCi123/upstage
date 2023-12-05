<template>
    <div class="download-button-content">
        <el-button v-if="roundFlag" type="danger" :size="size" round @click="deleteFile">
            删除<i class="el-icon-delete el-icon--right" />
        </el-button>
        <el-button v-if="circleFlag" type="danger" :size="size" circle @click="deleteFile">
            <i class="el-icon-delete" />
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import {deleteFiles} from '../../../api/file'
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

function deleteFile() {
    if (props.item) {
        doDeleteFile(props.item.fileId)
        return
    }
    if (fileStore.multipleSelection && fileStore.multipleSelection.length > 0) {
        let fileIdArr = new Array()
        fileStore.multipleSelection.forEach(item => fileIdArr.push(item.fileId))
        doDeleteFile(fileIdArr.join('__,__'))
        return
    }
    ElMessage.error('请选择要删除的文件')
}
function doDeleteFile(fileIds: any) {
    ElMessageBox.confirm('文件删除后将不保存，您确定这样做吗？', '删除文件', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteFiles({
            fileIds: fileIds
        }).then(()=>{
            ElMessage.success('删除成功')
            emit('loadFileList')
        }).catch((res:any)=>{
        })
    }).catch(()=>{})
}
</script>

<style>
.download-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>