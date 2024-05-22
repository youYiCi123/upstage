import request from "@/utils/request";

export function getAllProcess(params: any) {
  return request({
    url: "/business-service/process/getProcessBySearch",
    method: "get",
    params: params,
  });
}

//添加流程
export function createProcess(data: any) {
  return request({
    url: "/business-service/process/add",
    method: "post",
    data: data,
  });
}

//修改流程
export function updateProcess(id: any, data: any) {
  return request({
    url: "/business-service/process/update/" + id,
    method: "post",
    data: data,
  });
}

//删除
export function deleteProcess(id: any) {
  return request({
    url: "/business-service/process/delete/" + id,
    method: "post",
  });
}
