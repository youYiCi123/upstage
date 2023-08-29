<template>
  <div>
    <el-upload action="" list-type="picture-card" :file-list="fileList" :http-request="fnUploadRequest"
      :on-remove="handleRemove"  :on-preview="handlePreview" :limit="maxCount"
      :on-exceed="handleExceed">
      <!-- <i class="el-icon-plus"></i> -->
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
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

const emitInput = (fileList: any) => {
  let value = [];
  for (let i = 0; i < fileList.length; i++) {
    value.push(fileList[i].url);
  }
  emit("input", value);
};

function handleRemove(file: any, fileList: any) {
  emitInput(fileList);
}

function handlePreview(file: any) {
  dialogVisible.value = true;
  dialogImageUrl.value = file.url;
}

const OSS = require('ali-oss');

const client = new OSS({
  accessKeyId: "LTAI5tQypUTDzwEmi8Hx1kqC", // 查看你自己的阿里云KEY
  accessKeySecret: "nhWgUzvNB6jlxTssOwfx1rGWyrsa1J", // 查看自己的阿里云KEYSECRET
  bucket: "example-wang-oss", // 你的 OSS bucket 名称
  region: "cn-hangzhou", // bucket 所在地址，我的是 华北2 北京
  endpoint: "oss-cn-hangzhou.aliyuncs.com", // 自己的域名
});

// 上传图片返回链接
const fnUploadRequest = async (options: any) => {
  try {
    let file = options.file; // 拿到 file
    client.put("Blog/image/" + file.name, file).then((res: any) => {
      if (res.res.statusCode === 200) {
        // 把返回的链接赋值给本地变量
        fileList.value.push({ url: res.url });
        emitInput(fileList.value);
      } else {
        ElMessage.error("上传失败");
      }
    });
  } catch (e) {
    ElMessage.error("删除失败");
  }
}

// function beforeUpload(file: any) {
//   return new Promise((resolve, reject) => {
//     policy().then(response => {
//       dataObj.policy = response.data.policy;
//       dataObj.Signature = response.data.signature;
//       dataObj.OSSAccessKeyId = response.data.accessKeyId;
//       dataObj.key = response.data.dir + '/${filename}';
//       dataObj.dir = response.data.dir;
//       dataObj.host = response.data.host;
//       resolve(true)
//     }).catch(err => {
//       console.log(err)
//       reject(false)
//     })
//   })
// }

function handleExceed(files: any, fileList: any) {
  ElMessage({
    message: '最多只能上传' + props.maxCount + '张图片',
    type: 'warning',
    duration: 1000
  });
}

</script>
<style>

</style>


