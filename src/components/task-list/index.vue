<template>
    <div>
        <el-badge :max="99" :value="taskStore.taskList.length" :hidden="taskStore.taskList.length <= 0" class="item"
            type="danger">
            <el-popover title="上传任务列表" placement="bottom-end" width="600" trigger="manual" :visible="taskStore.viewFlag">
                <div class="pan-upload-task-items-content">
                    <el-table empty-text="暂无传输任务" :data="taskStore.taskList" height="300px" style="width: 100%">
                        <el-table-column align="center" header-align="center" label="文件名称" prop="filename" width="120"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="文件状态" width="120">
                            <template #default="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>状态: {{ scope.row.statusText }}</p>
                                    <template #reference class="name-wrapper">
                                        <el-button v-show="scope.row.status === fileStatus.WAITING.code" size="small"
                                            :icon="Stopwatch" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.PAUSE.code" size="small"
                                            :icon="VideoPlay" type="warning" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.UPLOADING.code" size="small"
                                            :icon="Upload" type="success" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.FAIL.code" size="small"
                                            :icon="Warning" type="danger" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.PARSING.code" size="small"
                                            :icon="Loading" type="info" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.MERGE.code" size="small"
                                            :icon="MagicStick" type="primary" circle></el-button>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="上传进度" width="180">
                            <template #default="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>上传速度: {{ scope.row.speed }} </p>
                                    <p>上传大小: {{ scope.row.uploadedSize }}/{{ scope.row.fileSize }} </p>
                                    <p>剩余时间: {{ scope.row.timeRemaining }} </p>
                                    <template #reference class="name-wrapper">
                                        <el-progress :stroke-width="13" :color="colors"
                                            :percentage="scope.row.percentage"></el-progress>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" header-align="center" label="操作" width="180">
                            <template #default="scope">
                                <div v-show="scope.row.status === fileStatus.UPLOADING.code">
                                    <el-tooltip class="item" effect="light" content="暂停上传" placement="top">
                                        <el-button @click="pauseUpload(scope.row.filename)" size="small" type="info"
                                            :icon="VideoPause" circle></el-button>
                                    </el-tooltip>
                                </div>
                                <div v-show="scope.row.status === fileStatus.PAUSE.code">
                                    <el-tooltip class="item" effect="light" content="继续上传" placement="top">
                                        <el-button @click="resumeUpload(scope.row.filename)" size="small" type="success"
                                            :icon="VideoPlay" circle></el-button>
                                    </el-tooltip>
                                </div>
                                <div
                                    v-show="scope.row.status === fileStatus.UPLOADING.code || scope.row.status === fileStatus.WAITING.code || scope.row.status === fileStatus.PAUSE.code">
                                    <el-tooltip class="item" effect="light" content="取消上传" placement="top">
                                        <el-button @click="cancelUpload(scope.row.filename)" size="small"
                                            :icon="CircleClose" circle></el-button>
                                    </el-tooltip>
                                </div>
                                <div v-show="scope.row.status === fileStatus.FAIL.code">
                                    <el-tooltip class="item" effect="light" content="重新上传" placement="top">
                                        <el-button @click="retryUpload(scope.row.filename)" size="small" type="warning"
                                            :icon="Refresh" circle></el-button>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <template #reference>
                    <el-button @click="taskStore.changeViewFlag" size="default"
                        :icon="Sort"></el-button>
                </template>
            </el-popover>
        </el-badge>
    </div>
</template>

<script setup lang="ts">
import panUtil from '@/utils/fileUtil'
import { ElMessage } from 'element-plus';
import { Sort, Refresh, CircleClose, VideoPlay, VideoPause, Stopwatch, MagicStick, Loading, Upload, Warning } from '@element-plus/icons-vue'
import pinia from '@/store/index'
import { useTaskStore } from "@/store/modules/taskStore";
const taskStore = useTaskStore(pinia);
const colors = [
    { color: '#909399', percentage: 30 },
    { color: '#e6a23c', percentage: 70 },
    { color: '#67c23a', percentage: 100 }
]
const fileStatus = panUtil.fileStatus

function pauseUpload(filename: string | number) {
    taskStore.pause(filename)
}
function resumeUpload(filename: string | number) {
    taskStore.resume(filename)
}
function cancelUpload(filename: string | number) {
    taskStore.cancel(filename)
    ElMessage.info('文件：' + filename + ' 取消上传');
}
function retryUpload(filename: string | number) {
    taskStore.retry(filename)
}
</script>

<style scoped>
.pan-upload-task-items-content {
    height: 300px;
}

.pan-upload-task-items-content .infinite-list {
    height: 100%;
    overflow: auto;
}

.el-badge.item {
    margin-right: 10px;
    line-height: 38px;
}
</style>