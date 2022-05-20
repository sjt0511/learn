// 引入的不再是 Vue 构造函数，引入的是一个名为 createApp 的工厂函数
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/index.scss'

createApp(App).use(router).mount('#app')
// 拆分写法
// // 创建应用实例对象--app(类似于 Vue2 中的 vm，但 app 比 vm 更“轻”)
// const app = createApp(App)
// // 挂载应用实例对象
// app.mount('#app')

// Vue2 写法
// new Vue({
//     render: h => h(App)
// }).$mount('#app')
