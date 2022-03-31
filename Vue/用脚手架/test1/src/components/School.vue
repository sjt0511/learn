<template>
    <div class="school">
        <h2>{{name}}</h2>
        <h3>{{address}}</h3>
    </div>    
</template>

<script>
    export default {
        name: 'SchoolMain',
        data () {
            return {
                name: '学校',
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