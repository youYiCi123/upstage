import request from "@/utils/request";

export function getCountByUserId() {
    return request({
        url: "/file-service/message/getCountByUserId",
        method: "get"
    });
}

export function selectByUserId(params: any) {
    return request({
        url: "/file-service/message/selectByUserId",
        method: "get",
        params: params,
    });
}