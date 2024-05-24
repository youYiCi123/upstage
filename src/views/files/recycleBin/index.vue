<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="small" type="primary" @click="batchDelete()" class="btn-add" style="margin-left: 20px">批量删除
            </el-button>
            <el-button size="small" type="danger" @click="batchRecovery()" class="btn-add">批量恢复
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
                <el-table-column prop="parentFilename" label="文件夹名称" min-width="140" align="center">
                    <template #default="scope">
                        <el-link type="primary">{{ scope.row.parentFilename
                        }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="fileSizeDesc" sortable label="大小" width="120" align="center">
                </el-table-column>
                <el-table-column prop="creatName" label="创建人" width="120" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" sortable align="center" label="修改日期" width="240">
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleRecover(scope.row)">恢复
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">彻底删除
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
import { ElMessage, ElMessageBox } from 'element-plus';
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
import panUtil from '@/utils/fileUtil';
import {filesFromRecycleBin,recoveryFile,recoveryBatch,deleteRecycleFileById,deleteRecycleBatch } from '@/api/file'


//el-table多/全选后的存放文件数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放文件id的数组
const multipleSelectionId = ref<number[]>([])

const fileList = ref<any[]>([]) //文件列表
const total = ref(0);
const tableLoading = ref(false);

function getList() {
    tableLoading.value = true;
    filesFromRecycleBin({pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
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

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>