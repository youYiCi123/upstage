import request from '@/utils/request'
export function fetchList(params:any) {
  return request({
    url:'/prod-service/brand/list',
    method:'get',
    params:params
  })
}
export function createBrand(data:any) {
  return request({
    url:'/prod-service/brand/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data:any) {
  return request({
    url:'/prod-service/brand/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data:any) {
  return request({
    url:'/prod-service/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteBrand(id:any) {
  return request({
    url:'/prod-service/brand/delete/'+id,
    method:'get',
  })
}

export function getBrand(id:any) {
  return request({
    url:'/prod-service/brand/'+id,
    method:'get',
  })
}

export function updateBrand(id:any,data:any) {
  return request({
    url:'/prod-service/brand/update/'+id,
    method:'post',
    data:data
  })
}

