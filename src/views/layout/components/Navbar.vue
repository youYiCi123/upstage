<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" @toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar?avatar:require('@/assets/images/avatar_default.jpg')">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <template #dropdown>
      <el-dropdown-menu>
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
    </el-dropdown>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { logOutRedis } from '@/api/login'
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
import { useUserStore } from "@/store/modules/userStore";
const AppStore = useAppStore(pinia);
const UserStore = useUserStore(pinia);

const sidebar = computed(() => {
  return AppStore.sidebar
})

const avatar = computed(() => {
  return UserStore.avatar
})

function toggleSideBar(){
  AppStore.toggleSidebar();
}

function logout() {
  let key1 = []
  key1.push(logOutRedis())
  UserStore.LogOut().then(()=>{
    location.reload() // 为了重新实例化vue-router对象 避免bug
  })
}


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;

    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}</style>

