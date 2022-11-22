<template>
  <div>
    <ul>
      <li v-for="(item, index) in menu" @click="goTo(item)">{{item.title}}</li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// 菜单
const menu = [
  { title: 'JS前端包图片上传', router: { name: 'upload_auto' } }
]

// 导航
const Router = useRouter()
const goTo = (item) => {
  Router.push(item.router)
}
</script>

<style>

</style>