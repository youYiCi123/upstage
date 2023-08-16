<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { computed } from "vue";
mixins: [ResizeMixin];
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
const AppStore = useAppStore(pinia);
// const { useAppStore} = useStore();
const _sidebar = computed(() => {
  return AppStore.sidebar
});
const _device = computed(() => {
  return AppStore.device
});
const classObj = computed(() => {
  return {
        hideSidebar: !_sidebar.value.opened,
        withoutAnimation: _sidebar.value.withoutAnimation,
        mobile: _device.value === 'mobile'
      }
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
