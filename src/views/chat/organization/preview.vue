<template>
    <div class="privewUser">
        <div class="text-center">
            <el-avatar v-if="user.icon" shape="square" size="large" :src="user.icon"></el-avatar>
            <el-avatar v-else shape="square" size="large"><span v-html="avararFormat(user.nickName)"></span> </el-avatar>
        </div>
        <el-descriptions title="用户基本信息" v-if="user" class="description" :column="2" border>
            <el-descriptions-item label="姓名" width="130" align="center">{{ user.nickName }}</el-descriptions-item>
            <el-descriptions-item label="电话" align="center">
                <span v-html="PhoneFormat(user.phone)"></span></el-descriptions-item>
            <el-descriptions-item label="性别" align="center">{{
                user.sex == "1" ? "男" : user.sex == "0" ? "女" : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="邮箱" align="center">{{ user.email }}</el-descriptions-item>
            <el-descriptions-item label="座右铭" role="2" align="center">
                {{ user.motto }}
            </el-descriptions-item>
        </el-descriptions>
        <span class="display-footer">
            <el-button type="primary" size="default" @click="send()">和她畅聊</el-button>
        </span>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { getUserInfoById } from '@/api/login'
import { useChatStore } from "@/store/modules/chatStore";
import ChatType from "@/mode/chat/ChatType";
const store = useChatStore();
import { useRouter } from "vue-router";
const router = useRouter();
const user = reactive({
    id:'',
    nickName: '',
    sex: '',
    phone: '',
    email: '',
    icon: '',
    motto: ''
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

function PhoneFormat(phone: string) {
    if (phone) {
        return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    return phone
}

function getUserInfo() {
    getUserInfoById(displayUserId.value).then(response => {
        Object.assign(user, response.data);
    })
}
getUserInfo()

const send = () => {
    if (user) {
        store.openChat({
            id: user.id,
            name: user.nickName,
            avatar: user.icon,
            type: ChatType.FRIEND,
            lastMessage: "",
            unreadCount: 0,
            isLoading: false,
            loaded: true,
        });
        router.push("/chat/sendMessage");
    }
};

</script>
<style scoped>
.privewUser {
    padding: 180px 100px 0px 100px;
    width: 85%;
}

.text-center {
    text-align: center;
    padding-bottom: 15px;
}

.description {
    padding: 20px;
    background-color: #eeeeee;
}

.display-footer {
    float: right;
    padding-right: 20px;
    margin-top: 20px;
}</style>