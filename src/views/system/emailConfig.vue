<template>
    <el-card class="form-container" shadow="never">
        <el-form ref="emailConfigForm" :model="form" :rules="rules" style="margin-top: 6px;" size="default"
            label-width="100px">
            <el-form-item label="发件人邮箱" prop="fromUser">
                <el-input v-model="form.fromUser" style="width: 50%" />
                <span style="color: #C0C0C0;margin-left: 10px;">Sender mailbox</span>
            </el-form-item>
            <el-form-item label="发件用户名" prop="user">
                <el-input v-model="form.user" style="width: 50%;" />
                <span style="color: #C0C0C0;margin-left: 10px;">Sender usernamex</span>
            </el-form-item>
            <el-form-item label="邮箱密码" prop="pass">
                <el-input v-model="form.pass" type="password" style="width: 50%;" />
                <span style="color: #C0C0C0;margin-left: 10px;">email Password</span>
            </el-form-item>
            <el-form-item label="SMTP地址" prop="host">
                <el-input v-model="form.host" style="width: 50%;" />
                <span style="color: #C0C0C0;margin-left: 10px;">SMTP address</span>
            </el-form-item>
            <el-form-item label="SMTP端口" prop="port">
                <el-input v-model="form.port" style="width: 50%;" />
                <span style="color: #C0C0C0;margin-left: 10px;">SMTP port</span>
            </el-form-item>
            <el-form-item label="">
                <el-button :loading="loading" size="default" type="primary"
                    @click="doSubmit(emailConfigForm)"
                    style="margin-left: 90px;">保存配置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
  
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElNotification} from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { get, update } from '@/api/email'

let form = reactive({
    id: 1,
    fromUser: '',
    user: '',
    pass: '',
    host: '',
    port: '',
    sslEnable: ''
});
const loading = ref(false);
const emailConfigForm = ref<FormInstance>();
/** 验证规则 */
const rules: FormRules = {
    fromUser: [
        { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    user: [
        { required: true, message: '请输入发件用户名', trigger: 'blur' }
    ],
    pass: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
    ],
    host: [
        { required: true, message: 'SMTP地址不能为空', trigger: 'blur' }
    ],
    port: [
        { required: true, message: 'SMTP端口不能为空', trigger: 'blur' }
    ]
}

init()

function init() {
    get().then(res => {
        if (res.data !== null)
        Object.assign(form, res.data);
    })
}
function doSubmit(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            loading.value = true
            update(form).then(res => {
                ElNotification({
                    title: '修改成功',
                    type: 'success',
                    duration: 2500
                })
                loading.value = false
            }).catch(err => {
                loading.value = false
            })
        }
    })
}


</script>
  
<style scoped></style>
  