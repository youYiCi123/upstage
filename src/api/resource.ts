import request from '@/utils/request'

export function fetchAllResourceList() {
    return request({
      url: '/upstage-service/resource/listAll',
      method: 'get'
    })
  }