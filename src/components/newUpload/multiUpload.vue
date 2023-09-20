<template>
  <div>
    <el-upload action=""  list-type="picture-card"
      :file-list="fileList" :http-request="fnUploadRequest" :on-remove="handleRemove" 
      :on-preview="handlePreview" :limit="maxCount" :on-exceed="handleExceed">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { policy } from '@/api/oss'
import axios from 'axios'
import { computed, ref, reactive } from 'vue'
const props = defineProps({
  //图片属性数组
  pic: {
    type: Array,
    default: []
  },
  //最大上传图片数量
  maxCount: {
    type: Number,
    default: 5
  }
})
const dataObj = reactive({
  policy: '',
  signature: '',
  key: '',
  OSSAccessKeyId: '',
  dir: '',
  host: '',
  callback: '',
  file: ''
})
const dialogVisible = ref(false);
const dialogImageUrl = ref('');

const fileList = computed(() => {
  let fileList = [];
  for (let i = 0; i < props.pic.length; i++) {
    fileList.push({ url: props.pic[i] });
  }
  return fileList;
})

const emit = defineEmits(['input'])

function emitInput(fileList:any) {
  let value = [];
  for (let i = 0; i < fileList.length; i++) {
    value.push(fileList[i].url);
  }
  emit('input', value)
}
function handleRemove(file:any, fileList:any) {
  emitInput(fileList);
}
function handlePreview(file:any) {
  dialogVisible.value = true;
  dialogImageUrl.value = file.url;
}

// 上传图片返回链接
const fnUploadRequest = async (options: any) => {
  try {
    let file = options.file; // 拿到 file
    policy().then(response => {
      dataObj.policy = response.data.policy;
      dataObj.signature = response.data.signature;
      dataObj.OSSAccessKeyId = response.data.accessKeyId;
      dataObj.key = response.data.dir + '/${filename}';
      dataObj.dir = response.data.dir;
      dataObj.host = response.data.host;
      dataObj.callback = response.data.callback;
      dataObj.file = file;
      axios.post(response.data.host, dataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res: any) => {
        // 把返回的链接赋值给本地变量
        fileList.value.push({ url: res.url });
        emitInput(fileList.value);
      })
    }).catch(err => {
      console.log(err)
    })
  }catch (e) {
    console.log("删除失败");
  }
}

function handleExceed(files:any, fileList:any) {
  ElMessage({
    message: '最多只能上传' + props.maxCount + '张图片',
    type: 'warning',
    duration: 1000
  });
}


</script>
<style></style>


