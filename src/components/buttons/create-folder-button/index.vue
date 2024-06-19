<template>
    <div class="create-folder-button-content">
        <el-button v-if="roundFlag" :icon="FolderAdd" type="success" :size="size" round
            @click="createFolderDialogVisible = true">
            新建文件夹
        </el-button>
        <el-button v-if="circleFlag" type="success" :icon="FolderAdd" :size="size" circle
            @click="createFolderDialogVisible = true">
        </el-button>
        <el-dialog title="新建文件夹" v-model="createFolderDialogVisible" width="40%" @opened="focusInput()"
            @closed="resetForm()" :append-to-body=true :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="150px" :rules="createFolderRules" ref="createFolderRef" :model="createFolderForm"
                    status-icon @submit.native.prevent>
                    <el-form-item label="文件夹名称" prop="folderName">
                        <el-input type="text" ref="folderName" @keyup.enter.native="doCreateFolder(createFolderRef)"
                            v-model="createFolderForm.folderName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item v-if="props.isDep" label="文件夹属性：">
                        <el-radio-group v-model="createFolderForm.folderType" size="default">
                            <el-radio-button :label="0">
                                <i class='iconfont icon-folder' style="margin-right: 5px;"/>
                                普通文件</el-radio-button>
                            <el-radio-button :label="1">
                                <i class='iconfont icon-kehuguanli' style="margin-right: 5px;"/>本部门小组</el-radio-button>
                            <el-radio-button :label="2">
                                <i class='iconfont icon-kehuguanli' style="margin-right: 5px;"/>跨部门小组</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="createFolderForm.folderType === 1" label="分配小组：">
                        <el-select v-model="createFolderForm.thisDepParticipants" clearable multiple placeholder="人员信息"
                            style="width: 250px">
                            <el-option v-for="item in options" :key="item.id" :label="item.nickName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="createFolderForm.folderType === 2" label="指定人员：">
                        <el-cascader clearable v-model="createFolderForm.crossDepParticipants" :options="sendPersonOptions"
                            style="width: 250px" :props="cascaderProps">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="createFolderDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doCreateFolder(createFolderRef)" :loading="loading">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { createFolder } from '../../../api/file'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import pinia from '@/store/index'
import { fetchListWithChildren, getColleague } from '@/api/dep';
import { useFileStore } from "@/store/modules/fileStore";
import {
    FolderAdd
} from '@element-plus/icons-vue'
const fileStore = useFileStore(pinia);
const props = defineProps({
    isDep: {
        type: Boolean,
        default: false
    },
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
const emit = defineEmits(['loadFileList'])
const sendPersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const createFolderRef = ref<FormInstance>();
/** 验证规则 */
const createFolderRules: FormRules = {
    folderName: [
        { required: true, message: '请输入文件夹名称', trigger: 'blur' }
    ]
};

const options = ref<any[]>([])
function getColleageSelector() {
    getColleague().then(response => {
        options.value = response.data
    })
}
getColleageSelector()

const createFolderDialogVisible = ref(false);

const loading = ref(false);

const createFolderForm = reactive({
    folderName: '',
    folderType: 0,
    thisDepParticipants: [] as any, //本部门参与人员
    crossDepParticipants: [] as any //跨部门参与人员
})
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
                pageType: props.isDep,
                parentId: props.isDep ? fileStore.parentDepId : fileStore.parentId,
                folderName: createFolderForm.folderName,
                folderType: createFolderForm.folderType,
                thisDepParticipants: createFolderForm.thisDepParticipants,
                crossDepParticipants: createFolderForm.crossDepParticipants
            }).then(() => {
                loading.value = false
                createFolderDialogVisible.value = false
                ElMessage.success('新建成功')
                emit('loadFileList')
            }).catch((res: any) => {
                loading.value = false
            })
        }
    })
}
getSendPersonList()

function getSendPersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        sendPersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
                }
            }
            sendPersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
        
    });
}
const cascaderProps = { multiple: true, emitPath: false }


</script>

<style>
.create-folder-button-content {
    display: inline-block;
    margin-right: 10px;
}
</style>