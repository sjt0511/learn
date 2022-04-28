<!-- Vue3中.vue文件里template里可以没有根标签，Vue3会用一个fragment包起来且不出现在DOM节点上 -->
<template>
  <div class="test-index">
      <!-- TODO: 可以让用户选择难度 -->
      
  </div>
  <div>第二个根节点</div>
</template>

<script>
import { reactive } from 'vue'
export default {
    name: 'TestIndex',
    setup (props, context) {
        const tab = reactive({
            data: [
                { label: '初级 9*9', value: 1, num: 10, m: 9, n: 9 }
            ],
            active: 1
        })
        console.log('setup', props, context)
        return {
            tab
        }
    }
}
</script>

<style>

</style>