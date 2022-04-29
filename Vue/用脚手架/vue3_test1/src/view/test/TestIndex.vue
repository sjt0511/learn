<!-- Vue3中.vue文件里template里可以没有根标签，Vue3会用一个fragment包起来且不出现在DOM节点上 -->
<template>
  <div class="test-index">
      <!-- TODO: 可以让用户选择难度 -->
      <!-- <ul>
          <li v-for="(item,index) in tab.data" :key="index" @click="init(item.value)">
              {{item.label}}
          </li>
      </ul> -->
      <comp-tab v-model:modelValue="tab.active" :list="tab.data" @doTab="init"></comp-tab>
  </div>
  <div>第二个根节点</div>
</template>

<script>
import { reactive } from 'vue'
import CompTab from '../../components/CompTab.vue'
export default {
  components: { CompTab },
    name: 'TestIndex',
    setup (props, context) {
        const tab = reactive({
            data: [
                { label: '初级 9*9', value: 1, num: 10, m: 9, n: 9 },
                { label: '中级 12*9', value: 2, num: 10, m: 12, n: 9 },
            ],
            active: ''
        })

        let matrix = reactive([])

        function init (value) {
            tab.active = value
            const find = tab.data.find(x => x.value === value)
            matrix.length = 0
            for (let i = 0; i < find.m; i++) {
                matrix.push(new Array(find.n).fill(0))
            }
            console.log('init', find)
        }

        init(1)

        console.log('setup', props, context, matrix)
        return {
            tab,
            matrix,
            init
        }
    }
}
</script>

<style>

</style>