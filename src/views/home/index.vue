<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-carousel>
          <el-carousel-item v-for="(item,index) in bannerImgs" :key="item">
            <img :src=item.imgUrl>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
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
          <bar :height="500" :barData="barData" v-if="flag4"></bar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <PieChart v-if="flag3" :pieData="pieData" :height="500"></PieChart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="15">
        <el-card>
          <TreeChart v-if="flag2" :treeData="treeData" :height="500"></TreeChart>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card>
          <taskChart :tempId="tempId"></taskChart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import TreeChart from '@/components/HomeCard/TreeChart.vue'
import PieChart from '@/components/HomeCard/PieChart.vue'
import bar from '@/components/HomeCard/bar.vue'
import taskChart from '@/components/HomeCard/taskChart.vue'
import NewsCard from '@/components/HomeCard/newsCard.vue'
import NewsBasicTop from '@/components/HomeCard/newsBasicTop.vue'
import { getDashboard } from '@/api/news';
const flag = ref(false);
const flag1 = ref(false);
const flag2 = ref(false);
const flag3 = ref(false);
const flag4 = ref(false);
const newsBasicTop = reactive({
  theme: '',
  createdTime: '',
  content: '',
  newsType: '',
})
const bannerImgs=[{ id: 0, title: '图1', imgUrl: require('@/assets/images/banner_img/1.png') },
 { id: 1, title: '图2', imgUrl: require('@/assets/images/banner_img/2.png') }]

const treeData = ref({
  name: '天一人员总览',
  children: [] as any[] // 属性需要做类型断言处理
})

const newsList = ref<[]>([])  //新闻公告列表信息
const pieData = ref<any>([])
const barData = ref<any>([])
const tempId=ref('')

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
    pieData.value = fileTypeNumsData
    //渲染企业内部架构数据
    let depUserArray = convertCompanyData(res.data.depUserRelationList)
    for (let index = 0; index < depUserArray.length; index++) {
      const element = depUserArray[index];
      treeData.value.children.push(element)
    }
    //渲染分享前十用户数量信息
    barData.value=res.data.userUploadCountArrayList
    //获取最新的调查问卷结果
    tempId.value=res.data.surveyLatestId

    flag.value = true
    flag1.value = true
    flag2.value = true
    flag3.value = true
    flag4.value = true
  })
}
getData()
</script>
<style scoped>
.el-row {
  margin-bottom: 15px;
}
.el-carousel__item {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: inline-block;
    overflow: hidden;
    z-index: 0;
}
/* 这是图片正常居中的常规写法 */
img {
	position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 98%; 
}
</style>
