<template>
  <keep-alive class="layout" :include="list">
    <router-view class="layput_content"></router-view>
  </keep-alive>
</template>

<script setup>
const list = ['home']
</script>

<style>

</style>