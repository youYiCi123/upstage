<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
    <product-info-detail v-show="showStatus[0]" :prod-detail="productParam" :is-edit="isEdit" @nextStep="nextStep">
    </product-info-detail>
    <product-sale-detail v-show="showStatus[1]" :prod-detail="productParam" :is-edit="isEdit" @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-attr-detail v-show="showStatus[2]" :prod-detail="productParam" :is-edit="isEdit" @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
    <product-relation-detail v-show="showStatus[3]" :prod-detail="productParam" :is-edit="isEdit" @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail>
  </el-card>
</template>
<script setup lang="ts">
import ProductInfoDetail from './ProductInfoDetail.vue';
import ProductSaleDetail from './ProductSaleDetail.vue';
import ProductAttrDetail from './ProductAttrDetail.vue';
import ProductRelationDetail from './ProductRelationDetail.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createProduct, getProduct, updateProduct } from '@/api/product';
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const productParam = reactive({
  id:0,
  albumPics: '',
  brandId: null,
  brandName: '',
  cateParentId:0,
  deleteStatus: 0,
  description: '',
  detailDesc: '',
  detailHtml: '',
  detailMobileHtml: '',
  detailTitle: '',
  feightTemplateId: 0,
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  giftPoint: 0,
  giftGrowth: 0,
  keywords: '',
  lowStock: 0,
  name: '',
  newStatus: 0,
  note: '',
  originalPrice: 0,
  pic: '',
  //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  memberPriceList: [],
  //商品满减
  productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
  //商品阶梯价格
  productLadderList: [{ count: 0, discount: 0, price: 0 }],
  previewStatus: 0,
  price: 0,
  productAttributeCategoryId: null,
  //商品属性相关{productAttributeId: 0, value: ''}
  productAttributeValueList: [],
  //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
  skuStockList: [],
  //商品相关专题{subjectId: 0}
  subjectProductRelationList: [],
  //商品相关优选{prefrenceAreaId: 0}
  prefrenceAreaProductRelationList: [],
  productCategoryId: 0,
  productCategoryName: '',
  productSn: '',
  promotionEndTime:  new Date(),
  promotionPerLimit: 0,
  promotionPrice: 0,
  promotionStartTime: new Date(),
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: 0,
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
})

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})

const showStatus = reactive([true, false, false, false])
const active = ref(0);

getContentInfo()
function getContentInfo() {
  if (props.isEdit) {
    getProduct(route.query.id).then(response => {
      productParam.id = response.data.id
      productParam.albumPics = response.data.albumPics
      productParam.brandId = response.data.brandId
      productParam.brandName = response.data.brandName
      productParam.deleteStatus = response.data.deleteStatus
      productParam.description = response.data.description
      productParam.detailDesc = response.data.detailDesc
      productParam.detailHtml = response.data.detailHtml
      productParam.detailMobileHtml = response.data.detailMobileHtml
      productParam.detailTitle = response.data.detailTitle
      productParam.feightTemplateId = response.data.feightTemplateId
      productParam.flashPromotionCount = response.data.flashPromotionCount
      productParam.flashPromotionId = response.data.flashPromotionId
      productParam.flashPromotionPrice = response.data.flashPromotionPrice
      productParam.flashPromotionSort = response.data.flashPromotionSort
      productParam.giftPoint = response.data.giftPoint
      productParam.giftGrowth = response.data.giftGrowth
      productParam.keywords = response.data.keywords
      productParam.lowStock = response.data.lowStock
      productParam.name = response.data.name
      productParam.newStatus = response.data.newStatus
      productParam.note = response.data.note
      productParam.originalPrice = response.data.originalPrice
      productParam.pic = response.data.pic
      productParam.memberPriceList = response.data.memberPriceList
      productParam.productFullReductionList = response.data.productFullReductionList
      productParam.productLadderList = response.data.productLadderList
      productParam.previewStatus = response.data.previewStatus
      productParam.price = response.data.price
      productParam.productAttributeCategoryId = response.data.productAttributeCategoryId
      productParam.productAttributeValueList = response.data.productAttributeValueList
      productParam.skuStockList = response.data.skuStockList
      productParam.subjectProductRelationList = response.data.subjectProductRelationList
      productParam.prefrenceAreaProductRelationList = response.data.prefrenceAreaProductRelationList
      productParam.productCategoryId = response.data.productCategoryId
      productParam.productCategoryName = response.data.productCategoryName
      productParam.productSn = response.data.productSn
      productParam.promotionEndTime = response.data.promotionEndTime
      productParam.promotionPerLimit = response.data.promotionPerLimit
      productParam.promotionPrice = response.data.promotionPrice
      productParam.promotionStartTime = response.data.promotionStartTime
      productParam.promotionType = response.data.promotionType
      productParam.publishStatus = response.data.publishStatus
      productParam.recommandStatus = response.data.recommandStatus
      productParam.sale = response.data.sale
      productParam.serviceIds = response.data.serviceIds
      productParam.sort = response.data.sort
      productParam.stock = response.data.stock
      productParam.subTitle = response.data.subTitle
      productParam.unit = response.data.unit
      productParam.usePointLimit = response.data.usePointLimit
      productParam.verifyStatus = response.data.verifyStatus
      productParam.weight = response.data.weight
    });
  }
}

function hideAll() {
  for (let i = 0; i < showStatus.length; i++) {
    showStatus[i] = false;
  }
}
function prevStep() {
  if (active.value > 0 && active.value < showStatus.length) {
    active.value--;
    hideAll();
    showStatus[active.value] = true;
  }
}

function nextStep() {
  if (active.value < showStatus.length - 1) {
    active.value++;
    hideAll();
    showStatus[active.value] = true;
  }
}

function finishCommit() {
  ElMessageBox.confirm('是否要提交该产品', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (props.isEdit) {
      updateProduct(route.query.id, productParam).then(response => {
        ElMessage({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
        router.back();
      });
    } else {
      createProduct(productParam).then(response => {
        ElMessage({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
        location.reload();
      });
    }
  })
}


</script>
<style>
.form-container {
  width: 800px;
}
</style>


