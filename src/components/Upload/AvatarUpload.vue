<template>
  <el-upload action="http://192.168.1.170:8079/upstage-service/avatar/upload" :headers="headers" :show-file-list="false"
    :on-success="handleSuccess" accept=".png,.jpg">
    <el-avatar v-if="avatar" size="large" :src="avatar"></el-avatar>
    <el-avatar v-if="!avatar" size="large">
      <span v-html="avararFormat(nickname)"></span></el-avatar>
  </el-upload>
</template>
  
<script setup lang="ts">
import { computed, defineEmits, defineProps, reactive, toRefs } from "vue";
import { getToken } from '@/utils/auth'
interface VimData {
  headers: any;
}
const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  }
});

let avatar = computed(() => {
  return props.avatar;
});


let nickname = computed(() => {
  return props.nickname;
});
const token = getToken();
const vimData = reactive<VimData>({
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: token,
  }
});
function avararFormat(nickname: string) {
  return nickname.slice(-2)
}

const emits = defineEmits(["uploadSuccess"]);
//上传成功回调
const handleSuccess = (response: any) => {
  emits("uploadSuccess", response.data.url);
};
const { headers } = toRefs(vimData);
</script>
  
<style>
.el-upload {
  display: flex
}
</style>
  