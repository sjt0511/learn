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
    // 监听所有地址，包括局域网和公网地址，这样可以在网络中暴露服务
    // 解决 `vite` 启动后出现 Network: use \`--host\` to expose
    // 同时也可以让局域网内的电脑和手机访问到网页
    host: '0.0.0.0',
    port: '8080',
    // 可以在开发环境启动项目时自动在浏览器中打开应用程序
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
