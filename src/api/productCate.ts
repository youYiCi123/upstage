import request from '@/utils/request'
export function fetchList(parentId:any,params:any) {
  return request({
    url:'/prod-service/productCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
export function deleteProductCate(id:any) {
  return request({
    url:'/prod-service/productCategory/delete/'+id,
    method:'post'
  })
}

export function createProductCate(data:any) {
  return request({
    url:'/prod-service/productCategory/create',
    method:'post',
    data:data
  })
}

export function updateProductCate(id:any,data:any) {
  return request({
    url:'/prod-service/productCategory/update/'+id,
    method:'post',
    data:data
  })
}

export function getProductCate(id:any) {
  return request({
    url:'/prod-service/productCategory/'+id,
    method:'get',
  })
}

export function updateShowStatus(data:any) {
  return request({
    url:'/prod-service/productCategory/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateNavStatus(data:any) {
  return request({
    url:'/prod-service/productCategory/update/navStatus',
    method:'post',
    data:data
  })
}

export function fetchListWithChildren() {
  return request({
    url:'/prod-service/productCategory/list/withChildren',
    method:'get'
  })
}
