// 引入 vue-router
import * as VueRouter from 'vue-router'

const base = [
  { path: '', redirect: { name: 'home' } },
  { 
    path: '/home',
    name: 'home',
    component: () => import('./views/home/HomeIndex.vue'),
    meta: { title: '首页' }
  }
]

const upload = [
  {
    path: '/upload/auto',
    name: 'upload_auto',
    component: () => import('./views/upload/uploadAuto.vue')
  }
]


// routes配置项
const routes = base.concat(upload)
// 创建 router 实例
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，在这里使用 hash 模式
  history: VueRouter.createWebHashHistory(),
  routes
})

// 导出 router 实例
export default router