// 模拟 new
// 创建一个全新的继承fn.prototype的对象，这个对象的__proto__指向构造函数的原型
// 执行构造函数，用call/apply改变this指向
// 若函数返回值的是object类型则作为new方法的返回值返回，否则返回刚才创建的全新对象
const _005_new = {
    isObject (target) {
        return (typeof target === 'object' || typeof target === 'function') && target !== null
    },
    myNew (fn, ...args) {
        // 使用Object.create(Y)，就说明实例的__proto__指向了Y，即实例的原型对象是Y
        // Object.create()：创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
        // 并且执行[[Prototype]]链接; 通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
        // TODO: 不用Object.create怎么搞
        const instance = Object.create(fn.prototype)
        // 改变this指向
        let res = fn.apply(instance, args)

        // 若res是个对象就直接返回，否则返回创建的对象
        return this.isObject(res) ? res : instance
    }
}