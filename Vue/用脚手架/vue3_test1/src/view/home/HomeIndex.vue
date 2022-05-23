<template>
  <div class="home">
    <header class="home_header">主页</header>
    <ul class="home_menu">
      <li class="home_menu_item" v-for="item in menu" :key="item.value" @click="goTo(item)">
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup () {
    /* 数据 */
    const menu = reactive([
      { label: '扫雷', value: 'test', router: { name: 'test' } }
    ])

    /* vue-router相关 */
    const router = useRouter()

    /* 函数 */
    const goTo = (item) => {
      if (item.router && item.router.name) {
        router.push(item.router)
      } else {
        alert('正在开发')
      }
    }

    /* 返回值 */
    return {
      menu,
      goTo
    }
  }
}
</script>

<style lang="less">
.home {
  // padding: ~`size(10)`;
  #size(padding, 40);

  &_header {
    color: #colors[font];
  }
}
</style>