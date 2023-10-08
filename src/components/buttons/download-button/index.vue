<template>
    <div class="download-button-content">
        <el-button v-if="roundFlag" type="info" :size="size" round @click="downloadFile" :loading="loading">
            下载<i class="el-icon-download el-icon--right" />
        </el-button>
        <el-button v-if="circleFlag" type="info" :size="size" circle @click="downloadFile" :loading="loading">
            <i class="el-icon-download" />
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage} from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
const fileStore = useFileStore(pinia);

import panUtil from '../../../utils/fileUtil'
import { getToken } from '../../../utils/auth'

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

const loading = ref(false);

function downloadFile() {
    if (!props.item && (!fileStore.multipleSelection || fileStore.multipleSelection.length === 0)) {
        ElMessage.error('请选择要下载的文件')
        return
    }
    if (!props.item) {
        for (let i = 0, iLength = fileStore.multipleSelection.length; i < iLength; i++) {
            if (fileStore.multipleSelection[i].folderFlag === 1) {
                ElMessage.error('文件夹暂不支持下载')
                return
            }
        }
        doDownLoads(fileStore.multipleSelection,0)
    }
    if (props.item) {
        if (props.item.folderFlag === 1) {
            ElMessage.error('文件夹暂不支持下载')
            return
        }
        doDownload(props.item)
    }
}
function doDownload(item: any) {
    let url = panUtil.getUrlPrefix() + '/file/download?fileId=' + item.fileId ,
        filename = item.filename,
        link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
function doDownLoads(items:any, i:number) {
    if (items.length === i) {
        return
    }
    setTimeout(function () {
        doDownload(items[i]);
        i++
        doDownLoads(items, i)
    }, 500);
}


</script>

<style>
.download-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>