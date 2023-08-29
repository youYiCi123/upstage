<template>
  <div>
    <el-upload action="" list-type="picture" accept=".png,.jpg" :multiple="false" :show-file-list="showFileList"
      :file-list="fileList" :http-request="fnUploadRequest" :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { policy } from '@/api/oss'
import axios from 'axios'
const props = defineProps({
  pic: {
    type: String,
  }
})

const imageUrl = computed(() => {
  return props.pic;
})

const imageName = computed(() => {
  if (props.pic != null && props.pic !== '') {
    return props.pic.substr(props.pic.lastIndexOf("/") + 1);
  } else {
    return null;
  }
})
const fileList = computed(() => {
  return [{
    name: imageName.value,
    url: imageUrl.value
  }]
})


const showFileList = computed({
  get() {
    return props.pic !== null && props.pic !== '' && props.pic !== undefined;
  },
  set(value) {
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
  file:''
})
const dialogVisible = ref(false);
const emit = defineEmits(['input'])

function emitInput(val: any) {
  emit("input", val);
}
function handleRemove(file: any, fileList: any) {
  emitInput('');
}
function handlePreview(file: any) {
  dialogVisible.value = true;
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
        fileList.value.pop();
        fileList.value.push({ name: file.name, url: res.url });
        emitInput(fileList.value[0].url);
      })
    }).catch(err => {
      console.log(err)
    })
  } catch (e) {
    console.log("删除失败");
  }
}





</script>
<style></style>


