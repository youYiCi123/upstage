<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script setup lang="ts">
import { computed} from 'vue'
import SidebarItem from './SidebarItem.vue'
import ScrollBar from '@/components/ScrollBar/index.vue'
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
