# 函数扩展

## 函数参数的默认值

### 基本用法

允许为函数的参数设置默认值，即直接写在参数定义的后面

- 参数变量x是默认声明的，在函数体中，不能用let或const再次声明，否则会报错
- 参数默认值不是传值的，而是每次都重新计算默认值表达式的值——惰性求值

``` JS
// 参数p的默认值是x + 1。这时，每次调用函数foo()，都会重新计算x + 1，而不是默认p等于 100
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

### 与解构赋值默认值结合使用

函数参数的默认值生效以后，参数解构赋值依然会进行

``` JS
function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5
```

``` JS
// 写法一：解构赋值赋默认值，并且参数赋默认值{}
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二：参数赋默认值{x:0, y:0}
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x 和 y 都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x 有值，y 无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]
```

### 参数默认值的位置

定义了默认值的参数，应该是函数的尾参数

- 无法只省略该参数，而不省略它后面的参数，除非显式输入undefined
- 只有传入undefined才会触发默认值，null并不会触发默认值

``` JS
function f(x, y = 5, z) {
  return [x, y, z];
}

f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // 报错
f(1, undefined, 2) // [1, 5, 2]
```

### 函数的length

指定了默认值以后，函数的length属性，将返回**没有指定默认值**的参数个数==>指定了默认值后，length属性将失真

- `length`属性的含义是，该函数预期传入的参数个数
- 设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了

``` JS
(function (a) {}).length // 1
(function (a, b, c = 5) {}).length // 2
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

### 作用域

**一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。**

``` JS
// 参数y的默认值等于变量x。调用函数f时，参数形成一个单独的作用域。在这个作用域里面，默认值变量x指向第一个参数x，而不是全局变量x，所以输出是2
var x = 1;
function f(x, y = x) {
  console.log(y);
}
f(2) // 2

// 函数f调用时，参数y = x形成一个单独的作用域。这个作用域里面，变量x本身没有定义，所以指向外层的全局变量x。函数调用时，函数体内部的局部变量x影响不到默认值变量x
// 如果此时，全局变量x不存在，就会报错 => ReferenceError: x is not defined
let x = 1;
function f(y = x) {
  let x = 2;
  console.log(y);
}
f() // 1

// 参数x = x形成一个单独作用域。实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错。
// 暂时性死区：let代码块中，用let声明变量之前不能使用它(赋值)
var x = 1;
function foo(x = x) {
  // ...
}
foo() // ReferenceError: Cannot access 'x' before initialization

// 参数的默认值是一个函数，该函数的作用域也遵守这个规则
// 函数bar的参数func的默认值是一个匿名函数，返回值为变量foo。函数参数形成的单独作用域里面，并没有定义变量foo，所以foo指向外层的全局变量foo，因此输出outer。
// 如果去掉外层的声明foo，会报错，匿名函数里面的foo指向函数外层，但是函数外层并没有声明变量foo，所以就报错了 => ReferenceError: foo is not defined
let foo = 'outer';
function bar(func = () => foo) {
  let foo = 'inner';
  console.log(func());
}
bar(); // outer


// 函数foo的参数形成一个单独作用域。这个作用域里面，首先声明了变量x，然后声明了变量y，y的默认值是一个匿名函数。
// 这个匿名函数内部的变量x，指向同一个作用域的第一个参数x。函数foo内部又声明了一个内部变量x，
// 该变量与第一个参数x由于不是同一个作用域，所以不是同一个变量，因此执行y后，内部变量x和外部全局变量x的值都没变。
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}
foo() // 3
x // 1

var x = 1;
function foo(x, y = function() { x = 2; }) {
  x = 3;
  y();
  console.log(x);
}
foo() // 2
x // 1
```

### 应用

利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。

参数mustBeProvided的默认值等于throwIfMissing函数的运行结果（注意函数名throwIfMissing之后有一对圆括号），这表明**参数的默认值不是在定义时执行，而是在运行时执行**。**如果参数已经赋值，默认值中的函数就不会运行。**

可以将参数默认值设为undefined，表明这个参数是可以省略的

``` JS
function throwIfMissing() {
  throw new Error('Missing parameter');
}
function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}
foo()
// Error: Missing parameter

function foo(optional = undefined) { ··· }
```

## rest参数

ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

- rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错
- 函数的length属性，不包括 rest 参数

## 严格模式

ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

这样规定的原因是，函数内部的严格模式，同时适用于函数体和函数参数。但是，函数执行的时候，先执行函数参数，然后再执行函数体。这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行。