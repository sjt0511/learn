<!-- Vue3中.vue文件里template里可以没有根标签，Vue3会用一个fragment包起来且不出现在DOM节点上 -->
<template>
  <div class="test-index">
      第一个根节点
  </div>
  <div>第二个根节点</div>
</template>

<script>
export default {
    name: 'TestIndex',
    setup (props, context) {
        console.log('setup', props, context)
    }
}
</script>

<style>

</style>