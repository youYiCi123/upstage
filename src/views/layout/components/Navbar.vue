<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" @toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar ? avatar : require('@/assets/images/avatar_default.jpg')">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              返回首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="resetPassword" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-menu>
  <el-dialog title="修改密码" v-model="changePasswordDialogVisible" @opened="focusPasswordInput"
    @closed="resetChangePasswordForm" width="30%" :center=true>
    <div>
      <el-form label-width="100px" :rules="changePasswordRules" ref="changePasswordFormRef" :model="changePasswordForm"
        status-icon @submit.native.prevent>
        <el-form-item label="旧密码" prop="password">
          <el-input type="password" show-password ref="password" @keyup.enter.native="doChangePassword(changePasswordFormRef)"
            v-model="changePasswordForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" show-password @keyup.enter.native="doChangePassword(changePasswordFormRef)"
            v-model="changePasswordForm.newPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="reNewPassword">
          <el-input type="password" show-password @keyup.enter.native="doChangePassword(changePasswordFormRef)"
            v-model="changePasswordForm.reNewPassword" autocomplete="off" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="changePasswordDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doChangePassword(changePasswordFormRef)">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed ,getCurrentInstance} from 'vue'
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElNotification } from 'element-plus';
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { logOutRedis,changePassword } from '@/api/login'
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
import { useUserStore } from "@/store/modules/userStore";
const AppStore = useAppStore(pinia);
const UserStore = useUserStore(pinia);
const { proxy } = getCurrentInstance();
const changePasswordDialogVisible = ref(false);
const changePasswordFormRef = ref()
const password = ref()

const changePasswordForm = reactive({
  password: '',
  newPassword: '',
  reNewPassword: ''
});

const checkReNewPassword = (rule: any, value: string, callback: any) => {
  if (value !== changePasswordForm.newPassword) {
    return callback(new Error('两次密码不一致'));
  } else {
    callback()
  }
}

/** 验证规则 */
const changePasswordRules: FormRules = {
  password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位的密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位的密码', trigger: 'blur' }
  ],
  reNewPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { validator: checkReNewPassword, trigger: 'blur' }
  ]
}

function focusPasswordInput() {
  password.value.focus()
}

function resetChangePasswordForm() {
  changePasswordFormRef.value.resetFields()
}

function doChangePassword(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
    if (valid) {
      changePassword({
        username:UserStore.name,
        oldPassword: changePasswordForm.password,
        newPassword: changePasswordForm.newPassword
      }).then(()=>{
        changePasswordDialogVisible.value = false
        ElNotification({
          title: '成功',
          message: '密码修改成功,即将跳转至登录页面',
          type: 'success'
        })
        setTimeout(() => logout(), 1000)
      }).catch((res:any)=>{
        ElMessage.error(res.message)
      })
    }
  })
}

const sidebar = computed(() => {
  return AppStore.sidebar
})

const avatar = computed(() => {
  return UserStore.avatar
})

function toggleSideBar() {
  AppStore.toggleSidebar();
}

function resetPassword() {
  changePasswordDialogVisible.value=true
}

function logout() {
  let key1 = []
  key1.push(logOutRedis())
  UserStore.LogOut().then(() => {
    proxy.$ws.close();
    location.reload() // 为了重新实例化vue-router对象 避免bug
  })
}


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;

    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

