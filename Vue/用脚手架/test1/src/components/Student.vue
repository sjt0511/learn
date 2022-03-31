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
        methods: {
        }
    }
</script>

<style>
.student {
    background: orange;
}
</style>