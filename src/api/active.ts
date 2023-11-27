import request from "@/utils/request";

export function submitActive(data: any) {
  return request({
    url: "/business-service/active/submit",
    method: "post",
    data: data,
  });
}

export function getAllActive(params: any) {
  return request({
    url: "/business-service/active/getActiveBySearch",
    method: "get",
    params: params,
  });
}

//删除
export function deleteActive(id: any) {
  return request({
    url: "/business-service/active/delete/" + id,
    method: "post",
  });
}
