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
                <el-table-column prop="parentFilename" label="文件位置" min-width="140" align="center">
                    <template #default="scope">
                        <el-link type="primary">{{ scope.row.parentFilename
                        }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="fileSizeDesc" sortable label="大小" width="120" align="center">
                </el-table-column>
                <el-table-column prop="creatName" label="创建人" width="120" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" sortable align="center" label="修改日期" width="240">
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
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
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { usePagination } from "@/hooks/usePagination";
import { ElMessage, ElMessageBox } from 'element-plus';
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
import panUtil from '@/utils/fileUtil';
import { filesForTable, handleBatchDelete,deleteFile,handleBatchPass,passFile } from '@/api/file'
import { useRouter } from 'vue-router'; //vue3路由跳转
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
});
const fileList = ref<any[]>([]) //文件列表
const total = ref(0);
const tableLoading = ref(false);

function getList() {
    tableLoading.value = true;
    filesForTable({ pageType: panUtil.fileFold.DEP, keyword: listQuery.keyword, pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
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
    openNewPage('/preview/office/' + row.fileId + '/' + row.filename, 'PreviewOffice', {
        fileId: row.fileId,
        filename: row.filename,
    })
}

function showMusic(row: any) {
    openNewPage('/preview/music/' + row.parentId + '/' + row.fileId + '/' + panUtil.fileFold.ENTERPRISE, 'PreviewMusic', {
        pageType: panUtil.fileFold.ENTERPRISE,
        parentId: row.parentId,
        fileId: row.fileId
    })
}

function showVideo(row: any) {
    openNewPage('/preview/video/' + row.parentId + '/' + row.fileId, 'PreviewVideo', {
        fileId: row.fileId,
        parentId: row.parentId
    })
}

function showIframe(row: any) {
    openNewPage('/preview/iframe/' + row.fileId, 'PreviewIframe', {
        fileId: row.fileId
    })
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
            imgUrl.value.push(panUtil.getPreviewUrl(fileList.value[i].fileId))
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
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    });
  });
}

function handleDelete(row: any) {
    ElMessageBox.confirm('是否要删除该文件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteFile(row.fileId).then(response => {
            ElMessage({
                message: '删除成功',
                type: 'success',
                duration: 1000
            });
            getList();
        });
    }).catch(() => { });
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