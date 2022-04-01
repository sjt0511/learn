<template>
    <div class="school">
        <h2 v-demo="n">{{name|myStr}}</h2>
        <h3 v-demo2="n">{{address}}</h3>
    </div>    
</template>

<script>
    export default {
        name: 'SchoolMain',
        data () {
            return {
                n: 1,
                name: '学校aaaa',
                address: '地址'
            }
        },
        methods: {
        }
    }
</script>

<style>
.school {
    background: pink;
}
</style>