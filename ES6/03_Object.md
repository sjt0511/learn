# 对象

## 属性的简洁表示法

ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法

**注意，简写的对象方法不能用作构造函数，会报错。**

## 属性名表达式

- 直接用标识符作为属性名
- 用表达式作为属性名，即\[表达式\]
- **注意，属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串[object Object]**

## 方法的name属性

- 方法的name属性返回函数名（即方法名）
- 如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set
- bind方法创造的函数，name属性返回bound加上原函数的名字
- Function构造函数创造的函数，name属性返回anonymous。

``` JS
const person = {
  sayName() {
    console.log('hello!');
  },
};
person.sayName.name   // "sayName"

// 表示的是 object.foo属性，是访问器属性--可以有设置方法或获取方法
// 查询一个访问器属性的值时，JavaScript调用getter
// 设置一个访问器属性的值时，JavaScript调用setter，返回值被忽略
const obj = {
  get foo() { return { name: 'test' } },
  set foo(x) {}
};
obj.foo.name
// 'test'
const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
descriptor.get.name // "get foo"
descriptor.set.name // "set foo"
```