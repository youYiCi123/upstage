import request from "@/utils/request";

export function fetchList(params: any) {
  return request({
    url: "/business-service/temp/list",
    method: "get",
    params: params,
  });
}

export function getTempIdToName() {
  return request({
    url: "/business-service/temp/getTempIdToName",
    method: "get"
  });
}

export function getSurveyIdToName() {
  return request({
    url: "/business-service/temp/getSurveyIdToName",
    method: "get"
  });
}

export function getActiveIdToName() {
  return request({
    url: "/business-service/temp/getActiveIdToName",
    method: "get"
  });
}

export function createTemplate(data: any) {
  return request({
    url: "/business-service/temp/add",
    method: "post",
    data: data,
  });
}

export function updateTemplate(data: any) {
  return request({
    url: "/business-service/temp/update",
    method: "post",
    data: data,
  });
}

//删除
export function deleteTemplate(id:any) {
  return request({
    url: '/business-service/temp/delete/' + id,
    method: 'post'
  })
}
