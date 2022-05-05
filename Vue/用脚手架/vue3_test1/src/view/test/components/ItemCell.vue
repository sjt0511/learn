<template>
  <div :class="mainClass">
      <template v-if="modelValue.flag"></template>
      <template v-if="!modelValue.value"></template>
      <template v-else-if="modelValue.value <= 8">{{modelValue.value}}</template>
      <template v-else-if="!isFinite(modelValue.value)">
          <i class="fa fa-edit"></i>
      </template>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['modelValue'],
    setup (props, context) {
        console.log('ItemCell', props, context)

        const mainClass = computed(function() {
            const list = ['item-cell']
            !props.modelValue.open && list.push('item-cell--close')
            props.flag && list.push('item-cell--flag')
            return list
        })
        // const item = reactive({
        //     value: props.item
        // })
        return {
            mainClass
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
    border: 1px solid #eee;

    &--close {
        background: pink;
    }

    &--flag::before {
        content: ''
    }
}
</style>