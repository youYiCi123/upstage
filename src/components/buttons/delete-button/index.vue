<template>
    <div class="download-button-content">
        <el-button v-if="roundFlag" :icon="Delete" type="danger" :size="size" round @click="deleteFile">
            删除
        </el-button>
        <el-button v-if="circleFlag" :icon="Delete" type="danger" :size="size" circle @click="deleteFile">
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue'
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
function doDeleteFile(fileId: any) {
    ElMessageBox.confirm('文件删除后将移动至回收站，您确定这样做吗？', '删除文件', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        console.log("fileIds",fileId)
        deleteFiles({fileId}).then(()=>{
            ElMessage.success('删除成功')
            emit('loadFileList')
        }).catch((res:any)=>{
        })
    }).catch((res)=>{

    })
}
</script>

<style>
.download-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>