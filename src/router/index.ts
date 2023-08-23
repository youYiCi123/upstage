import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { markRaw } from "vue";
/* Layout */
import Layout from "../views/layout/Layout.vue";

export const constantRouterMap: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "login", hidden: true },
  },
  {
    path: "/404",
    component: () => import("@/views/404.vue"),
    meta: { title: "404", hidden: true },
  },
  {
    path: "",
    component: markRaw(Layout),
    redirect: "/home",
    meta: {},
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "首页", icon: "iconfont icon-shouyefill" },
      },
    ],
  },
];

export const asyncRouterMap: RouteRecordRaw[] = [
  {
    path: "/ums",
    component: markRaw(Layout),
    redirect: "/ums/admin",
    name: "ums",
    meta: { title: "权限", icon: "icon-user" },
    children: [
      {
        path: "admin",
        name: "admin",
        component: () => import("@/views/ums/admin/index.vue"),
        meta: { title: "用户列表", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "role",
        name: "role",
        component: () => import("@/views/ums/role/index.vue"),
        meta: { title: "角色列表", icon: "icon-edit-role"},
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu.vue'),
        meta: { title: '分配菜单',hidden: true },
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource.vue'),
        meta: {title: '分配资源',hidden: true},
        
      }
    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // routes
  routes: constantRouterMap,
});

export default router;
