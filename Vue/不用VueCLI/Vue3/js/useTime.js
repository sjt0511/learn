import { ref, unref, onMounted, onBeforeUnmount } from 'vue'

export default (paramsOrigin) => {
  // 最好在处理输入参数时兼容 ref 而不只是原始的值。unref() 工具函数会对此非常有帮助
  const params = unref(paramsOrigin)

  // 组合式函数始终返回一个包含多个 ref 的普通的非响应式对象，这样该对象在组件中被解构为 ref 之后仍可以保持响应性
  let date = ref('') // 日期
  let time = ref('') // 时分秒
  let timer = null // 计时器

  /** 开始计时 */
  const startClock = () => {
    if (timer) {
      stopClock(timer)
    }
    let now = new Date()
    // date.value = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
    // time.value = `${now.getHours}:${now.getMinutes()}:${now.getSeconds()}`
    setInterval(() => {
      now = new Date()
      date.value = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
      time.value = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    }, 1000)
  }
  /** 结束计时 */
  const stopClock = () => {
    clearTimeout(timer)
  }

  onMounted(startClock)
  onBeforeUnmount(stopClock)

  return {
    date,
    time,
    startClock,
    stopClock
  }
}