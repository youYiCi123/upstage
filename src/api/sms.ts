import request from '@/utils/request'

export function sendSms(params: any) {
    return request({
      url: '/business-service/sms/send',
      params: params,
      method: 'post'
    })
  }