<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="default" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template #default="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template #default="scope">
            <p>{{ scope.row.name }}</p>
            <p>品牌：{{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template #default="scope">
            <p>价格：￥{{ scope.row.price }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template #default="scope">
            <p>上架：
              <el-switch @change="handlePublishStatusChange(scope.row)" :active-value="1"
                :inactive-value="0" v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>新品：
              <el-switch @change="handleNewStatusChange(scope.row)" :active-value="1" :inactive-value="0"
                v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch @change="handleRecommendStatusChange(scope.row)" :active-value="1"
                :inactive-value="0" v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)"
              circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template #default="scope">{{ scope.row.sale }}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template #default="scope">
            <p v-html="verifyStatusFilter(scope.row.verifyStatus)"></p>
            <p>
              <el-button type="primary" link @click="handleShowVerifyDetail(scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
           
              <el-button size="small" @click="handleUpdateProduct(scope.row)">编辑
              </el-button>

              <!-- <el-button size="small" @click="handleShowLog(scope.row)">日志
              </el-button> -->
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
        layout="total, sizes,prev, pager, next,jumper" :page-size="paginationData.pageSize" :page-sizes="[5, 10, 15]"
        :current-page.sync="paginationData.currentPage" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="编辑货品信息" v-model="editSkuInfo.dialogVisible" width="40%">
      <span>商品货号：</span>
      <span>{{ editSkuInfo.productSn }}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in editSkuInfo.productAttr" :label="item.name" :key="item.id"
          align="center">
          <template #default="scope">
            {{ getProductSkuSp(scope.row, index) }}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="80" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" width="100" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, PropType, watch, computed, shallowRef } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { usePagination } from "@/hooks/usePagination";
import {
  fetchList,
  updateDeleteStatus as updateDelStatus,
  updateNewStatus as updateStatus,
  updateRecommendStatus as updateRecomStatus,
  updatePublishStatus as updatePubStatus
} from '@/api/product'
import { fetchList as fetchSkuStockList, update as updateSkuStockList } from '@/api/skuStock'
import { fetchList as fetchProductAttrList } from '@/api/productAttr'
import { fetchList as fetchBrandList } from '@/api/brand'
import { fetchListWithChildren } from '@/api/productCate'
import { ProdBrief } from "@/mode/Prod/Prod";
import { selectCommonMode } from "@/mode/common/Option";
const route = useRoute();
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const operates = [{
  label: "商品上架",
  value: "publishOn"
},
{
  label: "商品下架",
  value: "publishOff"
},
{
  label: "设为推荐",
  value: "recommendOn"
},
{
  label: "取消推荐",
  value: "recommendOff"
},
{
  label: "设为新品",
  value: "newOn"
},
{
  label: "取消新品",
  value: "newOff"
},
{
  label: "转移到分类",
  value: "transferCategory"
},
{
  label: "移入回收站",
  value: "recycle"
}]

const publishStatusOptions = [{
  value: 1,
  label: '上架'
}, {
  value: 0,
  label: '下架'
}]

const verifyStatusOptions = [{
  value: 1,
  label: '审核通过'
}, {
  value: 0,
  label: '未审核'
}]

const listQuery = reactive({
  keyword: null,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null,
  pageNum: 1,
  pageSize: 10
});

const editSkuInfo = reactive({
  dialogVisible: false,
  productId: null,
  productSn: '',
  productAttributeCategoryId: null,
  stockList: [],
  productAttr: [] as selectCommonMode[],
  keyword: null
})

const operateType = ref("");
const total = ref(0);
const listLoading = ref(true);
const list = ref<ProdBrief[]>([])
const selectProductCateValue = ref<any[]>([])
const productCateOptions = ref<any[]>([])
const multipleSelection = ref<any[]>([])
const brandOptions = ref<any[]>([])


getBrandList();
getProductCateList();


watch(selectProductCateValue, (newValue) => {
  if (newValue != null && newValue.length == 2) {
    listQuery.productCategoryId = newValue[1];
  } else {
    listQuery.productCategoryId = null;
  }
})
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

function verifyStatusFilter(value: any) {
  if (value === 1) {
    return '审核通过';
  } else {
    return '未审核';
  }
}



function getProductSkuSp(row:any, index:number) {
  let spData = JSON.parse(row.spData);
  if (spData != null && index < spData.length) {
    return spData[index].value;
  } else {
    return null;
  }
}

function getList() {
  listQuery.pageNum=paginationData.currentPage
  listQuery.pageSize=paginationData.pageSize
  listLoading.value = true;
  fetchList(listQuery).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}
function getBrandList() {
  fetchBrandList({ pageNum: 1, pageSize: 100 }).then(response => {
    brandOptions.value = [];
    let brandList = response.data.list;
    for (let i = 0; i < brandList.length; i++) {
      brandOptions.value.push({ label: brandList[i].name, value: brandList[i].id });
    }
  });
}
function getProductCateList() {
  fetchListWithChildren().then(response => {
    let list = response.data;
    productCateOptions.value = [];
    for (let i = 0; i < list.length; i++) {
      let children = [];
      if (list[i].children != null && list[i].children.length > 0) {
        for (let j = 0; j < list[i].children.length; j++) {
          children.push({ label: list[i].children[j].name, value: list[i].children[j].id });
        }
      }
      productCateOptions.value.push({ label: list[i].name, value: list[i].id, children: children });
    }
  });
}
function handleShowSkuEditDialog(index:number, row:any) {
  editSkuInfo.dialogVisible = true;
  editSkuInfo.productId = row.id;
  editSkuInfo.productSn = row.productSn;
  editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
  editSkuInfo.keyword = null;
  fetchSkuStockList(row.id, { keyword: editSkuInfo.keyword }).then(response => {
    editSkuInfo.stockList = response.data;
  });
  if (row.productAttributeCategoryId != null) {
    fetchProductAttrList(row.productAttributeCategoryId, { type: 0 }).then(response => {
      editSkuInfo.productAttr = response.data.list;
    });
  }
}
function handleSearchEditSku() {
  fetchSkuStockList(editSkuInfo.productId, { keyword: editSkuInfo.keyword }).then(response => {
    editSkuInfo.stockList = response.data;
  });
}
function handleEditSkuConfirm() {
  if (editSkuInfo.stockList == null || editSkuInfo.stockList.length <= 0) {
    ElMessage({
      message: '暂无sku信息',
      type: 'warning',
      duration: 1000
    });
    return
  }
  ElMessageBox.confirm('是否要进行修改', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    updateSkuStockList(editSkuInfo.productId, editSkuInfo.stockList).then(response => {
      ElMessage({
        message: '修改成功',
        type: 'success',
        duration: 1000
      });
      editSkuInfo.dialogVisible = false;
    });
  });
}
function handleSearchList() {
  paginationData.currentPage = 1;
  getList();
}
function handleAddProduct() {
  router.push({ path: '/pms/addProduct' });
}
function handleBatchOperate() {
  if (operateType == null) {
    ElMessage({
      message: '请选择操作类型',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  if (multipleSelection == null || multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择要操作的商品',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  ElMessageBox.confirm('是否要进行该批量操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let ids = [];
    for (let i = 0; i < multipleSelection.value.length; i++) {
      ids.push(multipleSelection.value[i].id);
    }
    switch (operateType.value) {
      case operates[0].value:
        updatePublishStatus(1, ids);
        break;
      case operates[1].value:
        updatePublishStatus(0, ids);
        break;
      case operates[2].value:
        updateRecommendStatus(1, ids);
        break;
      case operates[3].value:
        updateRecommendStatus(0, ids);
        break;
      case operates[4].value:
        updateNewStatus(1, ids);
        break;
      case operates[5].value:
        updateNewStatus(0, ids);
        break;
      case operates[6].value:
        break;
      case operates[7].value:
        updateDeleteStatus(1, ids);
        break;
      default:
        break;
    }
    getList();
  });
}
function handleSelectionChange(val:any) {
  multipleSelection.value = val;
}
function handlePublishStatusChange(row:any) {
  let ids = [];
  ids.push(row.id);
  updatePublishStatus(row.publishStatus, ids);
}
function handleNewStatusChange(row:any) {
  let ids = [];
  ids.push(row.id);
  updateNewStatus(row.newStatus, ids);
}
function handleRecommendStatusChange(row:any) {
  let ids = [];
  ids.push(row.id);
  updateRecommendStatus(row.recommandStatus, ids);
}
function handleResetSearch() {
  selectProductCateValue.value = [];
  Object.assign(listQuery, {})
}
function handleDelete(row:any) {
  ElMessageBox.confirm('是否要进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let ids = [];
    ids.push(row.id);
    updateDeleteStatus(1, ids);
  });
}
function handleUpdateProduct(row:any) {
  router.push({ path: '/pms/updateProduct', query: { id: row.id } });
}
function handleShowVerifyDetail(row:any) {
  console.log("handleShowVerifyDetail", row);
}
function handleShowLog(row:any) {
  console.log("handleShowLog", row);
}
function updatePublishStatus(publishStatus:any, ids:any) {
  let params = new URLSearchParams();
  params.append('ids', ids);
  params.append('publishStatus', publishStatus);
  updatePubStatus(params).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  });
}
function updateNewStatus(newStatus:any, ids:any) {
  let params = new URLSearchParams();
  params.append('ids', ids);
  params.append('newStatus', newStatus);
  updateStatus(params).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  });
}
function updateRecommendStatus(recommendStatus:any, ids:any) {
  let params = new URLSearchParams();
  params.append('ids', ids);
  params.append('recommendStatus', recommendStatus);
  updateRecomStatus(params).then(response => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1000
    });
  });
}
function updateDeleteStatus(deleteStatus:any, ids:any) {
  let params = new URLSearchParams();
  params.append('ids', ids);
  params.append('deleteStatus', deleteStatus);
  updateDelStatus(params).then(response => {
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 1000
    });
  });
  getList();
}


</script>
<style></style>


