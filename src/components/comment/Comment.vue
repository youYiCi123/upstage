<template>
	<div class="ui bottom teal attached segment threaded comments">
		<CommentForm :parentCommentId="parentCommentId" :fileId="props.fileId" v-if="parentCommentId === -1" @getCommentList="getList" @setParentCommentId="resetParentCommentId"/>
		<h3 class="ui dividing header">评论区 | 共 {{ total }} 条评论</h3>
		<h3 class="ui header" v-if="total === 0">快来抢沙发！</h3>
		<div class="comment" v-for="comment in commentList" :key="comment.id">
			<span class="anchor" :id="`comment-${comment.id}`"></span>
			<a class="ui image avatar">
				<el-avatar v-if="comment.avatar" shape="square" :src="comment.avatar"></el-avatar>
				<el-avatar v-else shape="square"><span v-html="avararFormat(comment.nickname)"></span> </el-avatar>
			</a>
			<div class="content">
				<a class="nickname" target="_blank" rel="external nofollow noopener">{{ comment.nickname }}</a>
				<div class="ui red left label" v-if="comment.adminComment">创建人</div>
				<div class="metadata">
					<strong class="date"><span v-html="timeFormat(comment.createTime)"></span></strong>
				</div>
				<el-button size="small" type="danger" @click="deleteComment(comment.id)" v-if="comment.mimeComment">删除</el-button>
				<el-button size="small" type="primary" @click="setReply(comment.id)">回复</el-button>
				<div class="text" v-html="comment.content"></div>
			</div>
			<div class="comments" v-if="comment.replyComments.length > 0">
				<div class="comment" v-for="reply in comment.replyComments" :key="reply.id">
					<span class="anchor" :id="`comment-${reply.id}`"></span>
					<a class="ui image avatar">
						<!-- <img :src="reply.avatar"> -->
						<el-avatar v-if="reply.avatar" shape="square" :src="reply.avatar"></el-avatar>
						<el-avatar v-else shape="square"><span v-html="avararFormat(reply.nickname)"></span> </el-avatar>
					</a>	
					<div class="content">
						<a class="nickname" target="_blank" rel="external nofollow noopener">{{ reply.nickname }}</a>
						<div class="ui red left label" v-if="reply.adminComment">创建人
						</div>
						<div class="metadata">
							<strong class="date"><span v-html="timeFormat(comment.createTime)"></span></strong>
						</div>
						<el-button size="small" type="danger" @click="deleteComment(reply.id)" v-if="reply.mimeComment">删除</el-button>
						<el-button size="small" type="primary" @click="setReply(reply.id)">回复</el-button>
						<div class="text">
							<a :href="`#comment-${reply.parentCommentId}`">@{{ reply.parentCommentNickname }}</a>
							<div v-html="reply.content"></div>
						</div>
					</div>
					<CommentForm :parentCommentId="parentCommentId" :fileId="props.fileId" v-if="parentCommentId === reply.id" @getCommentList="getList" @setParentCommentId="resetParentCommentId"/>
				</div>
			</div>
			<div class="border"></div>
			<CommentForm :parentCommentId="parentCommentId" :fileId="props.fileId" v-if="parentCommentId === comment.id" @getCommentList="getList" @setParentCommentId="resetParentCommentId"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElNotification,ElMessage, ElMessageBox } from 'element-plus';
import CommentForm from "./CommentForm.vue";
import dayjs from "dayjs";
import sanitizeHtml from 'sanitize-html'
import tvMapper from '@/plugins/tvMapper.json'
import aruMapper from '@/plugins/aruMapper.json'
import paopaoMapper from '@/plugins/paopaoMapper.json'
import { getCommentListByQuery,deleteCommentById } from "@/api/comment";

const parentCommentId = ref(-1);
const commentList = ref<any[]>([])
const total = ref(0);

const props = defineProps({
	fileId: {
		type: String,
		default: -1
	},
})

const jumpId = computed(() => {
	return props.fileId;
})

function timeFormat(time: string) {
	if (time == null || time === '') {
		return 'N/A';
	}
	let date = new Date(time);
	return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

function avararFormat(nickname: string) {
	return nickname.slice(-2)
}

function setReply(id: any) {
	parentCommentId.value = id
}

function deleteComment(id: any){
	ElMessageBox.confirm('是否要删除该评论?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCommentById(id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
      getList();
    });
  }).catch(err => {
    console.log(err)
  });
}

function resetParentCommentId(){
	parentCommentId.value = -1;
}
getList()
function getList() {
	getCommentListByQuery({
		page: 0,
		jumpId: jumpId.value,
	}).then(res => {
		if (res.code == 200) {
			
			// let sanitizeHtmlConfig = {
			// 	allowedTags: [],
			// 	allowedAttributes: false,
			// 	disallowedTagsMode: 'recursiveEscape'
			// }
			res.data.pageCommentList.forEach((comment: any) => {
				//转义评论中的html
				comment.content = sanitizeHtml(comment.content, {
					allowedTags: [],
					allowedAttributes: false,
					disallowedTagsMode: 'recursiveEscape'
				})
				//查找评论中是否有表情
				if (comment.content.indexOf('@[') != -1) {
					convertEmoji(comment)
				}
				comment.replyComments.forEach((comment: any) => {
					//转义评论中的html
					comment.content = sanitizeHtml(comment.content, {
						allowedTags: [],
						allowedAttributes: false,
						disallowedTagsMode: 'recursiveEscape'
					})
					//查找评论中是否有表情
					if (comment.content.indexOf('@[') != -1) {
						convertEmoji(comment)
					}
				})
			})
			total.value = res.data.commentCount
			commentList.value = res.data.pageCommentList
		}
	}).catch(() => {
		ElNotification({
			title: '获取评论失败',
			message: '异常错误',
			type: 'error'
		})
	})
}

function replaceEmoji(comment: any, emoji: any) {
	comment.content = comment.content.replace(new RegExp(emoji.reg, 'g'), `<img src="${emoji.src}">`)
}

function convertEmoji(comment: any) {
	tvMapper.forEach(emoji => {
		replaceEmoji(comment, emoji)
	})
	aruMapper.forEach(emoji => {
		replaceEmoji(comment, emoji)
	})
	paopaoMapper.forEach(emoji => {
		replaceEmoji(comment, emoji)
	})
}

watch(jumpId, () => {
	getList()
})
</script>

<style scoped  lang="scss" >
.comments+.border {
	position: absolute;
	left: 34px;
	top: 47px;
	bottom: 0;
	border-style: solid;
	border-width: 0 0 0 1px;
	border-color: #e0e0e0;
}

.ui.threaded.comments .comment .comments {
	box-shadow: none;
	margin-top: -2em;
}

.comment {
	padding-right: 1em !important;
	padding-left: 1em !important;
}

.nickname {
	font-weight: bolder;
	color: #000;
}

.comment .el-button {
	margin-left: 5px;
	padding: 4px 5px;
}

.comment>.anchor {
	position: absolute;
	left: 0;
	top: -48px;
}

.comments .comment:first-child {
	margin-top: 0 !important;
}

.comment .comments .comment {
	box-shadow: 0 0 5px rgb(0, 0, 0, 0.1);
	border-radius: 5px;
	margin-top: 12px;
	padding-top: 10px !important;
	padding-bottom: 10px !important;
}

.comment .comments .comment>.anchor {
	top: -55px;
}

.ui.comments .comment .avatar {
	width: 40px !important;
	margin: 0;
}

.ui.comments .comment .text {
	white-space: pre-wrap !important;
	line-height: 1.5;
}

.ui.comments .comment .text a {
	cursor: pointer;
	margin-right: 8px;
	font-weight: bolder;
	color: rgba(0, 0, 0, .87);
}

.ui.comments .comment .text div {
	display: inline;
}

.label {
	cursor: default;
	padding: 4px 6px !important;
	font-weight: 500 !important;
}

.comment .form {
	margin-top: 20px;
}
</style>