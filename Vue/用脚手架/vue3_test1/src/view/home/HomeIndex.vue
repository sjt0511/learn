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
  setup() {
    /* 数据 */
    const menu = reactive([
      { label: 'sweep', value: 'test', router: { name: 'test', params: { test: { label: 'test', value: 1 }, list: [1,2,3], key: 1, obj: {name: 'pp', infos: {height:158, sex: '女'}} } } }
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

<style lang="scss">
.home {
  font-size: size(24);
  color: color();
  // padding: ~`size(10)`;
  // #size(padding, 40);

  &_header {
    // color: #colors[font];
  }
}
</style>