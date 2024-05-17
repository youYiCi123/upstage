<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
                <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
                    查询搜索
                </el-button>
                <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="listQuery" size="default" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="供应商名称"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="经营授权有效期至">
                        <el-date-picker v-model="listQuery.businessAuthTime" type="daterange" start-placeholder="开始时间"
                            end-placeholder="结束时间" range-separator="-" size="default" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" @click="downloadFile()">下载模板</el-button>
            <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加供应商</el-button>
            <el-button size="small" @click="setReminder()" type="warning"
                style="float:right; margin-bottom: 20px;margin-left: 30px">设置提醒人
            </el-button>
            <el-upload class="upload" action="#" :show-file-list="false" :on-change="handleExcel" accept="'.xlsx','.xls'"
                :auto-upload="false" :headers="headers" style="float:right;margin-left: 20px;margin-bottom: 20px">
                <el-button size="small" type="primary">Excel导入</el-button>
            </el-upload>
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table  :data="list" style="width: 100%;" stripe v-loading="listLoading"
                @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="供应商名称" width="250" align="center">
                    <template #default="scope">{{ scope.row.supplierName }}</template>
                </el-table-column>
                <el-table-column label="组织机构代码" width="250" align="center">
                    <template #default="scope">{{ scope.row.organizeStructureCode }}</template>
                </el-table-column>
                <el-table-column label="营业执照至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.businessTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="许可证/备案编号" width="250" align="center">
                    <template #default="scope">{{ scope.row.recordNumber }}</template>
                </el-table-column>
                <el-table-column label="许可证至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.licenseTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="产品" width="150" align="center">
                    <template #default="scope">{{ scope.row.product }}</template>
                </el-table-column>
                <el-table-column label="质保协议有效期至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.qaAgreementTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="经营授权有效期至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.businessAuthTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="法人授权有效期至" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.legalPersonAuthTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="其它" width="250" align="center">
                    <template #default="scope">{{ scope.row.other }}</template>
                </el-table-column>
                <el-table-column label="操作" width="230" align="center" fixed="right">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" @click="handleUpdate(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="设置提醒人" v-model="remindDialogVisible" width="40%" :append-to-body=true
            :modal-append-to-body=false :center=true>
            <div>
                <el-form label-width="140px" :model="remindInfo">
                    <el-form-item label="选择人员：">
                        <el-cascader clearable v-model="selectUserArray" :options="sendPersonOptions"
                            @change="selectProductCateValue" style="width: 250px">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="提前多少天提醒：">
                        <el-input-number v-model="remindInfo.forwardDays" @change="handleForwardDays" />
                    </el-form-item>
                    <el-form-item label="选择通知方式：">
                        <el-radio-group v-model="remindInfo.sendType" size="default">
                            <el-radio-button :label="0">全部</el-radio-button>
                            <el-radio-button :label="1">邮件</el-radio-button>
                            <el-radio-button :label="2">短信</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="remindDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { watch,ref, reactive } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import dayjs from "dayjs";
import { useRouter } from 'vue-router'; //vue3路由跳转
import { usePagination } from "@/hooks/usePagination";
import { getSupplierList,deleteSupplier,handleBatchDelete,querySupplierRemind, setSupplierRemind } from "@/api/suppliers";
import { importSupplierExcel } from "@/api/exportExcel";
import { fetchListWithChildren } from '@/api/dep';
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter();
const headers = { "Content-Type": "multipart/form-data;charset=UTF-8" };
const listQuery = reactive({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    businessAuthTime: [],
    keyword: ''
})
const listLoading = ref(false);
const list = ref<any>([])  //所有证书信息
const total = ref(0);  ////数量
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

const sendPersonOptions = ref<any>([]) //获取部门下所有人员的级联信息
const selectUserArray = ref<any>([])//级联选择器内容
const remindDialogVisible = ref(false);
const remindInfo = reactive({
    id: -1,
    forwardDays: 0,
    sendType: 0,
    serviceType:2,
    remindPersonEmail: '',
    updateTime: ''
})
function selectProductCateValue(newValue: any) {
    if (newValue != null) {
        remindInfo.remindPersonEmail = newValue[1]
    } else {
        remindInfo.remindPersonEmail = ''
    }
}
function handleForwardDays(value: number) {
    remindInfo.forwardDays = value
}

initSupplier()
function initSupplier() {
    //获取部门人员级联关系
    getSendPersonList()
    querySupplierRemind().then(response => {
        if (response.data != null) {
            remindInfo.remindPersonEmail = response.data.remindPersonEmail
            remindInfo.sendType = response.data.sendType
            remindInfo.forwardDays = response.data.forwardDays
            remindInfo.id = response.data.id
            selectUserArray.value = findIndexArray(sendPersonOptions.value, remindInfo.remindPersonEmail)
        }
    }
    )
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

function setReminder() {
    remindDialogVisible.value = true;
}

function getSendPersonList() {
    fetchListWithChildren().then(response => {
        let list = response.data;
        sendPersonOptions.value = [];
        for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
                for (let j = 0; j < list[i].userRelationList.length; j++) {
                    children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].email });
                }
            }
            sendPersonOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
        }
        console.log('sendPersonOptions.value',sendPersonOptions.value)
    });
}

function submitForm() {
    setSupplierRemind(remindInfo).then(res => {
        ElMessage({
            type: 'success',
            message: '设置成功!'
        });
        remindDialogVisible.value = false
    }).catch(err => {
        console.log(err.response.data.message)
    })
}

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}

//时间格式化并计算当前到截至日期的时间
function timeFormatToHtml(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    const credentialDate = dayjs(date).format("YYYY-MM-DD")
    const nowDate = dayjs(new Date).format("YYYY-MM-DD")
    const diff = dayjs(credentialDate).diff(dayjs(nowDate), 'day');
    var html = credentialDate;
    if (diff < 0) {
        html += '<span style="font-size:12px; color: red; margin-left: 4px">已过期</span>'
    } else if (0 < diff) {
        html += '<span style="font-size:12px; color: #e6a23c;  margin-left: 4px">还剩余' + diff + '天</span>'
    } else {
        html += '<span style="font-size:12px; color: #f56c6c;  margin-left: 4px">请及时提交</span>'
    }
    return html
}

function handleResetSearch() {
    listQuery.businessAuthTime = [];
    listQuery.keyword = '';
}
function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function handleSelectionChange(val: any) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.id))
}

function handleAdd() {
    router.push('/business/supplierAdd');
}

function handleUpdate(row: any) {
    router.push({ path: '/business/supplierUpdate', query: { id: row.id } });
}

//下载模板
function downloadFile() {
    axios({
        method: "GET", // 因为要避免request.ts中相应拦截
        url: "http://localhost:8079/business-service/excel/download/supplier",
        responseType: "blob"
    }).then(res => {
        const blob = new Blob([res.data]);
        const downloadElement = document.createElement("a");
        // 创建下载链接
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        // 下载后文件名
        downloadElement.download = "供应商模板.xlsx";
        document.body.appendChild(downloadElement);
        // 点击下载
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
    }).catch(err => {
        console.log("err: ", err)
    })
}


//导入表格
function handleExcel(file: any) {
    let formData = new FormData(); //声明一个FormDate对象
    formData.append("file", file.raw);    //把文件信息放入对象中
    //调用后台导入的接口
    importSupplierExcel(formData).then(res => {
        if (res.code === 200) { //得自定义res属性 在AxiosResponse中定义
            ElMessage.success(res.data);
            getList();   // 导入表格之后可以获取导入的数据渲染到页面，此处的方法是获取导入的数据
        } else {
            ElMessage.error(res.message)
        }
    }).catch(err => {
        ElMessage({
            type: 'error',
            message: '导入失败'
        })
    })
}

//删除
function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该供应商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteSupplier(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    }).catch((res:any)=>{})
}

//批量删除
function batchDelete() {
    ElMessageBox.confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        handleBatchDelete(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        })
    })
}

function getList() {
    let businessAuthTimeStr = ''
    if (listQuery.businessAuthTime != null) {
        businessAuthTimeStr = listQuery.businessAuthTime.toString();
    }
    listLoading.value = true;  //todo
    getSupplierList({
        keyword: listQuery.keyword, businessAuthTime: businessAuthTimeStr,
        pageNum: paginationData.currentPage, pageSize: paginationData.pageSize
    }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })


</script>