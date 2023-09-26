import request from "@/utils/request";


export function list(params: any) {
    return request({
      url: "/files",
      params: params,
      method: 'get'
    });
  }

  export function createFolder(data: any) {
    return request({
        url: '/file/folder',
        data: data,
        method: 'post'
    });
  }

  export function update(data: any) {
    return request({
        url: '/file',
        data: data,
        method: 'put'
    });
  }

  export function deleteFiles(data: any) {
    return request({
        url: '/file',
        data: data,
        method: 'delete'
    })
  }

  export function getFolderTree() {
    return request({
        url: '/file/folder/tree',
        method: 'get'
    })
  }

  export function transfer(data: any) {
    return request({
        url: '/file/transfer',
        data: data,
        method: 'post'
    })
  }

  export function copy(data: any) {
    return request({
        url: '/file/copy',
        data: data,
        method: 'post'
    })
  }

  export function search(params: any) {
    return request({
        url: '/file/search',
        params: params,
        method: 'get'
    })
  }

  export function getBreadcrumbs(params: any) {
    return request({
        url: '/file/breadcrumbs',
        params: params,
        method: 'get'
    })
  }

  export function detail(params: any) {
    return request({
        url: '/file',
        params: params,
        method: 'get'
    })
  }

  export function secUpload(data: any) {
    return request({
        url: '/file/sec-upload',
        data: data,
        method: 'post'
    })
  }

  export function merge(data: any) {
    return request({
        url: '/file/merge',
        data: data,
        method: 'post'
    })
  }

// let fileService = {
//     list: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/files',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     createFolder: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file/folder',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     update: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file',
//             data: data,
//             method: 'put'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     delete: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file',
//             data: data,
//             method: 'delete'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     getFolderTree: function (resolve:any, reject:any) {
//        request({
//             url: '/file/folder/tree',
//             params: {},
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     transfer: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file/transfer',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     copy: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file/copy',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     search: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file/search',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     getBreadcrumbs: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file/breadcrumbs',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     detail: function (params:any, resolve:any, reject:any) {
//        request({
//             url: '/file',
//             params: params,
//             method: 'get'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     secUpload: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file/sec-upload',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     },
//     merge: function (data:any, resolve:any, reject:any) {
//        request({
//             url: '/file/merge',
//             data: data,
//             method: 'post'
//         }).then(res => resolve(res)).catch(err => reject(err))
//     }
// }

// export default fileService