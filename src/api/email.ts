import request from '@/utils/request'

export function get() {
  return request({
    url: '/business-service/email',
    method: 'get'
  })
}

export function update(data:any) {
  return request({
    url: '/business-service/email',
    data,
    method: 'put'
  })
}

export function sendEmail(data:any) {
  return request({
    url: '/business-service/email',
    data,
    method: 'post'
  })
}
