<template>
    <ElConfigProvider :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>

<script lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn"
export default {
  setup() {
    const locale = zhCn /** 将 Element Plus 的语言设置为中文 */
    return {
      locale
    }
  }}
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "OPPOSans-R"; 
}
</style>
