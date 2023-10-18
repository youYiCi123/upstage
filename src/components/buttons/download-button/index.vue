<template>
    <div class="download-button-content">
        <el-button v-if="roundFlag" type="info" :size="size" round @click="showDialog" :loading="loading">
            下载<i class="el-icon-download el-icon--right" />
        </el-button>
        <el-button v-if="circleFlag" type="info" :size="size" circle @click="showDialog" :loading="loading">
            <i class="el-icon-download" />
        </el-button>
        <el-dialog title="添加水印" v-model="waterMarkDialogVisible" width="30%" @opened="focusInput()" :append-to-body=true
            :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="100px" :rules="waterMarkRules" ref="waterMarkForm" :model="waterMarkFormData"
                    status-icon @submit.native.prevent>
                    <el-form-item label="水印内容" prop="waterMark">
                        <el-input type="text" ref="waterMarkContRef" @keyup.enter.native="downloadFile(waterMarkForm)"
                            v-model="waterMarkFormData.waterMark" autocomplete="off" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="waterMarkDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="downloadFile(waterMarkForm)" :loading="loading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
const fileStore = useFileStore(pinia);

import panUtil from '../../../utils/fileUtil'
import { getToken } from '../../../utils/auth'

const waterMarkDialogVisible = ref(false);
const waterMarkFormData = reactive({
    waterMark: ''
})
/** 验证规则 */
const waterMarkRules: FormRules = {
    waterMark: [
        { required: true, message: '请输入水印内容', trigger: 'blur' }
    ]
}

const waterMarkForm = ref<FormInstance>();
const waterMarkContRef = ref();
function focusInput() {
    waterMarkContRef.value.focus()
}

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

const loading = ref(false);

function showDialog(){
    waterMarkDialogVisible.value=true;
}

function downloadFile(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            waterMarkDialogVisible.value = false
            if (!props.item && (!fileStore.multipleSelection || fileStore.multipleSelection.length === 0)) {
                ElMessage.error('请选择要下载的文件')
                return
            }
            if (!props.item) {
                for (let i = 0, iLength = fileStore.multipleSelection.length; i < iLength; i++) {
                    if (fileStore.multipleSelection[i].folderFlag === 1) {
                        ElMessage.error('文件夹暂不支持下载')
                        return
                    }
                }
                doDownLoads(fileStore.multipleSelection,waterMarkFormData.waterMark, 0)
            }
            if (props.item) {
                if (props.item.folderFlag === 1) {
                    ElMessage.error('文件夹暂不支持下载')
                    return
                }
                doDownload(props.item,waterMarkFormData.waterMark)
            }
        }
    })
}

function doDownload(item: any,waterMark:any) {
    let url = panUtil.getUrlPrefix() + '/file/download?fileId=' + item.fileId+'&waterMark='+waterMark,
        filename = item.filename,
        link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
function doDownLoads(items: any,waterMark:any, i: number) {
    if (items.length === i) {
        return
    }
    setTimeout(function () {
        doDownload(items[i],waterMark);
        i++
        doDownLoads(items,waterMark, i)
    }, 500);
}


</script>

<style>
.download-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>