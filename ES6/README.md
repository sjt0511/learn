# ES6

## let 和 const 命令

### let

声明变量，所声明的变量只在let命令所在的代码块内有效

``` JS
// for循环的特别之处
// 设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域

for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

#### 不存在变量提升

`var`命令会发生“变量提升”现象，即变量可以在声明之前使用，值为undefined

`let`命令所声明的变量一定要在声明后使用，否则报错

``` JS
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

#### 暂时性死区

只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

``` JS
var tmp = 123;
// 块级作用域内let又声明了一个局部变量tmp，导致后者绑定这个块级作用域
// 所以if块内在let声明变量前，对tmp赋值会报错
if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

`“暂时性死区”（temporal dead zone，简称 TDZ）`—— 在代码块内，使用let命令声明变量之前，该变量都是不可用的

``` JS
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```

``` JS
// 变量x使用let命令声明，所以在声明之前，都属于x的“死区”，只要用到该变量就会报错。
// 因此，typeof运行时就会抛出一个ReferenceError。
typeof x; // ReferenceError
let x;

// 如果一个变量根本没有被声明，使用typeof反而不会报错
typeof undeclared_variable // "undefined"
```

``` JS
// 参数x默认值等于另一个参数y，而此时y还没有声明，属于“死区”
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错
```

$\color{red}{函数形参声明是怎么实现的}$

暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。**暂时性死区和let、const语句不出现变量提升**

### 块级作用域

ES5有全局作用域和函数作用域---内层变量可能会覆盖外层变量|用来计数的循环变量泄露为全局变量

`ES6块级作用域`-- 外层作用域无法读取内层作用域的内部变量，内层作用域可以定义外层作用域的同名变量

使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了

#### 块级作用域和函数声明

$\color{red}{ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。}$

ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。

避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

- 允许在块级作用域内声明函数。
- 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
- 同时，函数声明还会提升到所在的块级作用域的头部。

ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域

### ES6 声明变量的6种方法

ES5 只有两种声明变量的方法：`var`命令和`function`命令。ES6 除了添加`let`和`const`命令，另外两种声明变量的方法：`import`命令和`class`命令

### globalThis 对象

JavaScript 语言存在一个顶层对象

- 浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
- 浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
- Node 里面，顶层对象是global，但其他环境都不支持。

ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

## 变量的解构赋值

按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

### 数组的解构赋值

这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值

只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值

``` JS
let [a, b, c] = [1, 2, 3]

// 和上面等价
let a = 1
let b = 2
let c = 3
```

#### 默认值

- ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，只有当一个数组成员**严格等于undefined**，默认值才会生效
- 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值
- 默认值可以引用解构赋值的其他变量，但该变量必须已经声明

``` JS
let [x = 1] = [undefined];
x // 1
let [x = 1] = [null];
x // null

// 因为x能取到值，所以函数f根本不会执行
function f() {
  console.log('aaa');
}
let [x = f()] = [1];

let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```
