# 笔记

## 004 实现 instanceOf

### 原型链

实例有__proto__属性(隐式原型)，构造函数有prototype(显式原型)
``` JS
function Person(name = '', age = 0) {
  this._name = name
  this._age = age
}
// p1是Person的实例对象
const p1 = new Person('张三', 20)

// Person.prototype 和 p1.__proto__ 都指向 Person 的原型对象
console.log(Person.prototype === p1.__proto__) // true
```

![原型链](https://user-images.githubusercontent.com/23610322/162155112-060fcd76-7352-48e3-9cf8-e0750a4997c8.png)
![image](https://user-images.githubusercontent.com/23610322/162158913-5958e402-72be-40ac-a439-8900ff85b0b1.png)

