import axios, { Axios, AxiosResponse, AxiosRequestConfig }  from 'axios'
import { ElMessage , ElMessageBox } from 'element-plus';
import { getToken } from '@/utils/auth'
import { useUserStore } from "@/store/modules/userStore";

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url8085
  baseURL:'http://localhost:8087/',
  timeout: 15000 // 请求超时时间
})

// 处理  类型“AxiosResponse<any, any>”上不存在属性“errorinfo”。ts(2339) 脑壳疼！关键一步。
declare module "axios" {
  interface AxiosResponse<T = any> {
    message:'';
    code:null;
    // 这里追加你的参数
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

// request拦截器
service.interceptors.request.use(config => {
  const store = useUserStore();
  if (store.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const store = useUserStore();
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== 200) {
      ElMessage({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })

      // 401:未登录;
      if (res.code === 401) {
        ElMessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.FedLogOut
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
