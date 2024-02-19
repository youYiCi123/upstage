<template>
  <el-dialog title="选择成员" v-model="visibleDialog" :width="600" append-to-body class="promoter_person">
    <tree-transfer ref="treeTransferRef" :nodeKey="'label'" :fromData="fromData" :toData="toData"
      :defaultProps="transferProps" :leftTit="'组织架构'" :rightTit="'已选成员'" @rcheckedData="checkVal" />
      <template #footer>
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="saveDialog">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { fetchListWithChildren } from '@/api/dep'
import { ref, computed } from 'vue';
import treeTransfer from '@/components/TreeTransfer/index.vue'
let treeTransferRef = ref();//树形穿梭框

let fromData = ref<any[]>([]);//树形数据
let toData = ref<any[]>([]);//选中的ids数据
const transferProps = ref({
  label: 'label',
  children: 'children',
  disabled: 'disabled',
})

//子组件树形穿梭框返回
const checkVal = (val:any) => {
  let arr = []
  for (var i in val) {
    arr.push(val[i])
  }
  toData.value = arr
}

let props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  }
});

getDepUserList()
function getDepUserList() {
  fetchListWithChildren().then(response => {
    let list = response.data;
    fromData.value = [];
    for (let i = 0; i < list.length; i++) {
      let children = [];
      if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
        for (let j = 0; j < list[i].userRelationList.length; j++) {
          children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
        }
      }
      fromData.value.push({ label: list[i].depName, value: list[i].depId, children: children });
    }
  });
}

let emits = defineEmits(['update:visible', 'checkedData'])
let visibleDialog = computed({
  get() {
    return props.visible
  },
  set() {
    closeDialog()
  }
});

const closeDialog = ()=> {
  emits('update:visible', false)
}

let saveDialog = () => {
  emits('checkedData', toData.value)
}

</script>
<style>
.person_body {
  border: 1px solid #f5f5f5;
  height: 500px;
}

.tree_nav span:last-of-type {
  background: none;
}

.person_tree {
  padding: 10px 12px 0 8px;
  width: 280px;
  height: 100%;
  border-right: 1px solid #f5f5f5;
}
</style>