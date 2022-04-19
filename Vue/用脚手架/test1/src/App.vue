<!-- 管理所有组件 -->
<template>
  <div>
      <router-link to="test">Test</router-link>
      <router-link to="school">School</router-link>
      <router-link to="student">Student</router-link>
      <router-view></router-view>
      <!-- <Test></Test> -->
      <!-- <School></School>
      <Student></Student> -->
  </div>
</template>

<script>
// import Student from './components/Student.vue'
// import School from './components/School.vue'
// import Test from './components/Test.vue'

export default {
    name: 'App',
    components: {
        // Student,
        // School,
        // Test
    }
}
</script>

<style>

</style>