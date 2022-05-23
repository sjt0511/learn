const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true // less样式支持js
        }, 
        additionalData: `@import "~@/styles/variables.less";`,
        // 在解析less文件之前引入.less内的变量，作用：提前声明
        // prependData: ``;
        // 在解析less文件之后引入b.less内的变量，作用：进行覆盖
        // appendData: `@import "b.less";`
      }
    }
  }
})
