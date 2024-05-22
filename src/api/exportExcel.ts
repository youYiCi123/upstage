import request from "@/utils/request";

export function importUserExcel(data: any) {
  return request({
    url: "/upstage-service/excel/importUser",
    method: "post",
    data: data,
  });
}

export function importCustomExcel(data: any) {
  return request({
    url: "/business-service/excel/importCustom",
    method: "post",
    data: data,
  });
}

export function importSupplierExcel(data: any) {
  return request({
    url: "/business-service/excel/importSupplier",
    method: "post",
    data: data,
  });
}

export function importCertificateExcel(data: any) {
  return request({
    url: "/business-service/excel/importCertificate",
    method: "post",
    data: data,
  });
}

