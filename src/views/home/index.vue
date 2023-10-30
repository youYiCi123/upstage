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
  </div>
</template>
<script setup lang="ts">
import { ref, reactive} from 'vue'
import NewsCard from '@/components/HomeCard/newsCard.vue'
import NewsBasicTop from '@/components/HomeCard/newsBasicTop.vue'
import { getDashboard } from '@/api/news';
const flag = ref(false);
const flag1 = ref(false);
const newsBasicTop = reactive({
  theme: '',
  createdTime:'',
  content: '',
  newsType: '',
})
const newsList = ref<[]>([])  //新闻公告列表信息
function getData() {
  getDashboard().then(res => {
    newsList.value=res.data.NewsShowList
    newsBasicTop.theme=res.data.newsTopToHome.theme
    newsBasicTop.createdTime=res.data.newsTopToHome.createdTime
    newsBasicTop.content=res.data.newsTopToHome.content
    newsBasicTop.newsType=res.data.newsTopToHome.newsType
    flag.value=true
    flag1.value=true
  })
}
getData()
</script>
<style scoped></style>