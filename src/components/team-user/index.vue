<template>
	<div class="whole">
		<div class="team-title">小组人员</div>
		<el-divider />
		<el-row>
			<el-col :span="4" class="text-center" v-for="(item, index)  in users">
				<div @mouseenter="hoverIndex = index" @mouseleave="hoverIndex = -1">
					<el-avatar v-if="hoverIndex === index" shape="square" size="large" @click="delUser(index)">
						<el-icon :size="20">
							<Delete />
						</el-icon>
					</el-avatar>
					<template v-else>
						<el-avatar v-if="item.icon" shape="square" size="large" :src="item.icon">
						</el-avatar>
						<el-avatar v-else shape="square" size="large">
							<span v-html="avararFormat(item.nickName)"></span>
						</el-avatar>
					</template>
					<div class="name">{{ item.nickName }}</div>
				</div>
			</el-col>
			<el-col :span="4" class="text-center">
				<el-avatar shape="square" size="large" @click="addUser">
					<el-icon :size="20">
						<Plus />
					</el-icon>
				</el-avatar>
			</el-col>
		</el-row>
		<el-dialog title="添加成员" v-model="addDialogVisible" width="40%" :append-to-body=true :modal-append-to-body=false
			:center=true>
			<div>
				<el-form label-width="140px">
					<el-form-item label="选择人员：">
						<el-cascader clearable v-model="selectedPerson" :options="personOptions" style="width: 250px"
							:props="cascaderProps">
						</el-cascader>
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</template>
		</el-dialog>
		<el-dialog title="小组重命名" v-model="renameDialogVisible" width="30%" @opened="focusInput()" :append-to-body=true
			:modal-append-to-body=false :center=true>
			<div>
				<el-form label-width="100px" :rules="renameRules" ref="renameForm" :model="renameFormData" status-icon
					@submit.native.prevent>
					<el-form-item label="小组名称" prop="filename">
						<el-input type="text" ref="filenameRef" @keyup.enter.native="doRenameFile(renameForm)"
							v-model="renameFormData.filename" autocomplete="off" />
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<el-button @click="renameDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="doRenameFile(renameForm)">确 定</el-button>
			</template>
		</el-dialog>
		<div class="team-bottom">
			<div class="button-group">
				<el-button type="success" size="large" plain @click="renameTeam">更名</el-button>
				<el-button type="danger" size="large" plain @click="delTeam">解散</el-button>
			</div>

		</div>
	</div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchListWithChildren } from '@/api/dep';
import { ref, reactive } from 'vue'
import { getTeamUser, updateFilename, updateTeamUser, deleteFiles } from '@/api/file'
const props = defineProps({
	foldId: {
		type: Number,
		default: -1
	},
})

const renameFormData = reactive({
	fileId: props.foldId,
	filename: ''
})

const filenameRef = ref();
const renameDialogVisible = ref(false);
const renameForm = ref<FormInstance>();
/** 验证规则 */
const renameRules: FormRules = {
	filename: [
		{ required: true, message: '请输入新小组名称', trigger: 'blur' }
	]
};

function renameTeam() {
	renameDialogVisible.value = true;
}

function delTeam() {
	ElMessageBox.confirm('小组解散后将不保存，您确定这样做吗？', '解散小组', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		deleteFiles({ fileId: props.foldId }).then(() => {
			ElMessage.success('删除成功')
		}).catch((res: any) => {
		})
	}).catch((res) => {

	})
}


function focusInput() {
	filenameRef.value.focus()
}

const cascaderProps = { multiple: true, emitPath: false }
//右侧数据
const users = ref<any>([]);
const usersId = ref<any>([]);
const hoverIndex = ref<number>(-1)
const personOptions = ref<any>([]) //获取部门下所有人员的级联信息
const selectedPerson = ref<any>([])//级联选择器内容
const addDialogVisible = ref(false);

init()

function init() {
	getTeamUser({ folderId: props.foldId }).then((res) => {
		users.value = res.data
	})
}

function avararFormat(nickname: string) {
	return nickname.slice(-2)
}

function addUser() {
	addDialogVisible.value = true
}
getSendPersonList()

function getSendPersonList() {
	fetchListWithChildren().then(response => {
		let list = response.data;
		personOptions.value = [];
		for (let i = 0; i < list.length; i++) {
			let children = [];
			if (list[i].userRelationList != null && list[i].userRelationList.length > 0) {
				for (let j = 0; j < list[i].userRelationList.length; j++) {
					children.push({ label: list[i].userRelationList[j].nickName, value: list[i].userRelationList[j].id });
				}
			}
			personOptions.value.push({ label: list[i].depName, value: list[i].depId, children: children });
		}
	});
}

function delUser(index: number) {
	ElMessageBox.confirm('是否要移除该用户?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		usersId.value = []
		users.value.splice(index, 1);
		users.value.forEach((t: any) => {
			usersId.value.push(t.id)
		})
		updateTeamUser({ folderId: props.foldId, teamUsers: usersId.value.toString() }).then(() => {
			ElMessage.success('移除成功')
		}).catch(res => {
			console.log(res)
		})
	}).catch(err => {
		console.log(err)
	});
}

function submitForm() {
	ElMessageBox.confirm('是否要添加勾选用户?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		usersId.value = []
		users.value.forEach((t: any) => {
			usersId.value.push(t.id)
		})
		let oldUser = usersId.value.toString() + ',' + selectedPerson.value;
		updateTeamUser({ folderId: props.foldId, teamUsers: oldUser }).then(() => {
			ElMessage.success('添加成功')
			addDialogVisible.value = false
			init()
		}).catch(res => {
			console.log(res)
		})
	})
}

function doRenameFile(formEl: FormInstance | undefined) {
	// 表单校验
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			updateFilename({
				fileId: renameFormData.fileId,
				newFilename: renameFormData.filename
			}).then(() => {
				renameDialogVisible.value = false
				ElMessage.success('重命名成功')
			}).catch((res: any) => {
			})
		}
	})
}

</script>
<style scoped  lang="scss" >
.whole {
	height: 100%;
	margin: 0;
	display: flex;
	flex-direction: column;
}

.el-divider--horizontal {
	margin: 15px 0;
}

.team-title {
	font-size: 16px;
	font-weight: 600;
}

.text-center {
	cursor: pointer;
	text-align: center;

	.name {
		margin-top: 5px;
		color: darkgrey;
		margin-bottom: 15px;
	}
}

.text-center:hover {}

.team-bottom {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: flex-end;

	.button-group {
		display: flex;
		flex-direction: column;
		/* 改为列方向排列 */
		justify-content: center;
		align-items: center;
		margin-bottom: 15px;
	}

	button {
		margin: 10px 10px;
		/* Adjust this value to change the space between the buttons */
		width: 180px;
	}

}</style>