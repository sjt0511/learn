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

### 4.Vue3 中的响应式原理

#### Vue2.x的响应式

- 实现原理：
  - 对象类型：通过 `Object.defineProperty()` 对 属性的读取、修改 进行拦截（数据劫持）。
  - 数组类型：通过重写更新数组的一系列方法来实现拦截（对数组的变更方法进行了包裹）。

     ```JS
     Object.defineProperty(data, 'count', {
       get () {
         console.log('有人读取了count属性，我要给他返回')
       },
       set () {
         console.log('有人修改了count属性，我发现了，我要去更新界面')
       }
     })
     ```

- 存在问题：
  - 新增、删除属性，界面不会更新
  - 直接通过下标修改数组，界面不会更新

#### Vue3.0响应式

- 实现原理：
  - 通过 `Proxy（代理）`：拦截对象中任意属性的变化，包括：对属性值的读写、添加属性、删除属性等
  - 通过 `Reflect（反射）`：对被代理对象的属性进行操作
  - MDN 文档中描述的 Proxy 与 Reflect：
    - [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
    - [Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect) ：内置对象，不是函数对象（**不可构造，不能调用**），有静态方法

      ``` JS
      // 代理p会将所有应用到它的操作转发到target这个目标对象上，从而改变target
      // p代理对象 data所要拦截的目标对象 handler拦截行为对象
      // 要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作
      // 如果handler没有设置任何拦截，那就等同于直接通向原对象,没有任何拦截效果，访问proxy就等同于访问target
      const p = new Proxy(data, {
        // 拦截读取属性值，当有人读取p的某个属性时调用
        get (target, prop) { // target是目标对象
          console.log(`有人读取了p身上的${prop}属性`)
          // return target[prop]
          // 从Reflect对象上可以拿到语言内部的方法
          // Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法
          // 不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为
          return Reflect.get(target, prop)
        },
        // 拦截设置属性值或添加新属性，…… 修改或追加
        set (target, prop, value) {
          console.log(`有人修改了p身上的${prop}属性，我要去更新页面了`)
          // target[prop] = value
          return Reflect.set(target, prop, value)
        },
        // 拦截删除属性
        deleteProperty (target, prop) {
          console.log(`有人删除了p身上的${prop}属性，我要去更新页面了`)
          // return delete target[prop]
          return Reflect.deleteProperty(target, prop)
        }
      })
      ```

### 5.reactive 对比 ref

- 从定义数据角度对比：
  - ref 用来定义：基本数据类型
  - reactive 用来定义：只能是对象（数组）类型数据
  - 备注：ref 也可定义对象（数组）类型数据，它内部会自动通过 `reactive` 转为代理对象
- 从原理角度对比：
  - ref 通过 `Object.defineProperty()` 的 `get` 与 `set` 实现响应式（数据劫持）
  - reactive 通过使用 `Proxy` 来实现响应式（数据劫持），并通过 `Reflect` 操作目标对象内部数据
- 从实用角度对比：
  - ref 定义的数据：操作数据需要 `.value`，模板中读取数据时不需要 `.value`
  - reactive 定义的数据：操作、读取数据均不需要 `.value`

### 6.setup的两个注意点

- setup 执行的实际
  - 在 `beforeCreate` 之前执行一次，this 是 undefined
- setup 的参数
  - props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性
  - context：上下文对象
    - attrs：值为对象，包含：组件外部传递过来，但没有在 props 配置中声明的属性，相当于 `this.$attrs`
    - slots：收到的插槽内容，相当于 `this.$slots`
    - emit：分发自定义事件的函数，相当于 `this.$emit`

### 7.计算属性与监视

#### 1.computed 函数

- 与 Vue2.x 中 computed 配置功能一致
- 写法：
  
  ``` JS
  import {computed, reactive} from 'vue'

  export default {
    setup () {
      const person = reactive({
        firstName: '张',
        lastName: '三'
      })
      // 计算属性简写
      person.fullName = computed(() => {
        return `${person.firstName}-${person.lastName}`
      }) 

      // 计算属性完整版
      person.fullName = computed({
        get () {
          return `${person.firstName}-${person.lastName}`
        },
        set (val) {
          const nameArr = value.split('-')
          person.firstName = nameArr[0]
          person.lastName = nameArr[1]
        }
      })

      return {
        person
      }
    }
  }
  ```

#### 2.watch 函数

- 与 Vue2.x 中 watch 配置功能一直
- 两个小“坑”：
  - 监视 reactive 定义的响应式数据时：oldValue 无法正确获取、强制开启了深度监视（deep 配置失效）
  - 监视 reactive 定义的响应式数据中的某个属性时：deep 配置有效

    ``` JS
    import { ref, reactive, watch } from 'vue'

    export default {
      setup (props, context) {
        // 数据
        let sum = ref(0)
        let msg = ref('你好啊')
        let person = reactive({
          name: '张三',
          age: 18,
          job: {
            j1: {
              salary: 20
            }
          }
        })

        let person2 = ref({
          name: '张三',
          age: 18,
          job: {
            j1: {
              salary: 20
            }
          }
        })

        // 情况一：监视 ref 定义的一个响应式数据
        watch(sum, (newValue, oldValue) => {
          console.log('sum变了', newValue, oldValue)
        }, immediate: true)
        // 监视 ref 定义的响应式数据（ref里传对象）
        watch(person.value, (newValue, oldValue) => {
          console.log('person的值变化了', newValue, oldValue)
        })

        // 情况二：监视 ref 定义的多个响应式数据
        watch([sum, msg], (newValue, oldValue) => {
          console.log('sum或msg变了', newValue, oldValue)
        }, immediate: true)

        // 情况三：监视 reactive 定义的响应式数据
        //   1.无法正确获得oldValue  2.强制开启了深度监视，配置deep无效
        watch(person, (newValue, oldValue) => {
          console.log('person变化了', newValue, oldValue) // oldValue为undefined
        }, { deep: true }) // 此处的deep配置无效

        // 情况四：监视 reactive 所定义的一个响应式数据中的某个属性
        watch(() => person.name, (newValue, oldValue) => {
          console.log('person的name变化了', newValue, oldValue)
        })

        // 情况五： 监视 reactive 所定义的一个响应式数据中的某些属性
        watch([()=>person.name,()=>person.age], (newValue, oldValue) => {
          console.log('person的name或age变化了', newValue, oldValue)
        })

        // 特殊情况
        // 此处由于监视的时 reactive 定义的对象中的某个属性，deep配置有效
        watch(() => person.job, (newValue, oldValue) => {
          console.log('person的job变化了', newValue, oldValue)
        }, { deep: true })
      }
    }
    // 情况一：监视 ref 定义的响应式数据
  
    ```

#### 3.watchEffect 函数

- watch 的套路是：既要指明监视的属性，也要指明监视的回调
- watchEffct 的套路是：不用指明监视哪个属性，监视的回调中用到哪些属性就监视这些属性
- watchEffect 与 computed 有点像：
  - 但 computed 注重的是计算出来的值（回调函数返回值），所以必须写返回值
  - 而 watchEffect 更注重的是过程（回调函数的函数体），所以不用写返回值

    ```JS
    import { ref, reactive, watchEffect } from 'vue'
    
    export default {
      setup (props, context) {
        let sum = ref(0)
        let person = reactive({
          name: '张三',
          age: 18
        })

        // sum或者person.age发生变化之后，就重新执行回调
        watchEffect(() => {
          const x1 = sum.value
          const x2 = person.age
          console.log('watchEffect配置的回调执行了')
        })
      }
    }
    ```

### 8.生命周期钩子

- Vue3 中可以继续使用 Vue2.x 的生命周期钩子，有两个被更名：
  - `beforeDestroy` 改名为 `beforeUnmount`
  - `destroyed` 改名为 `unmounted`
- Vue3 也提供了 Composition API 形式的生命周期钩子，与 Vue2.x 中钩子对应关系如下：
  - `beforeCreate` ===> `setup()`
  - `created` ========> `setup()`
  - `beforeMount` ====> `onBeforeMount`
  - `mounted` ========> `onMounted`
  - `beforeUpdate` ===> `onBeforeUpdate`
  - `updated` ========> `onUpdated`
  - `beforeUnmount` ==> `onBeforeUnmount`
  - `unmounted` ======> `onUnmounted`

### 9.自定义 hook 函数

- 什么是 hook？ —— 本质是一个函数，把 setup 函数中使用的 Composition API 进行了封装
- 类似于 Vue2.x 中的 mixin
- 自定义 hook 的优势：复用代码，让 setup 中逻辑更清晰

### 10.toRef

- 作用：创建一个 ref 对象，其 value 值指向另一个对象中的某个属性值
- 语法：`const name = toRef(person, 'name')`
- 应用：要将响应式对象中的某个属性单独提供给外部使用时
- 扩展：`toRefs` 与 `toRef` 功能一致，但可批量创建多个 ref 对象，语法：`toRefs(person)`

  ``` JS
  import {reactive, toRef, toRefs} from 'vue'

  export default {
    setup (props, context) {
      let person = reactive({
        name: '张三',
        age: 18,
        job: {
          j1: {
            salary: 20
          }
        }
      })
      // 访问name2就相当于访问person.name 
      const name2 = toRef(person, 'name')

      return {
        // name: toRef(person, 'name'),
        // age: toRef(person, 'age'),
        // salary: toRef(person.job.j1, 'salary')
        ...toRefs(person)
      }
    }
  }
  ```

## 其他 Composition API

### 1.shallowReactive 与 shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）
- shallowRef：只处理基本数据类型的响应式，不进行对象响应式处理
- 什么时候使用？
  - 如果有一个对象数据，结构比较深，但变化时只是外层属性变化 ===> shallowReactive
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生成新的对象替换 ===> shallowRef