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
                    <el-form-item label="选择模板：">
                        <el-select v-model="listQuery.tempId" clearable placeholder="请选择模板" style="width: 150px;">
                            <el-option v-for="item in allSurveyTypeList" :key="item.id" :label="item.title" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <DateTimeRangePicker :date="listQuery.date" :setDate="setDate" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" border stripe v-loading="listLoading">
                <el-table-column label="问卷" align="center">
                    <template #default="scope">
                        <div @click="handleSelectSurvey(scope.row)" class="file-name-content">{{ scope.row.tempName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="提交者"  width="160" align="center">
                    <template #default="scope">
                        <div class="file-name-content">{{ scope.row.userName }}</div>
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
                        <el-button size="small" type="primary" @click="handleSelectSurvey(scope.row)">查阅
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
import {getSurveyIdToName,} from "@/api/template"
import {getAllSurvey,deleteSurvey} from "@/api/survey"
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
    date: [],
    keyword: '',
    tempId: ''
})
const listLoading = ref(false);
const list = ref<any[]>([])  //所有问卷信息
const total = ref(0);  ////数量

const allSurveyTypeList = ref<any[]>([])

function handleResetSearch() {
    listQuery.date = [];
    listQuery.keyword = '';
    listQuery.tempId = '';
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

function getSurveySelector() {
  getSurveyIdToName().then(response => {
    allSurveyTypeList.value = response.data
  })
}

getSurveySelector()

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该问卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteSurvey(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}

function handleSelectSurvey(row: any) {
    router.push({ path: '/research/tempView', query: { tempId: row.tempId,relateId:row.id,userId:row.userId } });
}

function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getAllSurvey({ keyword: listQuery.keyword, date: dateStr, tempId: listQuery.tempId, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>