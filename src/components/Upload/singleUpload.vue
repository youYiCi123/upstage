<template>
  <el-upload action="" list-type="picture" :limit="1"  :file-list="fileList"
   :on-remove="handleRemove" :http-request="fnUploadRequest" :on-preview="handlePreview">
    <el-button size="small" type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </template>
  </el-upload>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import {computed, ref} from 'vue'
const props = defineProps({
  pic: {
    type: String,
  }
})

const imageUrlInit = computed(() => {
  if (props.pic != null && props.pic !== '') {
    return props.pic;
  } else {
    return null;
  }
})

const imageNameInit = computed(() => {
  if (props.pic != null && props.pic !== '') {
    return props.pic.substr(props.pic.lastIndexOf("/") + 1);
  } else {
    return null;
  }
})

const fileList = computed(() => {
  return [{
    name: imageNameInit.value===null?'以人为本.jpeg':imageNameInit.value,
    url: imageUrlInit.value===null?'https://example-wang-oss.oss-cn-hangzhou.aliyuncs.com/test20230517/%E4%BB%A5%E4%BA%BA%E4%B8%BA%E6%9C%AC.png':imageUrlInit.value
  }]
})

const dialogVisible = ref(false);
const emit = defineEmits(['input'])

const emitInput = (val: any) => {
  emit("input", val);
};

function handleRemove(file: any, fileList: any) {
  emitInput('');
}
function handlePreview(file: any) {
  console.log('handlePreview')
  dialogVisible.value = true;
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
        fileList.value.pop();
        fileList.value.push({ name: file.name, url: res.url });
        emitInput(fileList.value[0].url);
      } else {
        ElMessage.error("上传失败");
      }
    });
  } catch (e) {
    ElMessage.error("删除失败");
  }
}

</script>
<style></style>


