<template>
  <div class="upload-auto">
    <header class="upload-auto_header">
      <h2 class="upload-auto_title">JS上传前端包本地图片</h2>
    </header>
    <main class="upload-auto_main">
      <!-- 上传模块 -->
      <section class="upload-auto_upload">
        <img v-for="(img, index) in bannerList" :key="index" :src="img.src" :alt="img.name">
        <label for="upload">
          上传本地图片
          <input type="file" id="upload">
        </label>
        <button class="upload-auto_btn">上传选中图片</button>
      </section>
      <!-- 显示模块 -->
      <section class="upload-auto_res">

      </section>
    </main>
  </div>
</template>

<script setup>
// 图片列表
const bannerList = [
  { src: 'config/upload/banner1.jpg', name: 'banner1.jpg' },
  { src: 'config/upload/banner2.jpg', name: 'banner2.jpg' },
  { src: 'config/upload/banner3.jpg', name: 'banner3.jpg' },
  { src: 'config/upload/banner4.jpg', name: 'banner4.jpg' },
  { src: 'config/upload/banner5.jpg', name: 'banner5.jpg' },
]
</script>

<style lang="scss">
.upload-auto {
  &_upload {
    display: flex;
  }
}
</style>