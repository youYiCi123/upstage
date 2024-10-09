<template>
    <div class="download-button-content">
        <el-button v-if="roundFlag" :icon="Download" type="info" :size="size" round @click="showDialog" :loading="loading">
            下载
        </el-button>
        <el-button v-if="circleFlag" :icon="Download" type="info" :size="size" circle @click="showDialog"
            :loading="loading">
        </el-button>
        <el-dialog title="添加水印" v-model="waterMarkDialogVisible" width="30%" @opened="focusInput()" :append-to-body=true
            :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="120px" :rules="waterMarkRules" ref="waterMarkForm" :model="waterMarkFormData"
                    status-icon @submit.native.prevent>
                    <el-form-item label="水印形式: ">
                        <el-radio-group v-model="waterMarkFormData.waterType">
                            <el-radio-button label="姓名" value="1" />
                            <el-radio-button label="自定义" value="2" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="水印内容: " v-if="waterMarkFormData.waterType == '2'" prop="waterMark">
                        <el-input type="text" ref="waterMarkContRef" @keyup.enter.native="downloadFile(waterMarkForm)"
                            v-model.trim="waterMarkFormData.waterMark" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="水印页面: " v-if="waterMarkFormData.waterType == '2'">
                        <el-radio-group v-model="waterMarkFormData.waterPage">
                            <el-radio-button label="默认全部" value="1" />
                            <el-radio-button label="自定义" value="2" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="水印范围: " v-if="waterMarkFormData.waterPage == '2'">
                        <el-row>
                            <el-col :span="10" style="text-align: center">
                                <div>起始页：</div>
                            </el-col>
                            <el-col :span="11">
                                <el-input-number :min="1" :max="waterMarkFormData.pagesToWatermark[1]===null?10:waterMarkFormData.pagesToWatermark[1]"
                                    v-model="waterMarkFormData.pagesToWatermark[0]" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10" style="text-align: center">
                                <div>末尾页：</div>
                            </el-col>
                            <el-col :span="11">
                                <el-input-number :min="waterMarkFormData.pagesToWatermark[0]"
                                    v-model="waterMarkFormData.pagesToWatermark[1]" />
                            </el-col>
                        </el-row>
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
import { Download } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus';
import pinia from '@/store/index'
import { useFileStore } from "@/store/modules/fileStore";
const fileStore = useFileStore(pinia);
import { useUserStore } from "@/store/modules/userStore";
const userStore = useUserStore();
import panUtil from '../../../utils/fileUtil'

const waterMarkDialogVisible = ref(false);
const waterMarkFormData = reactive({
    waterType: '1',
    waterPage:'1',
    waterMark: '',
    pagesToWatermark: [1, null],
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

function showDialog() {
    if (props.item.waterMaterFlag == 1) {//添加水印
        waterMarkDialogVisible.value = true;
    } else {//不需要
        doDownload(props.item, waterMarkFormData.waterMark,[])
    }
}


function downloadFile(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            if (waterMarkFormData.waterType == '1') {
                waterMarkFormData.waterMark = userStore.nickName
            }
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
                doDownLoads(fileStore.multipleSelection, waterMarkFormData.waterMark, 0)
            }
            if (props.item) {
                if (props.item.folderFlag === 1) {
                    ElMessage.error('文件夹暂不支持下载')
                    return
                }
                doDownload(props.item, waterMarkFormData.waterMark,waterMarkFormData.pagesToWatermark)
            }
        }
    })
}

function doDownload(item: any, waterMark: any,pagesToWatermark:any) {
    let url = panUtil.getUrlPrefix() + '/file/download?fileId=' + item.fileId +
        '&userId=' + userStore.id + '&waterMark=' + waterMark + '&pagesToWatermark=' +pagesToWatermark,
        filename = item.filename,
        link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
function doDownLoads(items: any, waterMark: any, i: number) {
    if (items.length === i) {
        return
    }
    setTimeout(function () {
        doDownload(items[i], waterMark,[]);
        i++
        doDownLoads(items, waterMark, i)
    }, 500);
}


</script>

<style>
.download-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>