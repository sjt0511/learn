/**
 * 整个项目的入口，先执行这个文件（CLI 搞的）
 */
import '../src/styles/index.scss'
// 引入Vue：残缺的Vue(缺模板解析器)vue.runtime.esm.js|Vue包含两部分：Vue核心(生命周期、处理事件等)+模板解析器(解析new Vue() template里面的内容)
// 为什么引入残缺Vue：webpack打包的时候包体积可以小一点
// vue.runtime.esm.js：runtime=>运行时(去掉了模板解析器) esm=>ES6 module引入(import ...)
import Vue from 'vue'
// 引入App 组件--所有组件的父组件
import App from './App.vue'
import plugin from './plugin'
// 关闭 Vue 的生产提示
Vue.config.productionTip = false

// 使用插件
Vue.use(plugin)

// 创建 Vue 实例对象 vm
new Vue({
  // 将 App 组件放入容器中|引入残缺版Vue（不能解析下面的template项）的时候，需要借助render
  render: h => h(App), // App是一个组件，不需要指定内容
  // render (createElement) { // createElement是个函数-用于创建具体元素
  //   return createElement('h1', '你好啊') // h1是HTML内置标签，需要指定里面的内容
  // },
  // template: '<h1>你好啊</h1>', // 写了也没用
  beforeCreate () {
    Vue.prototype.$bus = this // this是就是new出来的Vue实例vm；vm上有$on|$off|$emit
  }
}).$mount('#app') // 容器
