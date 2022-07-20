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
- 如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述

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

const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```

## 属性的可枚举性和遍历

### 可枚举性

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为

`Object.getOwnPropertyDescriptor`方法可以获取该属性的`描述对象`

描述对象的enumerable属性，称为“可枚举性”，如果该属性为false，就表示某些操作会忽略当前属性:

- `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`：忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
- **ES6 规定，所有 Class 的原型的方法都是不可枚举的**

``` JS
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```

### 属性的遍历

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列

#### （1）for...in

遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）

#### （2）Object.keys(obj)

对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名

#### （3）Object.getOwnPropertyNames(obj)

对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名

#### （4）Object.getOwnPropertySymbols(obj)

对象自身的所有 Symbol 属性的键名

#### （5）Reflect.ownKeys(obj)

对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

## super 关键字

this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向`当前对象的原型对象`。

- super关键字表示原型对象时，**只能用在对象的方法之中**，用在其他地方都会报错
- **只有`对象方法的简写`法可以让 JavaScript 引擎确认，定义的是对象的方法**
- JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）或Object.getPrototypeOf(this).foo.call(this)（方法）

``` JS
const proto = {
  foo: 'hello'
};
const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};
Object.setPrototypeOf(obj, proto);
obj.find() // "hello"


// 报错:super用在属性里面
const obj = {
  foo: super.foo
}

// 报错:super用在一个函数里面，然后赋值给foo属性
const obj = {
  foo: () => super.foo
}

// 报错:super用在一个函数里面，然后赋值给foo属性
const obj = {
  foo: function () {
    return super.foo
  }
}
```

## 对象扩展运算符

ES2018 将这个运算符引入了对象。

### 解构赋值

从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。

### 扩展运算符

取出参数对象的所有可遍历属性，拷贝到当前对象之中

对象的扩展运算符等同于使用`Object.assign()`方法

``` JS
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```