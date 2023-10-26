<template>
    <el-card shadow="never" class="standard-margin">
        <div class="typo js-toc-content m-padded-tb-small match-braces rainbow-braces tableStyle" v-html="train.content">
        </div>
    </el-card>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { useRoute} from 'vue-router';
import {queryNewsContent } from "@/api/news";
const route = useRoute();
const train = reactive({ content: '' })

function getTrain() {
    queryNewsContent(route.query.id).then(response => {
        if (response.data != null) {
            train.content = response.data.content
        }
    })
}
getTrain()

</script>
<style scoped>
.detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
}

.standard-margin {
    margin-top: 15px;
}

.form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
}

.form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
}

.form-left-bg {
    background: #F2F6FC;
}
</style>