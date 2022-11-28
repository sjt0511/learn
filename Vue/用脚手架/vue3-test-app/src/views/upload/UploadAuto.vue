<template>
  <div class="upload-auto">
    <header class="upload-auto_header">
      <h2 class="upload-auto_title">JS上传前端包本地图片</h2>
    </header>
    <main class="upload-auto_main">
      <!-- 上传模块 -->
      <section class="upload-auto_upload">
        <img v-for="(img, index) in bannerList" :key="index" :src="img.src" :alt="img.name"
          class="upload-auto_item" :class="{active: active===index}" @click="select(index)">
        <label for="upload" class="upload-auto_item upload-auto_form">
          上传本地图片
          <input class="upload-auto_input" type="file" id="upload" accept="image/*" @input="uploadImg">
        </label>
        <button class="upload-auto_btn pai-btn" @click="uploadSelect">上传选中图片</button>
      </section>
    </main>
    <!-- 显示模块 -->
    <footer class="upload-auto_footer">
      <h3 class="upload-auto_label">上传结果</h3>
      <img class="upload-auto_res" :src="attach.thumb_path" alt="" v-if="attach&&attach.thumb_path">
      <p class="upload-auto_none" v-else>未上传</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
// 图片列表
const bannerList = [
  { src: 'config/upload/banner1.jpg', name: 'banner1.jpg' },
  { src: 'config/upload/banner2.jpg', name: 'banner2.jpg' },
  { src: 'config/upload/banner3.jpg', name: 'banner3.jpg' },
  { src: 'config/upload/banner4.jpg', name: 'banner4.jpg' },
  { src: 'config/upload/banner5.jpg', name: 'banner5.jpg' },
]
// 选中的图片
let active = ref(0)
// 最终上传的图片文件
let attach = ref(null)

/** 选择一张图片 */
const select = (index) => {
  active.value = index
}
/** 上传选中图片 */
const uploadSelect = () => {
  if (active.value < 0) {
    return
  }
  // 生成图片
  const item = bannerList[active.value] // 选中的选项
  const image = new Image()
  image.onload = () => { // 图片加载完毕后
    // 图片绘制到Canvas对象
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    // Canvas对象转blob文件流
    canvas.toBlob((file) => {
      upload(file, item.name)
    }, 'image/jpeg')
    image.src = item.src
  }
  
}
/** 普通上传图片 */
const uploadImg = (e) => {
  const files = e.target.files
  if (!files.length) { // 没有选择文件
    return
  }
  active.value = -1
  upload(files[0])
}
/** 接口上传 */
const upload = (file, fileName = undefined) => {
  // 创建axios实例
  const service = axios.create({
    baseURL: 'http://192.168.9.201:14084/appointmentapi',
    timeout: 30000
  })
  // 请求拦截
  service.interceptors.request.use(config => {
    config.headers.Authorization = 'pc-10081-2fba79b01d75489c91d56a18d9fb40b4'
    return config
  }, error => {
    return Promise.reject(error)
  })

  const data = new FormData()
  data.append('file', file, fileName)

  service.post('/common/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(response => {
    console.log(response)
    const res = response.data
    if (res.success) { // 成功
      attach.value = res.data
    }
  })
}
</script>

<style lang="scss">
.upload-auto {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 0 20px;

  &_upload {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: stretch;
    margin: 0 -20px;
  }

  &_item {
    box-sizing: content-box;
    display: block;
    margin: 10px 20px;
    width: calc(33.3% - 40px);
    border-radius: 10px;
    cursor: pointer;

    &.active {
      margin: 6px 16px;
      border: 4px solid color();
    }
  }

  &_form {
    position: relative;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    color: color();
    background: color(back);
  }

  &_input {
    position: absolute;
    opacity: 0;
  }

  &_btn {
    margin: 0 auto;
  }

  &_footer {
  }

  &_res {}

  &_none {}
}
</style>