<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" @toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container">
      <div class="avatar-wrapper">
        <el-badge :value=unReadMessageCount :hidden="unReadMessageCount === 0" class="item">
          <img class="user-avatar" :src="avatar ? avatar : require('@/assets/images/avatar_default.jpg')">
        </el-badge>
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
            <span @click="lookMessage" style="display:block;">
              <el-text class="mx-1" type="danger">{{ unReadMessageCount }}</el-text>条消息</span>
          </el-dropdown-item>
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
          <el-input type="password" show-password ref="password"
            @keyup.enter.native="doChangePassword(changePasswordFormRef)" v-model="changePasswordForm.password"
            autocomplete="off" />
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
  <el-drawer title="消息查看" v-model="drawerVisible" size="45%" :show-close="false" :direction="direction">
    <div class="inner">
    <ul class="hot-list-article">
      <li v-for="(item,index) in unReadMessages">
        <span v-html="formatToHtml(item)"></span></li>
    </ul>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElNotification } from 'element-plus';
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import dayjs from "dayjs";
import { logOutRedis, changePassword } from '@/api/login'
import { getCountByUserId, selectByUserId } from '@/api/noticeMessage'
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
import { useUserStore } from "@/store/modules/userStore";
const AppStore = useAppStore(pinia);
const UserStore = useUserStore(pinia);
const { proxy } = getCurrentInstance();
const changePasswordDialogVisible = ref(false);

const changePasswordFormRef = ref()
const password = ref()
const unReadMessageCount = ref(0)
const unReadMessages = ref<any>([]);

const drawerVisible = ref(false);
const direction = ref('rtl')

function lookMessage() {
  drawerVisible.value = true
  selectByUserId({userId:UserStore.id}).then(t=>{
    unReadMessages.value=t.data
  })
}

//时间格式化并计算当前到截至日期的时间
function formatToHtml(t: any) {
  let messageContent = '';
      switch(t.messageType){
        // 1 文件被评论 2评论被回复 3上传 4审核未通过
        case 1:
        messageContent=
        '<span style="color: #2ea7e0;">'+t.whoName+'</span>'+'评论了你上传的文件'+t.fileName
        +'<span style="color: #e6a23c; font-size:12px;float:right">'+timeFormat(t.createDate)+'</span>'
        break;
        case 2:
        messageContent='<span style="color: #2ea7e0;">'+t.whoName+'</span>'+'在'+t.fileName+'中回复了你的评论'
        +'<span style="color: #e6a23c; font-size:12px;float:right">'+timeFormat(t.createDate)+'</span>'
        break;
        case 3:
        messageContent='<span style="color: #2ea7e0;">'+t.whoName+'</span>'+'上传了'+t.fileName
        +'<span style="color: #e6a23c; font-size:12px;float:right">'+timeFormat(t.createDate)+'</span>'
        break;
        case 4:
        messageContent=t.whoName+'于'+timeFormat(t.createDate)+'在'
        break;
      }
      return messageContent;
}

function timeFormat(time: string) {
	if (time == null || time === '') {
		return 'N/A';
	}
	let date = new Date(time);
	return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}


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

getUnReadCounts()

function getUnReadCounts() {
  getCountByUserId().then(t=>{
    unReadMessageCount.value=t.data
  })
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
        username: UserStore.name,
        oldPassword: changePasswordForm.password,
        newPassword: changePasswordForm.newPassword
      }).then(() => {
        changePasswordDialogVisible.value = false
        ElNotification({
          title: '成功',
          message: '密码修改成功,即将跳转至登录页面',
          type: 'success'
        })
        setTimeout(() => logout(), 1000)
      }).catch((res: any) => {
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
  changePasswordDialogVisible.value = true
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
  height: 55px;
  line-height: 55px;
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
      margin-top: 9px;
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
ul {
  li {
    text-align: left;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: #2ea7e0;
    }
  }
}
.inner .hot-list-article li {
  display: block;
  line-height: 32px;
  position: relative;
  margin: 3px 0;
  counter-increment: nums;
  padding-left: 30px;
  overflow: hidden;
  word-wrap: normal !important;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hot-list-article li a {
  color: #787977;
}

.hot-list-article li:before {
  color: #000;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  content: counter(nums, decimal);
  position: absolute;
  left: 0;
  top: 5px;
  border-radius: 100%;
  background-color: #edefee;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  font-family: SourceCodeProRegular, Menlo, Monaco, Consolas, "Courier New",
    monospace, "Helvetica Neue", Arial, sans-serif;
}
</style>

