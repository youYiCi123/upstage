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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="企业名称或联系人姓名"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="经营授权有效期至">
                        <el-date-picker v-model="listQuery.businessAuthTime" type="daterange" start-placeholder="开始时间"
                            end-placeholder="结束时间" range-separator="-" size="default" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <!-- <el-button size="small" @click="downloadFile()">下载模板</el-button> -->
            <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加供应商</el-button>
            <!-- <el-upload class="upload" action="#" :show-file-list="false" :on-change="handleExcel" accept="'.xlsx','.xls'"
                :auto-upload="false" :headers="headers" style="float:right;margin-left: 20px;margin-bottom: 20px">
                <el-button size="small" type="primary">Excel导入</el-button>
            </el-upload> -->
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table  :data="list" style="width: 100%;" stripe v-loading="listLoading"
                @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="供应商名称" width="250" align="center">
                    <template #default="scope">{{ scope.row.supplierName }}</template>
                </el-table-column>
                <el-table-column label="组织机构代码" width="250" align="center">
                    <template #default="scope">{{ scope.row.organizeStructureCode }}</template>
                </el-table-column>
                <el-table-column label="营业执照至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.businessTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="许可证/备案编号" width="250" align="center">
                    <template #default="scope">{{ scope.row.recordNumber }}</template>
                </el-table-column>
                <el-table-column label="许可证至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.licenseTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="产品" width="150" align="center">
                    <template #default="scope">{{ scope.row.product }}</template>
                </el-table-column>
                <el-table-column label="质保协议有效期至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.qaAgreementTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="经营授权有效期至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.businessAuthTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="法人授权有效期至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.legalPersonAuthTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="其它" width="250" align="center">
                    <template #default="scope">{{ scope.row.other }}</template>
                </el-table-column>
                <el-table-column label="操作" width="230" align="center" fixed="right">
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
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch,ref, reactive } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import dayjs from "dayjs";
import { useRouter } from 'vue-router'; //vue3路由跳转
import { usePagination } from "@/hooks/usePagination";
import { getSupplierList,deleteSupplier,handleBatchDelete } from "@/api/suppliers";
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter();
const listQuery = reactive({
    businessAuthTime: [],
    keyword: ''
})
const listLoading = ref(false);
const list = ref<any>([])  //所有证书信息
const total = ref(0);  ////数量
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}

//时间格式化并计算当前到截至日期的时间
function timeFormatToHtml(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    const credentialDate = dayjs(date).format("YYYY-MM-DD")
    const nowDate = dayjs(new Date).format("YYYY-MM-DD")
    const diff = dayjs(credentialDate).diff(dayjs(nowDate), 'day');
    var html = credentialDate;
    if (diff < 0) {
        html += '<span style="font-size:12px; color: red; margin-left: 4px">已过期</span>'
    } else if (0 < diff) {
        html += '<span style="font-size:12px; color: #e6a23c;  margin-left: 4px">还剩余' + diff + '天</span>'
    } else {
        html += '<span style="font-size:12px; color: #f56c6c;  margin-left: 4px">请及时提交</span>'
    }
    return html
}

function handleResetSearch() {
    listQuery.businessAuthTime = [];
    listQuery.keyword = '';
}
function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function handleSelectionChange(val: any) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}

function handleAdd() {
    router.push('/business/supplierAdd');
}

function handleUpdate(row: any) {
    router.push({ path: '/business/supplierUpdate', query: { id: row.id } });
}

//删除
function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该供应商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteSupplier(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    }).catch((res:any)=>{})
}

//批量删除
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

function getList() {
    let businessAuthTimeStr = ''
    if (listQuery.businessAuthTime != null) {
        businessAuthTimeStr = listQuery.businessAuthTime.toString();
    }
    listLoading.value = true;  //todo
    getSupplierList({
        keyword: listQuery.keyword, businessAuthTime: businessAuthTimeStr,
        pageNum: paginationData.currentPage, pageSize: paginationData.pageSize
    }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })


</script>