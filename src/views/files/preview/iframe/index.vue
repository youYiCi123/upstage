<template>
    <div>
        <div class="iframe-content">
            <iframe class="iframe" :src="showPath" frameborder="0" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import panUtil from '@/utils/fileUtil'
import { useRoute } from 'vue-router'; //vue3路由跳转
const route = useRoute();
const showPath = ref('')

function init() {
    const fileId = route.params.fileId
    showPath.value = panUtil.getPreviewUrl(fileId)
}

onMounted(() => {
    //确保页面元素加载完成之后调用
    init()
})

</script>

<style scoped>
.iframe-content {
    width: 100%;
    display: block;
    text-align: center;
}

.iframe {
    width: 100%;
    height: 1200px;
}
</style>
