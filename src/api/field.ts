import request from "@/utils/request";

export function queryField(id: any) {
  return request({
    url: "/business-service/field/queryContent/" + id,
    method: "get",
  });
}

export function createField(data: any) {
  return request({
    url: "/business-service/field/add",
    method: "post",
    data: data,
  });
}

export function updateField(data: any) {
  return request({
    url: "/business-service/field/update",
    method: "post",
    data: data,
  });
}

export function deleteField(id:any) {
  return request({
    url: '/business-service/field/delete/' + id,
    method: 'post'
  })
}

export function getFieldsBySearch(params:any) {
  return request({
    url: '/business-service/field/list',
    method: 'get',
    params: params
  })
}

export function getTempDetail(id: any) {
  return request({
    url: "/business-service/field/tempDetail/" + id,
    method: "get",
  });
}