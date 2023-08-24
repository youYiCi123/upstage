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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="角色名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名称" width="150" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template #default="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="用户数" width="100" align="center">
          <template #default="scope">{{ scope.row.adminCount }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">
            <span v-html="timeFormat(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template #default="scope">
            <el-switch @change="handleStatusChange(scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleSelectMenu(scope.row)">分配菜单
            </el-button>
            <el-button size="small" type="primary" @click="handleSelectResource(scope.row)">分配权限
            </el-button>
            <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
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
    <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" v-model="dialogVisible" width="40%">
      <el-form :model="role">
        <el-form-item label="角色名称：" label-width="150px">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：" label-width="150px">
          <el-input v-model="role.description" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" label-width="150px">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </template>

    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'; //vue3路由跳转
import { fetchList, createRole, updateRole, updateStatus, deleteRole } from '@/api/role';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import dayjs from "dayjs";
import { RoleMode } from "@/mode/UserInfo/RoleMode";
let listQuery = reactive({
  keyword: null
})

const role = reactive({
  id: -1,
  name: '',
  description: '',
  adminCount: 0,
  status: 1
});

const listLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const list = ref<RoleMode[]>([])
const total = ref(0);
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter();
getList()

function timeFormat(time: string) {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function handleResetSearch() {
  listQuery.keyword = null
  paginationData.currentPage = 1
}
function handleSearchList() {
  paginationData.currentPage = 1;
  getList();
}
function handleAdd() {
  dialogVisible.value = true;
  isEdit.value = false;
  role.id = -1,
    role.name = '',
    role.description = '',
    role.adminCount = 0,
    role.status = 1
}
function handleStatusChange(row: RoleMode) {
  ElMessageBox.confirm('是否要修改该状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    updateStatus(row.id as number, row.status).then(response => {
      ElMessage({
        type: 'success',
        message: '修改成功!'
      });
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消修改'
    });
    getList();
  });
}
function handleDelete(row: RoleMode) {
  ElMessageBox.confirm('是否要删除该角色?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let ids = [];
    ids.push(row.id);
    // let params = new URLSearchParams();
    // params.append("ids", ids);
    deleteRole(ids).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
}
function handleUpdate(row: RoleMode) {
  dialogVisible.value = true;
  isEdit.value = true;
  role.id = row.id
  role.name = row.name
  role.description = row.description
  role.adminCount = row.adminCount
  role.status = row.status
}
function handleDialogConfirm() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {

    if (isEdit.value) {
      updateRole(role.id, role).then(response => {
        ElMessage({
          message: '修改成功！',
          type: 'success'
        });
        dialogVisible.value = false;
        getList();
      })
    } else {
      createRole(role).then(response => {
        ElMessage({
          message: '添加成功！',
          type: 'success'
        });
        dialogVisible.value = false;
        getList();
      })
    }
  })
}
function handleSelectMenu(row: RoleMode) {
  router.push({ path: '/ums/allocMenu', query: { roleId: row.id } })
}
function handleSelectResource(row: RoleMode) {
  router.push({ path: '/ums/allocResource', query: { roleId: row.id } })
}
function getList() {
  listLoading.value = true;
  fetchList({ keyword: listQuery.keyword, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

/** 监听分页参数的变化 */
// watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList)


</script>
<style></style>


