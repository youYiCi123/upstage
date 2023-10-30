<template>
    <div class="newsDetailsPageBackGround">
        <div class="h35"></div>
        <div class="newsWrap">
            <div class="subCont viewCont">
                <div class="newsDetialTitle">{{ newsInfo.theme }}</div>
                <div class="newsDetialTime">
                    <div class="center">
                        <div class="fl">
                            发布时间：
                            <span v-html="timeFormat(newsInfo.createdTime)"></span>
                            &nbsp; &nbsp;&nbsp; 查看次数：
                            <i style="font-size:14px;color:#cf3827;font-style: normal;font-weight:bold;padding-right:10px;">{{
                                newsInfo.viewCount }}</i>
                        </div>
                        <div class="newsDetial_fz fl">
                            <i style="font-family:'宋体';font-style:normal;padding-right:5px;font-size:18px;">T</i>
                            浏览字号：
                            <div class="fontSize_box fl">
                                <span @click="selectFontSize(index)" v-for="(item, index) in fontSizeBox"
                                    :class="fontSizeIndex == index ? 'hover' : ''">{{ item.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="h30"></div> -->
                <div v-html="newsInfo.content" class="articleBox minH_350"
                    :style="fontSizeIndex == 0 ? 'font-size:18px' : fontSizeIndex == 1 ? 'font-size:14px' : 'font-size:10px'">
                </div>
                <div class="articlePage"></div>
            </div>
        </div>
        <div class="h40"></div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRoute } from 'vue-router';
import dayjs from "dayjs";
import { getNewsInfo } from "@/api/news";
const route = useRoute();
const newsInfo = reactive({ theme: '', viewCount: '', createdTime: '', content: '' })
const fontSizeBox = [{ id: 0, name: '大' }, { id: 1, name: '中' }, { id: 2, name: '小' }]
const fontSizeIndex = ref(1)

function getTrain() {
    getNewsInfo(route.query.id).then(response => {
        if (response.data != null) {
            newsInfo.theme = response.data.theme
            newsInfo.viewCount = response.data.viewCount
            newsInfo.createdTime = response.data.createdTime
            newsInfo.content = response.data.content
        }
    })
}
function selectFontSize(index:number){
    fontSizeIndex.value = index;
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}
getTrain()

</script>
<style scoped>
.newsDetailsPageBackGround {
    background: #ededed;
}

.h35 {
    clear: both;
    height: 35px;
}

.newsWrap {
    clear: both;
    width: 1200px;
    margin: 0 auto;
}

.viewCont {
    padding: 35px;
    overflow: hidden;
    background: #fff;
}

.newsDetialTitle {
    font-family: OPPOSans-M;
    padding: 20px 0 0px 0;
    font-size: 30px;
    line-height: 45px;
    color: #141414;
    text-align: center;
    font-weight: bold;
}

.newsDetialTime {
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
    color: #666;
    font-size: 14px;
    padding: 20px 0px 30px 0px;
}

.newsDetialTime .center {
    display: inline-block;
}

.fl {
    float: left;
    display: inline;
}

.newsDetial_fz {
    position: relative;
    cursor: pointer;
    margin: 0px 20px;
}

.fontSize_box {
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 9999;
    opacity: 0;
    transform: rotateX(90deg);
    -webkit-transform: rotateX(90deg);
    transition: all 0.3s linear;
    -webkit-transition: all 0.3s linear;
    transform-origin: center top;
    -webkit-transform-origin: center top;
}

.newsDetial_fz:hover .fontSize_box {
    opacity: 1;
    transform: rotateX(0deg);
    -webkit-transform: rotateX(0deg);
}

.fontSize_box span {
    display: block;
    height: 20px;
    background: #f5f5f5;
    font-size: 14px;
    color: #666;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
}

.fontSize_box span.hover {
    background: #cf3827;
    color: #fff;
}

.minH_350 {
    min-height: 350px;
    height: auto !important;
    height: 350px;
}

.articleBox {
    overflow: hidden;
    font-size: 14px;
    color: #747474;
    line-height: 30px;
    padding: 20px 0 0 0;
}

.articlePage {
    clear: both;
    text-align: center;
    overflow: hidden;
    padding: 20px 0;
}

.pageUp {
    clear: both;
    overflow: hidden;
    line-height: 35px;
    font-size: 16px;
    padding: 20px 170px 0 0;
    border-top: 1px solid #e4e4e4;
    position: relative;
}

a.backList {
    height: 40px;
    overflow: hidden;
    line-height: 40px;
    background: #4c8cd2;
    font-size: 15px;
    color: #fff !important;
    text-align: center;
    padding: 0px 30px;
    position: absolute;
    right: 0px;
    top: 50%;
    margin-top: -20px;
}

.pageUp a {
    font-family: OPPOSans-M;
    color: #666;
}

.pageUp a:hover {
    color: #4c8cd2;
}

.h40 {
    clear: both;
    height: 40px;
}
</style>