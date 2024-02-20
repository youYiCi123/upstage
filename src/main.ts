import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "@/store/index";

//解决使用 echarts 生成图表时,经常需要做繁琐的数据类型转化
import VCharts from "v-charts";

// 添加全局CSS样式
import "@/styles/index.scss"; // global css
//引入semantic-ui-css样式
import "@/styles/semantic.css";

//引入审批流程draw样式
import "@/styles/override-element-ui.css";

//引入新字体
import "@/assets/font/font.scss";
//添加iconfont
import "@/iconfont/iconfont.css";

// 添加路由卫士
import "@/permission"; // permission control

//解决element-plus自动引入后ElLoading、ElMessage、ElNotification、ElMessageBox样式丢失的问题
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

//注册全局变量ws
import WsRequest from "@/api/wsRequest";
const ws = new WsRequest();

const app = createApp(App);
app.config.globalProperties.$ws = ws;
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia).use(VCharts).use(router).mount("#app");

// 注册一个全局自定义指令 v-focus
app.directive("focus", {
  // 当被绑定的元素挂载到 DOM 中时被调用
  mounted(el) {
    // 聚焦元素
    el.focus();
  },
});
