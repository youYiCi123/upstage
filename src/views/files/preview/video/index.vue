<template>
    <div>
        <div class="pan-video-content">
            <div class="video-name-content">
                <p class="video-name">{{ videoName }}</p>
            </div>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="18">
                    <!--视频播放容器-->
                    <div class="video-content">
                        <video id="r_pan_video_player" :src="videoShowPath" autoplay="true" controls="true" />
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="video-list-content">
                        <el-menu class="video-list" :default-active="activeIndex" @select="selectVideo">
                            <el-menu-item v-for="(item, index) in videoList" :key="index" :index="item.fileId">
                                <i class="iconfont  icon-video"></i>
                                <span slot="title">{{ item.filename }}</span>
                            </el-menu-item>
                        </el-menu>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; //vue3路由跳转
import { ElMessage} from 'element-plus';
const route = useRoute();
import {list} from '@/api/file'
import panUtil from '@/utils/fileUtil'

const videoName = ref('')
const activeIndex = ref('')
const videoShowPath = ref('')
const videoList = ref<any[]>([]);

function init() {
    console.log('1de',route.params)
    list({
        pageType:route.params.pageType,
        parentId: route.params.parentId,
        fileTypes: '9'
    }).then((res)=>{
        if (res.code === 200) {
            renderVideoList(res.data)
            listenVideoPlayer()
        } else {
            ElMessage.error(res.message)
        }
    }).catch((err)=>{
        ElMessage.error(err)
    })
}

function selectVideo(index:string) {
    activeIndex.value = index
    videoList.value.some((item:any) => {
        if (item.fileId === index) {
            videoName.value = item.fileName
            videoShowPath.value = panUtil.getPreviewUrl(item.fileId)
            return true
        }
    })
}

function renderVideoList(dataList:any) {
    videoList.value = new Array()
    dataList.forEach((item:any, index:number) => {
        item.filename = item.filename.substring(0, item.filename.lastIndexOf('.'))
        if (item.filename.length > 15) {
            item.filename = item.filename.substring(0, 16) + '...'
        }
        if (item.fileId === route.params.fileId) {
            videoName.value = item.filename
            videoShowPath.value = panUtil.getPreviewUrl(item.fileId)
        }
        videoList.value.push(item)
        activeIndex.value = route.params.fileId as unknown as string
    })
}
function listenVideoPlayer() {
    document.getElementById('r_pan_video_player')?.addEventListener('ended', () => {
        selectNext(activeIndex.value)
    }, false)
}

function selectNext(currentFileId:any) {
    let i=-1
    videoList.value.some((item:any, index:any) => {
        if (item.fileId === currentFileId) {
            i = index
            return true
        }
    })
    if (i === videoList.value.length - 1) {
        return
    }
    let item = videoList.value[++i]
    videoName.value = item.filename
    videoShowPath.value = panUtil.getPreviewUrl(item.fileId)
    activeIndex.value = item.fileId
}


onMounted(() => {
    init()
})

</script>

<style scoped>
.pan-video-content {
    width: 100%;
    margin-top: 22px;
    display: block;
}

.pan-video-content .video-name-content {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 0 0 0;
}

.pan-video-content .video-name-content .video-name {
    color: #409EFF;
    font-size: 35px;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.pan-video-content .video-content {
    width: 100%;
    height: 100px;
    display: block;
    text-align: center;
}

.pan-video-content .video-content #r_pan_video_player {
    display: inline-block;
    width: 100%;
    height: 500px;
    line-height: 500px;
}

.pan-video-content .video-list-content {
    display: block;
    margin: 0 auto;
    width: 250px;
    height: 500px;
    line-height: 500px;
    overflow: hidden;
}

.pan-video-content .video-list-content .video-list {
    width: 100%;
    height: 100%;
    overflow: scroll;
}

.pan-video-content .video-list i {
    margin-right: 15px;
}
</style>
