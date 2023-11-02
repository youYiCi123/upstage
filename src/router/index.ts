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
        meta: { title: "首页", icon: "iconfont icon-shouye-shouye" },
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
        meta: { title: "用户列表", icon: "icon-24gf-portraitMaleInfo3" },
      },
      {
        path: "role",
        name: "role",
        component: () => import("@/views/ums/role/index.vue"),
        meta: { title: "角色列表", icon: "icon-edit-role" },
      },
      {
        path: "allocMenu",
        name: "allocMenu",
        component: () => import("@/views/ums/role/allocMenu.vue"),
        meta: { title: "分配菜单", hidden: true },
      },
      {
        path: "allocResource",
        name: "allocResource",
        component: () => import("@/views/ums/role/allocResource.vue"),
        meta: { title: "分配资源", hidden: true },
      },
      {
        path: 'depList',
        name: 'depList',
        component: () => import('@/views/ums/dep/index.vue'),
        meta: { title: '部门管理' , icon: "product-list" }
      }
    ],
  },
  {
    path: '/fold',
    name: 'fold',
    component: Layout,
    meta: { title: '文件', icon: 'ums' },
    redirect: '/fold/enterpriseFiles',
    children: [
      {
        path: 'enterpriseFiles',
        name: 'enterpriseFiles',
        component: () => import('@/views/files/enterprise/index.vue'),
        meta: { title: '企业文件', icon: "product-list" }
      },
      {
        path: 'depFiles',
        name: 'depFiles',
        component: () => import('@/views/files/dep/index.vue'),
        meta: { title: '部门文件', icon: "product-list" }
      },
      {
        path: 'verifyEnterprise',
        name: 'verifyEnterprise',
        component: () => import('@/views/files/verifyEnterprise/index.vue'),
        meta: { title: '企业审核', icon: "product-list" }
      },
      {
        path: 'verifyDep',
        name: 'verifyDep',
        component: () => import('@/views/files/verifyDep/index.vue'),
        meta: { title: '部门审核', icon: "product-list" }
      },
    ]
  },
  {
    path: '/business',
    name: 'business',
    component: Layout,
    meta: { title: '业务', icon: 'ums' },
    redirect: '/business/news',
    children: [
      {
        path: "news",
        name: "news",
        component: () => import("@/views/business/news/newsList/index.vue"),
        meta: { title: "新闻列表", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "custom",
        name: "custom",
        component: () => import("@/views/business/custom/customList/index.vue"),
        meta: { title: "业务列表", icon: "icon-24gf-portraitMaleInfo3"},
      },
      {
        path: "newsInfo",
        name: "newsInfo",
        component: () => import("@/views/business/news/newsInfo/index.vue"),
        meta: { title: "新闻查看",hidden: true,},
      },
      {
        name: "newsContentAdd",
        path: 'newsContentAdd',
        component: () => import('@/views/business/news/newsAdd/index.vue'),
        meta: { title: "新闻添加",hidden: true,},
      },
      {
        name: "newsContentUpdate",
        path: 'newsContentUpdate',
        component: () => import('@/views/business/news/newsUpdate/index.vue'),
        meta: { title: "新闻修改",hidden: true,},
      },
      {
        name: "customAdd",
        path: 'customAdd',
        component: () => import('@/views/business/custom/customAdd/index.vue'),
        meta: { title: "客户添加",hidden: true,},
      },
      {
        name: "customUpdate",
        path: 'customUpdate',
        component: () => import('@/views/business/custom/customUpdate/index.vue'),
        meta: { title: "客户修改",hidden: true,},
      },
    ]
  },
  {
    path: "/pms",
    component: markRaw(Layout),
    redirect: "/pms/product",
    name: "pms",
    meta: { title: "商品", icon: "icon-user" },
    children: [
      {
        path: "product",
        name: "product",
        component: () => import("@/views/pms/product/index.vue"),
        meta: { title: "商品列表", icon: "product-list" },
      },
      {
        path: "addProduct",
        name: "addProduct",
        component: () => import("@/views/pms/product/add.vue"),
        meta: { title: "添加商品", icon: "product-add" },
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update.vue'),
        meta: {title: '修改商品', icon: 'product-add' ,hidden: true},
      },
      {
        path: "productAttr",
        name: "productAttr",
        component: () => import("@/views/pms/productAttr/index.vue"),
        meta: { title: "商品类型", icon: "product-attr" },
      },
      {
        path: "productAttrList",
        name: "productAttrList",
        component: () => import("@/views/pms/productAttr/productAttrList.vue"),
        meta: { title: "商品属性列表", hidden: true },
      },
      {
        path: "addProductAttr",
        name: "addProductAttr",
        component: () => import("@/views/pms/productAttr/addProductAttr.vue"),
        meta: { title: "添加商品属性", hidden: true },
      },
      {
        path: "updateProductAttr",
        name: "updateProductAttr",
        component: () =>
          import("@/views/pms/productAttr/updateProductAttr.vue"),
        meta: { title: "修改商品属性", hidden: true },
      },
      {
        path: "productCate",
        name: "productCate",
        component: () => import("@/views/pms/productCate/index.vue"),
        meta: { title: "商品分类", icon: "product-cate" },
      },
      {
        path: "addProductCate",
        name: "addProductCate",
        component: () => import("@/views/pms/productCate/add.vue"),
        meta: { title: "添加商品分类", hidden: true },
      },
      {
        path: "updateProductCate",
        name: "updateProductCate",
        component: () => import("@/views/pms/productCate/update.vue"),
        meta: { title: "修改商品分类", hidden: true },
      },
      {
        path: "brand",
        name: "brand",
        component: () => import("@/views/pms/brand/index.vue"),
        meta: { title: "品牌管理", icon: "product-brand" },
      },
      {
        path: "addBrand",
        name: "addBrand",
        component: () => import("@/views/pms/brand/add.vue"),
        meta: { title: "添加品牌", hidden: true },
      },
      {
        path: "updateBrand",
        name: "updateBrand",
        component: () => import("@/views/pms/brand/update.vue"),
        meta: { title: "编辑品牌", hidden: true },
      },
    ],
  },
  {
    path: '/preview/office/:fileId/:filename',
    name: 'PreviewOffice',
    component: () => import('@/views/files/preview/office/index.vue'),
    meta: { title: 'office预览', hidden: true  }
  },
  {
    path: '/preview/music/:parentId/:fileId/:pageType',
    name: 'PreviewMusic',
    component: () => import('@/views/files/preview/music/index.vue'),
    meta: { title: '音乐播放', hidden: true  }
  },
  {
    path: '/preview/video/:parentId/:fileId/:pageType',
    name: 'PreviewVideo',
    component: () => import('@/views/files/preview/video/index.vue'),
    meta: { title: '视频观看', hidden: true  }
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRouterMap,
});

export default router;
