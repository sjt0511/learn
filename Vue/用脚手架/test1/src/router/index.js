import Vue from 'vue'
// 引入 vue-router
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router =  new VueRouter({
    // 路由模式
    // --hash: http://localhost:8080/#/demo（#及后面都不会带入http请求）
    // --history: http://localhost:8080/demo（需要后端解决404问题 connect-history-api-fallback中间件）
    mode: 'hash',
    routes: [
        {
            path: '/test:id',
            name: 'test',
            component: () => import('../components/Test.vue'),
            meta: { title: '测试', isAuth: true },
            props: true, // params传参-配合path:id
            // props: { id: 666 }, // 对象，死值
            // props ($route) { // 函数
            //     return { id: $route.query.id }
            // }
        },
        {
            path: '/school',
            name: 'school',
            component: () => import('../components/School.vue'),
            meta: { title: '学校' },
            beforeEnter: (to, from, next) => {
                console.log('独享路由守卫|前置路由守卫', to, from, next)
                next()
            }
        },
        {
            path: '/student',
            name: 'student',
            component: () => import('../components/Student.vue'),
            meta: { title: '学生' }
        }
    ]
})

// 全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
// router.beforeEach((to, from, next) => {
//     console.log('全局前置路由守卫', to, from, next)
//     if (to.meta.isAuth) { // 判断是否需要鉴权
//         // 进行一些判断看是否有权限进入该页面
//         next()
//     } else {
//         // next()执行之后才进入页面
//         next()
//     }
// })

// // 全局后置路由守卫————初始化时被调用、每次路由切换之后被调用
// router.afterEach((to, from) => {
//     console.log('全局后置路由守卫', to, from)
//     document.title = to.meta.title || document.title
// })

export default router
