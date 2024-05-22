<template>
       <el-card class="form-container" shadow="never">
        <el-form :model="supplier" ref="supplierForm" label-width="150px" size="default">
            <el-form-item label="供应商名称：" prop="supplierName">
                <el-input v-model="supplier.supplierName" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码" prop="organizeStructureCode">
                <el-input v-model="supplier.organizeStructureCode" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="营业执照至" prop="businessTime">
                <el-date-picker v-model="supplier.businessTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="许可证/备案编号" prop="recordNumber">
                <el-input v-model="supplier.recordNumber" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="许可证至" prop="licenseTime">
                <el-date-picker v-model="supplier.licenseTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="产品" prop="product">
                <el-input v-model="supplier.product" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="质保协议有效期至" prop="qaAgreementTime">
                <el-date-picker v-model="supplier.qaAgreementTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="经营授权有效期至" prop="businessAuthTime">
                <el-date-picker v-model="supplier.businessAuthTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="法人授权有效期至" prop="legalPersonAuthTime">
                <el-date-picker v-model="supplier.legalPersonAuthTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="其它" prop="other">
                <el-input v-model="supplier.other" style="width: 250px"></el-input>
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
import {querySupplierContent,addSupplierContent,updateSupplierContent} from "@/api/suppliers";
import { ref, reactive, computed } from "vue";
import { ElNotification } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const supplier = reactive({
    id: -1,
    supplierName: '',//名称
    organizeStructureCode: '',//组织机构代码
    businessTime: '',//营业执照至
    recordNumber: '',//许可证/备案编号
    licenseTime: '',//许可证至
    product: '',//产品
    qaAgreementTime: '',//质保协议有效期至
    businessAuthTime: '',//经营授权有效期至
    legalPersonAuthTime: '',//法人授权有效期至
    other: '',//其它
})

const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true
    }
})
initSupplier()
function initSupplier() {
    if (props.isEdit) {
        querySupplierContent(route.query.id).then(response => {
            Object.assign(supplier, response.data);
        });
    }
}

function goBack() {
    router.back();
}

function doSubmit() {
    if (props.isEdit) {
        supplier.id = route.query.id as unknown as number
        updateSupplierContent(supplier).then(res => {
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
        addSupplierContent(supplier).then(res => {
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