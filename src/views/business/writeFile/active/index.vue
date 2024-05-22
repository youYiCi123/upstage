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
                <el-form :inline="true" :model="listQuery" size="default" label-width="120px">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="角色名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <DateTimeRangePicker :date="listQuery.date" :setDate="setDate" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" border stripe v-loading="listLoading">
                <el-table-column label="活动主题" align="center">
                    <template #default="scope">
                        <div @click="handleSelectActive(scope.row)" class="file-name-content">{{ scope.row.activeName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="模板"  width="180" align="center">
                    <template #default="scope">{{ scope.row.tempName }}
                    </template>
                </el-table-column>
                <el-table-column label="提交者"  width="180" align="center">
                    <template #default="scope">{{ scope.row.userName }}
                    </template>
                </el-table-column>
                <el-table-column label="提交时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="primary" @click="handleSelectActive(scope.row)">查阅
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
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'; //vue3路由跳转
import { ElMessage,ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
import DateTimeRangePicker from '@/components/Time/DateTimeRangePicker.vue'
import {getAllActive,deleteActive} from "@/api/active"
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
    date: [],
    keyword: ''
})
const listLoading = ref(false);
const list = ref<any[]>([])  //所有活动信息
const total = ref(0);  ////数量

function handleResetSearch() {
    listQuery.date = [];
    listQuery.keyword = '';
}

function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}
function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function setDate(value: any) {
    listQuery.date = value
}

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteActive(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}

function handleSelectActive(row: any) {
    router.push({ path: '/research/tempView', query: { tempId: row.tempId,relateId:row.id,userId:row.userId } });
}


function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getAllActive({ keyword: listQuery.keyword, date: dateStr, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })


</script>