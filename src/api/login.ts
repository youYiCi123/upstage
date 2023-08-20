import request from '@/utils/request'
import Cookies from 'js-cookie'
export function login(username:string, password:string,code:string,uuid:string) {
  return request({
    url: '/upstage-service/upstage/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: '/upstage-service/upstage/info',
    method: 'get',
  })
}
//验证码
export function getCodeImg() {
  return request({
    url: '/upstage-service/upstage/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/upstage-service/upstage/logout',
    method: 'post'
  })
}

//todo
export function logOutRedis(){
  let token=Cookies.get('loginToken') as string
  token= token.split(" ")[1]
  let arr = '' 
  arr='online-token-'+token
return arr
} 


export function fetchList(params:any) {
  return request({
    url: '/upstage-service/upstage/list',
    method: 'get',
    params: params
  })
}

export function createAdmin(data:any) {
  return request({
    url: '/upstage-service/upstage/register',
    method: 'post',
    data: data
  })
}

export function updateAdmin(id:number, data:any) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id:number, params:any) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id:number) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function handleBatchDelete(data:any) {
  return request({
    url: '/admin/deleteBatch',
    method: 'post',
    data: data
  })
}

export function getRoleByAdmin(id:number) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function getUserInfoById(id:number) {
  return request({
    url: '/admin/' + id,
    method: 'get'
  })
}


export function allocRole(data:any) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}

