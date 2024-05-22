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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="模板名称" clearable></el-input>
                    </el-form-item>
                    <!-- todo -->
                </el-form>
            </div>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" stripe v-loading="listLoading" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="模板名称" width="320" align="center">
                    <template #default="scope">{{ scope.row.title }}</template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                    <template #default="scope">{{ scope.row.remark }}</template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="handleActiveSubmit(scope.row)">填写内容
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
import { useRouter } from 'vue-router'; //vue3路由跳转
import { usePagination } from "@/hooks/usePagination";
import { getAllActive} from "@/api/template"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter();

const listQuery = reactive({
    keyword: ''
})

const list = ref<any>([])
const total = ref(0);
const listLoading = ref(false);

function handleResetSearch() {
    listQuery.keyword = '';
}

function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function handleActiveSubmit(row: any) {
    router.push({ path: '/research/tempSubmit', query: { tempId: row.id } });
}

function getList() {
    listLoading.value = true;
    getAllActive({ keyword: listQuery.keyword,pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>