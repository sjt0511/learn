const { defineConfig } = require('@vue/cli-service')
// 使用的CommonJS暴露，而不是ES6的模块暴露=> .js文件传给 webpack，而webpack是基于Node.js的，Node.js采用的模块化是CommonJS
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: 'warning'
})
