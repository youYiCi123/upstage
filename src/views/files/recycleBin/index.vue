<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span style="color:red ; font-weight:bold ">注：删除功能被禁用，被删除的文件将在15天后自动清理</span>
            <el-button size="small" type="primary" @click="batchRecovery()" class="btn-add"  style="margin-left: 15px">批量恢复
            </el-button>
            <el-button size="small"  type="danger" disabled  @click="batchDelete()" class="btn-add" >批量删除
            </el-button>

        </el-card>
        <div class="table-container">
            <el-table v-loading="tableLoading" ref="fileTable" :data="fileList" stripe tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="文件名" prop="filename" sortable show-overflow-tooltip width="440">
                    <template #default="scope">
                        <i :class="getFileFontElement(scope.row.fileType)"
                            style="margin-right: 15px; font-size: 20px; cursor: pointer;" />
                        <span style="cursor:pointer;">{{ scope.row.filename }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="parentFilename" label="原位置" min-width="140" align="center">
                    <template #default="scope">
                        <el-link type="primary" data-clipboard-target="#copyText" @click="copyText" id="copyText">{{ scope.row.parentFilename
                        }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="fileSizeDesc" sortable label="大小" width="120" align="center">
                </el-table-column>
                <el-table-column prop="creatName" label="创建人" width="120" align="center">
                </el-table-column>
                <el-table-column label="删除日期" prop="updateTime" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button size="small" type="danger" disabled  @click="handleDelete(scope.row)" >彻底删除
                        </el-button>
                        <el-button size="small" type="primary" @click="handleRecover(scope.row)">文件恢复
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :layout="paginationData.layout" :current-page.sync="paginationData.currentPage"
                :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox,ElNotification } from 'element-plus';
import dayjs from "dayjs";
import Clipboard from 'clipboard';
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
import panUtil from '@/utils/fileUtil';
import { filesFromRecycleBin, recoveryFile, recoveryBatch, deleteRecycleFileById, deleteRecycleBatch } from '@/api/file'

//el-table多/全选后的存放文件数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放文件id的数组
const multipleSelectionId = ref<number[]>([])

const fileList = ref<any[]>([]) //文件列表
const total = ref(0);
const tableLoading = ref(false);

function copyText() {
    const clipboard = new Clipboard('#copyText')
    // 复制成功
    clipboard.on('success', () => {
        ElNotification({
            title: '已复制到剪切板，可粘贴',
			type: 'success'
		})
        // 释放内存
        clipboard.destroy()
    })
    // 复制失败
    clipboard.on('error', () => {
        ElNotification({
			title: '复制失败',
			type: 'error'
		})
        // 释放内存
        clipboard.destroy()
    })
}


function getList() {
    tableLoading.value = true;
    filesFromRecycleBin({ pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
        tableLoading.value = false;
        fileList.value = response.data.list;
        total.value = response.data.total;
    });
}

function getFileFontElement(type: any) {
    return panUtil.getFileFontElement(type)
}

function handleSelectionChange(val: any[]) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.fileId))
}

//批量删除
function batchDelete() {
    ElMessageBox.confirm('是否确认批量通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteRecycleBatch(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '审核成功!'
            });
            getList();
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消审核'
        });
    });
}
//批量恢复
function batchRecovery() {
    ElMessageBox.confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        recoveryBatch(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '恢复成功!'
            });
            getList();
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消恢复'
        });
    });
}
//恢复文件
function handleRecover(row: any) {
    ElMessageBox.confirm('是否要恢复该文件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        recoveryFile(row.fileId).then(response => {
            ElMessage({
                message: '恢复成功',
                type: 'success',
                duration: 1000
            });
            getList();
        });
    }).catch(() => { });
}
//彻底删除文件
function handleDelete(row: any) {
    ElMessageBox.confirm('是否要彻底删除该文件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteRecycleFileById(row.fileId).then(response => {
            ElMessage({
                message: '删除成功',
                type: 'success',
                duration: 1000
            });
            getList();
        });
    }).catch(() => { });
}

//时间格式化并计算当前到截至日期的时间
function timeFormatToHtml(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    const credentialDate = dayjs(date).format("YYYY-MM-DD")
    const futureDate = dayjs(date).add(15, "day").format("YYYY-MM-DD")
    const nowDate = dayjs(new Date).format("YYYY-MM-DD")
    const diff = dayjs(futureDate).diff(dayjs(nowDate), 'day');
    var html = credentialDate;
    html += '<span style="font-size:12px; color: #e6a23c;  margin-left: 4px">还剩余' + diff + '天</span>'
    return html
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>