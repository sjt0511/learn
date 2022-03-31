# 笔记

## 脚手架文件结构

- `node_modules`
- `public`
  - `favicon.ico` 页签图标
  - `index.html` 主页面
- `src`
  - `assets` 存放静态资源
    - logo.png
  - `components` 存放组件
    - HelloWorld.vue
  - `App.vue` 汇总所有组件
  - `main.js` 入口文件
- `.gitignore` git版本管制忽略的配置
- `babel.config.js` babel的配置文件
- `package.json` 应用包的配置文件
- `README.md` 应用描述文件
- `package-lock.json` 包版本控制文件

## 关于不同版本的Vue

- vue.js 与 vue.runtime.xxx.js 的区别：
  1. vue.js 是完整版的 Vue，包含核心功能+模板解析器
  2. vue.runtime.xxx.js 是运行版的 Vue，只包含核心功能，没有模板解析器
- 因为 vue.runtime.xxx.js 没有模板解析器，所以 new Vue 实例时不能使用 template 配置项，需要使用 `render` 函数接收到的 `createElement` 函数去指定具体内容

## vue.config.js 配置文件

> 使用 vue inspect > output.js 可查看到 Vue 脚手架的默认配置(webpack.config.js)
>
> 使用 [vue.config.js](https://cli.vuejs.org/zh/config/#vue-config-js) 可以对脚手架进行个性化定制
