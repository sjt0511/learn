// 引入 vue-router
import * as VueRouter from 'vue-router'

// 引入组件
import HomeIndex from '../view/home/HomeIndex.vue'

const base = [
    {
        path: '/',
        name: 'home',
        component: HomeIndex,
        meta: { title: '主页' }
    }
]

const test = [
    {
        path: '/test',
        name: 'test',
        component: () => import('../view/test/TestIndex.vue'),
        meta: { title: '扫雷' },
        props ($route) {
            console.log(111, $route.params)
            return {
                item: $route.params
            }
        }
    }
]

// 定义routes配置项
const routes = base.concat(test)
console.log(VueRouter)
// 创建router实例
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

// 导出router实例
export default router