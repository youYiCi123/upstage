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
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="文件名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型">
                        <el-select v-model="listQuery.fileType" clearable placeholder="请选择" style="width: 150px">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="small" type="primary" @click="batchPass()" class="btn-add" style="margin-left: 20px">批量通过
            </el-button>
            <el-button size="small" type="danger" @click="batchDelete()" class="btn-add">批量删除
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table v-loading="tableLoading" ref="fileTable" :data="fileList" stripe tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="文件名" prop="filename" sortable show-overflow-tooltip width="440">
                    <template #default="scope">
                        <div @click="clickFilename(scope.row)" class="file-name-content">
                            <i :class="getFileFontElement(scope.row.fileType)"
                                style="margin-right: 15px; font-size: 20px; cursor: pointer;" />
                            <span style="cursor:pointer;">{{ scope.row.filename }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="parentFilename" label="文件夹导航" min-width="140" align="center">
                    <template #default="scope">
                        <el-link type="primary" @click="goInFolder(scope.row.parentId, scope.row.parentFilename)">{{
                            scope.row.parentFilename
                        }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="fileSizeDesc" sortable label="大小" width="120" align="center">
                </el-table-column>
                <el-table-column prop="creatName" label="创建人" width="120" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" sortable align="center" label="上传日期" width="240">
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">驳回并删除
                        </el-button>
                        <el-button size="small" type="primary" @click="handlePass(scope.row)">审核通过
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-image-viewer :initial-index="imgIndex" v-if="showViewer" @close="() => { showViewer = false }"
                :url-list="imgUrl" />
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :layout="paginationData.layout" :current-page.sync="paginationData.currentPage"
                :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="驳回并删除" v-model="rejectDialogVisible" width="30%">
            <el-input type="textarea" :rows="3" maxlength="30" show-word-limit v-model="reason.content" placeholder="请填写驳回理由" ></el-input>
            <template #footer>
                <el-button @click="rejectDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="defineDelete">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox } from 'element-plus';
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
import panUtil from '@/utils/fileUtil';
import { filesForTable, handleBatchDelete, deleteFile, handleBatchPass, passFile } from '@/api/file'
import { useRouter } from 'vue-router'; //vue3路由跳转
import pinia from '@/store/index'
import { useUserStore } from "@/store/modules/userStore";
import { useFileStore } from "@/store/modules/fileStore";
import { useBreadcrumbStore } from "@/store/modules/breadcrumbStore";
const breadcrumbStore = useBreadcrumbStore(pinia);
const fileStore = useFileStore(pinia);
const userStore = useUserStore(pinia);
const rejectDialogVisible = ref(false);
const reason = reactive({
    id: '',
    content: ''
});
const batchDelFlag = ref(false);
const router = useRouter();
const showViewer = ref(false);
const imgUrl = ref<any[]>([]);
const imgIndex = ref(0);
//el-table多/全选后的存放文件数据的数组
const multipleSelection = ref<any[]>([])
//用于多/全选后的存放文件id的数组
const multipleSelectionId = ref<number[]>([])

let listQuery = reactive({
    keyword: '',
    fileType: ''
});

const options = [
    {
        value: '3',
        label: 'Excel',
    },
    {
        value: '4',
        label: 'Word',
    },
    {
        value: '5',
        label: 'Pdf',
    },
    {
        value: '6',
        label: 'TXT',
    },
    {
        value: '10',
        label: 'PPT',
    },
    {
        value: '7',
        label: '图片',
    },
    {
        value: '8',
        label: '音频',
    },
    {
        value: '9',
        label: '视频',
    },

    {
        value: '11',
        label: '源码文件',
    },
    {
        value: '1',
        label: '普通文件',
    },
    {
        value: '2',
        label: '压缩文件',
    },

    {
        value: '12',
        label: 'CSV',
    }
]

const fileList = ref<any[]>([]) //文件列表
const total = ref(0);
const tableLoading = ref(false);

function goInFolder(parentId: any, parentFilename: any) {
    //放到vuex中
    fileStore.parentDepId = parentId
    breadcrumbStore.depBreadCrumbs = [];
    breadcrumbStore.depBreadCrumbs.unshift({
        name: parentFilename,
        id: parentId,
    });
    router.push({ path: '/fold/depFiles' })
}

function getList() {
    tableLoading.value = true;
    filesForTable({ pageType: panUtil.fileFold.DEP, keyword: listQuery.keyword, fileType: listQuery.fileType, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
        tableLoading.value = false;
        fileList.value = response.data.list;
        total.value = response.data.total;
    });
}

function handleResetSearch() {
    listQuery.keyword = ''
}
function handleSearchList() {
    paginationData.currentPage = 1
    getList();
}

function clickFilename(row: any) {
    switch (row.fileType) {
        case 0:
            break
        case 3:
        case 4:
        case 10:
            showOffice(row)
            break
        case 5:
        case 6:
            showIframe(row)
            break
        case 7:
            showImg(row)
            break
        case 8:
            showMusic(row)
            break
        case 9:
            showVideo(row)
            break
        case 11:
            showCode(row)
        default:
            break
    }
}

function showOffice(row: any) {
    openNewPage('/preview/office/' + row.fileId + '/' + row.filename + '/' + userStore.nickName, 'PreviewOffice', {
        fileId: row.fileId,
        filename: row.filename,
        userName: userStore.nickName
    })
}

function showMusic(row: any) {
    openNewPage('/preview/music/' + row.parentId + '/' + row.fileId + '/' + panUtil.fileFold.DEPVERIFY, 'PreviewMusic', {
        pageType: panUtil.fileFold.DEPVERIFY,
        parentId: row.parentId,
        fileId: row.fileId
    })
}

//视频播放
function showVideo(row: any) {
    openNewPage('/preview/video/' + row.parentId + '/' + row.fileId + '/' + panUtil.fileFold.DEPVERIFY, 'PreviewVideo', {
        pageType: panUtil.fileFold.DEPVERIFY,
        fileId: row.fileId,
        parentId: row.parentId
    })
}

function showIframe(row: any) {
    const pdfUrl = panUtil.getPreviewUrl(row.fileId, "")  // pdf路径
    window.open(pdfUrl)
}

function showCode(row: any) {
    openNewPage('/preview/code/' + row.fileId, 'PreviewCode', {
        fileId: row.fileId
    })
}

function openNewPage(path: any, name: any, params: any) {
    const { href } = router.resolve({
        path: path,
        name: name,
        params: params
    })
    window.open(href, '_blank')
}

function showImg(row: any) {
    imgUrl.value = new Array()
    let t = 0
    for (let i = 0, iLength = fileList.value.length; i < iLength; ++i) {
        if (fileList.value[i].fileType === 7) {
            imgUrl.value.push(panUtil.getPreviewUrl(fileList.value[i].fileId, ""))
            if (fileList.value[i].fileId === row.fileId) {
                imgIndex.value = t
            }
            t++;
        }
    }
    showViewer.value = true
}

function closeShowViewer() {
    showViewer.value = false
}

function getFileFontElement(type: any) {
    return panUtil.getFileFontElement(type)
}

function handleSelectionChange(val: any[]) {
    multipleSelection.value = val;
    multipleSelectionId.value = [];
    multipleSelection.value.forEach(t => multipleSelectionId.value.push(t.fileId))
}


function batchPass() {
    ElMessageBox.confirm('是否确认批量通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        handleBatchPass(multipleSelectionId.value).then(response => {
            ElMessage({
                type: 'success',
                message: '审核成功!'
            });
            getList();
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消审核'
        });
    });
}

function batchDelete() {
    batchDelFlag.value=true
    rejectDialogVisible.value=true
}

function handleDelete(row: any) {
    batchDelFlag.value=false    
    reason.id=row.fileId
    rejectDialogVisible.value=true
}

function defineDelete(){
    if(batchDelFlag.value){
        handleBatchDelete({multipleSelectionId:multipleSelectionId.value.toString(),reason:reason.content}).then(response => {
            ElMessage({
                type: 'success',
                message: '删除成功!'
            });
            rejectDialogVisible.value=false
            getList();
        })
    }else{
        deleteFile({id:reason.id,reason:reason.content}).then(response => {
            ElMessage({
                message: '删除成功',
                type: 'success',
                duration: 1000
            });
            rejectDialogVisible.value=false
            getList();
        });
    }
}

function handlePass(row: any) {
    ElMessageBox.confirm('是否要通过该文件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        passFile(row.fileId).then(response => {
            ElMessage({
                message: '审核成功',
                type: 'success',
                duration: 1000
            });
            getList();
        });
    }).catch(() => { });
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })

</script>