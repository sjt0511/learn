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
- `setup` 函数的参数：
  1. `props`：响应式的，当传入新的 prop 时，它将被更新。**不能使用 ES6 解构**，它会消除 prop 的响应性
  2. `context`：一个普通 JavaScript 对象，暴露了其它可能在 setup 中有用的值（`attrs/slots/emit/expose`）
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

### 2.readonly 和 shallowReadonly

- readonly：让一个响应式数据变为只读的（深只读）
- shallowReadonly：让一个响应式数据变为只读的（浅只读）
- 应用场景：不希望数据被修改时

### 3.toRaw 和 markRow

- toRow:
  - 作用：将一个由 `reactive` 生成的响应式对象转为普通对象
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新
- markRow：
  - 作用：标记一个对象，使其永远不会再成为响应式对象
  - 应用场景：
    1. 有些值不应被设为响应式的，如复杂的第三方类库等
    2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能

### 4.customRef

- 作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显示控制
- 实现防抖效果：
  
  ``` JS
  import { customRef, ref } from 'vue'
  export default {
    setup (props, context) {
      // 自定义一个 ref 名为：myRef
      function myRef (value) {
        let timeout
        return customRef((track, trigger) => {
          return {
            get () {
              console.log(`有人从myRef这个容器中读取数据了，我把${value}给他了`)
              // 通知Vue追踪value的变化（提前和get商量一下，让他认为这个value是有用的）
              track()
              return value
            },
            set (val) {
              clearTimeout()
              console.log(`有人把myRef这个容器中数据改为了：${val}`)
              // setTimeOut实现防抖，input框快速输入
              setTimeout(() => {
                // 这里用到了闭包
                value = val
                // 通知Vue去重新解析模板
                trigger()
              }, 1000)
            }
          }
        })
      }

      // let keyword = ref('hello') // 使用Vue提供的ref
      let keyword = myRef('hello') // 使用自定义的 ref
    }
  }
  ```

### 5.provide 与 inject

- 作用：实现祖孙组件间通信
- 套路：祖组件有一个 `provide` 选项来提供数据，孙组件有一个 `inject` 选项来开始使用这些数据
- 具体写法：
  1. 祖组件中

     ``` JS
     setup() {
       let car = reactive({ name: '奔驰', price: '40万' })
       provide('car', car)
     }
     ```
  
  2. 孙组件中

     ``` JS
     setup() {
       const car = inject('car')
       return {car}
     }
     ```

## Composition API 的优势

### 1.Options API 存在的问题

使用传统 Options API，新增或修改一个需求需要分别在 data, methods, computed 里修改

### 2.Composition API 的有优势

可以更优雅地组织我们的代码、函数，让相关功能地代码更加有序的组织在一起

## 新的组件

### 1.Fragment

- 在 Vue2 中：组件必须有根标签
- 在 Vue3 中：组件可以没有根标签，内部会将多个标签包含在一个 Fragment 虚拟元素中
- 好处：减少标签层级，减少内存占用

### 2.Teleport

一种能够将组件html结构移动到指定位置的技术

``` HTML
<teleport to="移动位置">
  <div v-if="isShow" class="mask">
    <div class="dialog">
      <h3>我是一个弹窗</h3>
      <button @click="isShow=false">关闭弹窗</button>
    </div>
  </div>
</teleport>
```

### 3.Suspense

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验
- 使用步骤：
  - 异步引入组件

    ``` JS
    import { defineAsyncComponent } from 'vue'
    const Child = defineAsyncComponent(() => import('./components/Child.vue'))
    ```

  - 使用 `Suspense` 包裹组件，并配置好 `default` 和 `fallback`

    ``` HTML
    <template>
      <div class="app">
        <h3>我是App组件</h3>
        <Suspense>
          <template #default>
            <Child/>
          </template>
          <template #fallback>
            <h3>加载中...</h3>
          </template>
        </Suspense>
      </div>
    </template>
    ```

## 其他

### 1.全局 API 的转移

- Vue2.x 有许多全局 API 和配置
  - 例如：组测全局组件、注册全局指令等

    ``` JS
    // 全局注册组件
    Vue.component('MyButton', {
      data () {
        count: 0
      },
      template: `<button @click="count++">Clicked {{count}} times.</button>`
    })
    // 全局注册指令
    Vue.directive('focus', {
      inserted: el => el.focus()
    })
    ```

- Vue3 中对这些 API 做出了调整
  - 将全局的 API，即：`Vue.xxx` 调整到应用实例（`app`）上

    | 2.x 全局 API（Vue） | 3.x 实例 API（app） |
    | ------------------ |---------------------|
    | Vue.config.xxx     | app.config.xxx      |
    | Vue.config.productionTip | 移除 |
    | Vue.component | app.component |
    | Vue.directive | app.directive |
    | Vue.mixin     | app.mixin     |
    | Vue.use       | app.use       |
    | Vue.prototype | app.config.globalProperties |

### 2.其他改变

- data 选项始终被声明为一个函数
- 过渡类名更改：
  - Vue2.x

     ``` CSS
     .v-enter,
     .v-leave-to {
       opacity: 0;
     }
     .v-leave,
     .v-enter-to {
       opacity: 1;
     }
     ```

  - Vue3

     ``` CSS
     .v-enter-from,
     .v-leave-to {
       opacity: 0;
     }
     .v-leave-from,
     .v-enter-to {
       opacity: 1;
     }
     ```

- 移除 keyCode 作为 v-on 的修饰符，不再支持 `config.keyCodes`
- 移除 `v-on.native` 修饰符，子组件在 `emits` 配置项里声明自定义事件
- 移除过滤器：过滤器虽然方便，但他与要一个自定义语法，打破大括号内表达式“只是JavaScript”守卫假设。可以用计算属性代替过滤器

## 单文件组件 `<script setup>`

`<script setup>` 中的代码会在每次组件实例被创建的时候执行

### 顶层的绑定会被暴露给模板

任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容) 都能在模板中直接使用

### 响应式

### 使用组件

`<script setup>` 范围里的值也能被直接作为自定义组件的标签名使用

将 MyComponent 看做被一个变量所引用。如果你使用过 JSX，在这里的使用它的心智模型是一样的。其 kebab-case 格式的 `<my-component>` 同样能在模板中使用。不过，我们强烈建议使用 PascalCase 格式以保持一致性。同时也有助于区分原生的自定义元素。

``` HTML
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

#### 动态组件

由于组件被引用为变量而不是作为字符串键来注册的，在 `<script setup>` 中要使用动态组件的时候，就应该使用动态的 `:is` 来绑定：

``` HTML
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

#### 递归组件

$\color{red}{？？？应用场景}$

一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 FooBar.vue 的组件可以在其模板中用 `<FooBar/>` 引用它自己。

请注意这种方式相比于 import 导入的组件优先级更低。如果有命名的 import 导入和组件的推断名冲突了，可以使用 import 别名导入：`import { FooBar as FooBarChild } from './components'`

#### 命名空间组件

可以使用带点 `.` 的组件标记，例如 `<Foo.Bar>` 来引用嵌套在对象属性中的组件。这在需要从单个文件中导入多个组件的时候非常有用

``` JS
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

### 使用自定义指令

全局注册的自定义指令将以符合预期的方式工作，且本地注册的指令可以直接在模板中使用，就像上文所提及的组件一样。

但这里有一个需要注意的限制：**必须以 `vNameOfDirective` 的形式来命名本地自定义指令，以使得它们可以直接在模板中使用。**

``` HTML
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

``` HTML
<script setup>
  // 导入的指令同样能够工作，并且能够通过重命名来使其符合命名规范
  import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

### `defineProps` 和 `defineEmits`

在 `<script setup>` 中必须使用 `defineProps` 和 `defineEmits` API 来声明 `props` 和 `emits` ，它们具备完整的类型推断并且在 `<script setup>` 中是直接可用的

- defineProps 和 defineEmits 都是只在 `<script setup>` 中才能使用的**编译器宏**。他们不需要导入且会随着 `<script setup>` 处理过程一同被编译掉。
- defineProps 接收与 props 选项相同的值，defineEmits 也接收 emits 选项相同的值。
- defineProps 和 defineEmits 在选项传入后，会提供恰当的类型推断。
- 传入到 `defineProps` 和 `defineEmits` 的选项会从 `setup` 中提升到模块的范围。因此，传入的选项不能引用在 `setup` 范围中声明的局部变量。这样做会引起编译错误。但是，它可以引用导入的绑定，因为它们也在模块范围内。

``` HTML
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

### `defineExpose`

使用 `<script setup>` 的组件是默认关闭的，也即通过模板 `ref` 或者 `$parent` 链获取到的组件的公开实例，不会暴露任何在 `<script setup>` 中声明的绑定。

为了在 `<script setup>` 组件中明确要暴露出去的属性，使用 `defineExpose` 编译器宏：

当父组件通过模板 ref 的方式获取到当前组件的实例，获取到的实例会像这样 { a: number, b: number } (ref 会和在普通实例中一样被自动解包)

``` HTML
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

### `useSlots` 和 `useAttrs`

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是很罕见的，因为可以在模板中通过 `$slots` 和 `$attrs` 来访问它们。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数：

`useSlots` 和 `useAttrs` 是真实的运行时函数，它会返回与 `setupContext.slots` 和 `setupContext.attrs` 等价的值，同样也能在普通的组合式 API 中使用

``` HTML
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

### 与普通的 `<script>` 一起使用

`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 在有这些需要的情况下或许会被使用到：

- 无法在 `<script setup>` 声明的选项，例如 `inheritAttrs` 或通过插件启用的自定义的选项。
- 声明命名导出。
- 运行副作用或者创建只需要执行一次的对象。

``` HTML
<script>
// 普通 <script>, 在模块范围下执行(只执行一次)
runSideEffectOnce()

// 声明额外的选项
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// 在 setup() 作用域中执行 (对每个实例皆如此)
</script>
```

### 顶层 `await`

`<script setup>` 中可以使用顶层 `await`。结果代码会被编译成 `async setup()`

另外，`await` 的表达式会自动编译成在 `await` 之后保留当前组件实例上下文的格式。$\color{red}{？？？看不懂}$

**`async setup()` 必须与 `Suspense` `组合使用，Suspense` 目前还是处于实验阶段的特性。我们打算在将来的某个发布版本中开发完成并提供文档 - 如果你现在感兴趣，可以参照 tests 看它是如何工作的。**

``` HTML
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

## Vue Router

### 安装

``` sh
  # 对于Vue3.x安装4版本，Vue2.x安装3版本
  npm install vue-router@4
```

### HTML

``` HTML
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

- `router-link`: 没有使用常规的`a`标签，Vue Router 可以在**不重新加载页面**的情况下更改 URL，处理 URL 的生成以及编码
- `router-view`: 将显示与 url 对应的组件。可以把它放在任何地方，以适应布局
- 总结来说，`router-link`控制显示那个组件，`router-view`就是显示组件的容器

### JavaScript

总结起来使用步骤：

1. 定义路由组件，如 Home
2. 定义路由 routes 配置项：每个路由都要映射到一个组件（理解成每一项都要有component配置项?）
3. 创建路由实例 `VueRouter.createRouter(options)`
4. 创建根实例，使用新创建的路由实例 `app.use(router)`(需要)，挂载根实例 `app.mount('#app')`

可以把定义创建路由实例的代码放到一个js文件

通过调用 `app.use(router)`，我们可以在任意组件中以 `this.$router` 的形式访问它，并且以 `this.$route` 的形式访问当前路由

要在 setup 函数中访问路由，请调用 useRouter 或 useRoute 函数

``` JS
// 1. 定义路由组件.
// 也可以从其他文件导入
const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。区别于vue2的mode，vue3中将使用history属性来决定采用哪种路由模式(createWebHashHistory, createWebHistory)
  history: VueRouter.createWebHashHistory(),
  // 区别于vue2的base，vue3中的基础路由路径将作为createWebHashHistory或者createWebHistory的唯一参数配置到路由中。
  routes, // `routes: routes` 的缩写
})

// 5. 创建并挂载根实例
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
```

``` JS
// index.vue
// vue-router库当中暴露了useRouter和useRoute两个方法供组件使用，还暴露有其他方法。
import { useRouter, useRoute } from 'vue-router';
import { onMounted, getCurrentInstance } from 'vue';

export default {
  setup() {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const route = useRoute();
    onMounted(() => {
      console.log(proxy.$router === router) // true
      console.log(route) // {path, params, query...}
    });
  }
};

```
