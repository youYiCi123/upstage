import request from "@/utils/request";

export function submitSurvey(data: any) {
    return request({
      url: "/business-service/survey/submit",
      method: "post",
      data: data,
    });
  }
