<template>
  <div class="app-container">
    <el-row class="panel-group" :gutter="20">
      <el-col :span="12">
        <el-card>
          <news-basic-top v-if="flag" :item="newsBasicTop"></news-basic-top>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <news-card v-if="flag1" :newsList="newsList"></news-card>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <TreeChart v-if="flag2" :treeData="treeData" :height="500"></TreeChart>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <PieChart v-if="flag3" :pieData="pieData" :height="500"></PieChart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import TreeChart from '@/components/HomeCard/TreeChart.vue'
import PieChart from '@/components/HomeCard/PieChart.vue'
import NewsCard from '@/components/HomeCard/newsCard.vue'
import NewsBasicTop from '@/components/HomeCard/newsBasicTop.vue'
import { getDashboard } from '@/api/news';
const flag = ref(false);
const flag1 = ref(false);
const flag2 = ref(false);
const flag3 = ref(false);
const newsBasicTop = reactive({
  theme: '',
  createdTime: '',
  content: '',
  newsType: '',
})
const treeData = ref({
  name: '天一人员总览',
  children: [] as any[] // 属性需要做类型断言处理
})
const newsList = ref<[]>([])  //新闻公告列表信息
const pieData = ref<any>([])  //新闻公告列表信息

function convertFileTypeData(data: any) {
  let res = []
  for (let i = 0; i < data.length; i++) {
    let fileTypeName = '';
    switch (data[i].fileType) {
      case 1:
        fileTypeName = '普通文件'
        break;
      case 2:
        fileTypeName = '压缩文件'
        break;
      case 3:
        fileTypeName = 'excel'
        break;
      case 4:
        fileTypeName = 'word'
        break;
      case 5:
        fileTypeName = 'pdf'
        break;
      case 6:
        fileTypeName = 'txt'
        break;
      case 7:
        fileTypeName = '图片'
        break;
      case 8:
        fileTypeName = '音频'
        break;
      case 9:
        fileTypeName = '视频'
        break;
      case 10:
        fileTypeName = 'ppt'
        break;
      case 11:
        fileTypeName = '源码文件'
        break;
      case 12:
        fileTypeName = 'csv'
        break;
    }
    res.push({
      name: fileTypeName,
      value: data[i].nums
    })
  }
  return res
}

function convertCompanyData(data: any) {
    let personList = []
    for (let i = 0; i < data.length; i++) {
        let children = [];
        if (data[i].userRelationList != null && data[i].userRelationList.length > 0) {
            for (let j = 0; j < data[i].userRelationList.length; j++) {
                children.push({ name: data[i].userRelationList[j].nickName, value: null });
            }
        }
        personList.push({ name: data[i].depName, value: data[i].userRelationList.length, children: children });
    }
    return personList
}

function getData() {
  getDashboard().then(res => {
    //公告列表
    newsList.value = res.data.NewsShowList
    //最新公告
    newsBasicTop.theme = res.data.newsTopToHome.theme
    newsBasicTop.createdTime = res.data.newsTopToHome.createdTime
    newsBasicTop.content = res.data.newsTopToHome.content
    newsBasicTop.newsType = res.data.newsTopToHome.newsType
    //渲染文件分类图形数据
    let fileTypeNumsData = convertFileTypeData(res.data.fileTypeNums)
    pieData.value= fileTypeNumsData
    //渲染企业内部架构数据
    let depUserArray = convertCompanyData(res.data.depUserRelationList)
    for (let index = 0; index < depUserArray.length; index++) {
      const element = depUserArray[index];
      treeData.value.children.push(element)
    }
    flag.value = true
    flag1.value = true
    flag2.value = true
    flag3.value = true
  })
}
getData()
</script>
<style scoped>
.el-row {
  margin-bottom: 15px;
}
</style>