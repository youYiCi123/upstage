<template>
    <div class="pan-main-search-content">
        <el-input class="pan-main-search" v-model="searchKey" placeholder="请输入内容" size="small"
            @keyup.enter.native="doSearch"  @select="handleSelect">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
import { useBreadcrumbStore } from "@/store/modules/breadcrumbStore";
const fileStore = useFileStore(pinia);
const breadcrumbStore = useBreadcrumbStore(pinia);
import { search } from '../../api/file'
const searchKey = ref('')

function doSearch() {
    // 设置FileTypes
    fileStore.setFileTypes('-1')
    // 设置搜索模式
    fileStore.setSearchFlag(true)
    // 缓存搜索关键字
    fileStore.setSearchKey(searchKey.value)
    search({
        keyword: searchKey.value,
        fileTypes: '-1'
    }).then((res: any) => {
        breadcrumbStore.clear()
        breadcrumbStore.addItem({
            id: fileStore.defaultParentId,
            name: fileStore.defaultParentFilename
        })
        breadcrumbStore.addItem({
            id: '-1',
            name: '搜索：' + searchKey.value
        })
        fileStore.setFileList(res.data)
    }).catch((res: any) => {
        ElMessage.error(res.message)
    })
}
function handleSelect(item: any) {
    searchKey.value = item.value
    doSearch()
}

onMounted(() => {
    fileStore.refreshFileParentId()
    searchKey.value = fileStore.searchKey
})

</script>

<style>
.pan-main-search-content {
    position: absolute;
    right: 35px;
    height: 60px;
    padding: 20px 0 0 13px;
}

.pan-main-search-content .pan-main-search {
    width: 250px;
}

.pan-main-search-content .pan-main-search input {
    border-radius: 30px;
}
</style>