// 实现 instanceOf
// x instanceOf Y => x是否是Y的实例
// 步骤：
//   1: 先取得当前类的原型，当前实例对象的原型链
//   2: 一直循环（执行原型链的查找机制）
// 取得当前实例对象原型链的原型链（proto = proto.__proto__，沿着原型链一直向上查找）
// 如果 当前实例的原型链__proto__上找到了当前类的原型prototype，则返回 true
// 如果 一直找到Object.prototype.__proto__ == null，Object的基类(null)上面都没找到，则返回 false
const _004_instanceOf = {
    myInstanceOf () {
    }
}