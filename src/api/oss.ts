import request from '@/utils/request'
export function policy() {
  return request({
    url:'/prod-service/aliyun/oss/policy',
    method:'get', 
  })
}