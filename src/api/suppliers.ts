import request from "@/utils/request";

export function getSupplierList(params: any) {
    return request({
      url: "/business-service/supplier/getSupplierBySearch",
      method: "get",
      params: params,
    });
  }
  
  //获取客户详细信息
  export function querySupplierContent(id: any) {
    return request({
      url: "/business-service/supplier/querySupplierContent/" + id,
      method: "get",
    });
  }
  
  //添加客户内容
  export function addSupplierContent(data: any) {
    return request({
      url: "/business-service/supplier/addSupplier",
      method: "post",
      data: data,
    });
  }
  
  //修改客户内容
  export function updateSupplierContent(data: any) {
    return request({
      url: "/business-service/supplier/updateSupplier",
      method: "post",
      data: data,
    });
  }
  
  //删除
  export function deleteSupplier(id:any) {
    return request({
      url: '/business-service/supplier/delete/' + id,
      method: 'post'
    })
  }
  //批量删除
  export function handleBatchDelete(data:any) {
    return request({
      url: '/business-service/supplier/handleBatchDelete',
      method: 'post',
      data: data
    })
  }