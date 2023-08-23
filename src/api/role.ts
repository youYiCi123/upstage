import request from '@/utils/request'
import { RoleMode,addRoleMode } from "@/mode/UserInfo/RoleMode";

export function fetchList(params:any) {
  return request({
    url: '/upstage-service/role/list',
    method: 'get',
    params: params
  })
}

export function createRole(data:addRoleMode) {
  return request({
    url: '/upstage-service/role/create',
    method: 'post',
    data: data
  })
}

export function updateRole(id:number, data:addRoleMode) {
  return request({
    url: '/upstage-service/role/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id:number, params:number) {
  return request({
    url: '/upstage-service/role/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteRole(data:any) {
  return request({
    url:'/upstage-service/role/delete',
    method:'post',
    data:data
  })
}

export function fetchAllRoleList() {
  return request({  
    url: '/upstage-service/role/listAll',
    method: 'get'
  })
}

export function listMenuByRole(roleId:number) {
  return request({
    url: '/upstage-service/role/listMenu/'+roleId,
    method: 'get'
  })
}

export function listResourceByRole(roleId:number) {
  return request({
    url: '/upstage-service/role/listResource/'+roleId,
    method: 'get'
  })
}

export function allocMenu(data:any) {
  return request({
    url: '/upstage-service/role/allocMenu',
    method: 'post',
    data:data
  })
}

export function allocResource(data:any) {
  return request({
    url: '/upstage-service/role/allocResource',
    method: 'post',
    data:data
  })
}
