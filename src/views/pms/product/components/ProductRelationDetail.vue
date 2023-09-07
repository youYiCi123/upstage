<template>
  <div style="margin-top: 50px">
    <el-form :model="prodDetail" ref="productRelationForm" label-width="120px" style="width: 680px" size="small">
      <el-form-item label="关联专题：">
        <el-transfer style="display: inline-block" filterable :filter-method="filterMethod" filter-placeholder="请输入专题名称"
          v-model="selectSubject" :titles="subjectTitles" :data="subjectList">
        </el-transfer>
      </el-form-item>
      <el-form-item label="关联优选：">
        <el-transfer style="display: inline-block" filterable :filter-method="filterMethod" filter-placeholder="请输入优选名称"
          v-model="selectPrefrenceArea" :titles="prefrenceAreaTitles" :data="prefrenceAreaList">
        </el-transfer>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="small" @click="handlePrev">上一步，填写商品属性</el-button>
        <el-button type="primary" size="small" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { fetchListAll as fetchSubjectList } from '@/api/subject'
import { fetchList as fetchPrefrenceAreaList } from '@/api/prefrenceArea'
import { ref, reactive, PropType, watch, computed } from "vue";
import { ProdInfo } from "@/mode/Prod/Prod";

const emit = defineEmits(['prevStep', 'finishCommit'])
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

//所有专题列表
const subjectList = ref<any[]>([])
//专题左右标题
const subjectTitles = ['待选择', '已选择']
//所有专题列表
const prefrenceAreaList = ref<any[]>([])
//专题左右标题
const prefrenceAreaTitles = ['待选择', '已选择']


getSubjectList();
getPrefrenceAreaList();

//选中的专题 
const selectSubject = computed({
  get() {
    let subjects: Array<number> = [];
    if (props.prodDetail.subjectProductRelationList == null || props.prodDetail.subjectProductRelationList.length <= 0) {
      return subjects;
    }
    for (let i = 0; i < props.prodDetail.subjectProductRelationList.length; i++) {
      subjects.push(props.prodDetail.subjectProductRelationList[i].subjectId);
    }
    return subjects;
  },
  set(newValue) {
    props.prodDetail.subjectProductRelationList = [];
    for (let i = 0; i < newValue.length; i++) {
      props.prodDetail.subjectProductRelationList.push({ subjectId: newValue[i] });
    }
  }
})

//选中的优选
const selectPrefrenceArea = computed({
  get() {
    let prefrenceAreas: Array<number> = [];
    if (props.prodDetail.prefrenceAreaProductRelationList == null || props.prodDetail.prefrenceAreaProductRelationList.length <= 0) {
      return prefrenceAreas;
    }
    for (let i = 0; i < props.prodDetail.prefrenceAreaProductRelationList.length; i++) {
      prefrenceAreas.push(props.prodDetail.prefrenceAreaProductRelationList[i].prefrenceAreaId);
    }
    return prefrenceAreas;
  },
  set(newValue) {
    props.prodDetail.prefrenceAreaProductRelationList = [];
    for (let i = 0; i < newValue.length; i++) {
      props.prodDetail.prefrenceAreaProductRelationList.push({ prefrenceAreaId: newValue[i] });
    }
  }
})


function filterMethod(query: any, item: any) {
  return item.label.indexOf(query) > -1;
}

function getSubjectList() {
  fetchSubjectList().then(response => {
    let list = response.data;
    for (let i = 0; i < list.length; i++) {
      subjectList.value.push({
        label: list[i].title,
        key: list[i].id
      });
    }
  });
}
function getPrefrenceAreaList() {
  fetchPrefrenceAreaList().then(response => {
    let list = response.data;
    for (let i = 0; i < list.length; i++) {
      prefrenceAreaList.value.push({
        label: list[i].name,
        key: list[i].id
      });
    }
  });
}

function handlePrev() {
  emit('prevStep')
}
function handleFinishCommit() {
  emit('finishCommit', props.isEdit);
}


</script>

<style scoped></style>
