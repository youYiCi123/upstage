<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="品牌名称：" prop="name">
        <el-input v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母：">
        <el-input v-model="brand.firstLetter"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO: " prop="logo">
        <single-upload  @input="getNewLogo" :pic="brand.logo"></single-upload>
      </el-form-item>
      <el-form-item label="品牌专区大图：">
        <single-upload  @input="getNewPic" :pic="brand.bigPic"></single-upload>
      </el-form-item>
      <el-form-item label="品牌故事：">
        <el-input placeholder="请输入内容" type="textarea" v-model="brand.brandStory" :autosize="true"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="brand.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌制造商：">
        <el-radio-group v-model="brand.factoryStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(brandFrom)">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm(brandFrom)">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createBrand, getBrand, updateBrand } from '@/api/brand'
import SingleUpload from '@/components/Upload/singleUpload.vue'
const router = useRouter();
const route = useRoute();
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})
const brandFrom = ref<FormInstance>();
/** 验证规则 */
const rules: FormRules = {
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请输入品牌logo', trigger: 'blur' }
  ],
  sort: [
    { type: 'number', message: '排序必须为数字' }
  ],
};

const brand = reactive({
  bigPic: '',
  brandStory: '',
  factoryStatus: 0,
  firstLetter: '',
  logo: '',
  name: '',
  showStatus: 0,
  sort: 0
})

getContentInfo()
function getContentInfo() {
  if (props.isEdit) {
    getBrand(route.query.id).then(response => {
      brand.bigPic = response.data.bigPic;
      brand.brandStory = response.data.brandStory;
      brand.factoryStatus = response.data.factoryStatus;
      brand.firstLetter = response.data.firstLetter;
      brand.logo = response.data.logo;
      brand.name = response.data.name;
      brand.showStatus = response.data.showStatus;
      brand.sort = response.data.sort;
    });
  } else {
    Object.assign({}, brand);
  }
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
          updateBrand(route.query.id, brand).then(response => {
            formEl.resetFields();
            ElMessage({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            router.back();
          });
        } else {
          createBrand(brand).then(response => {
            formEl.resetFields();
            Object.assign({}, brand);
            ElMessage({
              message: '提交成功',
              type: 'success',
              duration: 1000
            });
          });
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

function getNewLogo(pic: any) {
  brand.logo = pic;
}

function getNewPic(pic: any) {
  brand.bigPic = pic;
}

function resetForm(formEl: FormInstance | undefined) {
  // 表单校验
  if (!formEl) return;
  formEl.resetFields();
  Object.assign({}, brand);
}


</script>
<style></style>


