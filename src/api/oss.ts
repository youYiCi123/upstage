import request from '@/utils/request'
export function policy() {
  return request({
    url:'/prod-service/aliyun/oss/policy',
    method:'get', 
  })
}

export function getStsToken() {
  return request({
    url:'/prod-service/aliyun/oss/getStsToken',
    method:'get',
  })
}