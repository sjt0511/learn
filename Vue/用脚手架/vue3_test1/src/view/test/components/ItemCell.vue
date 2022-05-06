<template>
  <div :class="mainClass" @click.left="clickLeft" @contextmenu.prevent="clickRight" @dblclick.left="dblclickLeft">
    <!-- 未翻开 -->
    <template v-if="!item.open">
      <i class="fa fa-flag" v-if="item.flag"></i>
    </template>
    <template v-else-if="!item.value"></template>
    <template v-else-if="item.value <= 8">{{ item.value }}</template>
    <template v-else-if="!isFinite(item.value)">
      <i class="fa fa-bomb"></i>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import Utils from '../../../utils'

export default {
  props: ['modelValue'],
  emits: ['spreadOpen'],
  setup (props, context) {
    // console.log('ItemCell', props, context)
    // 样式
    const mainClass = computed(function () {
      const list = ['item-cell']
      !item.value.open && list.push('item-cell--close')
      item.value.flag && list.push('item-cell--flag')
      return list
    })

    let item = computed({
      get () {
        return props.modelValue || {}
      },
      set (val) {
        context.emit('update:modelValue', val)
      }
    })

    // 鼠标点击事件
    // 单击左键-未翻开的翻开
    const clickLeft = Utils.debounce(function () {
      item.value.open = true
    }, 500)
    // 单击右键-对于未翻开的方格-插旗或者取消插旗
    const clickRight = function () {
      if (!item.value.open) {
        item.value.flag = !item.value.flag
      }
    }
    // 双击左键-在已翻开的数字方格内，执行一次摊开
    const dblclickLeft = function () {
      if (item.value.open) {
        context.emit('spreadOpen', item.value)
      }
    }

    return {
      item,
      mainClass,
      clickLeft,
      clickRight,
      dblclickLeft
    }
  }
}
</script>

<style lang="scss">
.item-cell {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: white;
  border: 1px solid #eee;

  &--close {
    background: pink;
  }

  &--flag {
    color: red;
  }
}
</style>
