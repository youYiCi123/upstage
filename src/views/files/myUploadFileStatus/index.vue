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
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" placeholder="请输入文件名" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="操作时间: ">
                        <DateTimeRangePicker :date="listQuery.date" :setDate="setDate" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" stripe v-loading="listLoading" border>
                <el-table-column label="文件" align="center">
                    <template #default="scope">{{ scope.row.fileName }}</template>
                </el-table-column>
                <el-table-column label="上传时间" width="200" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="200" align="center">
                    <template #default="scope">
                        <el-tag :type=colorByType(scope.row.status)>
                            <span v-html="statusFormat(scope.row.status)"></span>   
                        </el-tag>
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
import { getMyUploadFileStatus } from '@/api/file';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
import pinia from "@/store/index";
import { useUserStore } from "@/store/modules/userStore";
const userStore = useUserStore(pinia);
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
    keyword:'',
    date: []
})
const listLoading = ref(false);
const list = ref<any[]>([])  //所有日志信息
const total = ref(0);  ////数量

function handleResetSearch() {
    listQuery.keyword='';
    listQuery.date = [];
}

function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function setDate(value: any) {
    listQuery.date = value
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function colorByType(type: number){
    switch (type) {
        case 0:
            return "warning";
        case 1:
            return "success";
        case 2:
            return "danger";
        }
}

function statusFormat(status: number) {
    if (status == null) {
        return '未知';
    }
    switch (status) { //0 待审核  1 审核通过  2 审核未通过/已删除
        case 0:
        return '待审核';
        case 1:
        return '审核通过';
        case 2:
        return '审核未通过/已删除';
        default:
        return '未知';
    }
}

function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getMyUploadFileStatus({ date: dateStr,keyword:listQuery.keyword, userId: userStore.id, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>