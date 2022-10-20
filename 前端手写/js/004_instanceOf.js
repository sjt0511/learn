// 实现 instanceOf
// x instanceOf Y => x是否是Y的实例; x是一个实例对象，Y是一个构造函数；严格上说是看x是否继承了Y.prototype
// 步骤：
//   1: 先取得当前类的原型，当前实例对象的原型链
//   2: 一直循环（执行原型链的查找机制）
// 取得当前实例对象原型链的原型链（proto = proto.__proto__，沿着原型链一直向上查找）
// 如果 当前实例的原型链__proto__上找到了当前类的原型prototype，则返回 true
// 如果 一直找到Object.prototype.__proto__ == null，Object的基类(null)上面都没找到，则返回 false
const _004_instanceOf = {
    myInstanceOf (example, classFunc) {
        // 由于instance要检测的是某对象，需要有一个前置判断条件
        // 基本数据类型直接返回false
        if(typeof example !== 'object' || example === null) return false;
        let proto = Object.getPrototypeOf(example) // 实例原型
        while(true) {
            if (proto === null) return false
            if (proto === classFunc.prototype) { // 原型链上找到了
                return true
            } else { // 没找到就继续延原型链向上查
                proto = Object.getPrototypeOf(proto)
            }
        }
    }
}