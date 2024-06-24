import request from "@/utils/request";

export function filesForTable(params: any) {
  return request({
    url: "/file-service/filesForTable",
    params: params,
    method: "get",
  });
}

export function searchForName(params: any) {
  return request({
    url: "/file-service/searchForName",
    params: params,
    method: "get",
  });
}

//获取回收站文件
export function filesFromRecycleBin(params: any) {
  return request({
    url: "/file-service/filesFromRecycleBin",
    params: params,
    method: "get",
  });
}

export function getAllFileLog(params:any) {
  return request({
    url: '/file-service/filesOperateLogs/select',
    method: 'get',
    params: params
  })
}

export function deleteFileLog(id:any) {
  return request({
    url: '/file-service/filesOperateLogs/delete/' + id,
    method: 'post'
  })
}

export function handleBatchDeleteLog(data:any) {
  return request({
    url: '/file-service/filesOperateLogs/deleteBatch',
    method: 'post',
    data: data
  })
}

export function list(params: any) {
  return request({
    url: "/file-service/files",
    params: params,
    method: "get",
  });
}

export function createFolder(data: any) {
  return request({
    url: "/file-service/file/folder",
    data: data,
    method: "post",
  });
}

/**
 * 文件基础设置（水印）
 */
export function saveSet(data: any) {
  return request({
    url: "/file-service/file/saveSet",
    data: data,
    method: "post",
  });
}

/**
 * 修改文件名
 */
export function updateFilename(data: any) {
  return request({
    url: "/file-service/file/updateFilename",
    data: data,
    method: "post",
  });
}

export function deleteFiles(params: any) {
  return request({
    url: "/file-service/file/delete",
    params: params,
    method: "post",
  });
}

//批量删除文件 审核
export function handleBatchDelete(params:any) {
  return request({
    url: '/file-service/file/delete/batch',
    method: 'post',
    params: params
  })
}

//批量审核文件
export function handleBatchPass(data:any) {
  return request({
    url: '/file-service/file/pass/batch',
    method: 'post',
    data: data
  })
}

export function deleteFile(params: any) {
  return request({
    url: "/file-service/file/delete/fileById",
    method: "post",
    params:params
  });
}
//删除文件--回收站页面
export function deleteRecycleFileById(id: any) {
  return request({
    url: "/file-service/file/deleteRecycle/fileById/" + id,
    method: "get",
  });
}
//批量删除文件 --回收站页面
export function deleteRecycleBatch(data:any) {
  return request({
    url: '/file-service/file/deleteRecycle/batch',
    method: 'post',
    data: data
  })
}

//恢复文件--回收站页面
export function recoveryFile(id: any) {
  return request({
    url: "/file-service/file/recovery/fileById/" + id,
    method: "get",
  });
}

//批量恢复文件 --回收站页面
export function recoveryBatch(data:any) {
  return request({
    url: '/file-service/file/recovery/batch',
    method: 'post',
    data: data
  })
}

export function passFile(id: any) {
  return request({
    url: "/file-service/file/pass/fileById/" + id,
    method: "get",
  });
}

export function getFolderTree(params: any) {
  return request({
    url: "/file-service/file/folder/tree",
    params: params,
    method: "get",
  });
}

export function getTeamUser(params: any) {
  return request({
    url: "/file-service/file/required/getTeamUser",
    params: params,
    method: "get",
  });
}

export function updateTeamUser(params: any) {
  return request({
    url: "/file-service/file/required/updateTeamUser",
    params: params,
    method: "get",
  });
}

export function getNotice(params: any) {
  return request({
    url: "/file-service/file/required/getNotice",
    params: params,
    method: "get",
  });
}
export function editNotice(params: any) {
  return request({
    url: "/file-service/file/required/editNotice",
    params: params,
    method: "post",
  });
}



export function transfer(data: any) {
  return request({
    url: "/file-service/file/transfer",
    data: data,
    method: "post",
  });
}

export function copy(data: any) {
  return request({
    url: "/file-service/file/copy",
    data: data,
    method: "post",
  });
}

//todo 缓存搜索内容
export function search(params: any) {
  return request({
    url: "/file-service/file/search",
    params: params,
    method: "get",
  });
}

export function getBreadcrumbs(params: any) {
  return request({
    url: "/file-service/file/breadcrumbs",
    params: params,
    method: "get",
  });
}

export function detail(params: any) {
  return request({
    url: "/file-service/file",
    params: params,
    method: "get",
  });
}

export function secUpload(data: any) {
  return request({
    url: "/file-service/file/upload/sec-upload",
    data: data,
    method: "post",
  });
}

export function merge(data: any) {
  return request({
    url: "/file-service/file/upload/merge",
    data: data,
    method: "post",
  });
}

export function getMyUploadFileStatus(params: any) {
  return request({
    url: "/file-service/myUploadFileStatus/select",
    params: params,
    method: "get",
  });
}

export function depToEnterprise(params: any) {
  return request({
    url: "/file-service/depToEnterprise",
    params: params,
    method: "get",
  });
}
