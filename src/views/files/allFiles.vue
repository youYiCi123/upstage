<template>
    <div>
        <div class="button-search-content">
            <file-button-group :button-array="buttonArray" />
            <search />
        </div>
        <file-table />
    </div>
</template>

<script setup lang="ts">
import {onMounted } from "vue";
import FileButtonGroup from '@/components/file-button-group/index.vue'
import Search from '@/components/file-search/index.vue'
import FileTable from '@/components/file-table/index.vue'
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
import { useBreadcrumbStore } from "@/store/modules/breadcrumbStore";
const fileStore = useFileStore(pinia);
const breadcrumbStore = useBreadcrumbStore(pinia);

const buttonArray = ['upload', 'createFolder', 'download', 'delete', 'rename', 'share', 'copy', 'transfer']
function init() {
    if (!fileStore.searchFlag) {
        let firstItem = {
            id: fileStore.defaultParentId,
            name: fileStore.defaultParentFilename
        }
        breadcrumbStore.clear()
        breadcrumbStore.addItem(firstItem)
        fileStore.refreshFileParentId()
        fileStore.setFileTypes('-1')
        fileStore.loadFileList()
    }
}
onMounted(() => {
    init()
})
</script>

<style scoped>
.button-search-content {
    display: flex;
    width: 100%;
}
</style>