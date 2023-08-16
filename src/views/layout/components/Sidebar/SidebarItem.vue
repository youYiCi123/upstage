<template>
  <div class="menu-wrapper">
    <template v-for="item in props.routes" >
      <div v-if="!item.meta!.hidden && item.children">
        <router-link
        v-if="item.children && hasOneShowingChildren(item.children as RouteRecordRaw[]) && !(item.children as RouteRecordRaw[])[0].children"
        :to="item.path + '/' + (item.children as RouteRecordRaw[])[0].path"
        :key="(item.children as RouteRecordRaw[])[0].name">
        <el-menu-item :index="item.path + '/' + (item.children as RouteRecordRaw[])[0].path"
          :class="{ 'submenu-title-noDropdown': !props.isNest }">
          <i v-if="(item.children as RouteRecordRaw[])[0].meta && (item.children as RouteRecordRaw[])[0].meta!.icon"
            :class="(item.children as RouteRecordRaw[])[0].meta!.icon" style="margin-right: 15px; font-size: 20px;"></i>
          <span v-if="(item.children as RouteRecordRaw[])[0].meta && (item.children as RouteRecordRaw[])[0].meta!.title"
            >{{ (item.children as RouteRecordRaw[])[0].meta!.title }}</span>
        </el-menu-item>
      </router-link>

      <el-sub-menu v-else :index="item.name || item.path" :key="item.name">
        <!-- elementplus 的固定写法  #title取代了原先的elementui的slot="title-->
        <template #title>
          <i v-if="item.meta && item.meta.icon" :class="item.meta.icon" style="margin-right: 15px; font-size: 20px;"></i>
          <span v-if="item.meta && item.meta!.title">{{ item.meta.title }}</span>
        </template>
        <template v-for="child in item.children" >
          <div v-if="!child.meta!.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children && child.children.length > 0"
            :routes="[child]" :key="child.path"></sidebar-item>
          <router-link v-else :to="item.path + '/' + child.path" :key="child.name">
            <el-menu-item :index="item.path + '/' + child.path">
              <i v-if="child.meta && child.meta.icon" :class="child.meta.icon"
                style="margin-right: 15px; font-size: 20px;"></i>
              <span v-if="child.meta && child.meta.title">{{ child.meta.title }}</span>
            </el-menu-item>
          </router-link>
        </div>
        </template>
      </el-sub-menu>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {defineProps,PropType} from "vue";
import {RouteRecordRaw,RouteMeta } from 'vue-router'; 
let props = defineProps({
  routes: {
    type: Array as PropType<RouteRecordRaw[]>
  },
  isNest: {
    type: Boolean,
    default: false
  }
})
function hasOneShowingChildren(children:RouteRecordRaw[]) {
  const showingChildren = children.filter(item => {
    return !(item.meta as RouteMeta).hidden
  })
  if (showingChildren.length === 1) {
    return true
  }
  return false
}
</script>
