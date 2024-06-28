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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="部门名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加部门</el-button>
      <el-button size="small" type="danger" @click="batchDelete()" style="float:right">批量删除
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="depTable" :data="list" style="width: 100%;" v-loading="listLoading"
      @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="部门名" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.depName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部门经理" width="150" align="center">
          <template #default="scope">{{ scope.row.leadName }}</template>
        </el-table-column>
        <el-table-column label="经理电话" align="center">
          <template #default="scope">{{ scope.row.leadPhone }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template #default="scope">{{ scope.row.note }}</template>
        </el-table-column>
        <el-table-column label="操作" width="235" align="center">
          <template #default="scope">
            <!-- todo  handleSelectRole   ====》handleSelectDep  -->
            <el-button size="small" type="primary" @click="handleQueryPersonal(scope.row)">人员信息
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
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑部门' : '添加部门'" v-model="dialogVisible" width="40%">
      <el-form :model="dept" ref="deptForm" :rules="addUserRules" label-width="150px" size="small">
        <el-form-item label="部门名称：" prop="depName">
          <el-input v-model="dept.depName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="部门经理：" prop="leadName">
          <el-input v-model="dept.leadName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="经理电话：" prop="leadPhone">
          <el-input v-model="dept.leadPhone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="leadEmail">
          <el-input v-model="dept.leadEmail" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="经理性别：">
          <el-radio-group v-model="dept.leadSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="dept.note" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm(deptForm)" size="small">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 点击后 传部门id，返回人员信息  -->
    <el-dialog title="人员信息" v-model="allocDialogVisible" width="50%">
      <div class="table-container">
        <el-table ref="personalTable" :data="deptPersonnel" style="width: 100%;" v-loading="listLoading" border>
          <el-table-column label="姓名" width="157" align="center">
            <template #default="scope">{{ scope.row.nickName }}</template>
          </el-table-column>
          <el-table-column label="账号" width="270" align="center">
            <template #default="scope">{{ scope.row.username }}</template>
          </el-table-column>
          <el-table-column label="职务" width="300" align="center">
            <template #default="scope">{{ scope.row.duty }}</template>
          </el-table-column>
        </el-table>

      </div>
      <template #footer>
        <el-pagination background @size-change="handlePersonalSizeChange" @current-change="handlePersonalCurrentChange"
          layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listPersonal.pageNum"
          :page-size="listPersonal.pageSize" :page-sizes="[10, 15, 20]" :total="deptPersonnelTotal">
        </el-pagination>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { validateTelephone, validateEmail } from '@/utils/validate';
//部门
import { createDep, getAllDep, depDetails, updateDep, deleteDep,handleBatchDelete } from '@/api/dep';

const deptPersonnel = ref<any[]>([]) //部门下的所有人员信息
const deptPersonnelTotal = ref(0)  //部门下的所有人员数量
const listQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: ''
})

const listPersonal = reactive({
  pageNum: 1,
  pageSize: 10,
  deptId: null
})

const dept = reactive({
  id: null,
  depName: null,
  leadName: null,  //部门负责人
  leadPhone: null, //部门负责人联系方式
  leadSex: 1,//部门负责人性别
  leadEmail: '',//部门负责人邮箱
  note: null,      //备注
})
const list = ref<any[]>([]) //所有部门信息
const total = ref(0)  //部门数量
const listLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const allocDialogVisible = ref(false);

const deptForm = ref<FormInstance>();
/** 验证规则 */
const addUserRules: FormRules = {
  depName: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
  leadName: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
  leadPhone: [{ required: true, trigger: 'blur', validator: validateTelephone }],
  leadEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],
}

//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

getList()

function handleSelectionChange(val: any[]) {
  multipleSelection.value = val;
  multipleSelectionId.value = [];
  multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}

function batchDelete() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleBatchDelete(multipleSelectionId.value).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
}

function handleResetSearch() {
  Object.assign({}, listQuery);
}
function handleSearchList() {
  listQuery.pageNum = 1;
  getList();
}
function handleSizeChange(val: number) {
  listQuery.pageNum = 1;
  listQuery.pageSize = val;
  getList();
}
function handleCurrentChange(val: number) {
  listQuery.pageNum = val;
  getList();
}
function handlePersonalSizeChange(val: any) {
  listPersonal.pageNum = 1;
  listPersonal.pageSize = val;
  getPersonalListByDep();
}
function handlePersonalCurrentChange(val: any) {
  listPersonal.pageNum = val;
  getPersonalListByDep();
}
function handleAdd() {
  dept.depName = null;
  dept.leadEmail = '';
  dept.leadName = null;
  dept.leadPhone = null;
  dept.leadSex = 1;
  dept.note = null;
  dialogVisible.value = true;
  isEdit.value = false;

}
function handleDelete(row: any) {
  ElMessageBox.confirm('是否要删除该部门?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDep(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  }).catch(err => {
    console.log(err)
  });
}
function handleUpdate(row: any) {
  dialogVisible.value = true;
  isEdit.value = true;
  Object.assign(dept, row);
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
          updateDep(dept.id, dept).then(response => {
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
          createDep(dept).then(response => {
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

function handleQueryPersonal(row: any) {
  listPersonal.deptId = row.id;
  getPersonalListByDep();
  allocDialogVisible.value = true;
}
function getList() {
  listLoading.value = true;
  getAllDep(listQuery).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}
// todo
function getPersonalListByDep() {
  depDetails(listPersonal).then(response => {
    deptPersonnel.value = response.data.list;
    deptPersonnelTotal.value = response.data.total;
  });
}


</script>
<style></style>


