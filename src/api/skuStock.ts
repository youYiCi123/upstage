import request from '@/utils/request'
export function fetchList(pid:any,params:any) {
  return request({
    url:'/prod-service/sku/'+pid,
    method:'get',
    params:params
  })
}

export function update(pid:any,data:any) {
  return request({
    url:'/prod-service/sku/update/'+pid,
    method:'post',
    data:data
  })
}
