<template>
    <div class="create-folder-button-content">
        <el-button v-if="roundFlag" type="success" :size="size" round @click="createFolderDialogVisible = true">
            新建文件夹<i class="el-icon-folder-add el-icon--right" />
        </el-button>
        <el-button v-if="circleFlag" type="success" :size="size" circle @click="createFolderDialogVisible = true">
            <i class="el-icon-folder-add" />
        </el-button>
        <el-dialog title="新建文件夹" v-model="createFolderDialogVisible" width="30%" @opened="focusInput()"
            @closed="resetForm()" :append-to-body=true :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="100px" :rules="createFolderRules" ref="createFolderRef" :model="createFolderForm"
                    status-icon @submit.native.prevent>
                    <el-form-item label="文件夹名称" prop="folderName">
                        <el-input type="text" ref="folderName" @keyup.enter.native="doCreateFolder"
                            v-model="createFolderForm.folderName" autocomplete="off" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="createFolderDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doCreateFolder" :loading="loading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { createFolder } from '../../../api/file'
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
const fileStore = useFileStore(pinia);

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
    }
})
const createFolderRef = ref<FormInstance>();
/** 验证规则 */
const createFolderRules: FormRules = {
    folderName: [
        { required: true, message: '请输入文件夹名称', trigger: 'blur' }
    ]
};

const createFolderDialogVisible = ref(false);

const loading = ref(false);

const createFolderForm = {
    folderName: ''
}
const folderName = ref();

function focusInput() {
    folderName.value.focus()
}
function resetForm() {
    createFolderForm.folderName = ''
}
function doCreateFolder(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            loading.value = true
            createFolder({
                parentId: fileStore.parentId,
                folderName: createFolderForm.folderName
            }).then(() => {
                loading.value = false
                createFolderDialogVisible.value = false
                ElMessage.success('新建成功')
                fileStore.loadFileList()
            }).catch((res: any) => {
                ElMessage.error(res.message)
                loading.value = false
            })
        }
    })
}

</script>

<style>
.create-folder-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>