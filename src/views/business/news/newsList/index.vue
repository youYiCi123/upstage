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
                <el-form :inline="true" :model="listQuery" size="default">
                    <el-form-item label="创建时间">
                        <DateTimeRangePicker :date="listQuery.date" :setDate="setDate" />
                    </el-form-item>
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="请输入主题" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="公告类型：">
                        <el-select v-model="listQuery.newsType" clearable placeholder="公告类型" style="width: 150px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" class="btn-add" @click="handleAdd()"
                style="float:right; margin-bottom: 20px;margin-left: 20px">添加
            </el-button>
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;"  stripe v-loading="listLoading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="公告标题" align="center" >
                    <template #default="scope">
                        <div @click="handleSelectNews(scope.row)" style="cursor: pointer;" class="file-name-content">{{ scope.row.theme }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="公告类型"  width="130" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.newsType== '1' ? 'warning' : 'success'" style="cursor:pointer;">
                            <span v-html="newsTypeFormat(scope.row.newsType)"></span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="编辑人" width="130" align="center">
                    <template #default="scope">{{ scope.row.createdAdminName }}</template>
                </el-table-column>
                <el-table-column label="创建时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createdTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" @click="handleContentUpdate(scope.row)">
                            编辑
                        </el-button>
                        <el-button size="small" type="primary" @click="handleSelectNews(scope.row)">查阅
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
import DateTimeRangePicker from '@/components/Time/DateTimeRangePicker.vue'
import { NewsTable } from "@/mode/business/NewsModel";
import { getAllNews, handleBatchDelete, deleteNews } from "@/api/news"
const listQuery = reactive({
    date: [],
    keyword: '',
    newsType: ''
})
const listLoading = ref(false);
const list = ref<NewsTable[]>([])  //所有新闻信息
const total = ref(0);  ////数量
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<NewsTable[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

const options =[
  {
    value: '1',
    label: '通知',
  },
  {
    value: '2',
    label: '公告',
  },
]

const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function handleResetSearch() {
    listQuery.date = [];
    listQuery.keyword = '';
    listQuery.newsType = '';
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
function newsTypeFormat(newsType: number) {
    if (newsType==1) {
        return '通知'
    }else{
        return '公告'
    }
}

function getList() {
    let dateStr = ''
    if (listQuery.date != null) {
        dateStr = listQuery.date.toString();
    }
    listLoading.value = true;  //todo
    getAllNews({ keyword: listQuery.keyword, date: dateStr, newsType: listQuery.newsType, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}
function handleDelete(row: NewsTable) {
    ElMessageBox.confirm('是否要删除该咨询?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteNews(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}
function handleAdd() {
    router.push('/business/newsContentAdd');
}

function handleContentUpdate(row: NewsTable) {
    router.push({ path: '/business/newsContentUpdate', query: { id: row.id } });
}
function setDate(value: any) {
    listQuery.date = value
}
function handleSelectionChange(val: any) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}
function batchDelete() {
    ElMessageBox.confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        handleBatchDelete(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        })
    })
}
function handleSelectNews(row: NewsTable) {
    router.push({ path: '/newsInfo', query: { id: row.id } });
}


/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

getList()
</script>