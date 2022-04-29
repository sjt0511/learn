<template>
  <ul class="comp-tab">
      <li class="comp-tab_item" v-for="(item,index) in list" :key="index"
          :class="{active:item.value===active}" @click="select(item,index)">
          {{item.label}}
      </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: [String, Number]
        }
    },
    emits: ['doTab'],
    setup (props, context) {
        let active = computed({
            get () {
                return props.modelValue
            },
            set (value) {
                context.emit('update:modelValue', value)
            }
        })

        function select (item) {
            active.value = item.value
            context.emit('doTab', item.value)
        }

        // 初始化相关操作
        function init () {
            if (props.list && props.list.length) {
                let find = props.list.find(x => x.value === active.value)
                find = find || props.list[0]
                select(find)
            }
        }

        init()

        return {
            active,
            select
        }
    }
}
</script>

<style lang="scss">
.comp-tab {
    .active {
        background: pink;
    }
}
</style>