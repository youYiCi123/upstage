<template>
    <div class="im-chat" v-if="chat">
        <div class="im-chat-top">
            <div>
                <span>{{ chat.name }}</span>
                <span v-if="chat.type === ChatType.GROUP">（{{ count }}人）</span>
            </div>
            <a href="javascript:;" @click="openModal" class="pull-right menu">
                <i class="iconfont icon-v-xinxi" />
            </a>
        </div>
        <div class="im-chat-main">
            <div class="im-chat-main-left">
                <div class="im-chat-main-box messages" id="message-box">
                    <ul>
                        <li v-for="item in messageList" :key="item.id" :class="{ 'im-chat-mine': item.mine }">
                            <div class="im-chat-user">
                                <el-avatar v-if="item.avatar !== null" shape="square" :src="item.avatar"></el-avatar>
                                <el-avatar v-else shape="square"><span v-html="avararFormat(item.name)"></span> </el-avatar>
                                <div class="message-info right" v-if="item.mine">
                                    <i>
                                        <Time :time="item.timestamp" />
                                    </i>
                                </div>
                                <div class="message-info" v-if="!item.mine">
                                    <i>
                                        <Time :time="item.timestamp" />
                                    </i>
                                </div>
                            </div>
                            <div class="im-chat-text">
                                <!--  pre<pre> 标签可定义预格式化的文本。被包围在 <pre> 标签 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。                -->
                                <pre v-html="ChatUtils.transform(item.content)" v-on:click="openImageProxy($event)"></pre>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="im-chat-footer">
                    <div class="im-chat-tool">
                        <!-- <i class="iconfont icon-v-smile" @click="showFace = !showFace"></i> -->
                        <!-- <faces v-if="showFace" @click="showFace = false" class="faces-box" @insertFace="insertFace"></faces> -->
                    </div>
                    <div class="im-chat-send">
                        <el-input v-model="messageContent" type="textarea"  :rows="2" @keyup.enter="mineSend()"
                            placeholder="恶语伤人六月寒,良言一句暖三冬"></el-input>
                        <el-button class="send-button" type="primary" size="large" @click="mineSend()">发送</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { useChatStore } from "@/store/modules/chatStore";
import { useUserStore } from "@/store/modules/userStore";
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from "vue";

import Time from "@/components/Chat/Time.vue";
import Chat from "@/mode/chat/Chat";
import Message from "@/mode/chat/Message";
import ChatUtils from "@/utils/ChatUtils";
import ChatType from "@/mode/chat/ChatType";
import { getMessageList } from '@/api/message';
import Receipt from "@/mode/chat/Receipt";

const { proxy } = getCurrentInstance();
const chatStore = useChatStore();
const userStore = useUserStore();

//是否展示表情
const showFace = ref(false);
//展示用户信息
const show = ref(false);
//群人数
const count = ref(0);
//当前聊天
const chat = computed((): Chat => {
    return chatStore.chats[chatStore.index];
});

function avararFormat(nickname: string) {
    return nickname.slice(-2)
}

watch(
    chat,
    (n) => {
        if (n && chat.value.type === ChatType.GROUP) {
        }
        if (n && userStore) {
            //第一次加载，从数据库中取10条，有序插入到聊天记录里
            getMessageList(
                {
                    chatId: n.id, fromId: userStore.id,
                    type: n.type, pageNum: 1, pageSize: 10
                }).then((res) => {
                    //读取消息
                    readMessage();
                    res.data.messageList.forEach((item: Message) => {
                        chatStore.addToMessageList(item, n.id);
                        nextTick(() => {
                            ChatUtils.imageLoad("message-box");
                        });
                    });
                });
        }
    },
    {
        immediate: true,
        deep: true,
    }
);

const openModal = () => {
    show.value = true;
};

const messageList = computed((): Array<Message> => {
    return chatStore.chatMessage.get(chat.value.id) ?? new Array<Message>();
});

/**
 * 用户点击消息列表某一个人
 */
const readMessage = () => {
    if (userStore.id) {
        let receipt: Receipt = {
            chatId: chat.value.id,
            userId: userStore.id,
            timestamp: new Date().getTime(),
            type: chat.value.type,
        };
        proxy.$ws.sendRead(receipt);
    }
};

// 附件和图片点击展开
const openImageProxy = (event: any) => {
    event.preventDefault();
    if (event.target.nodeName === "IMG") {
        proxy.$winControl.default.openURL(event.target.src);
    } else if (
        event.target.className === "message-file" ||
        event.target.nodeName === "A"
    ) {
        proxy.$winControl.default.openURL(event.target.href);
    }
};

const messageContent = ref("");
const mineSend = (): void => {
    if (userStore.id) {
        if (messageContent.value && messageContent.value.trim() !== "") {
            let msg: Message = {
                chatId: chat.value.id,
                fromId: userStore.id,
                avatar: userStore.avatar,
                name: userStore.nickName,
                mine: true,
                content: messageContent.value,
                timestamp: new Date().getTime(),
                type: chat.value.type,
            };
            proxy.$ws.sendMessage(msg);
            messageContent.value = "";
            nextTick(() => {
                ChatUtils.imageLoad("message-box");
            });
        }
    }
};

onMounted(() => {
    nextTick(() => {
        ChatUtils.imageLoad("message-box");
    });
});
</script>
  
<style lang="scss">
.im-chat {
    height: 750px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.im-chat-top {
    border-bottom: 1px solid #cccccc;
    color: #666666;
    padding: 0 0 0.2rem 1rem;
    font-size: 1.6rem;
    font-weight: bold;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu {
        color: #666666;
        display: inline-block;
        padding: 0 10px;
    }
}

.im-chat-main {
    flex: 1;
    display: flex;
    flex-direction: row;
    height: calc(100% - 60px);

    .im-chat-main-left {
        flex: 4;
        display: flex;
        flex-direction: column;
        .im-chat-main-box {
            flex: 1;
            padding: 1rem 1rem 0 1rem;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
    .messages {
        width: 100%;
        height: calc(100% - 3rem);
        overflow-y: scroll;

        ul {
            width: 100%;

            li {
                position: relative;
                font-size: 0;
                margin-bottom: 10px;
                padding-left: 60px;
                min-height: 68px;

                .im-chat-text {
                    position: relative;
                    line-height: 22px;
                    margin-top: 25px;
                    padding: 1rem;
                    background-color: #e2e2e2;
                    border-radius: 3px;
                    color: #333;
                    word-break: break-all;
                    display: inline-block;
                    vertical-align: top;
                    font-size: 14px;

                    &:after {
                        content: "";
                        position: absolute;
                        left: -10px;
                        top: 13px;
                        width: 0;
                        height: 0;
                        border-style: solid dashed dashed;
                        border-color: #e2e2e2 transparent transparent;
                        overflow: hidden;
                        border-width: 10px;
                    }

                    pre {
                        width: 100%;
                        white-space: pre-wrap;
                        word-break: break-all;

                        img {
                            display: block;
                        }
                    }
                }
            }
        }

        .im-chat-user {
            width: 4rem;
            height: 4rem;
            position: absolute;
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
            left: 3px;
            right: auto;

            .message-info {
                position: absolute;
                left: 60px;
                top: -2px;
                width: 500px;
                line-height: 24px;
                font-size: 12px;
                white-space: nowrap;
                color: #999;
                text-align: left;
                font-style: normal;

                i {
                    font-style: normal;
                    padding-left: 15px;
                }
            }

            .right {
                right: 0;
                text-align: right;
                left: auto;

                i {
                    padding-right: 15px;
                }
            }

            img {
                width: 4rem;
                height: 4rem;
            }
        }

        .im-chat-mine {
            text-align: right;
            padding-left: 0;
            padding-right: 60px;

            .im-chat-text {
                margin-left: 10px;
                text-align: left;
                background-color: #5fb878;
                color: #fff;
                display: inline-block;
                vertical-align: top;
                font-size: 14px;

                &:after {
                    left: auto;
                    right: -10px;
                    border-top-color: #5fb878;
                }
            }

            .im-chat-user {
                left: auto;
                right: 3px;

                cite {
                    left: auto;
                    right: 60px;
                    text-align: right;

                    i {
                        padding-left: 0;
                        padding-right: 15px;
                    }
                }

                .message-info {
                    right: 60px !important;
                    display: inline-block;
                }
            }
        }
    }
}

.im-chat-footer {
    border-top: 1px solid #dddddd;
    height: 15rem;
    display: flex;
    flex-direction: column;

    .im-chat-tool {
        height: 15px
    }

    .im-chat-send {
        display: flex;
        height: 4rem;
        text-align: right;
        padding: 0 1rem 1rem 0;
        .send-button{
            margin-top: 5px;
            margin-left: 50px;
            margin-right: 50px;
        }
    }
}

.ivu-scroll-wrapper {
    margin: 0 !important;
}

.ivu-scroll-container {
    padding: 15px 15px 5px;
    overflow-y: visible !important;
}

/* 重新覆盖iview 里面的 model 小于768px 时候 宽度变100% 的问题 */
@media (max-width: 768px) {
    .user-model {
        .ivu-modal {
            width: 30rem !important;
            margin: 0 auto;
        }
    }
}

.page {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0.5rem;
}

.ivu-drawer-body {
    padding: 0 !important;

    .messages {
        height: calc(100% - 3rem);
    }
}

.model-footer {
    text-align: right;
    margin: 10px;
}
</style>
  