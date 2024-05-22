import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/prod-service/prefrenceArea/listAll',
    method:'get',
  })
}
