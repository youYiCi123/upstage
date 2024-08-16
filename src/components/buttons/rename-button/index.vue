<template>
    <div class="rename-button-content">
        <el-button v-if="roundFlag" :icon="Reading" type="warning" :size="size" round @click="renameFile">
            重命名
        </el-button>
        <el-button v-if="circleFlag" :icon="Reading" type="warning" :size="size" circle @click="renameFile">
        </el-button>
        <el-dialog title="文件重命名" v-model="renameDialogVisible" width="30%" @opened="focusInput()"
             :append-to-body=true :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="100px" :rules="renameRules" ref="renameForm" :model="renameFormData" status-icon
                    @submit.native.prevent>
                    <el-form-item label="文件名称" prop="filename">
                        <el-input type="text" ref="filenameRef" @keyup.enter.native="doRenameFile(renameForm)"
                            v-model="nameWithoutExtension" autocomplete="off">
                            <template #append v-if="!props.item.folderFlag">{{ fileExtension }}</template></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="renameDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doRenameFile(renameForm)" :loading="loading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive,computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus';
import { Reading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import {updateFilename} from '../../../api/file'
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
    },
    item: {
        type: Object,
        default: null,
    },
})
const emit = defineEmits(['loadFileList'])
const renameForm = ref<FormInstance>();
/** 验证规则 */
const renameRules: FormRules = {
    filename: [
        { required: true, message: '请输入新文件名称', trigger: 'blur' }
    ]
};
const nameWithoutExtension = ref(''); // 文件名前缀
const fileExtension = ref(''); // 文件后缀

const filenameRef = ref();

const renameFormData = reactive({
    fileId: '',
    filename: ''
})
const renameDialogVisible = ref(false);
const loading = ref(false);

function updateNameAndExtension() {
  if (props.item.folderFlag) {
    nameWithoutExtension.value = renameFormData.filename;
    fileExtension.value = '';
  } else {
    const parts = renameFormData.filename.split('.');
    nameWithoutExtension.value = parts.slice(0, -1).join('.');
    fileExtension.value = '.' + parts.pop();
  }
}

function renameFile() {
    if (props.item) {
        renameFormData.fileId = props.item.fileId
        renameFormData.filename = props.item.filename
        updateNameAndExtension();
        renameDialogVisible.value = true
        return
    }
    if (!fileStore.multipleSelection || fileStore.multipleSelection.length == 0) {
        ElMessage.error('请选择要重命名的文件')
        return
    }
    if (fileStore.multipleSelection.length > 1) {
        ElMessage.error('请选择一个文件进行重命名')
        return
    }
    let item = fileStore.multipleSelection[0]
    renameFormData.fileId = item.fileId
    renameFormData.filename = item.filename
    updateNameAndExtension();
    renameDialogVisible.value = true
}
function doRenameFile(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            loading.value = true
            updateFilename({
                fileId: renameFormData.fileId,
                newFilename: nameWithoutExtension.value+fileExtension.value
            }).then(()=>{
                loading.value = false
                renameDialogVisible.value = false
                ElMessage.success('重命名成功')
                emit('loadFileList')
            }).catch((res:any)=>{
                loading.value = false
            })
        }
    })
}

function focusInput() {
    filenameRef.value.focus()
}


</script>

<style>
.rename-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>