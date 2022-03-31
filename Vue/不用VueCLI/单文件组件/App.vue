<!-- 管理所有组件 -->
<template>
  <div>
      <Student></Student>
      <School></School>
  </div>
</template>

<script>
import Student from './Student.vue'
import School from './School.vue'

export default {
    name: 'App',
    components: {
        Student,
        School
    }
}
</script>

<style>

</style>