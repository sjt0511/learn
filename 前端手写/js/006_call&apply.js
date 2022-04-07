const _006_callApplay = {
    init() {
        // 实现call: fn.call(obj, 1, 2 ,3)
        // 将函数设为对象的属性
        // 执行&删除这个函数
        // 指定this到函数并传入给定参数执行函数
        // 如果不传入参数，默认指向为 window
        Function.prototype.myCall = function (context = window, ...args) {
            // this-->func--是调用myCall的那个函数  context--> obj  args--> 传递过来的参数
            // 在context上加一个唯一值不影响context上的属性
            let key = Symbol('key')
            // context为调用的上下文,this此处为函数，将这个函数作为context的方法
            context[key] = this;
            // let args = [...arguments].slice(1)   //第一个参数为obj所以删除,伪数组转为数组

            let result = context[key](...args);
            delete context[key]; // 不删除会导致context属性越来越多
            return result;
        }


        // 实现apply: fn.apply(obj, [1,2,3])
        Function.prototype.myApply = function (context = window, args = []) {
            let key = Symbol('key')
            context[key] = this
            let result = context[key](...args)
            delete context[key]
            return result
        }
    }
}