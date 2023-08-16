<template>
  <div>
    <el-card shadow="hover" class="login-form-layout">
      <el-form ref="loginFormRef" autoComplete="on" :model="loginForm" :rules="loginRules" label-position="left">
        <h2 class="login-title color-main">合肥天一生物</h2>
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名">
            <template #prefix>
              <i class="iconfont icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin(loginFormRef)"
            v-model="loginForm.password" autoComplete="on" placeholder="请输入密码">
            <template #prefix>
              <i class="iconfont icon-mima"></i>
            </template>
            <template #suffix>
              <div @click="showPwd">
                <i v-if="pwdType == 'password'" class="iconfont icon-bukejian"></i>
                <i v-else class="iconfont icon-a-32Akejian"></i>
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
            @keyup.enter.native="handleLogin(loginFormRef)">
            <template #prefix>
              <i class="iconfont icon-yanzhengyanzhengma"></i>
            </template>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode">
          </div>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button style="width: 100%" type="primary" :loading="loading"
            @click.native.prevent="handleLogin(loginFormRef)">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_background" class="login-center-layout">
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; //vue3路由跳转
import { isvalidUsername } from '@/utils/validate';
import { getCodeImg ,login} from "@/api/login";
import { setToken } from '@/utils/auth'
import pinia from '@/store/index'
import { useUserStore } from "@/store/modules/userStore";

import LoginuserMode from "@/mode/LoginuserMode";
import { setCookie, getCookie } from '@/utils/support';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import login_background from '@/assets/images/login_background.jpg'

const loginForm = reactive<LoginuserMode>({
  username: '',
  password: '',
  code: '',
  uuid: '',
});
const codeUrl = ref(''); //验证码图片，后端请求
const loading = ref(false);
let pwdType = ref('password');//密码是否显示

const router = useRouter();

const validateUsername = (rule: any, value: string, callback: any) => {
  if (!isvalidUsername(value)) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
};

/** 验证规则 */
const loginRules: FormRules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
};

function showPwd() {
  if (pwdType.value === 'password') {
    pwdType.value = ''
  } else {
    pwdType.value = 'password'
  }
};

function getCode() {
  getCodeImg().then((res: any) => {
    codeUrl.value = res.data.img
    loginForm.uuid = res.data.uuid
  })
};

const loginFormRef = ref<FormInstance>();
const UserStore = useUserStore(pinia);
function handleLogin(formEl: FormInstance | undefined) {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      loading.value = true;
      const asretname = loginForm.username as string
      const username = asretname.trim()
      const password = loginForm.password as string
      login(username, password, loginForm.code, loginForm.uuid).then((response:any) => {
        const data = response.data
        const tokenStr = data.tokenHead + data.token
        setToken(tokenStr)
        UserStore.setToken(tokenStr)
        setCookie("username", username, 15);
        setCookie("password", password, 15);
        router.push({ path: '/' })
      }).catch(() => {
        loading.value = false
      })
    } else {
      ElMessage.success('提交失败！');
    }
  })
}

function initWindow() {
  getCode(); //获取验证码
  loginForm.username = getCookie("username");
  loginForm.password = getCookie("password");
  if (loginForm.username === undefined || loginForm.username == null || loginForm.username === '') {
    loginForm.username = 'admin';
  }
  if (loginForm.password === undefined || loginForm.password == null) {
    loginForm.password = '';
  }
}
initWindow()
</script>

<style rel="stylesheet/scss" lang="scss">
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 175px auto;
}

.login-form-layout .color-main {
  font-size: 30px;
  padding-bottom: 20px;
  letter-spacing: 5px;
  text-shadow: 1.2px 1.2px 1px #bdbbbc;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #11a1df;
  width: 100%;
  height: auto;
  object-fit: contain;
  // max-width: 100%;
  max-height: 100%;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}
</style>
