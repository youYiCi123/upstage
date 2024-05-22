<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate" :rules="rules" ref="productCateFrom" label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productCate.parentId" placeholder="请选择分类">
          <el-option v-for="item in selectProductCateList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量单位：">
        <el-input v-model="productCate.productUnit"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="productCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productCate.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productCate.navStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类图标：">
        <single-upload @input="getNewIcon" :pic="productCate.icon"></single-upload>
      </el-form-item>
      <el-form-item v-for="(filterProductAttr, index) in filterProductAttrList" :label="filterLabelFilter(index)"
        :key="filterProductAttr.key">
        <el-cascader clearable v-model="filterProductAttr.value" :options="filterAttrs">
        </el-cascader>
        <el-button style="margin-left: 20px" @click.prevent="removeFilterAttr(filterProductAttr)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleAddFilterAttr()">新增</el-button>
      </el-form-item>
      <el-form-item label="关键词：">
        <el-input v-model="productCate.keywords"></el-input>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input type="textarea" :autosize="true" v-model="productCate.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(productCateFrom)">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm(productCateFrom)">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive } from "vue";
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchList, createProductCate, updateProductCate, getProductCate } from '@/api/productCate';
import { fetchListWithAttr } from '@/api/productAttrCate';
import { selectCommonMode, CommonMode } from "@/mode/common/Option";
import { getProductAttrInfo } from '@/api/productAttr';
import SingleUpload from '@/components/Upload/singleUpload.vue';
const router = useRouter();
const route = useRoute();
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})
const productCateFrom = ref<FormInstance>();
/** 验证规则 */
const rules: FormRules = {
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ]
};
const productCate = reactive({
  description: '',
  icon: '',
  keywords: '',
  name: '',
  navStatus: 0,
  parentId: 0,
  productUnit: '',
  showStatus: 0,
  sort: 0,
  productAttributeIdList: [] as any
});
const selectProductCateList = ref<selectCommonMode[]>([])
const filterAttrs = ref<CommonMode[]>([])
const filterProductAttrList = ref<any[]>([])
getContentInfo()
function getContentInfo() {
  if (props.isEdit) {
    getProductCate(route.query.id).then(response => {
      productCate.name = response.data.name;
      productCate.keywords = response.data.keywords;
      productCate.icon = response.data.icon;
      productCate.description = response.data.description;
      productCate.navStatus = response.data.navStatus;
      productCate.parentId = response.data.parentId;
      productCate.productAttributeIdList = response.data.productAttributeIdList;
      productCate.productUnit = response.data.productUnit;
      productCate.showStatus = response.data.showStatus;
      productCate.sort = response.data.sort;
    });
    getProductAttrInfo(route.query.id).then(response => {
      if (response.data != null && response.data.length > 0) {
        filterProductAttrList.value = [];
        for (let i = 0; i < response.data.length; i++) {
          filterProductAttrList.value.push({
            key: Date.now() + i,
            value: [response.data[i].attributeCategoryId, response.data[i].attributeId]
          })
        }
      }
    });
  }
  getSelectProductCateList();
  getProductAttrCateList();
}


function getSelectProductCateList() {
  fetchList(0, { pageSize: 100, pageNum: 1 }).then(response => {
    selectProductCateList.value = response.data.list;
    selectProductCateList.value.unshift({ id: 0, name: '无上级分类' });
  });
}
function getProductAttrCateList() {
  fetchListWithAttr().then(response => {
    let list = response.data;
    for (let i = 0; i < list.length; i++) {
      let productAttrCate = list[i];
      let children = [];
      if (productAttrCate.productAttributeList != null && productAttrCate.productAttributeList.length > 0) {
        for (let j = 0; j < productAttrCate.productAttributeList.length; j++) {
          children.push({
            label: productAttrCate.productAttributeList[j].name,
            value: productAttrCate.productAttributeList[j].id
          })
        }
      }
      filterAttrs.value.push({ label: productAttrCate.name, value: productAttrCate.id, children: children });
    }
  }).catch(() => { });
}
function getProductAttributeIdList() {
  //获取选中的筛选商品属性
  let productAttributeIdList = [];
  for (let i = 0; i < filterProductAttrList.value.length; i++) {
    let item = filterProductAttrList.value[i];
    if (item.value !== null && item.value.length === 2) {
      productAttributeIdList.push(item.value[1]);
    }
  }
  return productAttributeIdList;
}
function onSubmit(formEl: FormInstance | undefined) {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('是否提交数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (props.isEdit) {
          productCate.productAttributeIdList = getProductAttributeIdList();
          updateProductCate(route.query.id, productCate).then(response => {
            ElMessage({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            router.back()
          });
        } else {
          productCate.productAttributeIdList = getProductAttributeIdList();
          createProductCate(productCate).then(response => {
            resetForm(formEl);
            ElMessage({
              message: '提交成功',
              type: 'success',
              duration: 1000
            });
          }).catch(() => { });
        }
      });

    } else {
      ElMessage({
        message: '验证失败',
        type: 'error',
        duration: 1000
      });
      return false;
    }
  });
}

function getNewIcon(pic: any) {
  productCate.icon = pic;
}

function resetForm(formEl: FormInstance | undefined) {
  // 表单校验
  if (!formEl) return;
  formEl.resetFields();
  Object.assign(productCate, {})
  getSelectProductCateList();
  filterProductAttrList.value = [{
    value: []
  }];
}
function removeFilterAttr(productAttributeId: number) {
  if (filterProductAttrList.value.length === 1) {
    ElMessage({
      message: '至少要留一个',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  var index = filterProductAttrList.value.indexOf(productAttributeId);
  if (index !== -1) {
    filterProductAttrList.value.splice(index, 1)
  }
}
function handleAddFilterAttr() {
  if (filterProductAttrList.value.length === 3) {
    ElMessage({
      message: '最多添加三个',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  filterProductAttrList.value.push({
    value: null,
    key: Date.now()
  });
}


function filterLabelFilter(index: any) {
  if (index === 0) {
    return '筛选属性：';
  } else {
    return '';
  }
}

</script>

<style scoped></style>
