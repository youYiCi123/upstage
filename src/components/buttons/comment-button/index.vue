<template>
    <div class="rename-button-content">
        <el-button v-if="roundFlag" :icon="ChatDotRound" type="primary" :size="size" round @click="lookComment">
            评论
        </el-button>
        <el-button v-if="circleFlag" type="primary" :icon="ChatDotRound" :size="size" circle @click="lookComment">
        </el-button>
        <el-drawer destroy-on-close append-to-body v-model="drawerVisible" size="35%" :with-header="false" :direction="direction">
            <comment :fileId="props.item.fileId"></comment>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import Comment from "@/components/comment/Comment.vue";
const props = defineProps({
    roundFlag: {
        type: Boolean,
        default: false
    },
    circleFlag: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: ''
    },
    item: {
        type: Object,
        default: null,
    },
})
const direction = ref('rtl')
const drawerVisible = ref(false);

function lookComment() {
    drawerVisible.value = true
}

</script>

<style>
.rename-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>