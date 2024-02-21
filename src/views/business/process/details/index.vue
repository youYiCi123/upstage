<template>
  <div>
    <div class="fd-nav">
      <div class="fd-nav-right">
        <div class="fd-title">{{ processName }}</div>
        <button type="button" class="ant-btn button-publish" @click="saveSet">
          <span>发 布</span>
        </button>
      </div>
    </div>
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)"></div>
        </div>
        <div class="box-scale" :style="`transform: scale(${ nowVal / 100});`">
          <nodeWrap v-model:nodeConfig="nodeConfig" />
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <!-- <errorDialog v-model:visible="tipVisible" :list="tipList" /> -->
    <approverDrawer />
    <copyerDrawer />
    <conditionDrawer />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getWorkFlowData, setWorkFlowData } from '@/api/workFlow';
import nodeWrap from '@/views/business/process/basis/nodeWrap.vue'
import approverDrawer from "@/views/business/process/drawer/approverDrawer.vue";
import copyerDrawer from "@/views/business/process/drawer/copyerDrawer.vue";
import conditionDrawer from "@/views/business/process/drawer/conditionDrawer.vue";

let tipList = ref<any[]>([]);
let tipVisible = ref(false);
let nowVal = ref(100);
let processName = ref('');
let processConfig = ref<any>({});
let nodeConfig = ref<any>({});
let route = useRoute()

onMounted(async () => {

  getWorkFlowData({ workFlowDefId: route.query.id }).then(res=>{
    let {data}=res.data
    processConfig.value = data;
  let {
    nodeConfig: nodes,
    processName: works
  } = data;
  nodeConfig.value = nodes;
  processName.value = works;
  })
}); 
const reErr = ({ childNode }) => {
  if (childNode) {
    let { type, error, nodeName, conditionNodes } = childNode;
    if (type == 1 || type == 2) {
      if (error) {
        tipList.value.push({
          name: nodeName,
          type: ["", "审核人", "抄送人"][type],
        });
      }
      reErr(childNode);
    } else if (type == 3) {
      reErr(childNode);
    } else if (type == 4) {
      reErr(childNode);
      for (var i = 0; i < conditionNodes.length; i++) {
        if (conditionNodes[i].error) {
          tipList.value.push({ name: conditionNodes[i].nodeName, type: "条件" });
        }
        reErr(conditionNodes[i]);
      }
    }
  } else {
    childNode = null;
  }
};
const saveSet = async () => {
  tipList.value = [];
  reErr(nodeConfig.value);
  if (tipList.value.length != 0) {
    tipVisible.value = true;
    return;
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(processConfig.value));
  let res = await setWorkFlowData(processConfig.value);
  if (res.code == 200) {
    ElMessage.success("设置成功")
    setTimeout(function () {
      window.location.href = "";
    }, 200);
  }
};
const zoomSize = (type:number) => {
  if (type == 1) {
    if (nowVal.value == 50) {
      return;
    }
    nowVal.value -= 10;
  } else {
    if (nowVal.value == 300) {
      return;
    }
    nowVal.value += 10;
  }
};
</script>
<style lang="scss">
@import "../../../../styles/workflow.css";
.error-modal-list {
  width: 455px;
}
</style>