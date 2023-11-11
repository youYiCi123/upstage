<template>
    <div class="privewUser">
        <div class="text-center">
            <el-avatar shape="square" size="large"><span v-html="avararFormat(user.nickName)"></span> </el-avatar>
        </div>
        <el-descriptions  title="用户基本信息"  v-if="user" class="description" :column="2" border>
            <el-descriptions-item label="姓名" width="130" align="center">{{ user.nickName }}</el-descriptions-item>
            <el-descriptions-item label="电话" align="center">{{
                user.phone
            }}</el-descriptions-item>
            <el-descriptions-item label="性别" align="center">{{
                user.sex == "1" ? "男" : user.sex == "0"?"女":""
            }}</el-descriptions-item>
            <el-descriptions-item label="邮箱" align="center">{{ user.email }}</el-descriptions-item>
            <el-descriptions-item label="座右铭" role="2" align="center">
                {{ user.depName }}
            </el-descriptions-item>
        </el-descriptions>
        <span class="display-footer">
          <el-button type="primary" size="default">和她畅聊</el-button>
        </span>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch,computed } from "vue";
import { getUserInfoById } from '@/api/login'
const user = reactive({
    nickName: '',
    sex: '',
    phone: '',
    email: '',
    depName: ''
})

const props = defineProps({
    userId: {
        type: String,
        default: ''
    }
})
const displayUserId = computed(() => {
	return props.userId;
})

watch(displayUserId, () => {
	getUserInfo()
})

function avararFormat(nickname: string) {
	return nickname.slice(-2)
}

function getUserInfo() {
    getUserInfoById(displayUserId.value).then(response => {
        Object.assign(user, response.data);
    })
}
getUserInfo()
</script>
<style scoped>
.privewUser{
    padding: 180px 100px 0px 100px;
    width: 85%;
}
.text-center{
    text-align: center;
    padding-bottom: 15px;
}
.description {
    padding: 20px;
    background-color: #eeeeee;
}
.display-footer{
    float: right;
    padding-right: 20px;
    margin-top: 20px;
}
</style>