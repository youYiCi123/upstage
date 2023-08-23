import request from '@/utils/request'
import MenuMode from "@/mode/UserInfo/MenuMode";

export function fetchList(parentId:number, params:any) {
  return request({
    url: '/upstage-service/menu/list/' + parentId,
    method: 'get',
    params: params
  })
}

export function deleteMenu(id:number) {
  return request({
    url: '/upstage-service/menu/delete/' + id,
    method: 'post'
  })
}

export function createMenu(data:MenuMode) {
  return request({
    url: '/upstage-service/menu/create',
    method: 'post',
    data: data
  })
}

export function updateMenu(id:number, data:MenuMode) {
  return request({
    url: '/upstage-service/menu/update/' + id,
    method: 'post',
    data: data
  })
}

export function getMenu(id:number) {
  return request({
    url: '/upstage-service/menu/' + id,
    method: 'get',
  })
}

export function updateHidden(id:number, params:number) {
  return request({
    url: '/upstage-service/menu/updateHidden/' + id,
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/upstage-service/menu/treeList',
    method: 'get'
  })
}

