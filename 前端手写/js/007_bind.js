// 实现bind--把函数绑定到对象
// 常见目的--让非箭头函数变为箭头函数; 调用者不能是箭头函数：∵箭头函数从定义自身的环境继承this，这个值不能被bind覆盖∴绑定不会起作用
// bind 需要返回一个函数，需要判断一些边界问题：对于函数来说有两种方式调用，一种是直接调用，一种是通过 new 的方式
// 1 直接调用：fn.apply;由于可以 f.bind(obj, 1)(2)，所以我们需要将两边的参数拼接起来
// 2 new执行构造函数：不会被任何方式改变 this，所以对于这种情况我们需要忽略传入的 this
// 3 箭头函数：箭头函数的this是从定于上下文继承的，所以也不会改变
// !!!!!!!! bind之后不能再次修改this的执行，bind多次后执行，函数this还是指向第一次bind的对象 !!!!!!!
// fn.bind(obj,)
const _007_bind = {
    init () {
        Function.prototype.myBind = function(context, ...outArgs) {
            // 这里的this是调用了myBind的那个函数
            const self = this
            console.log('self', self)

            return function F(...innerArgs) {
                console.log(111, self.prototype)
                // TODO: 如何判断是个箭头函数
                if (!self.prototype) { // 箭头函数调用bind；this不起作用；直接调用原箭头函数
                    console.log(1)
                    return self(...outArgs, ...innerArgs)
                }
                // 判断是否是new执行构造函数：new fn.myBind(obj,1)(2) =>new fn(1,2)
                // new 干了的事情：instance=Object.create(F.prototype);改变this指向instance;返回值;
                else if (self instanceof F) {
                    console.log(2)
                    // 对于这种，保持this不变性;要忽略传进来的context
                    return new self(...outArgs, ...innerArgs)
                } else {
                    console.log(3)
                    return self.apply(context, [...outArgs, ...innerArgs])
                }
            }

        }

        console.log('定义环境this=', this)
        const obj = {
            name: 'funcObj',
            fn: (b, c) => {
                // 箭头函数不自己定义this，而是从定义它的环境去继承this
                console.log(this.name, b, c, this)
            },
            // 对象里的函数要写成普通函数，这样this才是对象本身
            fn2 (d, e) {
                console.log(this.name, d, e, this)
            }
        }

        const obj2 = {
            name: 'bindObj'
        }

        obj.fn.myBind(obj2,1)(2)
        obj.fn2.myBind(obj2,3)(4)
        console.log('-----------------------')
        function fn111 () {console.log('fn')}
        const fn222 = fn111
        fn222.myBind(obj2, 3)()
    }
}