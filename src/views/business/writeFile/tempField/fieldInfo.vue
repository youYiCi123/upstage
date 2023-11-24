<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="field" ref="customForm" label-width="150px" size="default">
            <el-card>
                <el-form-item label="字段名称：">
                    <el-input v-model="field.quName" type="textarea" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="字段属性：">
                    <el-select v-model="field.quType" clearable style="width: 250px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属模板：">
                    <el-select v-model="field.templates" multiple style="width: 250px" clearable>
                        <el-option v-for="item in allTemps" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-card>
            <div v-if="field.quType != null && [2, 3].includes(field.quType)" class="filter-container"
                style="margin-top: 25px">
                <el-button class="filter-item" type="primary" :icon="Plus" style="margin-bottom: 10px;" size="default" plain
                    @click="handleAdd">
                    添加
                </el-button>
                <el-table :data="field.options" :border="true" style="width: 100%;">
                    <el-table-column align="center" label="选项值">
                        <template #default="scope">
                            <el-input v-model="scope.row.content" type="textarea" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100px">
                        <template #default="scope">
                            <el-button type="danger" :icon="Delete" circle @click="removeItem(scope.$index)" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-left:40% ;margin-top: 20px">
                <el-button type="info" @click="goBack">返回</el-button>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </div>
        </el-form>

    </el-card>
</template>
<script setup lang="ts">
import {
    Plus,
    Delete
} from '@element-plus/icons-vue'
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getTempIdToName } from "@/api/template"
import { useRoute, useRouter } from 'vue-router';
import { createField,updateField, queryField } from "@/api/field"
const route = useRoute();
const router = useRouter();
const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true
    }
})
initField()
function initField() {
    if (props.isEdit) {
        queryField(route.query.id).then(response => {
            Object.assign(field, response.data);
        });
    }
}

const allTemps = ref<any[]>([])

const field = reactive({
    id: -1,
    quName: '',
    quType: null,
    templates: [],
    options: [] as any[]
})

const options = [
    {
        value: 1,
        label: '评分',
    },
    {
        value: 2,
        label: '单选框',
    },
    {
        value: 3,
        label: '复选框',
    },
    {
        value: 4,
        label: '输入框',
    },
]

// 添加子项 
function handleAdd() {
    field.options.push({ content: '' })
}

function removeItem(index: number) {
    field.options.splice(index, 1)
}
function getTempSelector() {
    getTempIdToName().then(response => {
        allTemps.value = response.data
    })
}
getTempSelector()

function submitForm() {
    if (props.isEdit) {
        updateField(field).then(res=>{
            ElMessage({
                type: 'success',
                message: '修改成功!'
            });
            router.back();
        }).catch(err=>{
            console.log(err)
        })
    } else {
        createField(field).then(res => {
            ElMessage({
                type: 'success',
                message: '添加成功!'
            });
            router.back();
        }).catch(err => {
            console.log(err)
        })
    }
}

function goBack() {
    router.back();
}
</script>