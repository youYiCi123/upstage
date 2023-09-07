import request from '@/utils/request'
export function fetchListAll() {
  return request({
    url:'/prod-service/subject/listAll',
    method:'get',
  })
}

export function fetchList(params:any) {
  return request({
    url:'/prod-service/subject/list',
    method:'get',
    params:params
  })
}
