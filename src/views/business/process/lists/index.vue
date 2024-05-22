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
                <el-form :inline="true" :model="listQuery" size="default">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="请输入主题" clearable>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" class="btn-add" @click="handleAdd()"
                style="float:right; margin-bottom: 20px;margin-left: 20px">添加
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" stripe v-loading="listLoading" border>
                <el-table-column label="流程名称" align="center">
                    <template #default="scope">
                        <div @click="handleSelectProcess(scope.row)" class="file-name-content">{{ scope.row.processName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" width="130" align="center">
                    <template #default="scope">{{ scope.row.createdUserName }}</template>
                </el-table-column>
                <el-table-column label="修改人" width="130" align="center">
                    <template #default="scope">
                    <span v-html="scope.row.updateUserName==null?'无':scope.row.updateUserName">
                    </span></template>
                </el-table-column>
                <el-table-column label="创建时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.createdTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
                            编辑
                        </el-button>
                        <el-button size="small" type="primary" @click="handleSelectProcess(scope.row)">
                            流程定义
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
        <el-dialog :title="isEdit ? '编辑流程' : '添加流程'" v-model="dialogVisible" width="40%">
            <el-form :model="process" ref="processForm" :rules="ProcessRules" label-width="150px" size="small">
                <el-form-item label="名称：" prop="processName">
                    <el-input v-model="process.processName" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDialogConfirm(processForm)" size="small">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'; //vue3路由跳转
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
import pinia from '@/store/index'
import { useUserStore } from "@/store/modules/userStore";
const userStore = useUserStore(pinia);

import { updateProcess,createProcess,getAllProcess, deleteProcess } from "@/api/process"

const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listLoading = ref(false);
const list = ref<any[]>([])  //所有流程信息
const total = ref(0);  ////数量

const listQuery = reactive({
    keyword: ''
})

function handleResetSearch() {
    listQuery.keyword = '';
}
function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

const dialogVisible = ref(false);
const isEdit = ref(false);

const process = reactive({
  id: null,
  processName: null,
  handUserId:userStore.id,
  handUserName:userStore.nickName
})

const processForm = ref<FormInstance>();
/** 验证规则 */
const ProcessRules: FormRules = {
  processName: [{ required: true, trigger: 'blur', message: '流程名不能为空' }]
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function getList() {
    listLoading.value = true;
    getAllProcess({ keyword: listQuery.keyword, pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}
function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该流程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteProcess(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    }).catch(()=>{});
}

function handleSelectProcess(row: any) {
    router.push({ path: 'design', query: { id: row.id }});
}

function handleAdd() {
  process.processName = null;
  dialogVisible.value = true;
  isEdit.value = false;
}

function handleUpdate(row: any) {
  dialogVisible.value = true;
  isEdit.value = true;
  Object.assign(process, row);
}

function handleDialogConfirm(formEl: FormInstance | undefined) {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 表单校验
    if (!formEl) return;
    if (isEdit.value) {
      formEl.validate(valid => {
        if (valid) {
          updateProcess(process.id, process).then(response => {
            ElMessage({
              message: '修改成功！',
              type: 'success'
            });
            dialogVisible.value = false;
            getList();
          })
        } else {
          console.log('参数验证不合法！');
          return false
        }
      })

    } else {
      formEl.validate(valid => {
        if (valid) {
          createProcess(process).then(response => {
            ElMessage({
              message: '添加成功！',
              type: 'success'
            });
            dialogVisible.value = false;
            getList();
          })
        } else {
          console.log('参数验证不合法！');
          return false
        }
      })
    }
  })
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>
<style lang="scss"></style>