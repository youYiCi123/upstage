import request from '@/utils/request'


export function createProductAttr(data:any) {
  return request({
    url:'/prod-service/productAttribute/create',
    method:'post',
    data:data
  })
}

export function updateProductAttr(id:any,data:any) {
  return request({
    url:'/prod-service/productAttribute/update/'+id,
    method:'post',
    data:data
  })
}
export function getProductAttr(id:any) {
  return request({
    url:'/prod-service/productAttribute/'+id,
    method:'get'
  })
}

export function fetchList(cid:any,params:any) {
  return request({
    url:'/prod-service/productAttribute/list/'+cid,
    method:'get',
    params:params
  })
}

export function deleteProductAttr(data:any) {
    return request({
      url:'/prod-service/productAttribute/delete',
      method:'post',
      data:data
    })
  }

  export function getProductAttrInfo(productCategoryId:any) {
    return request({
      url:'/prod-service/productAttribute/attrInfo/'+productCategoryId,
      method:'get'
    })
  }