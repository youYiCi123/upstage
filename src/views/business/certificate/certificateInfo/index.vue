<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="certificate" ref="customForm" label-width="150px" size="default">
            <el-form-item label="证书名称：">
                <el-input v-model="certificate.certificateName" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="规格：" >
                <el-input v-model="certificate.norms" type="textarea" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="注册证号：">
                <el-input v-model="certificate.registerNumber" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="生产许可证号：">
                <el-input v-model="certificate.prodLicenseNumber" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="类别：">
                <el-select v-model="certificate.category" clearable placeholder="公告类型" style="width: 250px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="核准日期：">
                <el-date-picker v-model="certificate.approvalTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="有效日期：">
                <el-date-picker v-model="certificate.effectiveTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="下次申报日期：">
                <el-date-picker v-model="certificate.lastDeclareTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="风险再评价：">
                <el-date-picker v-model="certificate.riskEvaluateTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="首次注册时间：">
                <el-date-picker v-model="certificate.firstRegisterTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item>
                <el-button style="margin-top: 30px;margin-left:0.8%;margin-bottom: 30px" size="default" type="primary"
                    @click="goBack">取消</el-button>
                <el-button style="margin-top: 30px;margin-left:5.6%;margin-bottom: 30px" size="default" type="primary"
                    @click="doSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElNotification } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { queryCertificate, addCertificate, updateCertificate } from '@/api/certificate';
const route = useRoute();
const router = useRouter();

const certificate = reactive({
    id: -1,
    certificateName: '',
    norms: '',
    registerNumber: '',
    prodLicenseNumber:'',
    category: '',
    approvalTime: '',
    effectiveTime: '',
    lastDeclareTime: '',
    riskEvaluateTime: '',
    firstRegisterTime: '',
})

const options =[
  {
    value: 1,
    label: 'I类',
  },
  {
    value: 2,
    label: 'II类',
  },
  {
    value: 3,
    label: 'III类',
  },
]

const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true
    }
})

function goBack() {
    router.back();
}
initCertificate()
function initCertificate() {
    if (props.isEdit) {
        queryCertificate(route.query.id).then(response => {
            Object.assign(certificate, response.data);
        });
    }
}
function doSubmit() {
    if (props.isEdit) {
        certificate.id = route.query.id as unknown as number
        updateCertificate(certificate).then(res => {
            ElNotification({
                title: '修改成功',
                type: 'success',
                duration: 2500
            })
            router.back();
        }).catch(
            err => {
                console.log(err.response.data.message)
            })
    } else {
        addCertificate(certificate).then(res => {
            ElNotification({
                title: '添加成功',
                type: 'success',
                duration: 2500
            })
            router.back();
        }).catch(err => {
            console.log(err.response.data.message)
        })
    }
}


</script>