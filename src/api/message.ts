import request from "@/utils/request";

//查询所有消息
export function getMessageList(params: any) {
  return request({
    url: "/chat-service/chat/messages",
    method: "get",
    params: params,
  });
}
