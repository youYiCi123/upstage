<template>
  <div style="margin-top: 50px">
    <el-form :model="prodDetail" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px"
      size="small">
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader v-model="selectProductCateValue" :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="prodDetail.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="prodDetail.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select v-model="prodDetail.brandId" @change="handleBrandChange" placeholder="请选择品牌">
          <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品介绍：">
        <el-input :autoSize="true" v-model="prodDetail.description" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input v-model="prodDetail.productSn"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input-number v-model="prodDetail.price" :precision="2" :step="0.01"  @change="handlePriceChange"/>
        <span style="margin-left: 20px">元</span>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input-number v-model="prodDetail.originalPrice" :precision="2" :step="0.01"  @change="handleOriginalPriceChange"/>
        <span style="margin-left: 20px">元</span>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input-number v-model="prodDetail.stock" :min="1" @change="handleStockChange" />
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="prodDetail.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input v-model="prodDetail.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="prodDetail.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" @click="handleNext(productInfoForm)">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fetchListWithChildren } from '@/api/productCate'
import { fetchList as fetchBrandList } from '@/api/brand'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';
import { ProdInfo } from "@/mode/Prod/Prod";
import { getProduct } from '@/api/product';
import { ref, reactive, PropType, watch, computed } from "vue";

const props = defineProps({
  prodDetail: {
    type: Object as PropType<ProdInfo>,
    required: true,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const hasEditCreated = ref(false);
const selectProductCateValue = ref<any[]>([])
const productCateOptions = ref<any[]>([])
const brandOptions = ref<any[]>([])
const productInfoForm = ref<FormInstance>();
const rules: FormRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  subTitle: [{ required: true, message: '请输入商品副标题', trigger: 'blur' }],
  productCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
  brandId: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
  requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
}
const emit = defineEmits(['nextStep'])

const productId = computed(() => {
  return props.prodDetail.id;
});

getProductCateList()
getBrandList()

watch(productId, (newVal, oldVal) => {
  if (!props.isEdit) return;
  if (hasEditCreated.value) return;
  if (newVal === undefined || newVal == null || newVal === 0) return;
  handleEditCreated();
})

watch(selectProductCateValue, (newVal, oldVal) => {
  if (newVal != null && newVal.length === 2) {
    props.prodDetail.productCategoryId = newVal[1];
    props.prodDetail.productCategoryName = getCateNameById(props.prodDetail.productCategoryId);
  } else {
    props.prodDetail.productCategoryId = null;
    props.prodDetail.productCategoryName = null;
  }
})

//处理编辑逻辑
function handleEditCreated() {
  if (props.prodDetail.productCategoryId != null) {
    selectProductCateValue.value.push(props.prodDetail.cateParentId);
    selectProductCateValue.value.push(props.prodDetail.productCategoryId);
  }
  hasEditCreated.value = true;
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

//调整商品售价
function handlePriceChange(value: number) {
  props.prodDetail.price= value
}

//调整市场零售价
function handleOriginalPriceChange(value: number) {
  props.prodDetail.originalPrice = value
}

//调整库存量
function handleStockChange(value: number) {
  props.prodDetail.stock = value
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

function getCateNameById(id: any) {
  let name = null;
  for (let i = 0; i < productCateOptions.value.length; i++) {
    for (let j = 0; j < productCateOptions.value[i].children.length; j++) {
      if (productCateOptions.value[i].children[j].value === id) {
        name = productCateOptions.value[i].children[j].label;
        return name;
      }
    }
  }
  return name;
}

function handleNext(formEl: FormInstance | undefined) {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      emit('nextStep')
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

function handleBrandChange(val: any) {
  let brandName = '';
  for (let i = 0; i < brandOptions.value.length; i++) {
    if (brandOptions.value[i].value === val) {
      brandName = brandOptions.value[i].label;
      break;
    }
  }
  props.prodDetail.brandName = brandName;
}


</script>

<style scoped></style>
