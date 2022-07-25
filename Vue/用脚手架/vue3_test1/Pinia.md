# Pinia 使用 -- 基于 Vue3

## 安装

``` SH
yarn add pinia
# 或者使用 npm
npm install pinia
```

``` JS
// 创建一个 pinia（根存储）并将其传递给应用程序
import { createPinia } from 'pinia'
app.use(createPinia())
```

## Store

一个 Store （如 Pinia）是一个实体，它持有未绑定到您的组件树的状态和业务逻辑。换句话说，**它托管全局状态**。它有三个概念，state、getters 和 actions 并且可以安全地假设这些概念等同于组件中的“数据”、“计算”和“方法”。

存储应该包含可以在整个应用程序中访问的数据

## 定义一个 Store

Store 是使用 `defineStore()` 定义的，并且它需要一个**唯一名称**，作为第一个参数传递

- 第一个参数name: 也称为 id，是必要的，Pinia 使用它来将 store 连接到 devtools
- 将返回的函数命名为 `use...` 是跨可组合项的约定，以使其符合你的使用习惯
- defineStore()返回一个函数 useXXX，useXXX()返回一个store实例

``` JS
import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
  // other options...
})
```

## 使用 store

一旦 Store 被实例化，你就可以直接在 store 上访问 state、getters 和 actions 中定义的任何属性。

- store 是一个用reactive 包裹的对象
- 这意味着**不需要在getter 之后写.value**，
- 就像setup 中的props 一样，我们**不能对store进行解构**
- 为了从 Store 中提取属性同时保持其响应式，需要使用 `storeToRefs()`--它将为任何响应式属性创建 refs

``` JS
import { useStore } from '@/stores/counter'

export default {
  setup() {
    // 一个Store实例
    const store = useStore()

    return {
      // 您可以返回整个 store 实例以在模板中使用它
      store,
    }
  },
}


export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ 这不起作用，因为它会破坏响应式
    // 这和从 props 解构是一样的
    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // 一直会是 "eduardo"
      name,
      // 一直会是 2
      doubleCount,
      // 这将是响应式的
      doubleValue: computed(() => store.doubleCount),
      }
  },
})


export default defineComponent({
  setup() {
    const store = useStore()
    // `name` 和 `doubleCount` 是响应式引用
    // 这也会为插件添加的属性创建引用
    // 但跳过任何 action 或 非响应式（不是 ref/reactive）的属性
    const { name, doubleCount } = storeToRefs(store)

    return {
      name,
      doubleCount
    }
  },
})
```

## state

state 是 store 的核心部分，在 Pinia 中，状态被定义为**返回初始状态的函数**

``` JS
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

### 访问 "state"

默认情况下，可以通过 store 实例访问状态来直接读取和写入状态：

``` JS
const store = useStore()
store.counter++
```

### 重置状态 $reset()

调用 store 上的 `$reset()` 方法将状态 重置 到其初始值

``` JS
const store = useStore()
store.$reset()
```

### 使用

假设已创建以下 Store

``` JS
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  })
})
```

### 使用 setup()

setup() 钩子可以使在 Options API 中使用 Pinia 更容易。 不需要额外的 map helper！

``` JS
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    tripleCounter() {
      return counterStore.counter * 3
    },
  },
}
```

### 不使用setup()

如果不使用 Composition API，并且使用的是 computed、methods、...，则可以使用 `mapState()` 帮助器将状态属性映射为**只读计算属性**：

- 如果希望能够写入这些状态属性（例如，如果您有一个表单），您可以使用 `mapWritableState()` 代替。 请注意，您不能传递类似于 mapState() 的函数：

``` JS
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 允许访问组件内部的 this.counter
    // 与从 store.counter 读取相同
    ...mapState(useCounterStore, {
      myOwnName: 'counter',
      // 您还可以编写一个访问 store 的函数
      double: store => store.counter * 2,
      // 它可以正常读取“this”，但无法正常写入...
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),

    // 允许访问组件内的 this.counter 并允许设置它
    // this.counter++
    // 与从 store.counter 读取相同
    ...mapWritableState(useCounterStore, ['counter'])
    // 与上面相同，但将其注册为 this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```

### 改变状态 $patch

除了直接用 store.counter++ 修改 store，还可以调用 $patch 方法：使用部分“state”对象同时应用多个更改

- $patch 方法也接受一个函数来批量修改集合内部分对象的情况：任何集合修改（例如，从数组中推送、删除、拼接元素）都需要您创建一个新集合
- $patch() 允许您将批量更改的日志写入开发工具中的一个条目中。 注意两者，state 和 $patch() 的直接更改都出现在 devtools 中

``` JS
// 不要用这种
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})

// 用下面这种来变更
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

### 替换 state

- 可以通过将其 $state 属性设置为新对象来替换 Store 的整个状态
- 可以通过更改 pinia 实例的 state 来替换应用程序的整个状态。 这在 `SSR for hydration` 期间使用。

``` JS
store.$state = { counter: 666, name: 'Paimon' }
```

### 订阅状态 $subscribe()

可以通过 store 的 $subscribe() 方法查看状态及其变化

使用 $subscribe() 的优点是 subscriptions 只会在 patches 之后触发一次（例如，当使用上面的函数版本时）

默认情况下，state subscriptions 绑定到添加它们的组件（如果 store 位于组件的 setup() 中）。 当组件被卸载时，它们将被自动删除。 如果要在卸载组件后保留它们，请将 { detached: true } 作为第二个参数传递给 detach 当前组件的 state subscription

``` JS
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 与 cartStore.$id 相同
  mutation.storeId // 'cart'
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload // 补丁对象传递给 to cartStore.$patch()

  // 每当它发生变化时，将整个状态持久化到本地存储
  localStorage.setItem('cart', JSON.stringify(state))
})

export default {
  setup() {
    const someStore = useSomeStore()

    // 此订阅将在组件卸载后保留
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

## Getters

Getter 完全等同于 Store 状态的 计算值。 它们可以用 defineStore() 中的 getters 属性定义

- 大多数时候，getter 只会依赖状态，但是，他们可能需要使用其他 getter
- 可以在定义常规函数时通过 this 访问到 整个 store 的实例
- 可以直接在 store 实例上访问 getter，就像组件的计算属性一样

``` JS
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
})
```

``` HTML
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```

### 访问其他Getter

与计算属性一样，您可以组合多个 getter。 通过 this 访问任何其他 getter

不使用 TypeScript，您也可以使用 JSDoc 提示您的 IDE 类型

``` JS
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 类型是自动推断的，因为我们没有使用 `this`
    doubleCount: (state) => state.counter * 2,
    // 这里需要我们自己添加类型（在 JS 中使用 JSDoc）。 我们还可以
    // 使用它来记录 getter
    /**
     * 返回计数器值乘以二加一。
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动完成 ✨
      return this.doubleCount + 1
    },
  },
})
```

### 将参数传递给getter

Getters 只是幕后的 computed 属性，因此无法向它们传递任何参数。 但是，您可以**从 getter 返回一个函数**以接受任何参数

``` JS
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

``` HTML
<script>
export default {
  setup() {
    const store = useStore()

    return { getUserById: store.getUserById }
  },
}
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

请注意，在执行此操作时，**getter 不再缓存，它们只是您调用的函数**。 但是，**可以在 getter 本身内部缓存一些结果**

``` JS
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

### 访问其他Store的getter

直接引入其他store

``` JS
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

## 与 setup() 一起使用

您可以直接访问任何 getter 作为 store 的属性（与 state 属性完全一样）：

``` JS
export default {
  setup() {
    const store = useStore()

    store.counter = 3
    store.doubleCount // 6
  },
}
```

定义一个store

``` JS
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter() {
      return this.counter * 2
    }
  }
})
```

``` JS
// 使用setup()
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return counterStore.doubleCounter * 2
    },
  },
}

// 不使用
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 允许访问组件内的 this.doubleCounter
    // 与从 store.doubleCounter 中读取相同
    ...mapState(useCounterStore, ['doubleCount'])
    // 与上面相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // 您还可以编写一个访问 store 的函数
      double: store => store.doubleCount,
    }),
  },
}
```

## Actions

actions 可以是异步的，可以在其中await 任何 API 调用甚至其他操作！ 只要获得“Promise”，使用的库并不重要：

``` JS
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    },
  },
})
```

你也可以完全自由地设置你想要的任何参数并返回任何东西。 调用 Action 时，一切都会自动推断！Actions 像 methods 一样被调用：

``` JS
export default defineComponent({
  setup() {
    const main = useMainStore()
    // Actions 像 methods 一样被调用：
    main.randomizeCounter()

    return {}
  },
})
```

### 订阅Actions $onAction()

可以使用 store.$onAction() 订阅 action 及其结果。 传递给它的回调在 action 之前执行。 after 处理 Promise 并允许您在 action 完成后执行函数。 以类似的方式，onError 允许您在处理中抛出错误

``` JS
const unsubscribe = someStore.$onAction(
  ({
    name, // action 的名字
    store, // store 实例
    args, // 调用这个 action 的参数
    after, // 在这个 action 执行完毕之后，执行这个函数
    onError, // 在这个 action 抛出异常的时候，执行这个函数
  }) => {
    // 记录开始的时间变量
    const startTime = Date.now()
    // 这将在 `store` 上的操作执行之前触发
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 如果 action 成功并且完全运行后，after 将触发。
    // 它将等待任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回 Promise.reject ，onError 将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动移除订阅
unsubscribe()
```

默认情况下，action subscriptions 绑定到添加它们的组件（如果 store 位于组件的 setup() 内）。 意思是，当组件被卸载时，它们将被自动删除。 如果要在卸载组件后保留它们，请将 true 作为第二个参数传递给当前组件的 detach action subscription：

``` JS
export default {
  setup() {
    const someStore = useSomeStore()

    // 此订阅将在组件卸载后保留
    someStore.$onAction(callback, true)

    // ...
  },
}
```

## 插件
