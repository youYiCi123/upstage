import request from '@/utils/request'
//添加培训
export function createNews(data:any) {
    return request({
      url: '/business-service/news/add',
      method: 'post',
      data: data
    })
  }
  //添加新闻内容，图片，文档类
  export function addNewsContent(data:any) {
    return request({
      url: '/business-service/news/addContent',
      method: 'post',
      data: data
    })
  }
  //查询新闻内容、图片
  export function queryNewsContent(id:any) {
    return request({
      url: '/business-service/news/queryContent/'+id,
      method: 'get',
    })
  }
//修改新闻内容，图片，文档类
export function updateNewsContent(data:any) {
  return request({
    url:'/business-service/news/updateContent',
    method:'post',
    data:data
  })
}

export function getDashboard() {
  return request({
    url: '/business-service/news/getDashboard',
    method: 'get'
  })
}

export function getAllNews(params:any) {
  return request({
    url: '/business-service/news/getNewsBySearch',
    method: 'get',
    params: params
  })
}
//修改部门信息
export function updateNews(id:any,data:any) {
  return request({
    url:'/business-service/news/update/'+id,
    method:'post',
    data:data
  })
}

//查询某部门信息信息
export function getNewsInfo(id:any) {
  return request({
    url:'/business-service/news//queryNewsContent/'+id,
    method:'get',
  })
}

// //查询某部门详细信息
// export function getNewsInfoDetail(id:any) {
//   return request({
//     url:'/news/getNewsInfo/'+id,
//     method:'get',
//   })
// }

//删除
export function deleteNews(id:any) {
  return request({
    url: '/business-service/news/delete/' + id,
    method: 'post'
  })
}
//批量删除
export function handleBatchDelete(data:any) {
  return request({
    url: '/business-service/news/handleBatchDelete',
    method: 'post',
    data: data
  })
}
