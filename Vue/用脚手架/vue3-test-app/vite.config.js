import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      // 引入scss
      scss: {
        additionalData: '@import "./src/styles/variables.scss";'
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: '8080',
    open: true,
    cors: true,
    // 配置开启热更新 - 解决 修改了 .vue 文件保存后，视图没有更新，需要重新启动项目才行
    // 如果配置了还不生效，需要检查路由中文件名大小写是否正确
    hmr: true,
    // 配置代理
    proxy: {
      '/appointmentapi': {
        target: 'http://192.168.9.201:14084',
        changeOrigin: true
      }
    }
  }
})
