<template>
    <el-card class="form-container" shadow="never">
        <el-form ref="personalConfigForm" :model="mime"  style="margin-top: 6px;" size="default"
            label-width="100px">
            <el-form-item label="头像：" >
                <el-upload action="" list-type="picture" accept=".png,.jpg" :multiple="false">  
                    <el-avatar shape="square">安王</el-avatar>
                </el-upload>
            </el-form-item>
            <el-form-item label="姓名：" >
                <el-input v-model="mime.nickname" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="账号名：" >
                <el-input v-model="mime.username" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" >
                <el-input v-model="mime.phone" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" >
                <el-input v-model="mime.email" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="座右铭：" >
                <el-input v-model="mime.motto" type="textarea" style="width: 250px"></el-input>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';

let mime = reactive({
    nickname: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    motto: ''
});

</script>