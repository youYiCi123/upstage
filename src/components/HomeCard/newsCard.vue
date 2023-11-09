<template>
    <div class="chart-wrapper">
        <el-table ref="newsTable" :data="props.newsList" style="width: 100%;" border>
            <el-table-column label="公告标题" width="280" show-overflow-tooltip align="center">
                <template #default="scope">
                    <el-button  @click="handleSelectNews(scope.row)" type="success" size="small" text>{{ scope.row.theme }}</el-button>    
                </template>
            </el-table-column>
            <el-table-column label="公告类型" width="130" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.newsType== '1' ? 'warning' : 'success'">
                        <span v-html="newsTypeFormat(scope.row.newsType)"></span>
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="195" align="center">
                <template #default="scope">
                    <span v-html="timeFormat(scope.row.createdTime)"></span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router' //vue3路由跳转
import dayjs from "dayjs";
const router = useRouter();
const props = defineProps({
    newsList: {
        type: Array,
        default: []
    }
})


function newsTypeFormat(newsType: number) {
    if (newsType==1) {
        return '通知'
    }else{
        return '公告'
    }
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}

function handleSelectNews(row: any) {
    router.push({ path: '/newsInfo', query: { id: row.id } });
}

</script>
<style scoped></style>