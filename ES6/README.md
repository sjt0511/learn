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

### 对象的解构赋值

对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

支持嵌套，左侧是匹配模式。**对象的解构赋值可以取到继承的属性。**

``` JS
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };

// foo是匹配的模式，baz才是变量
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined

// 嵌套
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};
// 这时p是模式，不是变量，因此不会被赋值
let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"
// 这样就可以获取到p
let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]

// 如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错
let {foo: {bar}} = {baz: 'baz'}; // 报错

// 对象obj1的原型对象是obj2。foo属性不是obj1自身的属性，而是继承自obj2的属性，解构赋值可以取到这个属性。
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);
const { foo } = obj1;
foo // "bar"

// 可以对数组进行对象属性的解构

```

#### 默认值

默认值生效的条件是，对象的属性值严格等于undefined

``` JS
let { message: msg = 'Something went wrong', x = 1, y = 2 } = {x: null, y: undefined};
msg // "Something went wrong"
x // null
y // undefined
```

### 字符串解构赋值

字符串被转换成了一个类似数组的对象

类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。

``` JS
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

const { length : len } = 'hello';
len // 5
```

### 数值和布尔值的解构赋值

如果等号右边是数值和布尔值，则会先转为对象

只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

``` JS
// 数值和布尔值的包装对象都有toString属性，因此变量s都能取到值
let {toString: s} = 123;
s === Number.prototype.toString // true
let {toString: s} = true;
s === Boolean.prototype.toString // true

let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```

### 函数参数的解构赋值

``` JS
// 函数move的参数是一个对象，通过对这个对象进行解构，得到变量x和y的值。如果解构失败，x和y等于默认值。
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
// 这是为函数move的参数指定默认值，而不是为变量x和y指定默认值
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
```

### 用途

- 交换变量的值
  
  ``` JS
  let x = 1;
  let y = 2;
  [x, y] = [y, x];
  ```

- 从函数返回多个值：函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里返回，再解构赋值，取出这些值
  
  ``` JS
  // 返回一个数组
  function example() {
    return [1, 2, 3];
  }
  let [a, b, c] = example();

  // 返回一个对象
  function example() {
    return {
      foo: 1,
      bar: 2
    };
  }
  let { foo, bar } = example();
  ```

- 函数参数的定义：解构赋值可以方便地将一组参数与变量名对应起来
  
  ``` JS
  // 参数是一组有次序的值
  function f([x, y, z]) { ... }
  f([1, 2, 3]);

  // 参数是一组无次序的值
  function f({x, y, z}) { ... }
  f({z: 3, y: 2, x: 1});
  ```

- 提取 JSON 数据
  
  ``` JS
  let jsonData = {
    id: 42,
    status: "OK",
    data: [867, 5309]
  };

  let { id, status, data: number } = jsonData;

  console.log(id, status, number);
  // 42, "OK", [867, 5309]
  ```

- 函数参数的默认值：指定参数的默认值，就避免了在函数体内部再写`var foo = config.foo || 'default foo'`
  
  ``` JS
  jQuery.ajax = function (url, {
    async = true,
    beforeSend = function () {},
    cache = true,
    complete = function () {},
    crossDomain = false,
    global = true,
    // ... more config
  } = {}) {
    // ... do stuff
  };
  ```

- 遍历 Map 结构：任何部署了 Iterator 接口的对象，都可以用for...of循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便。
  
  ``` JS
  const map = new Map();
  map.set('first', 'hello');
  map.set('second', 'world');

  for (let [key, value] of map) {
    console.log(key + " is " + value);
  }
  // first is hello
  // second is world
  ```

- 输入模块的指定方法：加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。
  
  ``` JS
  const { SourceMapConsumer, SourceNode } = require("source-map");
  ```

## 字符串扩展

### 字符串的 Unicode 表示法

允许采用`\uxxxx`形式表示一个字符，其中`xxxx`表示字符的 Unicode 码点

- 这种表示法只限于码点在`\u0000`~`\uFFFF`之间的字符。超出这个范围的字符，必须用**两个双字节**的形式表示
- 直接在`\u`后面跟上超过`0xFFFF`的数值（比如`\u20BB7`），JavaScript 会理解成`\u20BB+7`。由于`\u20BB`是一个不可打印字符，所以只会显示一个空格，后面跟着一个7。
- **改进：只要将码点放入大括号，就能正确解读该字符**
- 大括号表示法 与 四字节的 UTF-16 编码是等价的
- 共有6种表示字符串的方法

``` JS
"\u0061"
// "a"

"\uD842\uDFB7"
// "𠮷"

"\u20BB7"
// " 7"

"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{6F} // 123

'\u{1F680}' === '\uD83D\uDE80'
// true

// 6种表示字符串的方法
'\z' === 'z'  // true
'\172' === 'z' // true----这是八进制？？？？？？
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```

### 字符串的遍历器接口

ES6 为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历。

除了遍历字符串，这个遍历器最大的优点是**可以识别大于0xFFFF的码点**，传统的for循环无法识别这样的码点。

``` JS
// 字符串text只有一个字符，但是for循环会认为它包含两个字符（都不可打印），而for...of循环会正确识别出这一个字符
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

### 直接输入 U+2028 和 U+2029

JavaScript 字符串允许直接输入字符，以及输入字符的转义形式

JavaScript 规定有5个字符，不能在字符串里面直接使用，只能使用转义形式——字符串里面不能直接包含反斜杠，一定要转义写成`\\`或者`\u005c`。

- U+005C：反斜杠（reverse solidus)
- U+000D：回车（carriage return）
- U+2028：行分隔符（line separator）
- U+2029：段分隔符（paragraph separator）
- U+000A：换行符（line feed）

 **而 JSON 格式允许字符串里面直接使用 U+2028（行分隔符）和 U+2029（段分隔符）**，服务器输出的 JSON 被JSON.parse解析，就有可能直接报错 —— 为了消除这个报错，ES2019 允许 JavaScript 字符串直接输入 U+2028（行分隔符）和 U+2029（段分隔符）—— 模板字符串现在就允许直接输入这两个字符，正则表达式依然不允许直接输入这两个字符

### JSON.stringify() 的改造

JSON 数据必须是 UTF-8 编码，UTF-8 标准规定，0xD800到0xDFFF之间的码点，不能单独使用，必须配对使用

JSON.stringify()的问题在于，它可能返回0xD800到0xDFFF之间的单个码点

ES2019 改变了JSON.stringify()的行为。如果遇到0xD800到0xDFFF之间的单个码点，或者不存在的配对形式，它会返回转义字符串，留给应用自己决定下一步的处理。

``` JS
JSON.stringify('\u{D834}') // ""\\uD834""
JSON.stringify('\uDF06\uD834') // ""\\udf06\\ud834""
```

### 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量

如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。

### 模板编译

### 标签模板

它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串

标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是`函数`，紧跟在后面的模板字符串就是它的`参数`

### 模板字符串的限制

### 字符串新增方法

#### String.fromCodePoint()

- `String.fromCharCode() ES5`: 从 Unicode 码点返回对应字符，但是这个方法不能识别码点大于0xFFFF的字符
- `String.fromCodePoint`: 可以识别大于0xFFFF的字符；多个参数，则它们会被合并成一个字符串返回

``` JS
String.fromCharCode(0x20BB7)
// "ஷ"

String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
```

#### String.raw()

返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法

如果原字符串的斜杠已经转义，那么String.raw()会进行再次转义

``` JS
String.raw`Hi\n${2+3}!`
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

String.raw`Hi\u000A!`;
// 实际返回 "Hi\\u000A!"，显示的是转义后的结果 "Hi\u000A!"

String.raw`Hi\\n`
// 返回 "Hi\\\\n"

String.raw`Hi\\n` === "Hi\\\\n" // true
```

- 可以作为处理模板字符串的基本方法，它会将所有变量替换，而且对斜杠进行转义
- 本质上是一个正常的函数，只是专用于模板字符串的标签函数
- 如果写成正常函数的形式，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组，对应模板字符串解析后的值

``` JS
// `foo${1 + 2}bar${2 + 3}hello`
// 等同于
String.raw({ raw: ['foo', 'bar', 'hello'] }, 1 + 2, 2 + 3) // "foo3bar"

// 基本实现
String.raw = function (strings, ...values) {
  let output = '';
  let index;
  for (index = 0; index < values.length; index++) {
    output += strings.raw[index] + values[index];
  }

  output += strings.raw[index]
  return output;
}
```

#### str.codePointAt()

`codePointAt()`方法，能够正确处理 4 个字节储存的字符

- JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节
- 需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符
- `字符串长度`会误判为2，而且`charAt()`方法无法读取整个字符，`charCodeAt()`方法只能分别返回前两个字节和后两个字节的值

- codePointAt()方法返回的是码点的十进制值
- codePointAt()方法的参数，是字符在字符串中的位置（从 0 开始）
- 使用for...of循环，因为它会正确识别 32 位的 UTF-16 字符。
- 使用扩展运算符（...）进行展开运算

``` JS
// 汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是0x20BB7
// UTF-16 编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存
let s = '𠮷a';

s.length // 3
s.charAt(0) // ''
s.charAt(1) // ''
s.charAt(2) // 'a'
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
s.charCodeAt(2) // 97

// codePointAt()方法的参数，是字符在字符串中的位置（从 0 开始）,JavaScript 将“𠮷a”视为三个字符
// codePointAt 方法在第一个字符上，正确地识别了“𠮷”，返回了它的十进制码点 134071（即十六进制的20BB7）
// 在第二个字符（即“𠮷”的后两个字节）和第三个字符“a”上，codePointAt()方法的结果与charCodeAt()方法相同
s.codePointAt(0) // 134071
s.codePointAt(1) // 57271
s.codePointAt(2) // 97

// toString(16)转为十六进制
s.codePointAt(0).toString(16) // "20bb7"
s.codePointAt(2).toString(16) // "61"

// for of循环
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16))
  // 20bb7
  // 61
}

// ...扩展运算符
let arr = [...'𠮷a']; // arr.length === 2
arr.forEach(
  ch => console.log(ch.codePointAt(0).toString(16))
  // 20bb7
  // 61
);
```

#### str.normalize()

将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化；
可以接受一个参数来指定normalize的方式

- NFC，默认参数，表示“标准等价合成”:多个简单字符的合成字符,视觉和语义上的等价
- NFD，表示“标准等价分解”:在标准等价的前提下，返回合成字符分解的多个简单字符
- NFKC，表示“兼容等价合成”:语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”
- NFKD，表示“兼容等价分解”:在兼容等价的前提下，返回合成字符分解的多个简单字符

normalize方法目前不能识别三个或三个以上字符的合成

``` JS
'\u01D1'.normalize() === '\u004F\u030C'.normalize() // true

// NFC参数返回字符的合成形式，NFD参数返回字符的分解形式
'\u004F\u030C'.normalize('NFC').length // 1
'\u004F\u030C'.normalize('NFD').length // 2
```

#### str.indexOf()|str.includes()|str.startsWith()|str.endsWith()

indexOf()是JS提供的确定一个字符串是否包含在另一个字符串中

- str.includes(xxx)：返回Boolean，是否找到参数字符串
- str.startsWith(xxx)：返回Boolean，参数字符串是否在头部
- str.endsWith(xxx)：返回Boolean，参数字符串是否在尾部
- 支持第二个参数，表示开始搜索的位置

``` JS
// endsWith针对前n个字符, 其他两个指从第n个位置直到字符串结束
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

#### str.repeat()

repeat方法返回一个新字符串，表示将原字符串重复n次

- 参数是小数，会被取整，大于0的向下取整
- 参数范围是 (-1, 有限数)：(-1,0)都被视作0，0 到-1 之间的小数，取整以后等于-0，repeat视同为 0
- 参数是负数或者Infinity，会报错
- (-1,1)范围内和NaN，等同于0
- 参数是字符串，则会先转换成数字

``` JS
const str = 'na'

str.repeat(2) // 'nana'
str.repeat(Infinity) // RangeError
str.repeat(-1) // RangeError
str.repeat(-0.9) // ''
str.repeat(NaN) // ''
str.repeat('na') // ''
str.repeat('3') // 'nanana'
```

#### str.padStart()|str.padEnd()

字符串补全长度,会在头部或尾部补全。`padStart()`用于头部补全，`padEnd()`用于尾部补全

- 第一个参数：字符串补全生效的最大长度，第二个参数：用来补全的字符串
- 原字符串长 >= 最大长度，则字符串补全不生效，返回原字符串
- 补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串
- 省略第二个参数，默认使用空格补全长度

``` JS
'x'.padStart(5, 'ab') // 'ababx'
'x'.padEnd(4, 'ab') // 'xaba'
'xxx'.padStart(2, 'ab') // 'xxx'
'abc'.padStart(10, '0123456789') // '0123456abc'
'x'.padStart(4) // '   x'

// padStart()的常见用途是为数值补全指定位数
'123456'.padStart(10, '0') // "0000123456"
// 提示字符串格式
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

#### str.trimStart()|str.trimEnd()

#### str.matchAll()

#### str.replaceAll()

searchValue是搜索模式，可以是一个字符串，也可以是一个全局的正则表达式（带有g修饰符）[否则报错]

#### str.at()

返回参数指定位置的字符，支持负索引（即倒数的位置）。

如果参数位置超出了字符串范围，at()返回undefined。

``` JS
const str = 'hello';
str.at(1) // "e"
str.at(-1) // "o"
```

### 正则的扩展

#### RegExp 构造函数

- ES5
  - 参数是一个字符串，第二个参数是正则表达式的修饰符（flag）
  - 参数是一个正则表达式，**不允许此时使用第二个参数添加修饰符，会报错**
- ES6
  -参数是正则表达式时，允许添加修饰符，会覆盖原有修饰符