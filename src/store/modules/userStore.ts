import { defineStore } from "pinia";
import { login, getInfo ,logout} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import LoginuserMode from "@/mode/LoginuserMode";

export const useUserStore = defineStore('userStore', {
  state: () => ({
    id:'',
    nickName: '',
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    isPractice: false, //练习模式标志
  }),
  actions: {
    setId(id: string) {
      this.id = id
    },
    setNickName(nickName: string) {
      this.nickName = nickName
    },
    setToken(token: string) {
      this.token = token
    },
    setName(name: string) {
      this.name = name
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setRoles(roles: []) {
      this.roles = roles
    },
    async Login(userInfo: LoginuserMode) {
      try {
        const asretname = userInfo.username as string
        const username = asretname.trim()
        const password = userInfo.password as string
        const response = await login(username, password, userInfo.code, userInfo.uuid)
        const data = response.data
        const tokenStr = data.tokenHead + data.token
        this.setToken(tokenStr)
        return 1
      } catch (error) {
        throw error
      }
    },

    async GetInfo() {
      try {
        const response = await getInfo()
        const data = response.data
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          this.setRoles(data.roles)
        } else {
          throw new Error('getInfo: roles must be a non-null array!')
        }
        this.setId(data.id)
        this.setName(data.username)
        this.setAvatar(data.icon)
        this.setNickName(data.nickName)
        return response
      } catch (error) {
        throw error
      }
    },

    // 登出
    async LogOut() {
      try{
        logout()
        this.setToken('')
        this.setRoles([])
        removeToken()
      }catch(error){
        throw error
      }
    },



    // 前端 登出
    FedLogOut(){
      return new Promise(resolve => {
        this.setToken('')
        removeToken()
        resolve('1')
      })
    }
  }
})
