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

## 对象新增方法

### Object.assign(target, source)

用于对象的合并，将源对象（source）的所有`自身可枚举属性（包含属性名为Symbol的属性）`，复制到目标对象（target）

- 非对象参数如果作为target参数，会先转为对象，由于undefined和null无法转成对象，就会报错。
- 非对象参数如果作为source参数，先转为对象，对于无法转为对象的就跳过
- 布尔值、数值、字符串分别转成对应的包装对象，可以看到它们的原始值都在包装对象的内部属性[[PrimitiveValue]]上面，这个属性是不会被Object.assign()拷贝的
- 只有字符串的包装对象，会产生可枚举的实义属性，那些属性则会被拷贝。
- Object.assign()拷贝的属性是有限制的，只拷贝源对象的`自身属性`（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）
- 属性名为 `Symbol` 值的属性，也会被Object.assign()拷贝

``` JS
const v1 = 'abc';
const v2 = true;
const v3 = 10;
const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }

Object(true) // {[[PrimitiveValue]]: true}
Object(10)  //  {[[PrimitiveValue]]: 10}
Object('abc') // {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}


Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })
// { a: 'b', Symbol(c): 'd' }
```

#### 注意点

1. **浅拷贝：**如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用
2. **同名属性的替换：**嵌套的对象，一旦遇到同名属性，Object.assign()的处理方法是替换，而不是添加。
3. **数组的处理：**Object.assign()可以用来处理数组，但是会把数组视为对象
4. **取值函数的处理：**Object.assign()只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。Object.assign()不会复制这个取值函数，只会拿到值以后，将这个值复制过去

``` JS
// 浅拷贝
const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
obj2.a.b // 2

// 同名属性的替换：target对象的a属性被source对象的a属性整个替换掉了，而不会得到{ a: { b: 'hello', d: 'e' } }的结果
const target = { a: { b: 'c', d: 'e' } }
const source = { a: { b: 'hello' } }
Object.assign(target, source) // { a: { b: 'hello' } }

// 数组的处理：Object.assign()把数组视为属性名为 0、1、2 的对象，因此源数组的 0 号属性4覆盖了目标数组的 0 号属性1。
Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]

// 取值函数的处理：source对象的foo属性是一个取值函数，Object.assign()不会复制这个取值函数，只会拿到值以后，将这个值复制过去
const source = {
  get foo() { return 1 }
};
const target = {};
Object.assign(target, source)
// { foo: 1 }
```

#### 常见用途

1. **为对象添加属性**
2. **为对象添加方法**
3. **克隆对象**
4. **合并多个对象**
5. **为属性指定默认值**

``` JS
// 为对象添加属性
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

// 为对象添加方法
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});
// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) {
  ···
};
SomeClass.prototype.anotherMethod = function () {
  ···
};

// 克隆对象
function clone(origin) {
  return Object.assign({}, origin);
}
// 采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

// 合并多个对象
// 将多个对象合并到某个对象
const merge =
  (target, ...sources) => Object.assign(target, ...sources);
// 要返回一个新对象
const merge =
  (...sources) => Object.assign({}, ...sources);  
```

### Object.getOwnPropertyDescriptors()

ES5 的`Object.getOwnPropertyDescriptor()`：返回某个**对象属性**的描述对象（descriptor）

ES2017 引入了`Object.getOwnPropertyDescriptors()`方法，返回**指定对象所有自身属性**（非继承属性）的描述对象

- 目的：主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
  - Object.assign方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。
  - Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝。
- 配合Object.create()方法，将对象属性克隆到一个新对象。这属于浅拷贝。
- 可以实现一个对象继承另一个对象。
  - ES6 规定__proto__只有浏览器要部署，其他环境不用部署

``` JS
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```

``` JS
// 正确拷贝get和set属性
const source = {
  set foo(value) {
    console.log(value);
  }
};
const target1 = {};
Object.assign(target1, source);
Object.getOwnPropertyDescriptor(target1, 'foo')
// { value: undefined,
//   writable: true,
//   enumerable: true,
//   configurable: true }


const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
```

``` JS
// 克隆
const clone = Object.create(Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj));
// 或者
const shallowClone = (obj) => Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
```

``` JS
// 继承
// 1 老写法
const obj = {
  __proto__: prot,
  foo: 123,
};

// 2 ES6 规定__proto__只有浏览器要部署，其他环境不用部署。如果去除__proto__，上面代码就要改成下面这样。
const obj = Object.create(prot);
obj.foo = 123;
//   或者
const obj = Object.assign(
  Object.create(prot),
  {
    foo: 123,
  }
);

// 3 Object.getOwnPropertyDescriptors()
const obj = Object.create(
  prot,
  Object.getOwnPropertyDescriptors({
    foo: 123,
  })
);
```

### __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()

JavaScript 语言的对象继承是通过原型链实现的。以下为操作原型对象

#### __proto__属性

读取或设置当前对象的原型对象（prototype）。目前，所有浏览器（包括 IE11）都部署了这个属性。

标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的

而是使用下面的Object.setPrototypeOf()（写操作）、Object.getPrototypeOf()（读操作）、Object.create()（生成操作）代替。

``` JS
// __proto__调用的是Object.prototype.__proto__
Object.defineProperty(Object.prototype, '__proto__', {
  get() {
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },
  set(proto) {
    if (this === undefined || this === null) {
      throw new TypeError();
    }
    if (!isObject(this)) {
      return undefined;
    }
    if (!isObject(proto)) {
      return undefined;
    }
    let status = Reflect.setPrototypeOf(this, proto);
    if (!status) {
      throw new TypeError();
    }
  },
});

function isObject(value) {
  return Object(value) === value;
}
```

#### Object.setPrototypeOf(object, prototype)

（推荐）设置一个对象的原型对象（prototype），返回参数对象本身

- 如果第一个参数不是对象，会自动转为对象。但是由于返回的还是第一个参数，所以这个操作不会产生任何效果。
- 由于undefined和null无法转为对象，所以如果第一个参数是undefined或null，就会报错。

``` JS
// 格式
Object.setPrototypeOf(object, prototype)

// 用法
const o = Object.setPrototypeOf({}, null);

// 等同于
function setPrototypeOf(obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```

``` JS
let proto = {};
let obj = { x: 10 };
Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;

obj.x // 10
obj.y // 20
obj.z // 40
```

``` JS
Object.setPrototypeOf(1, {}) === 1 // true
Object.setPrototypeOf('foo', {}) === 'foo' // true
Object.setPrototypeOf(true, {}) === true // true

Object.setPrototypeOf(undefined, {})
// TypeError: Object.setPrototypeOf called on null or undefined
Object.setPrototypeOf(null, {})
// TypeError: Object.setPrototypeOf called on null or undefined
```

#### Object.getPrototypeOf(obj)

读取一个对象的原型对象

- 如果参数不是对象，会被自动转为对象
- 如果参数是undefined或null，它们无法转为对象，所以会报错

``` JS
function Rectangle() {
  // ...
}

const rec = new Rectangle();

Object.getPrototypeOf(rec) === Rectangle.prototype
// true

Object.setPrototypeOf(rec, Object.prototype);
Object.getPrototypeOf(rec) === Rectangle.prototype
// false



// 等同于 Object.getPrototypeOf(Number(1))
Object.getPrototypeOf(1)
// Number {[[PrimitiveValue]]: 0}

// 等同于 Object.getPrototypeOf(String('foo'))
Object.getPrototypeOf('foo')
// String {length: 0, [[PrimitiveValue]]: ""}

// 等同于 Object.getPrototypeOf(Boolean(true))
Object.getPrototypeOf(true)
// Boolean {[[PrimitiveValue]]: false}

Object.getPrototypeOf(1) === Number.prototype // true
Object.getPrototypeOf('foo') === String.prototype // true
Object.getPrototypeOf(true) === Boolean.prototype // true



Object.getPrototypeOf(null)
// TypeError: Cannot convert undefined or null to object
Object.getPrototypeOf(undefined)
// TypeError: Cannot convert undefined or null to object
```

### Object.keys()，Object.values()，Object.entries()

#### Object.keys()

返回参数对象**自身**的（不含继承的）所有**可遍历**（可枚举？enumerable）属性的**键名**的一个数组

``` JS
var obj = { foo: 'bar', baz: 42 };
Object.keys(obj)
// ["foo", "baz"]
```

ES2017 引入了跟Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用

``` JS
let {keys, values, entries} = Object;
let obj = { a: 1, b: 2, c: 3 };

for (let key of keys(obj)) {
  console.log(key); // 'a', 'b', 'c'
}
for (let value of values(obj)) {
  console.log(value); // 1, 2, 3
}
for (let [key, value] of entries(obj)) {
  console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}
```

#### Object.values()

参数对象**自身**的（不含继承的）所有可遍历（**enumerable**）属性的**键值**

返回数组的成员顺序，与本章的《属性的遍历》部分介绍的排列规则一致。

- Object.values会过滤属性名为 Symbol 值的属性
- 如果Object.values方法的参数是一个字符串，会返回各个字符组成的一个数组
- 如果参数不是对象，Object.values会先将其转为对象。由于数值和布尔值的包装对象，都不会为实例添加非继承的属性。所以，Object.values会返回空数组。

``` JS
const obj = { foo: 'bar', baz: 42 };
Object.values(obj)
// ["bar", 42]

const obj = { 100: 'a', 2: 'b', 7: 'c' };
Object.values(obj)
// ["b", "c", "a"]

Object.values('foo')
// ['f', 'o', 'o']

Object.values(42) // []
Object.values(true) // []
```

Object.create方法的第二个参数添加的对象属性（属性p），**如果不显式声明，默认是不可遍历的，因为p的属性描述对象的enumerable默认是false，**

``` JS
// Object.create的第二个参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性
const obj = Object.create({}, {p: {value: 42}});
Object.values(obj) // []

const obj = Object.create({}, {p:
  {
    value: 42,
    enumerable: true, // 可枚举
    writable: true, // 可写
    configurable: true // 可配置
  }
});
Object.values(obj) // [42]
```

#### Object.entries()

参数对象**自身**的（不含继承的）所有**可遍历（enumerable）**属性的**键值对**数组

除了返回值不一样，该方法的行为与`Object.values`基本一致

``` JS
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]
```

### Object.fromEntries()

是`Object.entries()`的逆操作，用于将一个键值对数组转为对象。

- 是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象
- **配合URLSearchParams对象，将查询字符串转为对象**

``` JS
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }


Object.fromEntries(new URLSearchParams('foo=bar&baz=qux'))
// { foo: "bar", baz: "qux" }
```

### Object.hasOwn()

JavaScript 对象的属性分成两种：自身的属性和继承的属性。

- 对象实例有一个hasOwnProperty()方法，可以判断某个属性是否为原生属性。
- ES2022 在Object对象上面新增了一个`静态方法Object.hasOwn()`，也可以判断是否为自身的属性
- Object.hasOwn()的一个好处是，对于**不继承Object.prototype的对象不会报错**，而hasOwnProperty()是会报错的

``` JS
const foo = Object.create({ a: 123 });
foo.b = 456;

// 对象foo的属性a是继承属性，属性b是原生属性。Object.hasOwn()对属性a返回false，对属性b返回true
Object.hasOwn(foo, 'a') // false
Object.hasOwn(foo, 'b') // true



const obj = Object.create(null);
// Object.create(null)返回的对象obj是没有原型的，不继承任何属性，这导致调用obj.hasOwnProperty()会报错，但是Object.hasOwn()就能正确处理这种情况
obj.hasOwnProperty('foo') // 报错
Object.hasOwn(obj, 'foo') // false
```
