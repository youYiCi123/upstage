import request from "@/utils/request";

export function submitActive(data: any) {
  return request({
    url: "/business-service/active/submit",
    method: "post",
    data: data,
  });
}
