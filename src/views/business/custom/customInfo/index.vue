<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="custom" ref="customForm" label-width="150px" size="default">
            <el-form-item label="客户名称：" prop="customName">
                <el-input v-model="custom.customName" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="统一信用代码：" prop="creditCode">
                <el-input v-model="custom.creditCode" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item  label="营业执照截止方式：">
                <el-radio-group v-model="custom.businessTimeType" size="default">
                    <el-radio-button :label="0">长期</el-radio-button>
                    <el-radio-button :label="1">选择截止日期</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="custom.businessTimeType === 1" label="营业执照至：">
                    <el-date-picker v-model="custom.businessTime" type="date" placeholder="请选择日期"  style="width: 250px">
                    </el-date-picker>
            </el-form-item>
            <el-form-item label="许可证至：" prop="licenseTime">
                <el-date-picker v-model="custom.licenseTime" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="联系人姓名：">
                <el-input v-model="custom.contactName" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话：" prop="contactPhone">
                <el-input v-model="custom.contactPhone" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="选择业务员：">
                <el-cascader clearable v-model="selectUserArray" :options="sendPersonOptions"
                    @change="selectProductCateValue" style="width: 250px">
                </el-cascader>
            </el-form-item>
            <el-form-item label="住所：" prop="address">
                <el-input v-model="custom.address" type="textarea" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="法人：" prop="legalPerson">
                <el-input v-model="custom.legalPerson" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-top: 50px;margin-left:0.8%;margin-bottom: 30px" size="default" type="primary"
                    @click="goBack">取消</el-button>
                <el-button style="margin-top: 50px;margin-left:5.6%;margin-bottom: 30px" size="default" type="primary"
                    @click="doSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElNotification } from 'element-plus';
import { fetchListWithChildren } from '@/api/dep';
import { queryCustomContent, addCustomContent, updateCustomContent } from '@/api/custom';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const sendPersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const selectUserArray = ref<any>([])//级联选择器内容
const custom = reactive({
    id: -1,
    customName: '',//客户名称
    creditCode: '',//统一信用代码
    address: '',//住所
    legalPerson: '',//法人
    businessTimeType: 0,//营业执照方式
    businessTime: '',//营业执照至
    licenseTime: '',//许可证至
    contactName: '',//联系人姓名
    contactPhone: '',//联系人电话
    salesPersonId: '',//业务员Id
})

const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true
    }
})

function selectProductCateValue(newValue: any) {
    if (newValue != null) {
        custom.salesPersonId = newValue[1]
    } else {
        custom.salesPersonId = ''
    }
}

// 子找父 子节点信息中没有父节点
function findIndexArray(data: any, id: any) {
    let reductionSelectedUser = [] //重构部门人员级联关系
    const arr = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].children != null && data[i].children.length > 0) {
            for (let j = 0; j < data[i].children.length; j++) {
                if (data[i].children[j].value == id) {
                    arr.push(data[i].value, data[i].children[j].value)
                    reductionSelectedUser = arr
                }
            }
        }
    }
    return reductionSelectedUser;
}
initCustom()
function initCustom() {
    //获取部门人员级联关系
    getSendPersonList()
    if (props.isEdit) {
        queryCustomContent(route.query.id).then(response => {
            Object.assign(custom, response.data);
            selectUserArray.value = findIndexArray(sendPersonOptions.value, custom.salesPersonId)
        });
    }
}

function getSendPersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        sendPersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
                }
            }
            sendPersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
    });
}

function goBack() {
    router.back();
}

function doSubmit() {
    if (props.isEdit) {
        custom.id = route.query.id as unknown as number
        updateCustomContent(custom).then(res => {
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
        addCustomContent(custom).then(res => {
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