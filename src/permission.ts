import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { ElMessage } from 'element-plus';
import { getToken } from '@/utils/auth' // 验权
import pinia from '@/store/index'
import { useUserStore } from "@/store/modules/userStore";
import { usePermissionStore } from "@/store/modules/permissionStore";
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  const UserStore = useUserStore(pinia);
  const PermissionStore = usePermissionStore(pinia);
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (UserStore.roles.length === 0) {
        UserStore.GetInfo().then((res: any) => { // 拉取用户信息
          let menus = res.data.menus;
          let username = res.data.username;
          PermissionStore.GenerateRoutes({ menus, username }).then(() => { // 生成可访问的路由表
            PermissionStore.addRouters.map((item: any) => {
              router.addRoute(item) // 动态添加可访问路由表
            })
            next({ ...to, replace: true })
          })
        }).catch((err:any) => {
          UserStore.FedLogOut().then(() => {
            ElMessage.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
