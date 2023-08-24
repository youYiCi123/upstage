import request from '@/utils/request'

export function fetchList(params:any) {
  return request({
    url:'/upstage-service/productAttribute/category/list',
    method:'get',
    params:params
  })
}

export function createProductAttrCate(data:any) {
    return request({
      url:'/upstage-service/productAttribute/category/create',
      method:'post',
      data:data
    })
  }
  
  export function deleteProductAttrCate(id:any) {
    return request({
      url:'/upstage-service/productAttribute/category/delete/'+id,
      method:'get'
    })
  }
  
  export function updateProductAttrCate(id:any,data:any) {
    return request({
      url:'/upstage-service/productAttribute/category/update/'+id,
      method:'post',
      data:data
    })
  }
  export function fetchListWithAttr() {
    return request({
      url:'/upstage-service/productAttribute/category/list/withAttr',
      method:'get'
    })
  }
  