import request from '@/utils/request'

export function fetchList(params:any) {
    return request({
      url: '/upstage-service/online/onlineUserList',
      method: 'get',
      params: params
    })
  }

  