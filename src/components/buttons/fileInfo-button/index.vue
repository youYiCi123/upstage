<template>
    <div class="rename-button-content">
        <el-button v-if="roundFlag" :icon="Postcard" type="primary" :size="size" round @click="renameFile">
            详情信息
        </el-button>
        <el-button v-if="circleFlag" :icon="Postcard" type="primary" :size="size" circle @click="renameFile">
        </el-button>
        <el-dialog title="文件详情" v-model="fileInfoDialogVisible" width="47%" :append-to-body=true :modal-append-to-body=false
            :center=true>
            <div>
                <el-descriptions border :column="2">
                    <el-descriptions-item label="文件名">{{ props.item.filename }}</el-descriptions-item>
                    <el-descriptions-item label="文件大小">{{ props.item.fileSizeDesc }}</el-descriptions-item>
                    <el-descriptions-item label="上传人">{{ props.item.creatName }}</el-descriptions-item>
                    <el-descriptions-item label="上传时间">{{props.item.createTime}}</el-descriptions-item>
                    <el-descriptions-item label="审核人">{{ props.item.passUserName }}</el-descriptions-item>
                    <el-descriptions-item label="审核时间">{{ props.item.passTime }}</el-descriptions-item>
                    <el-descriptions-item label="修改时间">{{ props.item.updateTime }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Postcard } from '@element-plus/icons-vue'
import { ref} from 'vue'

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

const fileInfoDialogVisible = ref(false);

function renameFile() {
    fileInfoDialogVisible.value = true
}

</script>

<style>
.rename-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>