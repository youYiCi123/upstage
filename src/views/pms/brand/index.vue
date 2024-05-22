<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="searchBrandList()" type="primary" size="small">
          查询结果
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="品牌名称/关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addBrand()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="品牌首字母" width="100" align="center">
          <template #default="scope">{{ scope.row.firstLetter }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="品牌制造商" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleFactoryStatusChange(scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.factoryStatus">
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
        <el-table-column label="相关" width="220" align="center">
          <template #default="scope">
            <span>商品：</span>
            <el-button size="small" type="primary" link @click="getProductList(scope.row)">100
            </el-button>
            <span>评价：</span>
            <el-button size="small" type="primary" link @click="getProductCommentList(scope.row)">1000
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
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox } from 'element-plus';
import { BrandMode } from "@/mode/Prod/Brand";
import { fetchList, updateShowStatus, updateFactoryStatus, deleteBrand } from '@/api/brand'
const route = useRoute();
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const operates = [
  {
    label: "显示品牌",
    value: "showBrand"
  },
  {
    label: "隐藏品牌",
    value: "hideBrand"
  }
]
const operateType = ref("");
let listQuery = reactive({
  keyword: '',
  pageNum: paginationData.currentPage,
  pageSize: paginationData.pageSize
});
const total = ref(0);
const listLoading = ref(true);
const list = ref<BrandMode[]>([])
const multipleSelection = ref<BrandMode[]>([])

function getList() {
  listLoading.value = true;
  fetchList(listQuery).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

function handleSelectionChange(val:any) {
  multipleSelection.value = val;
}
function handleUpdate(row:BrandMode) {
  router.push({ path: '/pms/updateBrand', query: { id: row.id } })
}

function handleDelete(row:BrandMode) {
  ElMessageBox.confirm('是否要删除该品牌', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBrand(row.id).then(response => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      });
      getList();
    });
  }).catch((res:any)=>{});
}
function getProductList(row:BrandMode) {
  console.log(row);
}
function getProductCommentList(row:BrandMode) {
  console.log(row);
}

function handleFactoryStatusChange(row:BrandMode) {
  var data = new URLSearchParams();
  data.append("ids", row.id as unknown as string);
  data.append("factoryStatus", row.factoryStatus as unknown as string);
  updateFactoryStatus(data).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  }).catch(error => {
    if (row.factoryStatus === 0) {
      row.factoryStatus = 1;
    } else {
      row.factoryStatus = 0;
    }
  });
}

function handleShowStatusChange(row:BrandMode) {
  let data = new URLSearchParams();
  ;
  data.append("ids", row.id as unknown as string);
  data.append("showStatus", row.showStatus as unknown as string);
  updateShowStatus(data).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  }).catch(error => {
    if (row.showStatus === 0) {
      row.showStatus = 1;
    } else {
      row.showStatus = 0;
    }
  });
}

function searchBrandList() {
  listQuery.pageNum = 1;
  getList();
}

function handleBatchOperate() {
  console.log(multipleSelection);
  if (multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择一条记录',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  let showStatus = 0;
  if (operateType.value === 'showBrand') {
    showStatus = 1;
  } else if (operateType.value === 'hideBrand') {
    showStatus = 0;
  } else {
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
  let data = new URLSearchParams();
  data.append("ids", ids as unknown as string);
  data.append("showStatus", showStatus as unknown as string);
  updateShowStatus(data).then(response => {
    getList();
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  });
}

function addBrand() {
  router.push({ path: '/pms/addBrand' })
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>


