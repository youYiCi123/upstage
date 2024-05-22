const { defineConfig } = require('@vue/cli-service')
//按需导入ElementPlus组件
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  devServer: {
    port: 8082, // 启动端口号
  },
  configureWebpack:{  //配置webpack信息
    plugins: [
      //按需导入ElementPlus组件
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})

