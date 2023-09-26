<template>
    <div class="pan-main-file-list-content">
        <el-table v-loading="tableLoading" ref="fileTable" :data="fileList" :height="tableHeight" tooltip-effect="dark"
            style="width: 100%" @selection-change="handleSelectionChange" @cell-mouse-enter="showOperation"
            @cell-mouse-leave="hiddenOperation">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="文件名" prop="filename" sortable show-overflow-tooltip min-width="750">
                <template #default="scope">
                    <div @click="clickFilename(scope.row)" class="file-name-content">
                        <i :class="getFileFontElement(scope.row.fileType)"
                            style="margin-right: 15px; font-size: 20px; cursor: pointer;" />
                        <span style="cursor:pointer;">{{ scope.row.filename }}</span>
                    </div>
                    <div class="file-operation-content">
                        <el-tooltip class="item" effect="light" content="下载" placement="top">
                            <download-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="重命名" placement="top">
                            <rename-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="删除" placement="top">
                            <delete-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="复制到" placement="top">
                            <copy-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="移动到" placement="top">
                            <transfer-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="searchFlag" prop="parentFilename" label="位置" min-width="120" align="center">
                <template #default="scope">
                    <el-link @click="goInFolder(scope.row.parentId)" type="primary">{{ scope.row.parentFilename }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="fileSizeDesc" sortable label="大小" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="creatName" label="创建人" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="updateTime" sortable align="center" label="修改日期" min-width="240">
            </el-table-column>
        </el-table>

        <el-image-viewer class="el-image-viewer" :initial-index="imgIndex" v-if="showViewer" :on-close="closeShowViewer"
            :url-list="imgUrl" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted,computed } from 'vue'
import { useRouter } from 'vue-router'; //vue3路由跳转
import { ElMessage,ElImageViewer } from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
import { useBreadcrumbStore } from "@/store/modules/breadcrumbStore";
const fileStore = useFileStore(pinia);
const breadcrumbStore = useBreadcrumbStore(pinia);

import DownloadButton from '../buttons/download-button/index.vue'
import DeleteButton from '../buttons/delete-button/index.vue'
import RenameButton from '../buttons/rename-button/index.vue'
import CopyButton from '../buttons/copy-button/index.vue'
import TransferButton from '../buttons/transfer-button/index.vue'
import {getBreadcrumbs} from '../../api/file'
import panUtil from '../../utils/fileUtil'
const router = useRouter();
const tableHeight = ref(window.innerHeight - 200);
const showViewer = ref(false);
const imgUrl = ref<any[]>([]);
const imgIndex = ref(0);

function handleSelectionChange(multipleSelection:any) {
    fileStore.setMultipleSelection(multipleSelection)
}
function showOperation(row:any, column:any, cell:any, event:any) {
    panUtil.showOperation(cell)
}
function hiddenOperation(row:any, column:any, cell:any, event:any) {
    panUtil.hiddenOperation(cell)
}
function clickFilename(row:any) {
    switch (row.fileType) {
        case 0:
            goInFolder(row.fileId)
            break
        case 3:
        case 4:
        case 10:
            showOffice(row)
            break
        case 5:
        case 6:
            showIframe(row)
            break
        case 7:
            showImg(row)
            break
        case 8:
            showMusic(row)
            break
        case 9:
            showVideo(row)
            break
        case 11:
            showCode(row)
        default:
            break
    }
}
function goInFolder(fileId:any) {
    getBreadcrumbs({
        fileId: fileId
    }).then((res:any)=>{
        breadcrumbStore.clear()
        breadcrumbStore.reset(res.data)
        fileStore.setSearchFlag(false)
        fileStore.setFileParentId(fileId)
        fileStore.loadFileList()
    }).catch((res:any)=>{
        ElMessage.error(res.message)
    })
}
function showOffice(row:any) {
    openNewPage('/preview/office/' + row.fileId + '/' + row.filename, 'PreviewOffice', {
        fileId: row.fileId,
    })
}
function showIframe(row:any) {
    openNewPage('/preview/iframe/' + row.fileId, 'PreviewIframe', {
        fileId: row.fileId
    })
}
function showImg(row:any) {
    imgUrl.value = new Array()
    let t = 0
    for (let i = 0, iLength = fileStore.fileList.length; i < iLength; ++i) {
        if (fileStore.fileList[i].fileType === 7) {
            imgUrl.value.push(panUtil.getPreviewUrl(fileStore.fileList[i].fileId))
            if (fileStore.fileList[i].fileId === row.fileId) {
                imgIndex.value = t
            }
            t++;
        }
    }
    showViewer.value = true
}
function showMusic(row:any) {
    openNewPage('/preview/music/' + row.parentId + '/' + row.fileId, 'PreviewMusic', {
        parentId: row.parentId,
        fileId: row.fileId
    })
}
function showVideo(row:any) {
    openNewPage('/preview/video/' + row.parentId + '/' + row.fileId, 'PreviewVideo', {
        fileId: row.fileId,
        parentId: row.parentId
    })
}
function showCode(row:any) {
    openNewPage('/preview/code/' + row.fileId, 'PreviewCode', {
        fileId: row.fileId
    })
}
function openNewPage(path:any, name:any, params:any) {
    const { href } = router.resolve({
        path: path,
        name: name,
        params: params
    })
    window.open(href, '_blank')
}
function getFileFontElement(type:any) {
    return panUtil.getFileFontElement(type)
}
function closeShowViewer() {
    showViewer.value = false
}
const searchFlag = computed(() => {
   return fileStore.searchFlag;
})
const tableLoading = computed(() => {
   return fileStore.tableLoading;
})

const fileList = computed(() => {
   return fileStore.fileList;
})

onMounted(() => {
    fileStore.setMultipleSelection(new Array())
})
</script>

<style>
.pan-main-file-list-content {
    width: 100%;
    height: 100%;
    margin-top: 20px;
}

.file-operation-content {
    display: none;
    position: absolute;
    right: 100px;
    top: 8px;
}

.el-image-viewer {
    width: 80%;
    height: 80%;
    margin-left: 10%;
    margin-top: 4%
}
</style>