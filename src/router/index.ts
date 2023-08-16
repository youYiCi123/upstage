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
    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // routes
  routes: constantRouterMap,
});

export default router;
