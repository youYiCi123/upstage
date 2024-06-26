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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="字段名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="字段类型：">
                        <el-select v-model="listQuery.quType" placeholder="请选择字段类型" clearable>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属模板：">
                        <el-select v-model="listQuery.tempId" style="width: 250px" clearable>
                            <el-option v-for="item in allTemps" :key="item.id" :label="item.title" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="default" class="btn-add" @click="handleAdd()" style="float:right; margin-bottom: 20px">添加
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="fildList" style="width: 100%;" stripe v-loading="listLoading" border>
                <el-table-column label="字段内容"  align="center">
                    <template #default="scope">{{ scope.row.quName }}</template>
                </el-table-column>
                <el-table-column label="字段类型" width="110" align="center">
                    <template #default="scope">
                        <el-tag :type=colorByType(scope.row.quType) style="cursor:pointer;">
                            <span v-html="TypeFormat(scope.row.quType)"></span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="195" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
                            编辑
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
import { ref, reactive, computed, watch } from "vue";
import { usePagination } from "@/hooks/usePagination";
import { getTempIdToName } from "@/api/template"
import { getFieldsBySearch,deleteField } from "@/api/field"
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from "dayjs";
import { useRouter } from 'vue-router'; //vue3路由跳转
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
    keyword: '',
    quType: '',
    tempId: ''
})
const fildList = ref<any[]>([]) //文件列表
const total = ref(0);
const listLoading = ref(false);

const options = [
    {
        value: 1,
        label: '评分',
    },
    {
        value: 2,
        label: '单选框',
    },
    {
        value: 3,
        label: '复选框',
    },
    {
        value: 4,
        label: '输入框',
    },
]

const allTemps = ref<any[]>([])

function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function handleResetSearch() {
    listQuery.keyword = '';
    listQuery.tempId = '';
    listQuery.quType = '';
}

function handleAdd() {
    router.push('/business/fieldAdd');
}

function handleUpdate(row: any) {
    router.push({ path: '/business/fieldUpdate', query: { id: row.id } });
}

function colorByType(type: number){
    switch (type) {
        case 1:
            return "";
        case 2:
            return "success";
        case 3:
            return "danger";
        case 4:
            return "warning";
        }
}

function TypeFormat(type: number) {
    switch (type) {
        case 1:
            return "评分";
        case 2:
            return "单选框";
        case 3:
            return "复选框";
        case 4:
            return "输入框";
        default:
            break
    }
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}

//删除
function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteField(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    }).catch((res:any)=>{});
}

function getList() {
    listLoading.value = true;
    getFieldsBySearch({
        keyword: listQuery.keyword, quType: listQuery.quType, tempId: listQuery.tempId,
        pageSize: paginationData.pageSize, pageNum: paginationData.currentPage
    }).then(response => {
        listLoading.value = false;
        fildList.value = response.data.list;
        total.value = response.data.total;
    });
}

function getTempSelector() {
    getTempIdToName().then(response => {
        allTemps.value = response.data
    })
}
getTempSelector()

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>