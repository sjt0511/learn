// 防抖 重在清零，一定时间内多次触发某个事件只调用一次函数(按键、鼠标、窗口大小变化)
function debounce (fn, wait = 1000) {
    let timer = null
     // 最终事件绑定的是这个函数，事件的参数会传到...args剩余形参中，如onclick会传入event
    return function (...args) {
        if (timer) { // 清空定时器
            clearTimeout(timer)
        }
        // 这个this指向的是这个函数的调用者，不一定是window，可能是某个元素如button
        const _this = this
        timer = setTimeout(function() {
            // setTimeOut中的this是window，因为setTimeOut执行环境不一样
            console.log('debounce', this, _this)
            fn.apply(_this, args) // fn.apply(绑定对象，数组参数)
        }, wait)
    }
}

// 节流 重在加锁，一定时间内就调用一次函数
//  scroll 事件，每隔一秒计算一次位置信息等
//  浏览器播放事件，每个一秒计算一次进度信息等
//  input 框实时搜索并发送请求展示下拉列表，每隔一秒发送一次请求 (也可做防抖)
function throttle (fn, wait = 1000) {
    let timer = null
    return function (...args) {
        if (timer) { // 加锁：正在计时，这段时间已被占用，需要等当前定时器结束
            return
        }
        const _this = this
        timer = setTimeout(function() {
            console.log('throttle', this, _this)
            fn.apply(_this, args)
            timer = null // 计时结束，开锁
        }, wait)
    }

}