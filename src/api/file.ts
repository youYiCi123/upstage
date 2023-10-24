import request from "@/utils/request";

export function filesForTable(params: any) {
  return request({
    url: "/file-service/filesForTable",
    params: params,
    method: "get",
  });
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

export function deleteFiles(data: any) {
  return request({
    url: "/file-service/file/delete",
    data: data,
    method: "post",
  });
}

//批量删除文件 真實
export function handleBatchDelete(data:any) {
  return request({
    url: '/file-service/file/deleteBatch',
    method: 'post',
    data: data
  })
}

//批量审核文件
export function handleBatchPass(data:any) {
  return request({
    url: '/file-service/file/passeBatch',
    method: 'post',
    data: data
  })
}

export function deleteFile(id: any) {
  return request({
    url: "/file-service/file/deleteFile/" + id,
    method: "get",
  });
}

export function passFile(id: any) {
  return request({
    url: "/file-service/file/passFile/" + id,
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
    url: "/file-service/file/sec-upload",
    data: data,
    method: "post",
  });
}

export function merge(data: any) {
  return request({
    url: "/file-service/file/merge",
    data: data,
    method: "post",
  });
}