import request from "@/utils/request";

export function queryCertificate(id: any) {
  return request({
    url: "/business-service/certificate/queryContent/" + id,
    method: "get",
  });
}

export function getAllCertificates(params: any) {
  return request({
    url: "/business-service/certificate/getListBySearch",
    method: "get",
    params: params,
  });
}

export function queryCertificateRemind() {
  return request({
    url: "/business-service/certificate/getRemind",
    method: "get",
  });
}

//设置证书提醒人内容
export function setCertificateRemind(data: any){
  return request({
    url: "/business-service/certificate/setRemind",
    method: "post",
    data: data,
})
}
//添加客户内容
export function addCertificate(data: any) {
    return request({
      url: "/business-service/certificate/add",
      method: "post",
      data: data,
    });
  }
  
  //修改客户内容
  export function updateCertificate(data: any) {
    return request({
      url: "/business-service/certificate/update",
      method: "post",
      data: data,
    });
  }
  
  //删除
  export function deleteCertificate(id:any) {
    return request({
      url: '/business-service/certificate/delete/' + id,
      method: 'post'
    })
  }
  //批量删除
  export function handleBatchDelete(data:any) {
    return request({
      url: '/business-service/certificate/handleBatchDelete',
      method: 'post',
      data: data
    })
  }
