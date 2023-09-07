<template>
  <div style="margin-top: 50px">
    <el-form :model="prodDetail" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="赠送积分：">
        <el-input-number v-model="prodDetail.giftPoint" @change="handleGiftPoint"/>
      </el-form-item>
      <el-form-item label="赠送成长值：">
        <el-input-number v-model="prodDetail.giftGrowth" @change="handleGiftGrowth"/>
      </el-form-item>
      <el-form-item label="积分购买限制：">
        <el-input-number v-model="prodDetail.usePointLimit" @change="handlePointLimit"/>
      </el-form-item>
      <el-form-item label="预告商品：">
        <el-switch v-model="prodDetail.previewStatus" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch v-model="prodDetail.publishStatus" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch v-model="prodDetail.newStatus" :active-value="1" :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch v-model="prodDetail.recommandStatus" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详细页标题：">
        <el-input v-model="prodDetail.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="prodDetail.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="商品关键字：">
        <el-input v-model="prodDetail.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="prodDetail.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item label="选择优惠方式：">
        <el-radio-group v-model="prodDetail.promotionType" size="small">
          <el-radio-button :label="0">无优惠</el-radio-button>
          <el-radio-button :label="1">特惠促销</el-radio-button>
          <el-radio-button :label="2">会员价格</el-radio-button>
          <el-radio-button :label="3">阶梯价格</el-radio-button>
          <el-radio-button :label="4">满减价格</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="prodDetail.promotionType === 1">
        <div>
          开始时间：
          <el-date-picker v-model="prodDetail.promotionStartTime" type="datetime" :picker-options="pickerOptions1"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          结束时间：
          <el-date-picker v-model="prodDetail.promotionEndTime" type="datetime" :picker-options="pickerOptions1"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          促销价格：
          <el-input style="width: 220px" v-model="prodDetail.promotionPrice" placeholder="输入促销价格"></el-input>
        </div>

      </el-form-item>
      <el-form-item v-show="prodDetail.promotionType === 2">
        <div v-for="(item, index) in prodDetail.memberPriceList" :class="{ littleMargin: index !== 0 }">
          {{ item.memberLevelName }}：
          <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
        </div>
      </el-form-item>
      <el-form-item v-show="prodDetail.promotionType === 3">
        <el-table :data="prodDetail.productLadderList" style="width: 80%" border>
          <el-table-column label="数量" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.discount"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button type="primary" link @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
              <el-button type="primary" link @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="prodDetail.promotionType === 4">
        <el-table :data="prodDetail.productFullReductionList" style="width: 80%" border>
          <el-table-column label="满" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="立减" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button type="primary" link @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
              <el-button type="primary" link @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="small" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="small" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fetchList as fetchMemberLevelList } from '@/api/memberLevel'
import { ProdInfo } from "@/mode/Prod/Prod";
import { ElMessage } from 'element-plus';
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

const pickerOptions1 = {
  disabledDate(time: any) {
    return time.getTime() < Date.now();
  }
}

const emit = defineEmits(['nextStep', 'prevStep'])

getContentInfo()
function getContentInfo() {
  if (props.isEdit) {

  } else {
    fetchMemberLevelList({ defaultStatus: 0 }).then(response => {
      let memberPriceList = [];
      for (let i = 0; i < response.data.length; i++) {
        let item = response.data[i];
        memberPriceList.push({ memberLevelId: item.id, memberLevelName: item.name })
      }
      props.prodDetail.memberPriceList = memberPriceList;
    });
  }
}

const selectServiceList = computed({
  get() {
    let list:Array<number> = [];
    if (props.prodDetail.serviceIds === undefined || props.prodDetail.serviceIds == null || props.prodDetail.serviceIds === '')
      return list;
    let ids = props.prodDetail.serviceIds.split(',');
    for (let i = 0; i < ids.length; i++) {
      list.push(Number(ids[i]));
    }
    return list;
  },
  set(newValue) {
    let serviceIds = '';
    if (newValue != null && newValue.length > 0) {
      for (let i = 0; i < newValue.length; i++) {
        serviceIds += newValue[i] + ',';
      }
      if (serviceIds.endsWith(',')) {
        serviceIds = serviceIds.substr(0, serviceIds.length - 1)
      }
      props.prodDetail.serviceIds = serviceIds;
    } else {
      props.prodDetail.serviceIds = "";
    }
  }
})


//赠送积分：
function handleGiftPoint(value: number) {
  props.prodDetail.giftPoint = value
}

//赠送成长值：
function handleGiftGrowth(value: number) {
  props.prodDetail.giftGrowth = value
}
//积分购买限制：
function handlePointLimit(value: number) {
  props.prodDetail.usePointLimit = value
}

function handleEditCreated() {
  let ids = props.prodDetail.serviceIds.split(',');
  console.log('handleEditCreated', ids);
  for (let i = 0; i < ids.length; i++) {
    selectServiceList.value.push(Number(ids[i]));
  }
}

function handleRemoveProductLadder(index:any, row:any) {
  let productLadderList = props.prodDetail.productLadderList;
  if (productLadderList.length === 1) {
    productLadderList.pop();
    productLadderList.push({
      count: 0,
      discount: 0,
      price: 0
    })
  } else {
    productLadderList.splice(index, 1);
  }
}

function handleAddProductLadder(index:any, row:any) {
  let productLadderList = props.prodDetail.productLadderList;
  if (productLadderList.length < 3) {
    productLadderList.push({
      count: 0,
      discount: 0,
      price: 0
    })
  } else {
    ElMessage({
      message: '最多只能添加三条',
      type: 'warning'
    });
  }
}

function handleRemoveFullReduction(index:any, row:any) {
  let fullReductionList = props.prodDetail.productFullReductionList;
  if (fullReductionList.length === 1) {
    fullReductionList.pop();
    fullReductionList.push({
      fullPrice: 0,
      reducePrice: 0
    });
  } else {
    fullReductionList.splice(index, 1);
  }
}

function handleAddFullReduction(index:any, row:any) {
  let fullReductionList = props.prodDetail.productFullReductionList;
  if (fullReductionList.length < 3) {
    fullReductionList.push({
      fullPrice: 0,
      reducePrice: 0
    });
  } else {
    ElMessage({
      message: '最多只能添加三条',
      type: 'warning'
    });
  }
}

function handlePrev() {
  emit('prevStep')
}

function handleNext() {
  emit('nextStep')
}


</script>

<style scoped>
.littleMargin {
  margin-top: 10px;
}
</style>
