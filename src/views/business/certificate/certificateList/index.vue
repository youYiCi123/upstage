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
            <div style="margin-top: 20px">
                <el-form  :inline="true" :model="listQuery" size="default">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword"  placeholder="请输入主题" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="证书类型：">
                        <el-select v-model="listQuery.category" clearable placeholder="公告类型">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下次申报日期">
                        <el-date-picker v-model="listQuery.lastDeclareTime" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="-" size="default" />
                    </el-form-item>
                    <el-form-item label="首次注册日期">
                        <el-date-picker v-model="listQuery.firstRegisterTime" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="-" size="default" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button size="small" @click="downloadFile()">下载模板</el-button>
            <el-button size="small" class="btn-add" @click="handleAdd()"
                style="float:right; margin-bottom: 20px;margin-left: 20px">添加
            </el-button>
            <el-upload class="upload" action="#" :show-file-list="false" :on-change="handleExcel" accept="'.xlsx','.xls'"
                :auto-upload="false" :headers="headers" style="float:right;margin-left: 20px;margin-bottom: 20px">
                <el-button size="small" type="primary">Excel导入</el-button>
            </el-upload>
            <el-button size="small" type="danger" @click="batchDelete()" style="float:right;margin-bottom: 20px">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;"  stripe v-loading="listLoading"
                @selection-change="handleSelectionChange" border>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="证书名称"  width="220" align="center">
                    <template #default="scope">{{ scope.row.certificateName }}</template>
                </el-table-column>
                <el-table-column label="类别"  width="110" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.category== '1' ? '' : scope.row.category== '2'?'success':'warning'" style="cursor:pointer;">
                            <span v-html="categoryFormat(scope.row.category)"></span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="注册证号" width="150" align="center">
                    <template #default="scope">{{ scope.row.registerNumber }}</template>
                </el-table-column>
                <el-table-column label="下次申报日期" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.lastDeclareTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="风险再评价" width="180" align="center">
                    <template #default="scope">
                        <span v-html="timeFormatToHtml(scope.row.riskEvaluateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="核准日期" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.approvalTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="有效日期" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.effectiveTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="规格" width="230" align="center">
                    <template #default="scope">{{ scope.row.norms }}</template>
                </el-table-column>
                
                <el-table-column label="首次注册时间" width="160" align="center">
                    <template #default="scope">
                        <span v-html="timeFormat(scope.row.firstRegisterTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
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
                :layout="paginationData.layout" :current-page.sync="paginationData.currentPage"
                :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'; //vue3路由跳转
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePagination } from "@/hooks/usePagination";
import axios from 'axios'
import dayjs from "dayjs";
import { getAllCertificates,deleteCertificate,handleBatchDelete} from "@/api/certificate"
import { importCertificateExcel } from "@/api/exportExcel";
const router = useRouter();
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const listQuery = reactive({
    lastDeclareTime: [],
    firstRegisterTime:[],
    keyword: '',
    category: ''
})


const options =[
  {
    value: '1',
    label: 'I类',
  },
  {
    value: '2',
    label: 'II类',
  },
  {
    value: '3',
    label: 'III类',
  },
]
const headers = { "Content-Type": "multipart/form-data;charset=UTF-8" };
const listLoading = ref(false);
const list = ref<any>([])  //所有证书信息
const total = ref(0);  ////数量
//el-table多/全选后的存放用户数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放用户id的数组
const multipleSelectionId = ref<number[]>([])

function handleResetSearch() {
    listQuery.lastDeclareTime = [];
    listQuery.firstRegisterTime = [];
    listQuery.keyword = '';
    listQuery.category = '';
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
    }else{
        html += '<span style="font-size:12px; color: #f56c6c;  margin-left: 4px">请及时提交</span>'
    }
    return html
}

function categoryFormat(category: number) {
    if (category==1) {
        return 'I类'
    }else if(category==2){
        return 'II类'
    }else{
        return 'III类'
    }
}

function handleAdd() {
    router.push('/business/certificateAdd');
}

function handleUpdate(row: any) {
    router.push({ path: '/business/certificateUpdate', query: { id: row.id } });
}


//下载模板
function downloadFile() {
    axios({
        method: "GET", // 因为要避免request.ts中相应拦截
        url: "http://192.168.1.170:8079/business-service/excel/download/certificate",
        responseType: "blob"
    }).then(res => {
        const blob = new Blob([res.data]);
        const downloadElement = document.createElement("a");
        // 创建下载链接
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        // 下载后文件名
        downloadElement.download = "证书模板.xlsx";
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
    importCertificateExcel(formData).then(res => {
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
    ElMessageBox.confirm('是否要删除该证书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteCertificate(row.id).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            getList();
        });
    });
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
    let lastDeclareTimeStr = ''
    let firstRegisterTimeStr = ''
    if (listQuery.lastDeclareTime != null) {
        lastDeclareTimeStr = listQuery.lastDeclareTime.toString();
    }
    if (listQuery.firstRegisterTime != null) {
        firstRegisterTimeStr = listQuery.firstRegisterTime.toString();
    }
    listLoading.value = true;  //todo
    getAllCertificates({ keyword: listQuery.keyword, lastDeclareTime: lastDeclareTimeStr, firstRegisterTime: firstRegisterTimeStr, category: listQuery.category,
        pageNum: paginationData.currentPage, pageSize: paginationData.pageSize }).then(response => {
        listLoading.value = false;
        list.value = response.data.list;
        total.value = response.data.total;
    });
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>