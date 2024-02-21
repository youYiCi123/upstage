
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
  // return request.get(`${baseUrl}conditions.json`, { params: data })
  return axios.get("/static/conditions.json")
}
import axios from "axios";
/**
 * 获取审批数据
 * @param {*} data 
 * @returns 
 */
export function getWorkFlowData(data:any) {
  return axios.get("/static/data.json")
}

/**
 * 设置审批数据
 * @param {*} data 
 * @returns 
 */
export function setWorkFlowData(data:any) {
  return request.post(`${baseUrl}`, data)
}