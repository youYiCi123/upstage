<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
                    查询搜索
                </el-button>
                <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="listQuery" size="default" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="模板名称" clearable></el-input>
                    </el-form-item>
                    <!-- todo -->
                    <el-form-item label="模板类型：">
                        <el-select v-model="listQuery.type" placeholder="请选择模板类型" clearable>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" class="btn-add" @click="handleAdd()" style="float:right; margin-bottom: 20px">添加
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" stripe v-loading="listLoading"
                @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="模板名称" width="320" align="center">
                    <template #default="scope">{{ scope.row.title }}</template>
                </el-table-column>
                <el-table-column label="类别" width="110" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.titleType == '1' ? 'success' : 'warning'" style="cursor:pointer;">
                            <span v-html="TypeFormat(scope.row.titleType)"></span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="195" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                    <template #default="scope">{{ scope.row.remark }}</template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
                            编辑
                        </el-button>
                        <el-button size="small" type="primary" @click="handleView(scope.row)">查看模板内容
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :layout="paginationData.layout" :current-page.sync="paginationData.currentPage"
                :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :total="total">
            </el-pagination>
        </div>
    </div>
    <el-dialog :title="isEdit ? '编辑模板' : '添加模板'" v-model="tempDialogVisible" width="30%">
        <el-form :model="template" ref="templateForm" :rules="templateRules" label-width="110px" size="default">
            <el-form-item label="模板名称：" prop="title">
                <el-input v-model="template.title" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="模板类型：">
                <el-radio-group v-model="template.titleType" size="default">
                    <el-radio-button :label="1">调查问卷</el-radio-button>
                    <el-radio-button :label="2">活动评估</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="描述：" prop="remark">
                <el-input type="textarea" :rows="2" v-model="template.remark" style="width: 250px"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="tempDialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="handleDialogConfirm(templateForm)" size="small">确 定</el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from 'vue-router'; //vue3路由跳转
import { usePagination } from "@/hooks/usePagination";
import { ElMessage,ElMessageBox } from 'element-plus';
import dayjs from "dayjs";
import type { FormInstance, FormRules } from 'element-plus';
import { fetchList, createTemplate,updateTemplate,deleteTemplate } from "@/api/template"
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter();
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])
const tempDialogVisible = ref(false)

const listQuery = reactive({
    keyword: '',
    type: ''
})

const list = ref<any>([])
const total = ref(0);
const isEdit = ref(false);
const listLoading = ref(false);
const template = reactive({
    id: -1,
    title: '',
    titleType: 1,
    remark: '',
})

const options = [
    {
        value: 1,
        label: '调查问卷',
    },
    {
        value: 2,
        label: '活动评估',
    }
]

function TypeFormat(type: number) {
    if (type == 1) {
        return '调查问卷'
    } else {
        return '活动评估'
    }
}

/** 验证规则 */
const templateRules: FormRules = {
    title: [
        { required: true, message: '请输入内容', trigger: 'blur' }
    ]
}

const templateForm = ref<FormInstance>();

function handleSelectionChange(val: any) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}

function handleResetSearch() {
    listQuery.keyword = '';
    listQuery.type = '';
}

function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function getList() {
    listLoading.value = true;
    fetchList({ keyword: listQuery.keyword, type: listQuery.type, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

function handleAdd() {
    isEdit.value = false;
    tempDialogVisible.value = true;
    template.remark='';
    template.title='';
    template.titleType=1
}

function handleView(row: any) {
    router.push({ path: '/research/tempView', query: { id: row.id } });
}

function handleUpdate(row: any) {
    isEdit.value = true;
    tempDialogVisible.value = true;
    Object.assign(template, row);
}

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该培训?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteTemplate(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}

function handleDialogConfirm(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            if (isEdit.value) {
                updateTemplate(template).then(res=>{
                    ElMessage({
                        message: '修改成功！',
                        type: 'success'
                    });
                    tempDialogVisible.value = false
                    getList()
                })
            } else {
                createTemplate(template).then(res => {
                    ElMessage({
                        message: '创建成功！',
                        type: 'success'
                    });
                    tempDialogVisible.value = false
                    getList()
                }).catch(
                    err => {
                        console.log(err.response.data.message)
                    })
            }

        }
    })

}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>