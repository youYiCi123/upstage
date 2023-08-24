<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttr()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="140" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="商品类型" width="140" align="center">
          <template #default="scope">{{ $route.query.cname }}</template>
        </el-table-column>
        <el-table-column label="属性是否可选" width="120" align="center">
          <template #default="scope">
            <span v-html="selectTypeFilter(scope.row.selectType)"></span></template>
        </el-table-column>
        <el-table-column label="属性值的录入方式" width="150" align="center">
          <template #default="scope">
            <span v-html="inputTypeFilter(scope.row.inputType)"></span></template>
        </el-table-column>
        <el-table-column label="可选值列表" align="center">
          <template #default="scope">{{ scope.row.inputList }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary"
        size="small">
        确定
      </el-button>
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
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox } from 'element-plus';
import { ProductAttrMode } from "@/mode/Prod/ProductAttr";
import { fetchList, deleteProductAttr } from '@/api/productAttr'

const route = useRoute();
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const list = ref<ProductAttrMode[]>([])
const total = ref(0);
const listLoading = ref(true);
let listQuery = reactive({
  type: route.query.type,
  pageNum: paginationData.currentPage,
  pageSize: paginationData.pageSize
});
const operateType = ref("");
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<ProductAttrMode[]>([])
const operates = [
  {
    label: "删除",
    value: "deleteProductAttr"
  }
]

function getList() {
  listLoading.value = true;
  fetchList(route.query.cid, listQuery).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

function addProductAttr() {
  router.push({ path: '/pms/addProductAttr', query: { cid: route.query.cid, type: route.query.type } });
}

function handleSelectionChange(val:any) {
  multipleSelection.value = val;
}

function handleBatchOperate() {
  if (multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择一条记录',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  if (operateType.value !== 'deleteProductAttr') {
    ElMessage({
      message: '请选择批量操作类型',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  let ids = [];
  for (let i = 0; i < multipleSelection.value.length; i++) {
    ids.push(multipleSelection.value[i].id);
  }
  handleDeleteProductAttr(ids);
}

function handleUpdate(row:ProductAttrMode) {
  router.push({ path: '/pms/updateProductAttr', query: { id: row.id } });
}

function handleDeleteProductAttr(ids:any) {
  ElMessageBox.confirm('是否要删除该属性', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let data = new URLSearchParams();
    data.append("ids", ids);
    deleteProductAttr(data).then(response => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      });
      getList();
    });
  }).catch(()=>{ElMessage({
      type: 'info',
      message: '取消删除'
    });});
}

function handleDelete(row:ProductAttrMode) {
  let ids = [];
  ids.push(row.id);
  handleDeleteProductAttr(ids);
}

function inputTypeFilter(value:number) {
  if (value === 1) {
    return '从列表中选取';
  } else {
    return '手工录入'
  }
}
function selectTypeFilter(value:number) {
  if (value === 1) {
    return '单选';
  } else if (value === 2) {
    return '多选';
  } else {
    return '唯一'
  }
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>


