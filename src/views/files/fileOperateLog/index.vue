<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
                    查询搜索
                </el-button>
                <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="listQuery" size="default" label-width="140px">
                    <el-form-item label="创建时间">
                        <DateTimeRangePicker :date="listQuery.date" :setDate="setDate" />
                    </el-form-item>
                    <el-form-item label="选择操作员：">
                        <el-cascader clearable  :options="operatePersonOptions"
                            @change="selectDepPersonal" style="width: 250px">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;"  stripe v-loading="listLoading"
                @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="操作人" width="150" align="center">
                    <template #default="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template #default="scope">{{ scope.row.operate }}</template>
                </el-table-column>
                <el-table-column label="文件" align="center">
                    <template #default="scope">{{ scope.row.fileName }}</template>
                </el-table-column>
                <el-table-column label="操作时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
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
import { ref, reactive,watch } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAllFileLog,deleteFileLog,handleBatchDeleteLog } from '@/api/file';
import { fetchListWithChildren } from '@/api/dep';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
    date: [],
    operatePersonId: ''
})
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])
const operatePersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const listLoading = ref(false);
const list = ref<any[]>([])  //所有日志信息
const total = ref(0);  ////数量
function handleResetSearch() {
    listQuery.date = [];
    listQuery.operatePersonId = '';
}

function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function setDate(value: any) {
    listQuery.date = value
}
function handleSelectionChange(val: any) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

getOperatePersonList()

function getOperatePersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        operatePersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
                }
            }
            operatePersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
    });
}

function selectDepPersonal(newValue: any) {
    if (newValue != null) {
        listQuery.operatePersonId = newValue[1]
    } else {
        listQuery.operatePersonId = ''
    }
}

function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getAllFileLog({date: dateStr, userId: listQuery.operatePersonId, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteFileLog(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}

function batchDelete() {
    ElMessageBox.confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        handleBatchDeleteLog(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        })
    })
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>