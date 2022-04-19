<template>
    <div class="student">
        <h2>{{name}}</h2>
        <h3>{{age || 0}}岁</h3>
    </div>    
</template>

<script>
    export default {
        name: 'StudentMain',
        data () {
            return {
                name: '派派',
                age: 3
            }
        },
        /* 进入守卫：通过 ** 路由规则 ** 进入该组件时被调用 */
        beforeRouteEnter(to, from, next) {
            console.log('组件内路由守卫|进入路由守卫', to, from, next)
            // *** 不调用next()就进不来了 ***
            next()
        },
        /* 离开守卫：通过 ** 路由规则 ** 离开该组件时被调用 */
        beforeRouteLeave(to, from, next) {
            console.log('组件内路由守卫|离开路由守卫', to, from, next)
            // *** 不调用next()就离不开了 ***
            next()
        },
        methods: {
        }
    }
</script>

<style>
.student {
    background: orange;
}
</style>