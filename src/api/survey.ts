import request from "@/utils/request";

export function submitSurvey(data: any) {
  return request({
    url: "/business-service/survey/submit",
    method: "post",
    data: data,
  });
}

export function getAllSurvey(params: any) {
  return request({
    url: "/business-service/survey/getSurveyBySearch",
    method: "get",
    params: params,
  });
}

//删除
export function deleteSurvey(id: any) {
  return request({
    url: "/business-service/survey/delete/" + id,
    method: "post",
  });
}
