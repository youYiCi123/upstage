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
                    <el-form-item label="选择业务员：">
                        <el-cascader clearable @change="selectSalesPersonValue" :options="sendPersonOptions">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加客户</el-button>
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="depTable" :data="list" style="width: 100%;" stripe v-loading="listLoading"
                @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="客户名" width="250" align="center">
                    <template #default="scope">{{ scope.row.customName }}</template>
                </el-table-column>
                <el-table-column label="营业执照至" width="180" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.businessTimeType == 0">长期</span>
                        <span v-else v-html="timeFormat(scope.row.businessTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="许可证至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.licenseTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="联系人姓名" width="150" align="center">
                    <template #default="scope">{{ scope.row.contactName }}</template>
                </el-table-column>
                <el-table-column label="联系人电话" width="180" align="center">
                    <template #default="scope">{{ scope.row.contactPhone }}</template>
                </el-table-column>
                <el-table-column label="业务员" width="150" align="center">
                    <template #default="scope">{{ scope.row.salesPersonName }}</template>
                </el-table-column>
                <el-table-column label="统一信用代码" width="200" align="center">
                    <template #default="scope">{{ scope.row.creditCode }}</template>
                </el-table-column>
                <el-table-column label="住所" width="300" align="center">
                    <template #default="scope">{{ scope.row.address }}</template>
                </el-table-column>
                <el-table-column label="法人" width="150" align="center">
                    <template #default="scope">{{ scope.row.legalPerson }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
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
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from "dayjs";
import { useRouter } from 'vue-router'; //vue3路由跳转
import { fetchListWithChildren } from '@/api/dep';
//客户
import { getCustomList, deleteCustom, handleBatchDelete } from '@/api/custom';
const router = useRouter();
const listQuery = reactive({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    salesPersonId:''
})

const sendPersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const list = ref<any[]>([]) //所有客户信息
const total = ref(0)  //客户数量
const listLoading = ref(false);

//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

getList()

function handleSelectionChange(val: any[]) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}

function handleResetSearch() {
    Object.assign({}, listQuery);
}
function handleSearchList() {
    listQuery.pageNum = 1;
    getList();
}
function handleSizeChange(val: number) {
    listQuery.pageNum = 1;
    listQuery.pageSize = val;
    getList();
}
function handleCurrentChange(val: number) {
    listQuery.pageNum = val;
    getList();
}
function handleAdd() {
    router.push('/business/customAdd');
}

function handleUpdate(row: any) {
    router.push({ path: '/business/customUpdate', query: { id: row.id } });
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    const credentialDate = dayjs(date).format("YYYY-MM-DD")
    const nowDate = dayjs(new Date).format("YYYY-MM-DD")
    const diff = dayjs(credentialDate).diff(dayjs(nowDate), 'day');
    var html = credentialDate;
    if (diff < 0) {
        html += '<span style="font-size:12px; color: #f56c6c; margin-left: 4px">已过期</span>'
    } else if (0 < diff && diff < 90) {
        html += '<span style="font-size:12px; color: #f56c6c;  margin-left: 4px">' + diff + '天后到期</span>'
    }
    return html
}

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteCustom(row.id).then(response => {
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
        handleBatchDelete(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        })
    })
}

function getSendPersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        sendPersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
                }
            }
            sendPersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
    });
}
getSendPersonList()

function selectSalesPersonValue(newValue: any) {
    if (newValue != null) {
        listQuery.salesPersonId = newValue[1]
    } else {
        listQuery.salesPersonId = ''
    }
}

function getList() {
    listLoading.value = true;
    getCustomList(listQuery).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}


</script>
<style></style>
  
  
  