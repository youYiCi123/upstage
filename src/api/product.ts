import request from '@/utils/request'
export function fetchList(params:any) {
  return request({
    url:'/prod-service/product/list',
    method:'get',
    params:params
  })
}

export function fetchSimpleList(params:any) {
  return request({
    url:'/prod-service/product/simpleList',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(params:any) {
  return request({
    url:'/prod-service/product/update/deleteStatus',
    method:'post',
    params:params
  })
}

export function updateNewStatus(params:any) {
  return request({
    url:'/prod-service/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updateRecommendStatus(params:any) {
  return request({
    url:'/prod-service/product/update/recommendStatus',
    method:'post',
    params:params
  })
}

export function updatePublishStatus(params:any) {
  return request({
    url:'/prod-service/product/update/publishStatus',
    method:'post',
    params:params
  })
}

export function createProduct(data:any) {
  return request({
    url:'/prod-service/product/create',
    method:'post',
    data:data
  })
}

export function updateProduct(id:any,data:any) {
  return request({
    url:'/prod-service/product/update/'+id,
    method:'post',
    data:data
  })
}

export function getProduct(id:any) {
  return request({
    url:'/prod-service/product/prodInfo/'+id,
    method:'get',
  })
}

