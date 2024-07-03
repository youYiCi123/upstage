<template>
    <div class="upload-button-content">
        <el-button v-if="roundFlag" :icon="Upload" id="uploadButton" :size="size" @click="uploadDialogVisible = true">
            上传
        </el-button>
        <el-button v-if="circleFlag" size="size" :icon="Upload" id="uploadButton" circle>
        </el-button>
        <div>
            <el-dialog title="文件上传" v-model="uploadDialogVisible" width="30%" :modal="false" :append-to-body="true"
                @opened="rebindUploader" center>
                <div class="upload-content" id="upload-content">
                    <div class="drag-content">
                        <div class="drag-icon-content">
                            <i class="iconfont icon-bg-upload" style="color: #b5bbb6;font-size: 70px;"></i>
                        </div>
                        <div class="drag-text-content">
                            <el-link :underline="false" type="info">将文件拖到此处,或</el-link>
                            <el-link :underline="false" type="primary">点击上传</el-link>
                        </div>
                    </div>
                </div>
                <div style="text-align: center">
                    <el-switch v-model="waterMarkFlag" class="ml-2" inline-prompt size="large"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="开启水印"
                        inactive-text="关闭水印" />
                </div>
            </el-dialog>
            <el-dialog title="文件预览列表" v-model="previewDialogVisible" width="30%" center>
                <div class="table-container">
                    <el-table ref="newsTable" :data="previewFileList" style="width: 100%;" border>
                        <el-table-column label="文件名" width="340">
                            <template #default="scope">
                                <span style="cursor:pointer;">{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" fixed="right">
                            <template #default="scope">
                                <el-button :icon="Delete" type="danger" circle @click="removeItem(scope.$index)">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <template #footer>
                    <el-button @click="previewDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureUpload">确 定({{ previewFileList.length }})</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Uploader from 'simple-uploader.js'
import { ElMessage } from 'element-plus';
import { getToken } from '../../../utils/auth'
import panUtil from '../../../utils/fileUtil'
import { MD5 } from '@/utils/md5'
import { secUpload, merge } from '../../../api/file'
const previewFileList = ref<any[]>([]);
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
import { useTaskStore } from "@/store/modules/taskStore";
import {
    Delete, Upload
} from '@element-plus/icons-vue'
const taskStore = useTaskStore(pinia);
const fileStore = useFileStore(pinia);

const waterMarkFlag = ref(false)
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
    }
})
const emit = defineEmits(['loadFileList'])
const uploadDialogVisible = ref(false);
const previewDialogVisible = ref(false);
const assignFlag = ref(false);

// 详细文档地址：https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
const fileOptions = {
    target: function (file: any, chunk: any) {
        if (panUtil.getChunkSize() && panUtil.getChunkSize() > 0) {
            return panUtil.getUrlPrefix() + '/file/upload/chunk-upload'
        }
        return panUtil.getUrlPrefix() + '/file/upload'
    },
    singleFile: !panUtil.getChunkSize() || panUtil.getChunkSize() <= 0, //单文件上传。覆盖式，如果选择了多个会把之前的取消掉。默认 false。
    chunkSize: panUtil.getChunkSize(),  //分块时按照该值来分。最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小
    forceChunkSize: false,   //是否强制所有的块都是小于等于 chunkSize 的值。默认是 false
    simultaneousUploads: 3,  //并发上传数
    fileParameterName: 'file', //上传文件时文件的参数名，默认 file。
    query: function (file: any, chunk: any) {
        return {}
    },
    headers: {
        Authorization: getToken()
    },
    checkChunkUploadedByResponse: function (chunk: any, message: any) {   //可选的函数用于根据 XHR 响应内容检测每个块是否上传成功了
        let objMessage = reactive<any>({})
        try {
            objMessage = JSON.parse(message)
        } catch (e) {
        }
        // fake response
        // objMessage.uploaded_chunks = [2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17, 20, 21]
        // check the chunk is uploaded
        return (objMessage.data.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0
    },
    maxChunkRetries: 0,  // 最大自动失败重试上传次数，值可以是任意正整数，如果是 undefined 则代表无限次，默认 0
    chunkRetryInterval: null, //重试间隔，值可以是任意正整数，如果是 null 则代表立即重试，默认 null
    progressCallbacksInterval: 500,
    successStatuses: [200, 201, 202],//认为响应式成功的响应码
    permanentErrors: [404, 415, 500, 501],//认为是出错的响应码
    initialPaused: false //初始文件 paused 状态，默认 false
}
// 实例化一个上传对象
const uploader = new Uploader(fileOptions)
function rebindUploader() {
    if (!uploader.support) ElMessage.error('本浏览器不支持simple-uploader，请更换浏览器重试')
    if (!assignFlag.value) {
        uploader.assignBrowse(document.getElementById('upload-content'))
        uploader.assignDrop(document.getElementById('upload-content'))
        assignFlag.value = true
    }
}
function initUploader() {
    taskStore.clear()
    // 如果不支持 需要降级的地方
    if (!uploader.support) ElMessage.error('本浏览器不支持simple-uploader，请更换浏览器重试')
    // this.uploader.assignBrowse(document.getElementById('drag-text'))
    // this.uploader.assignDrop(document.getElementById('upload-content'))
    // 绑定进队列
    uploader.on("filesAdded", filesAdded)
    // 绑定进度
    uploader.on("fileProgress", uploadProgress)
    // 上传成功监听
    uploader.on("fileSuccess", fileUploaded)
    // 上传全部完成调用
    uploader.on("complete", uploadComplete)
    // 上传出错调用
    uploader.on("fileError", uploadError)
}

function filesAdded(files: any, fileList: any, event: any) {
    // 插件在调用该方法之前会自动过滤选择的文件 去除正在上传的文件 新添加的文件就是第一个参数files
    uploadDialogVisible.value = false
    previewFileList.value = files
    previewDialogVisible.value = true
}

function uploadProgress(rootFile: any, file: any, chunk: any) {
    let uploadTaskItem = taskStore.getUploadTask(file.name)
    if (file.isUploading()) {
        if (uploadTaskItem.status !== panUtil.fileStatus.UPLOADING.code) {
            taskStore.updateStatus({
                filename: file.name,
                status: panUtil.fileStatus.UPLOADING.code,
                statusText: panUtil.fileStatus.UPLOADING.text
            })
        }
        taskStore.updateProcess({
            filename: file.name,
            speed: panUtil.translateSpeed(file.averageSpeed),
            percentage: Math.floor(file.progress() * 100),
            uploadedSize: panUtil.translateFileSize(file.sizeUploaded()),
            timeRemaining: panUtil.translateTime(file.timeRemaining())
        })
    }

}
function fileUploaded(rootFile: any, file: any, message: any, chunk: any) {
    let res = reactive<any>({})
    try {
        res = JSON.parse(message)
    } catch (e) {
    }
    if (res.code === 200) {
        if (res.data.mergeFlag) {
            doMerge(file)
        } else if (res.data.uploadedChunks && res.data.uploadedChunks.length === file.chunks.length) {
            doMerge(file)
        }
    } else {
        file.pause()
        taskStore.updateStatus({
            filename: file.name,
            status: panUtil.fileStatus.FAIL.code,
            statusText: panUtil.fileStatus.FAIL.text
        })
    }
}
function uploadComplete() {

}
function sureUpload() {
    previewDialogVisible.value = false
    const parentId = props.isDep ? fileStore.parentDepId : fileStore.parentId
    previewFileList.value.forEach((f: any) => {
        f.pause()
        if (f.size > panUtil.getMaxFileSize()) {
            throw new Error('文件：' + f.name + '大小超过了最大上传文件的限制（' + panUtil.translateFileSize(panUtil.getMaxFileSize()) + '）')
        }
        let taskItem = {
            target: f,
            filename: f.name,
            fileSize: panUtil.translateFileSize(f.size),
            uploadedSize: panUtil.translateFileSize(0),
            status: panUtil.fileStatus.PARSING.code,
            statusText: panUtil.fileStatus.PARSING.text,
            timeRemaining: panUtil.translateTime(Number.POSITIVE_INFINITY),
            speed: panUtil.translateSpeed(f.averageSpeed),
            percentage: 0,
            parentId: new String(parentId)
        }
        // 添加
        taskStore.add(taskItem)
        MD5(f.file, (e: any, md5: any) => {
            f['uniqueIdentifier'] = md5
            f.resume()
            taskStore.updateStatus({
                filename: f.name,
                status: panUtil.fileStatus.WAITING.code,
                statusText: panUtil.fileStatus.WAITING.text
            })
            // secUpload({ //秒传功能取消，避免相同文件在多个文件夹中出现
            //     pageType: props.isDep ? panUtil.fileFold.DEP : panUtil.fileFold.ENTERPRISE,
            //     filename: f.name,
            //     identifier: md5,
            //     parentId: parentId
            // }).then((res) => {
            //     if (res.code === 200 && res.message===null) {
            //         ElMessage.success('文件：' + f.name + ' 上传完成')
            //         f.cancel()
            //         taskStore.remove(f.name)
            //         emit('loadFileList')
            //         if (uploader.files.length === 0) {
            //             taskStore.updateViewFlag(false)
            //         }
            //     } else {
            //         f.resume()
            //         taskStore.updateStatus({
            //             filename: f.name,
            //             status: panUtil.fileStatus.WAITING.code,
            //             statusText: panUtil.fileStatus.WAITING.text
            //         })
            //     }
            // }).catch(() => {
            //     f.resume()
            //     taskStore.updateStatus({
            //         filename: f.name,
            //         status: panUtil.fileStatus.WAITING.code,
            //         statusText: panUtil.fileStatus.WAITING.text
            //     })
            // })
        })
    })
    taskStore.updateViewFlag(true)
}
function uploadError(rootFile: any, file: any, message: any, chunk: any) {
    taskStore.updateStatus({
        filename: file.name,
        status: panUtil.fileStatus.FAIL.code,
        statusText: panUtil.fileStatus.FAIL.text
    })
    taskStore.updateProcess({
        filename: file.name,
        speed: panUtil.translateSpeed(0),
        percentage: 0,
        uploadedSize: panUtil.translateFileSize(0),
        timeRemaining: panUtil.translateTime(Number.POSITIVE_INFINITY)
    })
}

function doMerge(file: any) {
    let uploadTaskItem = taskStore.getUploadTask(file.name)
    taskStore.updateStatus({
        filename: file.name,
        status: panUtil.fileStatus.MERGE.code,
        statusText: panUtil.fileStatus.MERGE.text
    })
    taskStore.updateProcess({
        filename: file.name,
        speed: panUtil.translateSpeed(file.averageSpeed),
        percentage: 99,
        uploadedSize: panUtil.translateFileSize(file.sizeUploaded()),
        timeRemaining: panUtil.translateTime(file.timeRemaining())
    })
    merge({//todo
        waterMarkFlag: waterMarkFlag.value,
        teamFlag: fileStore.teamFlag,
        pageType: props.isDep ? panUtil.fileFold.DEP : panUtil.fileFold.ENTERPRISE,
        filename: uploadTaskItem.filename,
        identifier: uploadTaskItem.target.uniqueIdentifier,
        parentId: uploadTaskItem.parentId,
        totalSize: uploadTaskItem.target.size
    }).then(() => {
        ElMessage.success('文件：' + file.name + ' 上传完成')
        uploader.removeFile(file)
        taskStore.remove(file.name)
        emit('loadFileList')
        if (uploader.files.length === 0) {
            taskStore.updateViewFlag(false)
        }
    }).catch(() => {
        file.pause()
        taskStore.updateStatus({
            filename: file.name,
            status: panUtil.fileStatus.FAIL.code,
            statusText: panUtil.fileStatus.FAIL.text
        })
    })
}

function removeItem(index: number) {
    const file = previewFileList.value.splice(index, 1)[0]
    uploader.removeFile(file)
}

onMounted(() => {
    initUploader()
})


</script>

<style>
.table-container {
    max-height: 340px;
    overflow-y: auto;
}

.upload-button-content {
    display: inline-block;
    margin-right: 10px;
}

.upload-content {
    width: 100%;
    height: 300px;
    line-height: 300px;
    display: flex;
    justify-content: center;
}

.upload-content .drag-content {
    border: 0.2em dashed #DCDFE6;
    border-radius: 1em;
    width: 80%;
    height: 250px;
    line-height: 250px;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.upload-content .drag-content:hover {
    border: 0.2em dashed #409EFF;
}

.upload-content .drag-content .drag-icon-content {
    height: 100px;
    line-height: 100px;
    width: 100px;
    margin-top: 25px;
}

.upload-content .drag-content .drag-icon-content .drag-icon {
    font-size: 7em;
    color: #DCDFE6;
}

.upload-content .drag-content .drag-text-content {
    display: block;
    height: 30px;
    line-height: 30px;
}
</style>