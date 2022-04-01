/** 
 * 插件：用于增强Vue
 * 本质：一个对象，必须包含install方法
 * 使用：main.js里 Vue.use(插件) | Vue.use 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件
 */
export default {
    // Vue: Vue 构造器, options: 可选参数
    install (Vue, options) {
        // 添加全局资源：指令/过滤器/过渡等。如 vue-touch
        Vue.filter('myStr', function(value) { // 过滤器 - 通过管道符使用 {{ name | myStr }}
            if (!value) return ''
            return value.slice(0, 4)
        })
        Vue.directive('demo', { // 指令 - v-demo="n"
            // 指令与元素成功绑定时(一上来)
            bind (el, binding) {
                console.log('bind', el, binding)
                el.focus()
            },
            // 指令所在元素被插入页面时
            inserted (el) {
                console.log('inserted', el)
            },
            // 指令所在模板被重新解析时，不必是n变化，可能是其他数据的变化引起页面重新被解析
            update (el) {
                console.log('update', el)
            }
        })
        Vue.directive('demo2', function(el, binding) {
            // 相当于上面的 bind和update
            // 即函数会在：指令与元素成功绑定(一上来)、指令所在的模板被重新解析时 被调用
            console.log('demo2', el, binding)
        })
        // 通过全局混入来添加一些组件选项。如 vue-router
        Vue.mixin({ // 一个混入对象可以包含任意组件选项
            created () {},
            methods: {}
        })
        // 添加全局方法或者 property。如：vue-custom-element
        Vue.myGlobalMethod = function () { console.log('myGlobalMethod') }
        // 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现
        Vue.prototype.$myMethod = function () { console.log(options) }
        Vue.prototype.$myProperty = 'xxx'
        // 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router
    }
}