<template>
  <el-scrollbar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#e4e2e5"
      text-color="#6183ed"
      active-text-color="#1f69e0"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed} from 'vue'
import SidebarItem from './SidebarItem.vue'
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
import { usePermissionStore } from "@/store/modules/permissionStore";
const AppStore = useAppStore(pinia);
const PermissionStore = usePermissionStore(pinia);

const isCollapse = computed(() => {
  return !AppStore.sidebar.opened
})

const routes = computed(() => {
  return PermissionStore.routers
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/variables.scss';
.el-scrollbar{
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;
}
</style>
