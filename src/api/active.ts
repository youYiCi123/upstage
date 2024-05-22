import request from "@/utils/request";

export function submitActive(data: any) {
  return request({
    url: "/business-service/active/submit",
    method: "post",
    data: data,
  });
}
//获取用户已经填写好的活动评估
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
