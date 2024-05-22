import { defineStore } from "pinia";
import { RouteRecordRaw,RouteRecordName } from 'vue-router'; 
import { ref } from "vue"
import { asyncRouterMap, constantRouterMap } from '@/router/index';
// 引入mode对象
import MenuMode from "@/mode/UserInfo/MenuMode";
import {UserInfoMode} from "@/mode/UserInfo/UserInfoMode";

export const usePermissionStore = defineStore('permissionStore', {
  state: () => ({
    routers: constantRouterMap,
    //vue-router 源码解析  https://bryanadamss.github.io/2020/04/27/vue-router-analysis-part1/
    addRouters: ref<RouteRecordRaw[]>([])
  }),
  actions: {
    //判断是否有权限访问该菜单
    hasPermission(menus:Array<MenuMode>, route:RouteRecordRaw) {
      if (route.name) {
        let currMenu = this.getMenu(route.name, menus);
        //细数 TS 中那些奇怪的符号  https://segmentfault.com/a/1190000023943952
        if (currMenu != null) {
          //设置菜单的标题、图标和可见性
          if (currMenu.title != null && currMenu.title !== '') {
            route.meta!.title = currMenu.title;
          }
          if (currMenu.icon != null && currMenu.title !== '') {
            route.meta!.icon = currMenu.icon;
          }
          if (currMenu.hidden != null) {
            route.meta!.hidden = currMenu.hidden !== 0;
          }
          if (currMenu.sort != null && currMenu.sort !== '') {
            route.meta!.sort = currMenu.sort;
          }
          return true;
        } else {
          route.meta!.sort = 0;
          if (route.meta!.hidden !== undefined && route.meta!.hidden === true) {
            route.meta!.sort = -1;
            return true;
          } else {
            return false;
          }
        }
      } else {
        return true
      }
    },
    //根据路由名称获取菜单
    getMenu(name:string|RouteRecordName, menus:Array<MenuMode>) {
      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (name === menu.name) {
          return menu;
        }
      }
      return null;
    },

    //对菜单进行排序
    sortRouters(accessedRouters:RouteRecordRaw[]) {
      for (let i = 0; i < accessedRouters.length; i++) {
        let router = accessedRouters[i];
        if (router.children && router.children.length > 0) {
          router.children.sort(this.compare("sort"));
        }
      }
      accessedRouters.sort(this.compare("sort"));
    },

    //降序比较函数
    compare(p:string) {
      return function (m:any, n:any) {
        let a = m[p];
        let b = n[p];
        return b - a;
      }
    },
    
    setRouters(routers:RouteRecordRaw[]) {
      this.addRouters = routers;
      this.routers = constantRouterMap.concat(routers);
    },

    GenerateRoutes(data:UserInfoMode) {
      return new Promise(resolve => {
        const { menus } = data;
        const accessedRouters = asyncRouterMap.filter((v:RouteRecordRaw) => {
          //admin帐号直接返回所有菜单
          // if(username==='admin') return true;
          if (this.hasPermission(menus, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (this.hasPermission(menus, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        //对菜单进行排序
        this.sortRouters(accessedRouters);
        this.setRouters(accessedRouters)
        resolve(1);
      })
    }
  }
})

