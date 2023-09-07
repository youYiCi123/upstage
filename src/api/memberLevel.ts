import request from '@/utils/request'
export function fetchList(params:any) {
  return request({
    url:'/prod-service/memberLevel/list',
    method:'get',
    params:params
  })
}