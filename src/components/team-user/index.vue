<template>
    <div class="container ">
        <div class="notice">
            <div class="rise">
                <div class="title">团队公告</div>
                <div class="operation" style="cursor: pointer;" @click="editNoticeFlag = false">
                    <el-icon :size="20">
                        <EditPen />
                    </el-icon>
                </div>
            </div>
            <div class="content">
                <el-input :rows="4" v-model="noticeContent.notice" :disabled="editNoticeFlag" resize="none" type="textarea"
                    placeholder="添加团队公告 所有成员都可以查看" />
            </div>
            <div class="btn-group">
                <el-button>取消</el-button>
                <el-button type="primary" @click="submitNotice">确定</el-button>
            </div>
        </div>
        <div class="member">
            <div class="rise">
                <div class="title">成员</div>
                <div class="operation" style="color: #409eff;cursor: pointer;" @click="addUser">
                    <el-icon :size="19">
                        <CirclePlusFilled />
                    </el-icon>
                    <div>添加成员</div>
                </div>
            </div>
            <div class="content">
                <el-scrollbar>
                    <ul class="infoList">
                        <li v-for="(item, index)  in users" style="margin-bottom: 10px;">
                            <div class="rank" @mouseenter="hoverIndex = index" @mouseleave="hoverIndex = -1">
                                <div class="info">
                                    <div class="aratar">
                                        <el-avatar v-if="item.icon" size="small" :src="item.icon">
                                        </el-avatar>
                                        <el-avatar v-else size="small">
                                            <span v-html="avararFormat(item.nickName)"></span>
                                        </el-avatar>
                                    </div>
                                    <div class="name">{{ item.nickName }}</div>
                                </div>
                                <div class="operation" v-show="hoverIndex === index">
                                    <span @click="editUser(item.id, item.nickName)">
                                        <Finished style="width: 1em; height: 1em; margin-right: 10px ;color: #78bb7b;" />
                                    </span>
                                    <span @click="delUser(index)">
                                        <Delete style="width: 1em; height: 1em; margin-right: 8px ;color: red;" />
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </el-scrollbar>

            </div>
        </div>
        <div class="team-bottom">
            <div class="button-group">
                <el-button size="large" plain @click="renameTeam">更名</el-button>
                <el-button size="large" plain @click="delTeam">解散</el-button>
            </div>
        </div>
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

        <el-dialog :title="'权限设置（' + authFormData.userName + ')'" v-model="authDialogVisible" width="30%"
            :append-to-body=true :modal-append-to-body=false :center=true>
            <div>
                <el-form ref="authForm" :model="authFormData" label-width="140px">
                    <el-form-item label="允许上传文件：">
                        <el-radio-group v-model="authFormData.uploadFileFlag">
                            <el-radio-button label="允许" value=1 />
                            <el-radio-button label="不允许" value=0 />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="允许移动文件：">
                        <el-radio-group v-model="authFormData.moveFileFlag">
                            <el-radio-button label="允许" value=1 />
                            <el-radio-button label="不允许" value=0 />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="人员身份设置：">
                        <el-radio-group v-model="authFormData.fileManageFlag">
                            <el-radio-button label="文件管理员" value=1 />
                            <el-radio-button label="普通用户" value=0 />
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button @click="authDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAuthFile()">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchListWithChildren } from '@/api/dep';
import { ref, reactive } from 'vue'
import { getTeamUser, updateFilename, updateTeamUser, deleteFiles, getNotice, editNotice, doAuth, getAuth } from '@/api/file'
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

const authFormData = reactive({
    id: 0,
    fileId: props.foldId,
    userId: 0,
    userName: '',
    fileManageFlag: 0,
    moveFileFlag: 1,
    uploadFileFlag: 1
})

const authForm = ref();
const filenameRef = ref();
const renameDialogVisible = ref(false);
const editNoticeFlag = ref(true)
const authDialogVisible = ref(false);

const noticeContent = reactive({
    notice: ""
})
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
initNotice()
function initNotice() {
    getNotice({ teamId: props.foldId }).then((res) => {
        noticeContent.notice = res.data.notice
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

function editUser(userId: number, userName: string) {
    authFormData.userId = userId
    authFormData.userName = userName
    getAuth({ fileId: authFormData.fileId, userId: authFormData.userId }).then((res) => {
        if (res.data) {
            authFormData.id = res.data.id
            authFormData.fileManageFlag = res.data.fileManageFlag
            authFormData.moveFileFlag = res.data.moveFileFlag
            authFormData.uploadFileFlag = res.data.uploadFileFlag
        } else {
            authFormData.id = 0
            authFormData.fileManageFlag = 0
            authFormData.moveFileFlag = 1
            authFormData.uploadFileFlag = 1
        }
    })
    authDialogVisible.value = true
}

function doAuthFile() {
    doAuth(authFormData).then(() => {
        ElMessage.success('提交成功')
        authDialogVisible.value = false
    }).catch(res => {
        console.log(res)
    })
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
function submitNotice() {
    ElMessageBox.confirm('是否要提交该公告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        editNotice({ teamId: props.foldId, notice: noticeContent.notice }).then(() => {
            ElMessage.success('提交成功')
        }).catch(res => {
            console.log(res)
        })
    })
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
        const mergedArray = mergeArrays(usersId.value, selectedPerson.value).toString();
        updateTeamUser({ folderId: props.foldId, teamUsers: mergedArray }).then(() => {
            ElMessage.success('添加成功')
            addDialogVisible.value = false
            init()
        }).catch(res => {
            console.log(res)
        })
    })
}

function mergeArrays<T>(array1: T[], array2: T[]): T[] {
    // 创建一个Set以自动移除重复的元素
    const mergedSet = new Set<T>([...array1, ...array2]);
    // 将Set转换回数组并返回
    return Array.from(mergedSet);
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
.container {
    height: calc(100% - 20px);
    display: flex;
    /* 使用flex布局 */
    flex-direction: column;

    .rise {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 10px;
        margin-top: 5px;

        .title {
            font-weight: bold;
        }

        .operation {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .notice {
        /* 设置背景颜色 */
        height: 27%;
        margin-bottom: 30px;

        .btn-group {
            float: right;
            padding-top: 10px;
        }

    }

    .member {
        // height: 50%;

        .content {
            .infoList {
                height: 300px;
                list-style-type: none;
                cursor: pointer;

                .rank {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .info {
                        display: flex;
                        align-items: start;

                        .name {
                            padding-left: 5px;
                            font-size: 13px;
                        }
                    }
                }

                .rank:hover {
                    transition: all .3s ease-in-out;
                    background-color: #f0f3f6;
                }
            }
        }
    }
}

.el-avatar {
    font-size: 10px;
}

.team-bottom {
    // margin-bottom: 10px;
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

}
</style>