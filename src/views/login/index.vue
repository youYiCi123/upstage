<template>
    <div class="login-container">
        <div class="overlay">
            <div class="left-side">
                <div class="logo-outter">
                    <img class="logo-inner" src="@/assets/images/login-logo.png" alt="404">
                </div>
                <div class="introduce">
                    <div class="title" style="font-family: 优设标题黑;">天一生物共享平台</div>
                    <div class="version" style="font-family: 优设标题黑;">(v1.0)</div>
                </div>
                <div class="enterprise" style="font-family: 优设标题黑;">合肥天一生物技术研究所有限责任公司</div>
            </div>
            <div class="right-side">
                <div class="login-form">
                    <div class="login-top" style="font-family: 优设标题黑;">登 录</div>
                    <div class="login-body">
                        <el-form ref="loginFormRef" autoComplete="on" :model="loginForm" :rules="loginRules">
                            <el-form-item prop="username">
                                <el-input size="large" v-model="loginForm.username" autoComplete="on" class="noBorderInput"
                                    type="text" placeholder="请输入登陆账号">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input size="large" class="noBorderInput" type="password" placeholder="请输入登录密码"
                                    @keyup.enter.native="handleLogin(loginFormRef)" v-model="loginForm.password"
                                    autoComplete="on">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="code">
                                <el-input size="large" class="noBorderInput" type="text" placeholder="验证码"
                                    style="width: 60%;" v-model="loginForm.code"
                                    @keyup.enter.native="handleLogin(loginFormRef)" auto-complete="off">
                                </el-input>
                                <div class="login-code">
                                    <img :src="codeUrl" @click="getCode">
                                </div>
                            </el-form-item>
                            <el-form-item class="login-button">
                                <div class="button-outer"  @click.native.prevent="handleLogin(loginFormRef)">
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; //vue3路由跳转
import { isvalidUsername } from '@/utils/validate';
import { getCodeImg, login } from "@/api/login";
import { setToken } from '@/utils/auth'
import pinia from '@/store/index'
import { useUserStore } from "@/store/modules/userStore";

import LoginuserMode from "@/mode/LoginuserMode";
import { setCookie, getCookie } from '@/utils/support';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import login_background from '@/assets/images/login-background.jpg'

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
            login(username, password, loginForm.code, loginForm.uuid).then((response: any) => {
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
<style lang="scss">
.login-container {
    background-image: url('@/assets/images/login-background.png');
    /* 设置背景图片 */
    background-size: cover;
    /* 背景图片覆盖整个div区域 */
    background-position: center;
    /* 背景图片居中 */
    height: 100vh;
    display: grid;
    place-items: center;

    /* 同时实现水平垂直居中 */
    // background-color: blue;
    .overlay {
        border-radius: 20px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
        width: 950px;
        height: 350px;
        display: flex;
        justify-content: space-between;

        .left-side {
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            width: 50%;
            background-color: #223530;
            color: white;

            .logo-outter {
                border-top-left-radius: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 30%;
                margin-top: 10px;

                .logo-inner {
                    width: 85px;
                    height: 85px;
                }
            }

            .introduce {
                display: flex;
                flex-direction: column;
                /* 垂直对齐下对齐 */
                align-items: center;
                /* 水平方向居中 */
                height: 50%;
                font-size: 47px;
                line-height: 47px;

                .title {
                    margin-top: 20px;
                }

                .version {
                    margin-top: 10px;
                }
            }

            .enterprise {
                margin-top: 10px;
                font-size: 25px;
                text-align: center;
            }

        }

        .right-side {
            background-color: white;
            border-bottom-right-radius: 20px;
            border-top-right-radius: 20px;
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            .login-form {
                height: 80%;
                width: 80%;
                .el-form-item {
                    margin-bottom: 25px;
                }
                .login-top {
                    margin-left: 10px;
                    margin-bottom: 10px;
                    line-height: 35px;
                    font-size: 35px;
                    color: #223530;
                }

                .el-input__wrapper {

                    box-shadow: none;
                }

                .noBorderInput .el-input__inner {
                    font-style: italic;
                    font-family: OPPOSans-L;
                }

                .el-form-item__error {
                    margin-left: 10px;
                }

                .el-input__wrapper:hover {
                    box-shadow: none;
                }

                .noBorderInput .el-input__inner {
                    border: none;
                    /* 去除边框 */
                    box-shadow: none;
                    /* 去除阴影 */
                    border-bottom: 1px solid #c2c4c1;
                }

                .login-body {
                    width: 100%;

                    .login-code {
                        display: inline-block;
                        height: 38px;
                        width: 35%;

                        img {
                            cursor: pointer;
                            vertical-align: middle
                        }
                    }

                    .login-button {
                        display: grid;
                        place-items: center;
                        height: 40px;
                        width: 100%;
                        .button-outer {
                            cursor: pointer;
                            display: inline-block;
                            height: 50px;
                            width: 250px;
                            background-image: url('@/assets/images/login-button.png');
                            /* 设置背景图片 */
                            background-size: cover;
                            /* 背景图片覆盖整个div区域 */
                            background-position: center;
                        }
                    }
                }

            }
        }
    }
}
</style>