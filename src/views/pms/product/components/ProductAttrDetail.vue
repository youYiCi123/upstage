<template>
  <div style="margin-top: 50px">
    <el-form :model="prodDetail" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="prodDetail.productAttributeCategoryId" placeholder="请选择属性类型" @change="handleProductAttrChange">
          <el-option v-for="item in productAttributeCategoryOptions" :key="item.value" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr, idx) in selectProductAttr">
            {{ productAttr.name }}：
            <el-checkbox-group v-if="productAttr.handAddStatus === 0" v-model="selectProductAttr[idx].values">
              <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item"
                class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div v-for="(item, index) in selectProductAttr[idx].options" style="display: inline-block"
                  class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="primary" link class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx, index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px" :data="prodDetail.skuStockList" border>
          <el-table-column v-for="(item, index) in selectProductAttr" :label="item.name" :key="item.id" align="center">
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
          <el-table-column label="库存预警值" width="80" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU编号" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice">同步价格
        </el-button>
        <el-button type="primary" style="margin-top: 20px" @click="handleSyncProductSkuStock">同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductAttrPics">
            <span>{{ item.name }}:</span>
            <single-upload v-model="item.pic"
              style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductParam" :class="{ littleMarginTop: index !== 0 }">
            <div class="paramInputLabel">{{ item.name }}:</div>
            <el-select v-if="item.inputType === 1" class="paramInput" v-model="selectProductParam[index].value">
              <el-option v-for="item1 in getParamInputList(item.inputList)" :key="item1" :label="item1" :value="item1">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload @input="getNewPic" :pic="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <component :is="loadEdit" @change="getPCContent" :content="prodDetail.detailHtml">
            </component>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <component :is="loadEdit" @change="getMobileContent" :content="prodDetail.detailMobileHtml">
            </component>
            <!-- <tinymce :width="595" :height="300" v-model="prod.detailMobileHtml"></tinymce> -->
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="small" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="small" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fetchList as fetchProductAttrCateList } from '@/api/productAttrCate'
import { fetchList as fetchProductAttrList } from '@/api/productAttr'
import SingleUpload from '@/components/Upload/singleUpload.vue'
import MultiUpload from '@/components/Upload/multiUpload.vue'
import WangEdit from '@/components/wangEdit/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { ProdInfo, PmsSkuStock } from "@/mode/Prod/Prod";
import { ref, reactive, PropType, watch, computed, shallowRef } from "vue";
const emit = defineEmits(['prevStep', 'nextStep'])
const loadEdit = shallowRef(WangEdit); //加载的组件-解决wangEdit从后台拿到数据后，页面渲染不出的问题
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
//编辑模式时是否初始化成功
const hasEditCreated = ref(false);
//商品属性分类下拉选项
const productAttributeCategoryOptions = ref<any[]>([])
//选中的商品属性
const selectProductAttr = ref<any[]>([])
//选中的商品参数
const selectProductParam = ref<any[]>([])
//选中的商品属性图片
const selectProductAttrPics = ref<any[]>([])
//可手动添加的商品属性
const addProductAttrValue = ref('');
//商品富文本详情激活类型
const activeHtmlName = ref('pc');
//是否有商品属性图片
const hasAttrPic = computed(() => {
  if (selectProductAttrPics.value.length < 1) {
    return false;
  }
  return true;
})
//商品的编号
const productId = computed(() => {
  return props.prodDetail.id;
})

//商品的主图和画册图片
const selectProductPics = computed(() => {
  const pics = reactive<string[]>([])
  if (props.prodDetail.pic === undefined || props.prodDetail.pic == null || props.prodDetail.pic === '') {
    return pics;
  }
  pics.push(props.prodDetail.pic);
  if (props.prodDetail.albumPics === undefined || props.prodDetail.albumPics == null || props.prodDetail.albumPics === '') {
    return pics;
  }
  let albumPics = props.prodDetail.albumPics.split(',');
  for (let i = 0; i < albumPics.length; i++) {
    pics.push(albumPics[i]);
  }
  return pics;
})

function getNewPic(newValue: any) {
  if (newValue == null || newValue.length === 0) {
    props.prodDetail.pic = '';
    props.prodDetail.albumPics = '';
  } else {
    props.prodDetail.pic = newValue[0];
    props.prodDetail.albumPics = '';
    if (newValue.length > 1) {
      for (let i = 1; i < newValue.length; i++) {
        props.prodDetail.albumPics += newValue[i];
        if (i !== newValue.length - 1) {
          props.prodDetail.albumPics += ',';
        }
      }
    }
  }
}

getProductAttrCateList()

watch(productId, (newVal, oldVal) => {
  if (!props.isEdit) return;
  if (hasEditCreated.value) return;
  if (newVal === undefined || newVal == null || newVal === 0) return;
  handleEditCreated();
})


function handleEditCreated() {
  //根据商品属性分类id获取属性和参数
  if (props.prodDetail.productAttributeCategoryId != null) {
    handleProductAttrChange(props.prodDetail.productAttributeCategoryId);
  }
  hasEditCreated.value = true;
}

function getProductAttrCateList() {
  let param = { pageNum: 1, pageSize: 100 };
  fetchProductAttrCateList(param).then(response => {
    productAttributeCategoryOptions.value = [];
    let list = response.data.list;
    for (let i = 0; i < list.length; i++) {
      productAttributeCategoryOptions.value.push({ label: list[i].name, value: list[i].id });
    }
  });
}

function getProductAttrList(type: any, cid: any) {
  let param = { pageNum: 1, pageSize: 100, type: type };
  fetchProductAttrList(cid, param).then(response => {
    let list = response.data.list;
    if (type === 0) {
      selectProductAttr.value = [];
      for (let i = 0; i < list.length; i++) {
        let options: Array<string> = [];
        let values: Array<any> = [];
        if (props.isEdit) {
          if (list[i].handAddStatus === 1) {
            //编辑状态下获取手动添加编辑属性
            options = getEditAttrOptions(list[i].id);
          }
          //编辑状态下获取选中属性
          values = getEditAttrValues(i);
        }
        selectProductAttr.value.push({
          id: list[i].id,
          name: list[i].name,
          handAddStatus: list[i].handAddStatus,
          inputList: list[i].inputList,
          values: values,
          options: options
        });
      }
      if (props.isEdit) {
        //编辑模式下刷新商品属性图片
        refreshProductAttrPics();
      }
    } else {
      selectProductParam.value = [];
      for (let i = 0; i < list.length; i++) {
        let value = null;
        if (props.isEdit) {
          //编辑模式下获取参数属性
          value = getEditParamValue(list[i].id);
        }
        selectProductParam.value.push({
          id: list[i].id,
          name: list[i].name,
          value: value,
          inputType: list[i].inputType,
          inputList: list[i].inputList
        });
      }
    }
  });
}

function getPCContent(content: any) {
  props.prodDetail.detailHtml = content;
}

function getMobileContent(content: any) {
  props.prodDetail.detailMobileHtml = content;
}

//获取设置的可手动添加属性值
function getEditAttrOptions(id: number) {
  let options = [];
  for (let i = 0; i < props.prodDetail.productAttributeValueList.length; i++) {
    let attrValue = props.prodDetail.productAttributeValueList[i];
    if (attrValue.productAttributeId === id) {
      let strArr = attrValue.value.split(',');
      for (let j = 0; j < strArr.length; j++) {
        options.push(strArr[j]);
      }
      break;
    }
  }
  return options;
}

//获取选中的属性值
function getEditAttrValues(index: number) {
  let values = new Set();
  if (index === 0) {
    for (let i = 0; i < props.prodDetail.skuStockList.length; i++) {
      let sku = props.prodDetail.skuStockList[i];
      let spData = JSON.parse(sku.spData);
      if (spData != null && spData.length >= 1) {
        values.add(spData[0].value);
      }
    }
  } else if (index === 1) {
    for (let i = 0; i < props.prodDetail.skuStockList.length; i++) {
      let sku = props.prodDetail.skuStockList[i];
      let spData = JSON.parse(sku.spData);
      if (spData != null && spData.length >= 2) {
        values.add(spData[1].value);
      }
    }
  } else {
    for (let i = 0; i < props.prodDetail.skuStockList.length; i++) {
      let sku = props.prodDetail.skuStockList[i];
      let spData = JSON.parse(sku.spData);
      if (spData != null && spData.length >= 3) {
        values.add(spData[2].value);
      }
    }
  }
  return Array.from(values);
}

//获取属性的值
function getEditParamValue(id: number) {
  for (let i = 0; i < props.prodDetail.productAttributeValueList.length; i++) {
    if (id === props.prodDetail.productAttributeValueList[i].productAttributeId) {
      return props.prodDetail.productAttributeValueList[i].value;
    }
  }
}
function handleProductAttrChange(value: any) {
  getProductAttrList(0, value);
  getProductAttrList(1, value);
}
function getInputListArr(inputList: string) {
  return inputList.split(',');
}

function handleAddProductAttrValue(idx: number) {
  let options = selectProductAttr.value[idx].options;
  if (addProductAttrValue == null || addProductAttrValue.value == '') {
    ElMessage({
      message: '属性值不能为空',
      type: 'warning',
      duration: 1000
    });
    return
  }
  if (options.indexOf(addProductAttrValue) !== -1) {
    ElMessage({
      message: '属性值不能重复',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  selectProductAttr.value[idx].options.push(addProductAttrValue.value);
  addProductAttrValue.value = '';
}

function handleRemoveProductAttrValue(idx: number, index: number) {
  selectProductAttr.value[idx].options.splice(index, 1);
}

function getProductSkuSp(row: any, index: number) {
  let spData = JSON.parse(row.spData);
  if (spData != null && index < spData.length) {
    return spData[index].value;
  } else {
    return null;
  }
}

function handleRefreshProductSkuList() {
  ElMessageBox.confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    refreshProductAttrPics();
    refreshProductSkuList();
  });
}

function handleSyncProductSkuPrice() {
  ElMessageBox.confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (props.prodDetail.skuStockList !== null && props.prodDetail.skuStockList.length > 0) {
      let tempSkuList: Array<PmsSkuStock> = [];
      tempSkuList = tempSkuList.concat(tempSkuList, props.prodDetail.skuStockList);
      let price = props.prodDetail.skuStockList[0].price;
      for (let i = 0; i < tempSkuList.length; i++) {
        tempSkuList[i].price = price;
      }
      props.prodDetail.skuStockList = [];
      props.prodDetail.skuStockList = props.prodDetail.skuStockList.concat(props.prodDetail.skuStockList, tempSkuList);
    }
  });
}

function handleSyncProductSkuStock() {
  ElMessageBox.confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (props.prodDetail.skuStockList !== null && props.prodDetail.skuStockList.length > 0) {
      let tempSkuList: Array<PmsSkuStock> = [];
      tempSkuList = tempSkuList.concat(tempSkuList, props.prodDetail.skuStockList);
      let stock = props.prodDetail.skuStockList[0].stock;
      let lowStock = props.prodDetail.skuStockList[0].lowStock;
      for (let i = 0; i < tempSkuList.length; i++) {
        tempSkuList[i].stock = stock;
        tempSkuList[i].lowStock = lowStock;
      }
      props.prodDetail.skuStockList = [];
      props.prodDetail.skuStockList = props.prodDetail.skuStockList.concat(props.prodDetail.skuStockList, tempSkuList);
    }
  });
}

function refreshProductSkuList() {
  props.prodDetail.skuStockList = [];
  let skuList = props.prodDetail.skuStockList;
  //只有一个属性时
  if (selectProductAttr.value.length === 1) {
    let attr = selectProductAttr.value[0];
    for (let i = 0; i < attr.values.length; i++) {
      skuList.push({
        spData: JSON.stringify([{ key: attr.name, value: attr.values[i] }])
      });
    }
  } else if (selectProductAttr.value.length === 2) {
    let attr0 = selectProductAttr.value[0];
    let attr1 = selectProductAttr.value[1];
    for (let i = 0; i < attr0.values.length; i++) {
      if (attr1.values.length === 0) {
        skuList.push({
          spData: JSON.stringify([{ key: attr0.name, value: attr0.values[i] }])
        });
        continue;
      }
      for (let j = 0; j < attr1.values.length; j++) {
        let spData = [];
        spData.push({ key: attr0.name, value: attr0.values[i] });
        spData.push({ key: attr1.name, value: attr1.values[j] });
        skuList.push({
          spData: JSON.stringify(spData)
        });
      }
    }
  } else {
    let attr0 = selectProductAttr.value[0];
    let attr1 = selectProductAttr.value[1];
    let attr2 = selectProductAttr.value[2];
    for (let i = 0; i < attr0.values.length; i++) {
      if (attr1.values.length === 0) {
        skuList.push({
          spData: JSON.stringify([{ key: attr0.name, value: attr0.values[i] }])
        });
        continue;
      }
      for (let j = 0; j < attr1.values.length; j++) {
        if (attr2.values.length === 0) {
          let spData = [];
          spData.push({ key: attr0.name, value: attr0.values[i] });
          spData.push({ key: attr1.name, value: attr1.values[j] });
          skuList.push({
            spData: JSON.stringify(spData)
          });
          continue;
        }
        for (let k = 0; k < attr2.values.length; k++) {
          let spData = [];
          spData.push({ key: attr0.name, value: attr0.values[i] });
          spData.push({ key: attr1.name, value: attr1.values[j] });
          spData.push({ key: attr2.name, value: attr2.values[k] });
          skuList.push({
            spData: JSON.stringify(spData)
          });
        }
      }
    }
  }
}

function refreshProductAttrPics() {
  selectProductAttrPics.value = [];
  if (selectProductAttr.value.length >= 1) {
    let values = selectProductAttr.value[0].values;
    for (let i = 0; i < values.length; i++) {
      let pic = null;
      if (props.isEdit) {
        //编辑状态下获取图片
        pic = getProductSkuPic(values[i]);
      }
      selectProductAttrPics.value.push({ name: values[i], pic: pic })
    }
  }
}

//获取商品相关属性的图片
function getProductSkuPic(name: string) {
  for (let i = 0; i < props.prodDetail.skuStockList.length; i++) {
    let spData = JSON.parse(props.prodDetail.skuStockList[i].spData);
    if (name === spData[0].value) {
      return props.prodDetail.skuStockList[i].pic;
    }
  }
  return null;
}

//合并商品属性
function mergeProductAttrValue() {
  props.prodDetail.productAttributeValueList = [];
  for (let i = 0; i < selectProductAttr.value.length; i++) {
    let attr = selectProductAttr.value[i];
    if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
      props.prodDetail.productAttributeValueList.push({
        productAttributeId: attr.id,
        value: getOptionStr(attr.options)
      });
    }
  }
  for (let i = 0; i < selectProductParam.value.length; i++) {
    let param = selectProductParam.value[i];
    props.prodDetail.productAttributeValueList.push({
      productAttributeId: param.id,
      value: param.value
    });
  }
}

//合并商品属性图片
function mergeProductAttrPics() {
  for (let i = 0; i < selectProductAttrPics.value.length; i++) {
    for (let j = 0; j < props.prodDetail.skuStockList.length; j++) {
      let spData = JSON.parse(props.prodDetail.skuStockList[j].spData);
      if (spData[0].value === selectProductAttrPics.value[i].name) {
        props.prodDetail.skuStockList[j].pic = selectProductAttrPics.value[i].pic;
      }
    }
  }
}

function getOptionStr(arr: any) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    str += arr[i];
    if (i != arr.length - 1) {
      str += ',';
    }
  }
  return str;
}

function handleRemoveProductSku(index: any, row: any) {
  let list = props.prodDetail.skuStockList;
  if (list.length === 1) {
    list.pop();
  } else {
    list.splice(index, 1);
  }
}

function getParamInputList(inputList: any) {
  return inputList.split(',');
}

function handlePrev() {
  emit('prevStep')
}

function handleNext() {
  mergeProductAttrValue();
  mergeProductAttrPics();
  emit('nextStep')
}


</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px
}

.cardBg {
  background: #F8F9FC;
}
</style>
