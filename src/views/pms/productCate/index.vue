<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="handleAddProductCate()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable" style="width: 100%" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template #default="scope">
            <span v-html="levelFilter(scope.row.level)"></span>
          </template>
        </el-table-column>
        <el-table-column label="商品数量" width="100" align="center">
          <template #default="scope">{{ scope.row.productCount }}</template>
        </el-table-column>
        <el-table-column label="数量单位" width="100" align="center">
          <template #default="scope">{{ scope.row.productUnit }}</template>
        </el-table-column>
        <el-table-column label="导航栏" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleNavStatusChange(scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.navStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleShowStatusChange(scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" v-if="!disableNextLevel(scope.row.level)"
              @click="handleShowNextLevel(scope.row)">查看下级
            </el-button>
            <el-button size="small" v-else type="primary" 
              @click="returnPreLevel()">查看上级
            </el-button>
          </template>
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
import { useRouter, useRoute } from "vue-router";
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox } from 'element-plus';
import { ProductCateMode } from "@/mode/Prod/ProductCate";
import { fetchList, deleteProductCate, updateShowStatus, updateNavStatus } from '@/api/productCate'
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const list = ref<ProductCateMode[]>([])
const total = ref(0);
const listLoading = ref(true);
const parentId = ref(0);
const router = useRouter();
const route = useRoute();
watch(
  () => route.query,
  () => {
    resetParentId();
    getList();
  }
)

function resetParentId() {
  console.log("query值为：",route.query)
  paginationData.currentPage = 1;
  if (route.query.parentId != null) {
    parentId.value = route.query.parentId as unknown as number;
  } else {
    parentId.value = 0;
  }
}
function handleAddProductCate() {
  router.push('/pms/addProductCate');
}
function getList() {
  listLoading.value = true;
  fetchList(parentId.value, {pageNum:paginationData.currentPage,pageSize:paginationData.currentPage}).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

function handleNavStatusChange(row:ProductCateMode) {
  // let data = new URLSearchParams();
  let ids = [];
  ids.push(row.id)
  // data.append('ids', ids as unknown as string);
  // data.append('navStatus', row.navStatus as unknown as string);
  updateNavStatus({ids:ids,navStatus:row.navStatus}).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  });
}
function handleShowStatusChange(row:ProductCateMode) {
  // let data = new URLSearchParams();
  let ids = [];
  ids.push(row.id)
  // data.append('ids', ids as unknown as string);
  // data.append('showStatus', row.showStatus as unknown as string);
  updateShowStatus({ids:ids,showStatus:row.showStatus}).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  });
}

function handleShowNextLevel(row:ProductCateMode) {
  router.push({ path: '/pms/productCate', query: { parentId: row.id } })
}

function handleUpdate(row:ProductCateMode) {
  router.push({ path: '/pms/updateProductCate', query: { id: row.id } });
}
function handleDelete(row:ProductCateMode) {
  ElMessageBox.confirm('是否要删除该品牌', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteProductCate(row.id).then(response => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      });
      getList();
    });
  }).catch((res:any)=>{});
}

function levelFilter(value: number) {
  if (value === 0) {
    return '一级';
  } else if (value === 1) {
    return '二级';
  }
}
function disableNextLevel(value: number) {
  if (value === 0) {
    return false;
  } else {
    return true;
  }
}

function returnPreLevel(){
  router.back();
}
getList()
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)

</script>

<style scoped></style>
