# Proxy

## 概述

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“**元编程**”（meta programming），即**对编程语言进行编程**

Proxy 可以理解成，在目标对象之前架设一层“**拦截**”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“**代理器**”。

``` JS
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
```

上面代码对一个空对象架设了一层拦截，重定义了属性的`读取（get）`和`设置（set）`行为。**Proxy 实际上`重载（overload）`了点运算符，即用自己的定义覆盖了语言的原始定义**

ES6 原生提供 `Proxy` 构造函数，用来生成 Proxy 实例。`new Proxy()`表示生成一个Proxy实例，`target参数`表示`所要拦截的目标对象`，`handler参数`也是一个对象，用来定制`拦截行为`。

- 第一个参数是所要代理的目标对象（上例是一个空对象），即如果没有Proxy的介入，操作原来要访问的就是这个对象
- 要使得Proxy起作用，必须**针对Proxy实例**（下面的proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作
- 如果handler没有设置任何拦截，那就等同于直接通向原对象
- 一个技巧是将 Proxy 对象，设置到`object.proxy`属性，从而可以在object对象上调用: `var object = { proxy: new Proxy(target, handler) };`
- Proxy 实例也可以作为其他对象的原型对象
- 同一个拦截器函数，可以设置拦截多个操作
- 对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果

``` JS
var proxy = new Proxy(target, handler);


var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

Proxy 支持13种拦截操作：

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in循环`，返回一个数组。该方法返回**目标对象所有自身的属性的属性名**，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的**描述对象**。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截
- **apply(target, object, args)**：拦截 Proxy 实例作为**函数调用的操作**，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`
- **construct(target, args)**：拦截 Proxy 实例**作为构造函数调用的操作**，比如`new proxy(...args)`

## Proxy 实例的方法

### get(target, propertyKey, receiver)

get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选

- get方法可以继承
- 利用 Proxy，可以将读取属性的操作（get），转变为**执行某个函数**，从而实现属性的链式操作
- get方法的第三个参数，它总是指向**原始的读操作**所在的那个对象，一般情况下就是 Proxy 实例
- 如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错

``` JS
// 1 如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，访问不存在的属性，只会返回undefined
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, propKey) {
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误

// 2 get方法可以继承
// 拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，拦截会生效
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.foo // "GET foo"

// 3 使用get拦截，实现数组读取负数的索引
// 数组的位置参数是-1，就会输出数组的倒数第一个成员
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // c

// 4 设置 Proxy 以后，达到了将函数名链式使用的效果
var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({} , {
    get : function (pipeObject, fnName) {
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        },value);
      }
      funcStack.push(window[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63

// 5 利用get拦截，实现一个生成各种 DOM 节点的通用函数dom
const dom = new Proxy({}, {
  get(target, property) {
    return function(attrs = {}, ...children) {
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);

// 6 get方法的第三个参数，它总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例
// proxy对象的getReceiver属性是由proxy对象提供的，所以receiver指向proxy对象
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
// d对象本身没有a属性，所以读取d.a的时候，会去d的原型proxy对象找。这时，receiver就指向d，代表原始的读操作所在的那个对象
const proxy2 = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
const d = Object.create(proxy2);
d.a === d // true

// 7 如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```

### set(target, propertyKey, value, receiver)

set方法用来拦截某个**属性的赋值操作**，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选

- 数据验证
- 数据绑定，即每当对象发生变化时，会自动更新 DOM
- 防止内部属性被外部读写
- 第四个参数`receiver`，指的是原始的操作行为所在的那个对象，一般情况下是proxy实例本身
- 如果目标对象自身的某个属性不可写，那么set方法将不起作用
- `set代理`应当返回一个布尔值。严格模式下，`set代理`如果没有返回true，就会报错

``` JS
// 由于设置了存值函数set，任何不符合要求的age属性赋值，都会抛出一个错误，这是数据验证的一种实现方法
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写

``` JS
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```

`set()`的第四个参数

``` JS
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
    return true;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
proxy.foo === proxy // true

// set方法的第四个参数receiver，指的是原始的操作行为所在的那个对象，一般情况下是proxy实例本身
// 设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。
// myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。这时，第四个参数receiver就指向原始赋值行为所在的对象myObj
const myObj = {};
Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
myObj.foo === myObj // true
```

如果目标对象自身的某个属性不可写，那么set方法将不起作用

``` JS
// obj.foo属性不可写，Proxy 对这个属性的set代理将不会生效。
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false
});

const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = 'baz';
    return true;
  }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo // "bar"
```

``` JS
// 严格模式下，set代理返回false或者undefined，都会报错
'use strict';
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
    // 无论有没有下面这一行，都会报错
    return false;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'
```

### apply(target, ctx, args)

`apply`方法拦截`函数的调用`、`call`和`apply`操作

- `apply`方法可以接受三个参数，分别是`目标对象`、`目标对象的上下文对象（this）`和`目标对象的参数数组`

``` JS
var handler = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments);
  }
};

// 每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截
// 直接调用Reflect.apply方法，也会被拦截
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30

Reflect.apply(proxy, null, [9, 10]) // 38
```

### has(target, propertyKey)

`has()`方法用来拦截`HasProperty`操作，即**判断对象是否具有某个属性**时，这个方法会生效。典型的操作就是`in`运算符

- `has()`方法可以接受两个参数，分别是`目标对象`、`需查询的属性名`
- 可以隐藏某些属性不被`in`运算符发现
- 如果原对象**不可配置**或者**禁止扩展**，这时`has()`拦截会报错
- `has()`方法拦截的是`HasProperty`操作，而不是`HasOwnProperty`操作，即`has()`方法不判断一个属性是对象自身的属性，还是继承的属性
- 虽然`for...in`循环也用到了`in`运算符，但是`has()`拦截对`for...in`循环**不生效**

``` JS
// _开头的属性不被in运算符发现
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false

// 不可配置或禁止扩展的对象，has拦截会报错
// obj对象禁止扩展，结果使用has拦截就会报错。如果某个属性不可配置（或者目标对象不可扩展），则has()方法就不得“隐藏”（即返回false）目标对象的该属性
var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

'a' in p // TypeError is thrown

// has()拦截只对in运算符生效，对for...in循环不生效，导致不符合要求的属性没有被for...in循环所排除
let stu1 = {name: '张三', score: 59};
let stu2 = {name: '李四', score: 99};

let handler = {
  has(target, prop) {
    if (prop === 'score' && target[prop] < 60) {
      console.log(`${target.name} 不及格`);
      return false;
    }
    return prop in target;
  }
}

let oproxy1 = new Proxy(stu1, handler);
let oproxy2 = new Proxy(stu2, handler);

'score' in oproxy1
// 张三 不及格
// false

'score' in oproxy2
// true

for (let a in oproxy1) {
  console.log(oproxy1[a]);
}
// 张三
// 59

for (let b in oproxy2) {
  console.log(oproxy2[b]);
}
// 李四
// 99
```

### construct(target, args, newTarget)

`construct()`方法用于拦截`new`命令

- `construct()`方法可以接受三个参数:
  - `target`：目标对象
  - `args`：构造函数的参数数组
  - `newTarget`：创造实例对象时，new命令作用的构造函数（下面例子的p）
