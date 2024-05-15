
import request from "@/utils/request";
let baseUrl = 'http://localhost:8079/'

/**
 * 获取条件字段
 * @param {*} data 
 * @returns 
 */
// export function getConditions(data:any) {
//   // return request.get(`${baseUrl}conditions.json`, { params: data })
//   return axios.get("/static/conditions.json")
// }
export function getConditions(params: any) {
  return request({
    url:'/business-service/process/getAllProcessConditions',
    method:'get',
    params: params,
  })
}

import axios from "axios";

/**
 * 获取审批数据
 * @param {*} data 
 * @returns 
 */
export function getWorkFlowData(id:any) {
  return request({
    url:'/business-service/process/queryDetailContent/'+id,
    method:'get',
  })
}

// export function getWorkFlowData(data:any) {
//   return axios.get("/static/data.json")
// }

/**
 * 设置审批数据
 * @param {*} data 
 * @returns 
 */
export function setWorkFlowData(data:any) {
  return request.post(`${baseUrl}`, data)
}