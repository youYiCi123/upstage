import request from "@/utils/request";

export function getUnReadCount() {
    return request({
        url: "/file-service/message/getUnReadCount",
        method: "get"
    });
}

export function selectMessage(params: any) {
    return request({
        url: "/file-service/message/selectMessage",
        method: "get",
        params: params,
    });
}

export function readSingleMessage(params: any) {
    return request({
        url: "/file-service/message/readSingleMessage",
        method: "get",
        params: params,
    });
}

export function readAll(params: any) {
    return request({
        url: "/file-service/message/readAll",
        method: "get",
        params: params,
    });
}

export function deleteReadAll(params: any) {
    return request({
        url: "/file-service/message/deleteReadAll",
        method: "get",
        params: params,
    });
}