<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,getCurrentInstance,nextTick } from 'vue'
import { ElMessage } from 'element-plus';
import { getUserFileBrief } from '@/api/login'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { computed } from "vue";
mixins: [ResizeMixin];
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
import { useFileStore } from "@/store/modules/fileStore";
const AppStore = useAppStore(pinia);
const fileStore = useFileStore(pinia);
// const { useAppStore} = useStore();
const _sidebar = computed(() => {
  return AppStore.sidebar
});
const _device = computed(() => {
  return AppStore.device
});
const classObj = computed(() => {
  return {
    hideSidebar: !_sidebar.value.opened,
    withoutAnimation: _sidebar.value.withoutAnimation,
    mobile: _device.value === 'mobile'
  }
});
onMounted(() => {
  getUserFileBrief().then((res: any) => {
    //部门文件
    fileStore.setFileDepParentId(res.data.rootFileId)
    fileStore.setFileDefaultDepParentId(res.data.rootFileId)
    fileStore.setDefaultParentDepFilename(res.data.rootFilename)
  }).catch((res: any) => {
    ElMessage.error(res.message)
  })
})

import Message from "@/mode/chat/Message";
import ChatType from "@/mode/chat/ChatType";
import ChatUtils from "@/utils/ChatUtils";
import vimConfig from "@/mode/chat/ChatConfig";
import { useUserStore } from "@/store/modules/userStore";
import { useChatStore } from "@/store/modules/chatStore";
const userStore = useUserStore();
const chatStore = useChatStore();
const { proxy } = getCurrentInstance();
let currentUserId= userStore.id
onMounted(() => {
  if (currentUserId) {
    //初始化websocket
    proxy.$ws.init(vimConfig.wsProtocol + "://" + vimConfig.host + ":" + vimConfig.wsPort+ "?userId=" + userStore.id);
    //重写 onmessage 方法，收到的消息都在这里进行分发
    proxy.$ws.onmessage = (message: Message) => {
      //群聊里面，自己发的消息不再显示
      if (currentUserId === message.fromId) {
        message.mine = true;
      }
      //友聊换chatId,chatId 不一样
      if (
        ChatType.FRIEND === message.type &&
        currentUserId !== message.fromId
      ) {
        message.chatId = message.fromId;
      }
      chatStore.pushMessage(message);
      nextTick(() => {
        ChatUtils.imageLoad("message-box");
      });
    };
  }
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
