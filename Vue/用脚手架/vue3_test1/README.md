# Vue3 笔记

## Vue3 带来了什么

### 1.性能的提升

- 打包大小减少41%
- 初次渲染快55%，更新渲染快133%
- 内存减少 54%

### 2.源码的升级

- 使用 `Proxy` 代替 `defineProperty` 实现响应式
- 重写虚拟 DOM 的实现和 Tree-Shaking

### 3.拥抱 TypeScript

- Vue3可以更好地支持 TypeScript

### 4.新特性

1. Composition API (组合式 API)
   - `setup` 配置
   - `ref` 和 `reactive` 响应式
   - `watch` 和 `watchEffect`
   - `provide` 和 `inject`
   - ……
2. 新的内置组件
   - Fragment
   - Teleport
   - Suspense
3. 其他改变
   - 新的生命周期钩子
   - data 选项始终被声明为一个函数
   - 移除 keyCode 支持作为 v-on 的修饰符
   - ……

## 创建 Vue3 工程

### 使用 vue-cli 创建

``` JS
//查看版本 在4.5.0以上
npm --version
// 安装或升级@vue/cli
npm install -g @vue/cli
// 创建
vue create vue_test
// 在vue_test文件夹下
npm run serve
```

### 使用 Vite 创建

新一代前端构建工具，对标 webpack

- 开发环境中无需打包操作，可快速冷启动
- 轻量快速的热重载(HMR)
- 真正的按需编译，不再等待整个应用编译完成

``` JS
// 创建工程
npm init vite-app vue_test
// 进入到当前文件夹
cd vue_test
// 安装依赖
npm install
// 运行
npm run dev
```

## Composition API(组合式 API)

### 1. setup

- Vue3 中一个新的配置项，是一个函数
- 是所有 `Composition API` “表演的舞台”
- 组件中用到的：数据、方法等，均要配在 `setup` 中
- `setup` 函数的两种返回值：
  1. **返回一个对象：对象中的属性、方法，在模板中均可直接使用**
  2. 返回一个渲染函数：可以自定义渲染内容
- 注意点：
  1. 尽量不要和 Vue2.x 配置混用
     - Vue2.x配置（data、methods、computed…）中可以访问到 setup 中的属性、方法
     - 但 setup 中 不能访问到 Vue2.x 配置（data、methods、computed）
     - 如有重名 setup 优先
  2. setup 不能是一个 async 函数，因为返回值不再是 return 的对象而是 promise，模板看不到 return 对象中的属性。（除非用 `异步组件` 和 `Suspense` 内置组件）

### 2. ref 函数

定义一个响应式的数据

- 语法：`const xxx = ref(initValue)`
  - 创建一个包含响应式数据的 `引用对象`(reference对象--`RefImpl`)
  - JS 中操作数据：xxx.value
  - 模板中读取数据：不需要 .value， 直接 `<div>{{xxx}}</div>`
- 备注：
  - 接受的数据类型：基本类型、对象类型
  - 基本类型数据：响应式依然是靠 `Object.defineProperty()` 的 `get` 和 `set` 完成
  - 对象数据类型：内部“求助”了Vue3中的一个新函数—— `reactive` 函数

### 3.reactive 函数

定义一个**对象类型**的响应式数据（∴ 基本类型要用 `ref` 函数）

- 语法：`const 代理对象 = reactive(被代理对象)` 接收一个对象（数组），返回一个 `代理器对象（Proxy 对象）`
- reactive 定义的响应式数据是“深层次的”，强制开启了 deep 模式
- 内部基于 ES6 的 `Proxy`（`Reflect`）实现，通过代理对象操作元对象内部数据都是响应式的

### Vue3 中的响应式原理
