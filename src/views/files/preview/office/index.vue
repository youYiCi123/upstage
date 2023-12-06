<template>
    <div>
        <div class="office-iframe-content">
            <iframe class="office-iframe" :src="showPath" frameborder="0" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router'; //vue3路由跳转
const route = useRoute();
import { Base64 } from "js-base64";
import panUtil from '@/utils/fileUtil'
const showPath = ref('');

function init() {
    let fileId = route.params.fileId;
    let userName = route.params.userName;
    let filename = route.params.filename;
    //使用kkfileview预览文档
    var url = panUtil.getPreviewUrl(fileId,userName) + '&fullfilename=' + filename;
    showPath.value = 'http://localhost:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(url));
}

onMounted(() => {
    init()
})
</script>

<style scoped>
.office-iframe-content {
    width: 100%;
    display: block;
    text-align: center;
}

.office-iframe {
    width: 100%;
    height: 1200px;
}
</style>
