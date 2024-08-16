<template>
    <div class="app-container">
        <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="姓名" width="100" align="center">
          <template #default="scope">{{ scope.row.nickName }}</template>
        </el-table-column>
        <el-table-column label="IP地址" width="150" align="center">
          <template #default="scope">{{ scope.row.ip }}</template>
        </el-table-column>
        <el-table-column label="登陆地址" align="center">
          <template #default="scope">{{ scope.row.loginAddress }}</template>
        </el-table-column>
        <el-table-column label="登录时间" width="160" align="center">
          <template #default="scope">
            <span v-html="timeFormat(scope.row.loginTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="登陆游览器" align="center">
          <template #default="scope">{{ scope.row.browser }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" >踢出登录
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
import { ref,watch } from 'vue';
import { usePagination } from "@/hooks/usePagination";
import { fetchList } from '@/api/online';
import dayjs from "dayjs";
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const listLoading = ref(false);
const list = ref<any[]>([])
const total = ref(0);

function timeFormat(time: string) {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function getList() {
  listLoading.value = true;
  fetchList({pageSize: paginationData.pageSize, pageNum: paginationData.currentPage }).then(response => {
    listLoading.value = false;
    list.value = response.data.list;
    total.value = response.data.total;
  });
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getList, { immediate: true })


</script>