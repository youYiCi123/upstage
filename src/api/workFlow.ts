
import request from "@/utils/request";
let baseUrl = 'http://localhost:8079/'

/**
 * 获取角色
 * @param {*} data 
 * @returns 
 */
export function getRoles(data:any) {
  return request.get(`${baseUrl}roles.json`, { params: data })
}

/**
 * 获取部门
 * @param {*} data 
 * @returns 
 */
export function getDepartments(data:any) {
  return request.get(`${baseUrl}departments.json`, { params: data })
}

/**
 * 获取职员
 * @param {*} data 
 * @returns 
 */
export function getEmployees(data:any) {
  return request.get(`${baseUrl}employees.json`, { params: data })
}
/**
 * 获取条件字段
 * @param {*} data 
 * @returns 
 */
export function getConditions(data:any) {
  return request.get(`${baseUrl}conditions.json`, { params: data })
}
import axios from "axios";
/**
 * 获取审批数据
 * @param {*} data 
 * @returns 
 */
// export function getWorkFlowData(id:any) {
//   return request({
//     url:'/static/data.json',
//     method:'get',
//   })
// }

export function getWorkFlowData(data:any) {
  return axios.get("/static/data.json")
}

// export function getWorkFlowData(data:any) {
  // console.log('155115')
  // return request.get(`${baseUrl}data.json`, { params: data })
//   return {
//     "code": "200",
//     "msg": "success",
//     "data": {
//         "tableId": 1,
//         "workFlowDef": {
//             "name": "合同审批"
//         },
//         "directorMaxLevel": 4,
//         "flowPermission": [],
//         "nodeConfig": {
//             "nodeName": "发起人",
//             "type": 0,
//             "priorityLevel": "",
//             "settype": "",
//             "selectMode": "",
//             "selectRange": "",
//             "directorLevel": "",
//             "examineMode": "",
//             "noHanderAction": "",
//             "examineEndDirectorLevel": "",
//             "ccSelfSelectFlag": "",
//             "conditionList": [],
//             "nodeUserList": [],
//             "childNode": {
//                 "nodeName": "审核人",
//                 "error": false,
//                 "type": 1,
//                 "settype": 2,
//                 "selectMode": 0,
//                 "selectRange": 0,
//                 "directorLevel": 1,
//                 "examineMode": 1,
//                 "noHanderAction": 2,
//                 "examineEndDirectorLevel": 0,
//                 "childNode": {
//                     "nodeName": "路由",
//                     "type": 4,
//                     "priorityLevel": 1,
//                     "settype": 1,
//                     "selectMode": 0,
//                     "selectRange": 0,
//                     "directorLevel": 1,
//                     "examineMode": 1,
//                     "noHanderAction": 2,
//                     "examineEndDirectorLevel": 1,
//                     "ccSelfSelectFlag": 1,
//                     "conditionList": [],
//                     "nodeUserList": [],
//                     "childNode": {
//                         "nodeName": "抄送人",
//                         "type": 2,
//                         "ccSelfSelectFlag": 1,
//                         "childNode": null,
//                         "nodeUserList": [],
//                         "error": false
//                     },
//                     "conditionNodes": [{
//                         "nodeName": "条件1",
//                         "type": 3,
//                         "priorityLevel": 1,
//                         "settype": 1,
//                         "selectMode": 0,
//                         "selectRange": 0,
//                         "directorLevel": 1,
//                         "examineMode": 1,
//                         "noHanderAction": 2,
//                         "examineEndDirectorLevel": 1,
//                         "ccSelfSelectFlag": 1,
//                         "conditionList": [{
//                             "columnId": 0,
//                             "type": 1,
//                             "conditionEn": "",
//                             "conditionCn": "",
//                             "optType": "",
//                             "zdy1": "",
//                             "zdy2": "",
//                             "opt1": "",
//                             "opt2": "",
//                             "columnDbname": "",
//                             "columnType": "",
//                             "showType": "",
//                             "showName": "",
//                             "fixedDownBoxValue": ""
//                         }],
//                         "nodeUserList": [{
//                             "targetId": 85,
//                             "type": 1,
//                             "name": "天旭"
//                         }],
//                         "childNode": {
//                             "nodeName": "审核人",
//                             "type": 1,
//                             "priorityLevel": 1,
//                             "settype": 1,
//                             "selectMode": 0,
//                             "selectRange": 0,
//                             "directorLevel": 1,
//                             "examineMode": 1,
//                             "noHanderAction": 2,
//                             "examineEndDirectorLevel": 1,
//                             "ccSelfSelectFlag": 1,
//                             "conditionList": [],
//                             "nodeUserList": [{
//                                 "targetId": 2515744,
//                                 "type": 1,
//                                 "name": "哈哈哈哈"
//                             }],
//                             "childNode": null,
//                             "conditionNodes": [],
//                             "error": false
//                         },
//                         "conditionNodes": [],
//                         "error": false
//                     }, {
//                         "nodeName": "条件2",
//                         "type": 3,
//                         "priorityLevel": 2,
//                         "settype": 1,
//                         "selectMode": 0,
//                         "selectRange": 0,
//                         "directorLevel": 1,
//                         "examineMode": 1,
//                         "noHanderAction": 2,
//                         "examineEndDirectorLevel": 1,
//                         "ccSelfSelectFlag": 1,
//                         "conditionList": [],
//                         "nodeUserList": [],
//                         "childNode": null,
//                         "conditionNodes": [],
//                         "error": false
//                     }]
//                 },
//                 "nodeUserList": []
//             },
//             "conditionNodes": []
//         }
//     }
// }
// }

// export function getWorkFlowData(data: any) {
//   return request({
//     url: "/business-service/workFlow/getWorkFlowData",
//     method: "get",
//     data: data,
//   });
// }
/**
 * 设置审批数据
 * @param {*} data 
 * @returns 
 */
export function setWorkFlowData(data:any) {
  return request.post(`${baseUrl}`, data)
}