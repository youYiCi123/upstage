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

export function update(data: any) {
  return request({
    url: "/file-service/file",
    data: data,
    method: "put",
  });
}

export function deleteFiles(data: any) {
  return request({
    url: "/file-service/file",
    data: data,
    method: "delete",
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

//     list: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/files',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     createFolder: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/folder',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     update: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file',
//             data: data,
//             method: 'put'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     delete: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file',
//             data: data,
//             method: 'delete'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     getFolderTree: function (resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/folder/tree',
//             params: {},
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     transfer: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/transfer',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     copy: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/copy',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     search: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/search',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     getBreadcrumbs: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/breadcrumbs',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     detail: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     secUpload: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/sec-upload',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     merge: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file-service/file/merge',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     }
// }

// export default fileService
