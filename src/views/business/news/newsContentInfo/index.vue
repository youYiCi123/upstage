<template>
  <div style="margin-top: 50px">
    <el-form :model="newsContentParam" label-width="120px" style="width: 75%" size="default">
      <el-form-item label="新闻标题：">
        <el-input v-model="newsContentParam.theme" placeholder="请输入新闻标题"></el-input>
      </el-form-item>
      <el-form-item label="新闻类型：">
        <el-radio-group v-model="newsContentParam.newsType">
          <el-radio :label="'1'">通知</el-radio>
          <el-radio :label="'2'">公告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="新闻内容：">
        <component :is="loadEdit" @change="getNewContent" :styleSize="'1'" :content="newsContentParam.content">
        </component>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-top: 50px;margin-left:1.6%;margin-bottom: 30px" size="small" type="primary"
          @click="doSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, shallowRef, defineProps } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { getUserName } from '@/utils/auth' // 验权
import { ElNotification } from 'element-plus';
import WangEdit from '@/components/wangEdit/index.vue'
import { addNewsContent, queryNewsContent, updateNewsContent } from '@/api/news'

const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true
  }
})

const newsContentParam = reactive({
  newsId: 0,
  theme: '',//主题
  newsType: 1,//新闻类型
  content: '',
})
const loadEdit = shallowRef(WangEdit); //加载的组件-解决wangEdit从后台拿到数据后，页面渲染不出的问题
const route = useRoute();
const router = useRouter();

function doSubmit() {
  newsContentParam.newsId = route.query.id as unknown as number
  if (props.isEdit) {
    updateNewsContent({id:newsContentParam.newsId, 
      theme: newsContentParam.theme, newsType: newsContentParam.newsType,
      content: newsContentParam.content
    }).then(res => {
      ElNotification({
        title: '修改成功',
        type: 'success',
        duration: 2500
      })
      router.back();
    }).catch(
      err => {
        console.log(err.response.data.message)
      })
  } else {
    const userName = getUserName()
    addNewsContent({
      theme: newsContentParam.theme, newsType: newsContentParam.newsType,
      content: newsContentParam.content, userName: userName
    }).then(res => {
      ElNotification({
        title: '添加成功',
        type: 'success',
        duration: 2500
      })
      router.back();
    }).catch(err => {
      console.log(err.response.data.message)
    })
  }
}

function getContentInfo() {
  if (props.isEdit) {
    queryNewsContent(route.query.id).then(
      res => {
        if (res.data != null) {    //如果能取出值，则点击提交按钮时为修改操作，否则为提交操作
          newsContentParam.content = res.data.content;
          newsContentParam.newsType = res.data.newsType;
          newsContentParam.theme = res.data.theme;
        }
        loadEdit.value = WangEdit//请求成功，加载子组件
      },
    )
  }
}
function getNewContent(content: any) {
  newsContentParam.content = content;
}

getContentInfo();

</script>
<style></style>