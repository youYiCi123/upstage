<template>
    <div class="set-folder-button-content">
        <el-button v-if="roundFlag" type="success" :size="size" round @click="setFile">
            基础设置<i class="el-icon-folder-add el-icon--right" />
        </el-button>
        <el-button v-if="circleFlag" type="success" :size="size" circle @click="setFile">
            <i class="el-icon-folder-add" />
        </el-button>
        <el-dialog title="基础设置" v-model="basicSettingsDialogVisible" width="30%" :append-to-body=true
            :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="125px"  status-icon>
                    <el-form-item label="下载添加水印">
                        <el-radio-group v-model="settingForm.isWaterMater">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="basicSettingsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()" :loading="loading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { saveSet } from '../../../api/file'
import { ref, reactive} from 'vue'
import { ElMessage } from 'element-plus';

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
    }
})
const emit = defineEmits(['loadFileList'])

const basicSettingsDialogVisible = ref(false);

const loading = ref(false);

const settingForm = reactive({
    isWaterMater:0
})

function setFile(){
    settingForm.isWaterMater= props.item.waterMaterFlag
    basicSettingsDialogVisible.value=true
} 

function submitForm() {
    loading.value = true
    saveSet({
        fileId: props.item.fileId,
        isWaterMater: settingForm.isWaterMater
    }).then(() => {
        loading.value = false
        basicSettingsDialogVisible.value = false
        ElMessage.success('修改成功')
        emit('loadFileList')
    }).catch((res: any) => {
        ElMessage.error(res.message)
        loading.value = false
    })
}

</script>

<style>
.set-folder-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>