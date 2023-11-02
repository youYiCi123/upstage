import request from "@/utils/request";

export function getCustomList(params: any) {
  return request({
    url: "/business-service/custom/getCustomBySearch",
    method: "get",
    params: params,
  });
}

//获取客户详细信息
export function queryCustomContent(id: any) {
  return request({
    url: "/business-service/custom/queryContent/" + id,
    method: "get",
  });
}

//添加客户内容
export function addCustomContent(data: any) {
  return request({
    url: "/business-service/custom/addCustom",
    method: "post",
    data: data,
  });
}

//修改客户内容
export function updateCustomContent(data: any) {
  return request({
    url: "/business-service/custom/updateCustom",
    method: "post",
    data: data,
  });
}

//删除
export function deleteCustom(id:any) {
  return request({
    url: '/business-service/custom/delete/' + id,
    method: 'post'
  })
}
//批量删除
export function handleBatchDelete(data:any) {
  return request({
    url: '/business-service/custom/handleBatchDelete',
    method: 'post',
    data: data
  })
}
