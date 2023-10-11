<template>
    <div>
        <div class="pan-music-content">
            <div class="music-name-content">
                <p class="music-name">{{ musicName }}</p>
            </div>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="18">
                    <div class="record-img-content">
                        <img class="record-img" src="@/assets/images/record.png">
                    </div>
                    <!--音频播放容器-->
                    <div class="music-content">
                        <audio id="r_pan_music_player" :src="musicShowPath" autoplay="true" controls="true" />
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="music-list-content">
                        <el-menu class="music-list" :default-active="activeIndex" @select="selectMusic">
                            <el-menu-item v-for="(item, index) in musicList" :key="index" :index="item.fileId">
                                <i class="iconfont  icon-AUDIO"></i>
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

const musicName = ref('')
const activeIndex = ref('')
const musicShowPath = ref('')
const musicList = ref<any[]>([]);


function init() {
    list({
        pageType:route.params.pageType,
        parentId: route.params.parentId,
        fileTypes: '8'
    }).then((res)=>{
        renderMusicList(res.data)
        listenMusicPlayer()
    }).catch((res)=>{
        ElMessage.error(res.message)
    })
}

function selectMusic(index:any, indexPath:any) {
    activeIndex.value = index
    musicList.value.some(item => {
        if (item.fileId === index) {
            musicName.value = item.filename
            musicShowPath.value = panUtil.getPreviewUrl(item.fileId)
            return true
        }
    })
}

function renderMusicList(dataList:any) {
    musicList.value = new Array()
    dataList.forEach((item:any, index:any) => {
        item.filename = item.filename.substring(0, item.filename.lastIndexOf('.'))
        if (item.filename.length > 15) {
            item.filename = item.filename.substring(0, 16) + '...'
        }
        if (item.fileId === route.params.fileId) {
            musicName.value = item.filename
            musicShowPath.value = panUtil.getPreviewUrl(item.fileId)
        }
        musicList.value.push(item)
        activeIndex.value = route.params.fileId as unknown as string
    })
}

function selectNext(currentFileId:any) {
    let i=-1
    musicList.value.some((item, index) => {
        if (item.fileId === currentFileId) {
            i = index
            return true
        }
    })
    if (i === musicList.value.length - 1) {
        return
    }
    let item = musicList.value[++i]
    musicName.value = item.filename
    musicShowPath.value = panUtil.getPreviewUrl(item.fileId)
    activeIndex.value = item.fileId
}

function listenMusicPlayer() {
    document.getElementById('r_pan_music_player')?.addEventListener('ended', () => {
        selectNext(activeIndex.value)
    }, false)
}


onMounted(() => {
    //确保页面元素加载完成之后调用
    init()
})
</script>

<style scoped>
.pan-music-content {
    width: 100%;
    margin-top: 22px;
    display: block;
}

.pan-music-content .music-name-content {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 0 0 0;
}

.pan-music-content .music-name-content .music-name {
    color: #409EFF;
    font-size: 35px;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.pan-music-content .record-img-content {
    display: inline-block;
    width: 100%;
    height: 100%;
    margin-top: 80px;
    text-align: center;
}

.pan-music-content .record-img-content .record-img {
    width: 300px;
}

.pan-music-content .music-content {
    width: 100%;
    height: 100px;
    display: block;
    margin-top: 60px;
    text-align: center;
    position: relative;
}

.pan-music-content .music-content #r_pan_music_player {
    display: inline-block;
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0;
}

.pan-music-content .music-list-content {
    display: block;
    margin: 0 auto;
    width: 250px;
    height: 500px;
    line-height: 500px;
    overflow: hidden;
}

.pan-music-content .music-list-content .music-list {
    width: 100%;
    height: 100%;
    overflow: scroll;
}

.pan-music-content .music-list i {
    margin-right: 15px;
}
</style>
