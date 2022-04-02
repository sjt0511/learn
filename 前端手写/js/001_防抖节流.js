// 防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行

// 防抖 重在清零，一定时间内多次触发某个事件只调用一次函数(按键、鼠标、窗口大小变化)
// 按钮提交场景：防止多次提交按钮，只执行最后提交的一次
// 服务端验证场景：表单验证需要服务端配合，只执行一段连续的输入事件的最后一次，还有搜索联想词功能类似
function debounce (fn, wait = 1000) {
    let timer = null
     // 最终事件绑定的是这个函数，事件的参数会传到...args剩余形参中，如onclick会传入event
    return function (...args) {
        if (timer) { // 清空定时器
            clearTimeout(timer)
        }
        // 这个this指向的是这个函数的调用者，不一定是window，可能是某个元素如button
        const _this = this
        // 普通函数要绑定this
        // timer = setTimeout(function() {
        //     // 由setTimeout()调用的代码运行在与所在函数完全分离的执行环境上。这会导致，这些代码中包含的 this 关键字在非严格模式会指向 window (或全局)对象，严格模式下为 undefined
        //     // 普通函数的this总是指向它的**直接调用者**，这里普通函数是在window中执行的
        //     console.log('debounce', this, _this)
        //     fn.apply(_this, args) // fn.apply(绑定对象，数组参数)
        // }, wait)

        // 箭头函数this指向是一样的
        timer = setTimeout(() => {
            // 箭头函数从**定义**自己的环境继承this而不是像普通函数那样自己去定义this；而定义它的是function(){}；setTimeOut只是指定一定时间之后window再去调用这个函数
            console.log('debounce', this, _this)
            fn.apply(this, args) // this === _this; 所以可以比普通函数少一步暂存_this
        }, wait)
    }
}

// 节流 重在加锁，一定时间内就调用一次函数
//  scroll 事件，每隔一秒计算一次位置信息等
//  浏览器播放事件，每个一秒计算一次进度信息等
//  input 框实时搜索并发送请求展示下拉列表，每隔一秒发送一次请求 (也可做防抖)
// 拖拽场景：固定时间内只执行一次，防止超高频次触发位置变动
// 缩放场景：监控浏览器resize
// 动画场景：避免短时间内多次触发动画引起性能问题
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