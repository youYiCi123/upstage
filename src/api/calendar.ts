import request from "@/utils/request";

export function addCalendar(data: any) {
  return request({
    url: "/business-service/calendar/add",
    method: "POST",
    data: data,
  });
}

export function updateCalendar(data: any) {
  return request({
    url: "/business-service/calendar/update",
    method: "POST",
    data: data,
  });
}

//删除
export function deleteCalendar(id: any) {
  return request({
    url: "/business-service/calendar/delete/" + id,
    method: "post",
  });
}

//查询某部门信息信息
export function getCalendarById(id: any) {
  return request({
    url: "/business-service/calendar/query/" + id,
    method: "get",
  });
}
