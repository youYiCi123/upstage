import request from "@/utils/request";

//添加部门
export function createDep(data: any) {
  return request({
    url: "/upstage-service/dep/add",
    method: "post",
    data: data,
  });
}

//查询所有部门
export function getAllDep(params: any) {
  return request({
    url: "/upstage-service/dep/allInfo",
    method: "get",
    params: params,
  });
}

//部门人员信息
export function depDetails(params: any) {
  return request({
    url: "/upstage-service/dep/details",
    method: "get",
    params: params,
  });
}

//修改部门
export function updateDep(id: any, data: any) {
  return request({
    url: "/upstage-service/dep/update/" + id,
    method: "post",
    data: data,
  });
}

//删除部门
export function deleteDep(id: any) {
  return request({
    url: "/upstage-service/dep/delete/" + id,
    method: "post",
  });
}

//批量删除部门
export function handleBatchDelete(data:any) {
  return request({
    url: '/upstage-service/dep/deleteBatch',
    method: 'post',
    data: data
  })
}

//查询所有部门及人员的级联关系
export function fetchListWithChildren() {
  return request({
    url: "/upstage-service/dep/selectUserRelation",
    method: "get",
  });
}

export function getDepIdToName() {
  return request({
    url: "/upstage-service/dep/getDepIdToName",
    method: "get",
  });
}
