<template>
  <el-row class="panel-group" :gutter="20">
    <el-col class="chatLeft" :span="4">
      <div class="title">聊天 </div>
      <el-divider />
      <el-scrollbar class="list">
        <list-item v-for="(chat, index) in store.chats" :key="chat.id" :index="index" :id="chat.id" :img="chat.avatar"
          :username="chat.name" :unreadCount="chat.unreadCount" :text="chat.lastMessage" :showDel="true"
          :active="index === store.index" @del="delChat" @click="showChat(chat)"></list-item>
      </el-scrollbar>
    </el-col>
    <el-col :span="20">
      <chat-message></chat-message>
    </el-col>
  </el-row>
</template>
  
<script setup lang="ts">
import { useChatStore } from "@/store/modules/chatStore";
import Chat from "@/mode/chat/Chat";
import ChatMessage from "@/components/Chat/ChatMessage.vue";
import ListItem from "@/components/Chat/ListItem.vue";
import { nextTick } from "vue";
import ChatUtils from "@/utils/ChatUtils";

const store = useChatStore();

const showChat = (chat: Chat) => {
  store.openChat(chat);
  nextTick(() => {
    ChatUtils.imageLoad("message-box");
  });
};
const delChat = (id: string) => {
  store.delChat(id);
};
</script>
  
<style lang="scss" scoped>
.panel-group {
    height: 675px;
    .chatLeft {
        background-color: #eeeeee;
        .title {
            padding: 10px;
            font-weight: bold;
        }
    }
}
.el-col-4{
    padding-right: 1px;
}
.el-divider--horizontal {
    margin: 5px 0;
}
.el-scrollbar {
height: 675px;
}
</style>
  