import request from '@/utils/request'
import Cookies from 'js-cookie'
export function login(username:string, password:string,code:string,uuid:string) {
  return request({
    url: '/upstage-service/admin/login',
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
    url: '/upstage-service/admin/info',
    method: 'get',
  })
}
//验证码
export function getCodeImg() {
  return request({
    url: '/upstage-service/admin/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/upstage-service/admin/logout',
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
    url: '/upstage-service/admin/list',
    method: 'get',
    params: params
  })
}

export function changePassword(data:any) {
  return request({
    url: '/upstage-service/admin/updatePassword',
    method: 'post',
    data: data
  })
}


export function createAdmin(data:any) {
  return request({
    url: '/upstage-service/admin/register',
    method: 'post',
    data: data
  })
}

export function getMimeInfo() {
  return request({
    url: '/upstage-service/admin/getMimeInfo',
    method: 'get'
  })
}

export function updateAdmin(id:number, data:any) {
  return request({
    url: '/upstage-service/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id:number, params:any) {
  return request({
    url: '/upstage-service/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id:number) {
  return request({
    url: '/upstage-service/admin/delete/' + id,
    method: 'post'
  })
}

export function handleBatchDelete(data:any) {
  return request({
    url: '/upstage-service/admin/deleteBatch',
    method: 'post',
    data: data
  })
}

export function getRoleByAdmin(id:number) {
  return request({
    url: '/upstage-service/admin/role/' + id,
    method: 'get'
  })
}

export function getUserInfoById(id:any) {
  return request({
    url: '/upstage-service/admin/' + id,
    method: 'get'
  })
}


export function allocRole(data:any) {
  return request({
    url: '/upstage-service/admin/role/update',
    method: 'post',
    data: data
  })
}

export function getUserFileBrief() {
  return request({
    url: '/upstage-service/admin/getUserFileBrief',
    method: 'get'
  })
}

