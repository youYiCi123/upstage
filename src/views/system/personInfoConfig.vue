<template>
    <el-card class="form-container" shadow="never">
        <el-form ref="personalConfigForm" :model="mime" :rules="rules" style="margin-top: 6px;" size="default" label-width="100px">
            <el-form-item label="头像：">
                <avatar-upload class="avatar" :avatar="mime.icon" :nickname="mime.nickName"
                    @uploadSuccess="uploadSuccess" ></avatar-upload>
            </el-form-item>
            <el-form-item label="姓名：" prop="nickName">
                <el-input v-model="mime.nickName" style="width: 250px" disabled></el-input>
            </el-form-item>
            <el-form-item label="账号名：" prop="username">
                <el-input v-model="mime.username" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model="mime.phone" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="mime.email" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="座右铭：">
                <el-input v-model="mime.motto" type="textarea" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button :loading="loading" size="default" type="primary" @click="doSubmit(personalConfigForm)"
                    style="margin-left: 90px;">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage} from 'element-plus';
import { validateTelephone, validateEmail } from '@/utils/validate';
import { getMimeInfo } from '@/api/login'
import {updateAdmin} from '@/api/login';

let mime = reactive({
    userId:-1,
    icon: '',
    nickName: '',
    username: '',
    phone: '',
    email: '',
    motto: ''
});
const loading = ref(false);
const personalConfigForm = ref<FormInstance>();
const rules: FormRules = {
  nickName:[{ required: true, trigger: 'change', message: '姓名不能为空' }],
  username:[{ required: true, trigger: 'change', message: '账号名不能为空' }],
  email: [{ required: true, trigger: 'blur', validator: validateEmail }],
  phone: [{ required: true, trigger: 'blur', validator: validateTelephone }],
}

/** 上传成功 */
const uploadSuccess = (url: string) => {
    console.log("response.data.url", url)
    mime.icon = url;
};
init()

function init() {
    getMimeInfo().then(res => {
        Object.assign(mime, res.data);
    })
}
function doSubmit(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            loading.value = true
            updateAdmin(mime.userId, mime).then(response => {
            ElMessage({
              message: '修改成功！',
              type: 'success'
            });
            loading.value = false;
          })
        }
    })

}
</script>