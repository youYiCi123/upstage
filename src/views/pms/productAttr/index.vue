<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttrCate()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable" style="width: 100%" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200" align="center">
          <template #default="scope">{{ scope.row.attributeCount == null ? 0 : scope.row.attributeCount }}</template>
        </el-table-column>
        <el-table-column label="参数数量" width="200" align="center">
          <template #default="scope">{{ scope.row.paramCount == null ? 0 : scope.row.paramCount }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="getAttrList(scope.row)">属性列表
            </el-button>
            <el-button size="small" @click="getParamList(scope.row)">参数列表
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="handleClose()" width="30%">
      <el-form ref="productAttrCatForm" :model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="productAttrCate.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleConfirm(productAttrCatForm)">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from "vue-router";
import { usePagination } from "@/hooks/usePagination";
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetchList, createProductAttrCate, deleteProductAttrCate, updateProductAttrCate } from '@/api/productAttrCate'
import { ProductAttrCateMode } from "@/mode/Prod/ProductAttr";
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const list = ref<ProductAttrCateMode[]>([])
const total = ref(0);
const listLoading = ref(true);
const dialogVisible = ref(false);
const dialogTitle = ref('');
let productAttrCate = reactive({
  name: '',
  id: -1
});
const productAttrCatForm = ref<FormInstance>();
/** 验证规则 */
const rules: FormRules = {
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' }
  ]
};

function getList() {
  listLoading.value = true;
  fetchList({ pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  }).catch(()=>{});
}
function addProductAttrCate() {
  dialogVisible.value = true;
  dialogTitle.value = "添加类型";
}

function handleDelete(row: ProductAttrCateMode) {
  ElMessageBox.confirm('是否要删除该品牌', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteProductAttrCate(row.id).then(response => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      });
      getList();
    }).catch(()=>{});
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
}
function handleUpdate(row: ProductAttrCateMode) {
  dialogVisible.value = true;
  dialogTitle.value = "编辑类型";
  productAttrCate.name = row.name;
  productAttrCate.id = row.id;
}

function getAttrList(row: ProductAttrCateMode) {
  router.push({ path: '/pms/productAttrList', query: { cid: row.id, cname: row.name, type: 0 } })
}
function getParamList(row: ProductAttrCateMode) {
  router.push({ path: '/pms/productAttrList', query: { cid: row.id, cname: row.name, type: 1 } })
}
function handleConfirm(formEl: FormInstance | undefined) {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let data = new URLSearchParams();
      data.append("name", productAttrCate.name);
      if (dialogTitle.value === "添加类型") {
        createProductAttrCate(data).then(response => {
          ElMessage({
            message: '添加成功',
            type: 'success',
            duration: 1000
          });
          dialogVisible.value = false;
          getList();
        });
      } else {
        updateProductAttrCate(productAttrCate.id, data).then(response => {
          ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          dialogVisible.value = false;
          getList();
        });
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

function handleClose() {

}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>


