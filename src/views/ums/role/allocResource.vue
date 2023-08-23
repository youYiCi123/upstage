<template>
  <el-card class="form-container" shadow="never">
    <div v-for="(cate, index) in allResourceCate" :class="index === 0 ? 'top-line' : null" :key="'cate' + cate.id">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox v-model="cate.checked" :indeterminate="isIndeterminate(cate.id)"
          @change="handleCheckAllChange(cate)">
          {{ cate.name }}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-col :span="8" v-for="resource in getResourceByCate(cate.id)" :key="resource.id" style="padding: 4px 0">
          <el-checkbox v-model="resource.checked" @change="handleCheckChange(resource)">
            {{ resource.name }}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>

  </el-card>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { ResourceCateMode, ResourceMode } from "@/mode/UserInfo/ResourceMode";
import { fetchAllResourceList } from '@/api/resource';
import { listAllCate } from '@/api/resourceCategory';
import { allocResource, listResourceByRole } from '@/api/role';
const route = useRoute();
const router = useRouter();
const roleId = route.query.roleId

const allResourceCate = ref<ResourceCateMode[]>([])
const allResource = ref<ResourceMode[]>([])
const { proxy } = getCurrentInstance() as ComponentInternalInstance

function getAllResourceList() {
  fetchAllResourceList().then((response: any) => {
    allResource.value = response.data;
    for (let i = 0; i < allResource.value.length; i++) {
      allResource.value[i].checked = false;
    }
    getResourceByRole(roleId as unknown as number);
  });
}
function getAllResourceCateList() {
  listAllCate().then((response: any) => {
    allResourceCate.value = response.data;
    for (let i = 0; i < allResourceCate.value.length; i++) {
      allResourceCate.value[i].checked = false;
    }
    getAllResourceList();
  });
}
function getResourceByCate(categoryId: number) {
  let cateResource = [];
  if (allResource == null) return null;
  for (let i = 0; i < allResource.value.length; i++) {
    let resource = allResource.value[i];
    if (resource.categoryId === categoryId) {
      cateResource.push(resource);
    }
  }
  return cateResource;
}
function getResourceByRole(roleId: number) {
  listResourceByRole(roleId).then(response => {
    let allocResource = response.data;
    allResource.value.forEach(item => {
      item.checked = getResourceChecked(item.id, allocResource);
    });
    allResourceCate.value.forEach(item => {
      item.checked = isAllChecked(item.id);
    });
    proxy!.$forceUpdate()
  });
}
function getResourceChecked(resourceId: number, allocResource: any) {
  if (allocResource == null || allocResource.length === 0) return false;
  for (let i = 0; i < allocResource.length; i++) {
    if (allocResource[i].id === resourceId) {
      return true;
    }
  }
  return false;
}
function isIndeterminate(categoryId: number) {
  let cateResources = getResourceByCate(categoryId);
  if (cateResources == null) return false;
  let checkedCount = 0;
  for (let i = 0; i < cateResources.length; i++) {
    if (cateResources[i].checked === true) {
      checkedCount++;
    }
  }
  return !(checkedCount === 0 || checkedCount === cateResources.length);
}
function isAllChecked(categoryId: number) {
  let cateResources = getResourceByCate(categoryId);
  if (cateResources == null) return false;
  let checkedCount = 0;
  for (let i = 0; i < cateResources.length; i++) {
    if (cateResources[i].checked === true) {
      checkedCount++;
    }
  }
  if (checkedCount === 0) {
    return false;
  }
  return checkedCount === cateResources.length;
}
function handleSave() {
  ElMessageBox.confirm('是否分配资源？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let checkedResourceIds = new Set();
    if (allResource != null && allResource.value.length > 0) {
      allResource.value.forEach(item => {
        if (item.checked) {
          checkedResourceIds.add(item.id);
        }
      });
    }
    let params = new URLSearchParams();
    params.append("roleId", roleId as string);
    params.append("resourceIds", Array.from(checkedResourceIds) as unknown as string);
    allocResource(params).then(response => {
      ElMessage({
        message: '分配成功',
        type: 'success',
        duration: 1000
      });
      router.back();
    })
  })
}
function handleClear() {
  allResourceCate.value.forEach(item => {
    item.checked = false;
  });
  allResource.value.forEach(item => {
    item.checked = false;
  });
  proxy!.$forceUpdate()
}
function handleCheckAllChange(cate: any) {
  let cateResources = getResourceByCate(cate.id);
  if (cateResources != null) {
    for (let i = 0; i < cateResources.length; i++) {
      cateResources[i].checked = cate.checked;
    }
  }
  proxy!.$forceUpdate()
}
function handleCheckChange(resource: any) {
  allResourceCate.value.forEach(item => {
    if (item.id === resource.categoryId) {
      item.checked = isAllChecked(resource.categoryId);
    }
  });
  proxy!.$forceUpdate()
}

getAllResourceCateList();
</script>

<style scoped>
.table-layout {
  padding: 20px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
}

.top-line {
  border-top: 1px solid #DCDFE6;
}
</style>
