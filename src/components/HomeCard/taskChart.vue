<template>
    <div class="o2oa_net_homepage_home_content_top_right">
        <div
            style="position: relative; margin-left: 2px; margin-top: 0px; margin-right: 0px; float: left; height: 30px; cursor: pointer; min-width: 80px;">
            <div
                style="color: rgb(74, 144, 226); line-height: 30px; text-align: center; margin-right: 8px; margin-top: 2px; margin-left: 8px;">
                日常应用</div>
        </div>
        <div style="overflow: hidden;clear: both;line-height: normal;">
            <div style="display: flex;padding-top: 10px;" class="o2oa_net_homepage_home_tab_content">
                <div style="display: flex;" class="o2oa_net_homepage_home_app_item" v-for="(item, index) in iconArrs" @click="writeSurvey()">
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

function writeSurvey() {
    router.push({ path: '/research/tempSubmit',query:{ tempId: props.tempId} });
}

const iconArrs = [{
    imgUrl: require('@/assets/images/home_img/问卷计划.png'),
    content: '调查问卷',
    routeUrl: '/research/tempSubmit'
}]

</script>
<style>
.o2oa_net_homepage_home_content_top_right {
    height: calc(100% - 40px);
    padding: 20px;
    background-color: #ffffff;
    border-radius: 28px;
    position: relative;
}

.o2oa_net_homepage_home_tab_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.o2oa_net_homepage_home_app_item {
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

.o2oa_net_homepage_home_app_item img {
    width: 46px;
    height: 46px;
    margin-right: 10px;
}
</style>