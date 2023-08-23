import request from '@/utils/request'

export function listAllCate() {
    return request({
      url: '/upstage-service/resourceCategory/listAll',
      method: 'get'
    })
  }