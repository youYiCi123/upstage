<template>
	<!-- 评论输入表单 -->
	<div class="form">
		<h3>
			发表评论
			<el-button class="m-small" size="small" type="primary" @click="resetParentCommentId()"
				v-show="parentCommentId !== -1">取消回复</el-button>
		</h3>
		<el-form :inline="true" :model="commentForm" ref="formRef" size="small">
			<el-input :class="'textarea'" type="textarea" :rows="5" v-model="commentForm.content" placeholder="评论千万条，友善第一条"
				maxlength="250" show-word-limit :validate-event="false"></el-input>
			<div class="el-form-item el-form-item--small emoji">
				<img src="https://cdn.naccl.top/blog/img/paopao/30.png" @click="showEmojiBox">
				<div class="mask" v-show="emojiShow" @click="hideEmojiBox"></div>
				<div class="emoji-box" v-show="emojiShow">
					<div class="emoji-title">
						<span>{{ activeEmojiTab === 0 ? 'tv_小电视' : activeEmojiTab === 1 ? '阿鲁' : '泡泡' }}</span>
					</div>
					<div class="emoji-wrap" v-show="activeEmojiTab === 0">
						<div class="emoji-list" v-for="(img, index) in tvMapper" :key="index"
							@click="insertEmoji(img.name)">
							<img :src="img.src" :title="img.name">
						</div>
					</div>
					<div class="emoji-wrap" v-show="activeEmojiTab === 1">
						<div class="emoji-list" v-for="(img, index) in aruMapper" :key="index"
							@click="insertEmoji(img.name)">
							<img :src="img.src" :title="img.name">
						</div>
					</div>
					<div class="emoji-wrap" v-show="activeEmojiTab === 2">
						<div class="emoji-list" v-for="(img, index) in paopaoMapper" :key="index"
							@click="insertEmoji(img.name)">
							<img :src="img.src" :title="img.name">
						</div>
					</div>
					<div class="emoji-tabs">
						<a class="tab-link" :class="{ 'on': activeEmojiTab === 0 }" @click="activeEmojiTab = 0">
							<img src="https://cdn.naccl.top/blog/img/tv/1.png">
						</a>
						<a class="tab-link" :class="{ 'on': activeEmojiTab === 1 }" @click="activeEmojiTab = 1">
							<img src="https://cdn.naccl.top/blog/img/aru/1.png">
						</a>
						<a class="tab-link" :class="{ 'on': activeEmojiTab === 2 }" @click="activeEmojiTab = 2">
							<img src="https://cdn.naccl.top/blog/img/paopao/1.png">
						</a>
					</div>
				</div>
			</div>
			<el-form-item style="float:right">
				<el-button type="primary" size="default"  @click="postForm">发表评论</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed,onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus';
import {submitComment } from "@/api/comment";
import tvMapper from '@/plugins/tvMapper.json'
import aruMapper from '@/plugins/aruMapper.json'
import paopaoMapper from '@/plugins/paopaoMapper.json'

const emojiShow = ref(false);
const activeEmojiTab = ref(0);
const textarea = ref<any>(null)
const start = ref(0);
const end = ref(0);

const formRef = ref<FormInstance>();

const props = defineProps({
	fileId: {
		type: String,
		default: -1
	},
	parentCommentId:{
		type: Number,
		default: -1
	}
})

const parentCommentId = ref(props.parentCommentId);
// const parentCommentId = computed(() => {
// 	return props.parentCommentId;
// })

const jumpId = computed(() => {
	return props.fileId;
})


const commentForm = reactive({
	content: ''
})

const emit = defineEmits(['getCommentList','setParentCommentId'])

onMounted(() => {
	textarea.value = document.querySelector('.el-form textarea')
})

function resetParentCommentId() {
	emit('setParentCommentId')
}

function showEmojiBox() {
	start.value = textarea.value.selectionStart
	end.value = textarea.value.selectionEnd
	textarea.value.focus()
	textarea.value.setSelectionRange(start.value, end.value)
	emojiShow.value = !emojiShow.value
}

function insertEmoji(name: any) {
	let str = commentForm.content
	commentForm.content = str.substring(0, start.value) + name + str.substring(end.value)
	start.value += name.length
	end.value = start.value
	textarea.value.focus()
	nextTick(() => {
		textarea.value.setSelectionRange(start.value, end.value)
	})
}

function hideEmojiBox() {
	emojiShow.value = false
	textarea.value.focus()
	textarea.value.setSelectionRange(start.value, end.value)
}

function postForm() {
	if (commentForm.content === '' || commentForm.content.length > 250) {
		ElNotification({
			title: '评论失败',
			message: '请正确填写评论',
			type: 'warning'
		})
	} else {
		submitCommentForm()
	}
}

function submitCommentForm() {
	submitComment({jumpId:jumpId.value,content:commentForm.content,parentCommentId:parentCommentId.value}).then((res: any) => {
		if (res.code === 200) {
			ElNotification({
				title: '评论成功',
				type: 'success'
			})
			commentForm.content = ''
			emit('setParentCommentId')
			emit('getCommentList')
		} else {
			ElNotification({
				title: '评论失败',
				message: res.msg,
				type: 'error'
			})
		}
	}).catch(() => {
		ElNotification({
			title: '评论失败',
			message: '异常错误',
			type: 'error'
		})
	})
}




</script>

<style >
.form {
	background: #fff;
	position: relative;
}

.form h3 {
	margin: 5px;
	font-weight: 500 !important;
}

.form .m-small {
	margin-left: 5px;
	padding: 4px 5px;
}

.el-form .textarea {
	margin-top: 5px;
	margin-bottom: 15px;
}

.el-form textarea {
	padding: 6px 8px;
}

.el-form textarea,
.el-form input {
	color: black;
}

.el-form .el-form-item__label {
	padding-right: 3px;
}

.emoji {
	margin-right: 5px;
	position: relative;
	user-select: none;
}

.emoji>img {
	cursor: pointer;
	transition: all 0.3s ease-in-out;
	-webkit-transition: all 0.3s ease-in-out;
	-moz-transition: all 0.3s ease-in-out;
	-o-transition: all 0.3s ease-in-out;
}

.emoji>img:hover {
	transform: rotate(360deg);
	-webkit-transform: rotate(360deg);
	-moz-transform: rotate(360deg);
	-o-transform: rotate(360deg);
}

.emoji-box {
	color: #222;
	overflow: visible;
	background: #fff;
	border: 1px solid #E5E9EF;
	box-shadow: 0 11px 12px 0 rgba(106, 115, 133, 0.3);
	border-radius: 8px;
	width: 340px;
	position: absolute;
	top: 40px;
	z-index: 100;
}

.emoji-box * {
	box-sizing: content-box;
}

.emoji-box .emoji-title {
	font-size: 12px;
	line-height: 16px;
	margin: 13px 15px 0;
	color: #757575;
}

.emoji-box .emoji-wrap {
	margin: 6px 11px 0 11px;
	height: 185px;
	overflow: auto;
	word-break: break-word;
}

.emoji-box .emoji-wrap .emoji-list {
	height: 33px;
	color: #111;
	border-radius: 4px;
	transition: background 0.2s;
	display: inline-block;
	outline: 0;
	cursor: pointer;
}

.emoji-box .emoji-wrap .emoji-list:hover {
	background-color: #ddd;
}

.emoji-box .emoji-wrap .emoji-list img {
	margin: 4px;
	width: 25px;
	height: 25px;
}

.emoji-box .emoji-tabs {
	position: relative;
	height: 36px;
	overflow: hidden;
	background-color: #f4f4f4;
	border-radius: 0 0 4px 4px;
}

.emoji-box .emoji-tabs .tab-link {
	cursor: pointer;
	float: left;
	padding: 7px 18px;
	width: 22px;
	height: 22px;
}

.emoji-box .emoji-tabs .tab-link.on {
	background-color: #fff;
}

.emoji-box .emoji-tabs .tab-link img {
	width: 22px;
}

.emoji-box .emoji-tabs .tab-link:hover {
	background: #e7e7e7;
}

.mask {
	pointer-events: auto;
	position: fixed;
	z-index: 99;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>