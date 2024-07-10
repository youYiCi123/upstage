<template>
    <div class="home_content_top_right">
        <div
            style="position: relative; margin-left: 2px; margin-top: 0px; margin-right: 0px; float: left; height: 30px; cursor: pointer; min-width: 80px;">
            <div
                style="color: rgb(74, 144, 226); line-height: 30px; text-align: center; margin-right: 8px; margin-top: 2px; margin-left: 8px;">
                日常应用</div>
        </div>
        <div style="overflow: hidden;clear: both;line-height: normal;">
            <div style="display: flex;padding-top: 10px;" class="home_tab_content">
                <div style="display: flex;" class="home_app_item" v-for="(item, index) in iconArrs" @click="writeSurvey(index)">
                    <img :src="item.imgUrl">
                    <div>{{ item.content }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'; //vue3路由跳转
const router = useRouter();

const props = defineProps({
    tempId: {
        type: String,
        default: ''
    }
})

function writeSurvey(index:number) {
    if(index==0){
        router.push({ path: '/research/tempSubmit',query:{ tempId: props.tempId} });
    }else{
        window.open('http://120.55.69.236:8072/', '_blank')
    }
   
}

const iconArrs = [{
    imgUrl: require('@/assets/images/home_img/问卷计划.png'),
    content: '调查问卷',
    routeUrl: '/research/tempSubmit'
},{
    imgUrl: require('@/assets/images/home_img/网站建站.png'),
    content: '新版官网',
    routeUrl: 'http://120.55.69.236:8072/'
}]

</script>
<style>
.home_content_top_right {
    height: calc(100% - 40px);
    padding: 20px;
    background-color: #ffffff;
    border-radius: 28px;
    position: relative;
}

.home_tab_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.home_app_item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 190px;
    height: 60px;
    padding: 20px;
    background-color: #F7F7F7;
    border-radius: 28px;
    color: #333333;
    font-size: 18px;
    margin-top: 15px;
    cursor: pointer;
}

.home_app_item img {
    width: 46px;
    height: 46px;
    margin-right: 10px;
}
</style>