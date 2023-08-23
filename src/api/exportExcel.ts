import request from "@/utils/request";

export function importUserExcel(data: any) {
  return request({
    url: "/upstage-service/excel/importUser",
    method: "post",
    data: data,
  });
}
export function downloadExcel() {
  return request({
    url: "/upstage-service/excel/download",
    method: "get",
    responseType: 'blob',
  });
}
