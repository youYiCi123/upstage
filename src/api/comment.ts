import request from '@/utils/request'

export function getCommentListByQuery(params:any) {
	return request({
		url: '/file-service/comment/getComments',
		method: 'GET',
		params:params
	})
}

export function submitComment(data:any) {
	return request({
		url: '/file-service/comment/postComment',
		method: 'POST',
		data: data
	})
}

//删除评论
export function deleteCommentById(id: any) {
	return request({
	  url: "/file-service/comment/delete/" + id,
	  method: "post",
	});
  }