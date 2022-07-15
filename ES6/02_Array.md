# 数组

## 扩展运算符(...)

扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。该运算符主要用于函数调用

- **只有函数调用时，扩展运算符才可以放在圆括号中，否则会报错**
- **扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符**
- **如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错**

``` JS
// 扩展运算符所在的括号不是函数调用
(...[1, 2])
// Uncaught SyntaxError: Unexpected number

console.log((...[1, 2]))
// Uncaught SyntaxError: Unexpected number

console.log(...[1, 2])
// 1 2
```

## 代替函数的apply()

扩展运算符可以展开数组，所以不再需要apply()方法将数组转为函数的参数了

``` JS
// ES5 的写法
Math.max.apply(null, [14, 3, 77])
// ES6 的写法
Math.max(...[14, 3, 77])
// 等同于
Math.max(14, 3, 77);

// ES5 的写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);
// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);

// ES5
new (Date.bind.apply(Date, [null, 2015, 1, 1]))
// ES6
new Date(...[2015, 1, 1]);
```

## 扩展运算符的应用

### 1 复制数组

浅拷贝

### 2 合并数组

浅拷贝

### 3 与解构赋值结合

### 4 字符串

扩展运算符还可以将字符串转为真正的数组

- 能够正确识别四个字节的 Unicode 字符

``` JS
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3

// 正确返回字符串长度
function length(str) {
  return [...str].length;
}
length('x\uD83D\uDE80y') // 3

// 如果不用扩展运算符，字符串的reverse()操作就不正确
let str = 'x\uD83D\uDE80y';
str.split('').reverse().join('')
// 'y\uDE80\uD83Dx'
[...str].reverse().join('')
// 'y\uD83D\uDE80x'
```

### 5 实现了Iterator接口的对象

任何定义了**遍历器（Iterator）接口**的对象，都可以用扩展运算符转为真正的数组。

- 先定义了Number对象的遍历器接口，扩展运算符将5自动转成Number实例以后，就会调用这个接口，就会返回自定义的结果
- 对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组

``` JS
Number.prototype[Symbol.iterator] = function*() {
  let i = 0;
  let num = this.valueOf();
  while (i < num) {
    yield i++;
  }
}
console.log([...5]) // [0, 1, 2, 3, 4]

// arrayLike是一个类似数组的对象，但是没有部署 Iterator 接口，扩展运算符就会报错
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};
// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike];
```

### 6 Map 和 Set 结构，Generator 函数

扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符

- Generator 函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符
- 如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错

``` JS
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
let arr = [...map.keys()]; // [1, 2, 3]

// 变量go是一个 Generator 函数，执行后返回的是一个遍历器对象，对这个遍历器对象执行扩展运算符，就会将内部遍历得到的值，转为一个数组
const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};
[...go()] // [1, 2, 3]

// 如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错
const obj = {a: 1, b: 2};
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
```

## Array.from()

用于将两类对象转为真正的数组：`类似数组的对象（array-like object）`和可遍历`（iterable）的对象`（包括 ES6 新增的数据结构 Set 和 Map）。

- 只要是部署了 Iterator 接口的数据结构，Array.from()都能将其转为数组
- 扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from()方法还支持类似数组的对象。
- 所谓类似数组的对象，本质特征只有一点，即**必须有length属性**。因此，任何有length属性的对象，都可以通过Array.from()方法转为数组，而此时扩展运算符就无法转换
- Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符，可以避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的 bug。

参数：

1. 第一个参数，需要转换为数组的对象
2. 第二个参数，作用类似于数组的map()方法，用来对每个元素进行处理，将处理后的值放入返回的数组
3. 第三个参数，如果map()函数里面用到了this关键字，还可以传入Array.from()的第三个参数，用来绑定this

``` JS
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
// ES5 的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6 的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']


Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']
let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

Array.from({ length: 3 });
// [ undefined, undefined, undefined ]

// 对于还没有部署该方法的浏览器，可以用Array.prototype.slice()方法替代
const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj)
)();

Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]

// 字符串转数组
function countSymbols(string) {
  return Array.from(string).length;
}
```

## Array.of()

用于将一组值，转换为数组。Array.of()总是返回参数值组成的数组

- 弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异
- new Array()：没有参数、一个参数、三个参数时，返回的结果都不一样。
  - 只有当参数个数不少于 2 个时，Array()才会返回由参数组成的新数组。
  - 参数只有一个时，如果是字符串就返回[字符串]；如果是数字，**表示的是数组长度**--必须是非负整数，否则会报错
- Array.of()基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载

``` JS
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
Array(-1) // Uncaught RangeError: Invalid array length
Array('3') // ['3']

Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

## arr.copyWithin()

在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。使用这个方法，会修改当前数组。

`Array.prototype.copyWithin(target, start = 0, end = this.length)`

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。
- 这三个参数都应该是数值，如果不是，会自动转为数值

``` JS
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}

// 将2号位到数组结束，复制到0号位
let i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]

// 对于没有部署 TypedArray 的 copyWithin 方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
```

## 实例方法：find()，findIndex()，findLast()，findLastIndex()

- find()方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。
- 回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

## 实例方法：entries()，keys() 和 values()

返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

- 如果不使用for...of循环，可以手动调用遍历器对象的next方法，进行遍历。

## 实例方法：includes()

Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似

- 该方法的第二个参数表示搜索的起始位置，默认为0。
- 如果第二个参数为负数，则表示倒数的位置
- 第二个参数为负数，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始

indexOf方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。二是，它内部使用**严格相等运算符（===）进行判断**，这会导致**对NaN的误判**

``` JS
const arr = [1, 2, 3]
arr.includes(2, 2) // false
arr.includes(2, -1) // false
arr.includes(2, -4) // true
arr.includes(2, 4) // false -- 对于整数，超出数组长度不会置零

[NaN].indexOf(NaN) // false
[NaN].includes(NaN) // true
```

## 实例方法：flat()，flatMap()

Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响

- flat()默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将flat()方法的参数写成一个整数，表示想要拉平的层数，默认为1
- 如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数
- 如果原数组有空位，flat()方法会跳过空位

flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法

- **flatMap()只能展开一层数组**
- 第一个参数，遍历函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组 -- item, index, arr
- 第二个参数，用来绑定遍历函数里面的this

``` JS
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]

[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]

[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]

[1, 2, , 4, 5].flat()
// [1, 2, 4, 5]

// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```

## 实例方法：at()

接受一个整数作为参数，返回对应位置的成员，并支持负索引。这个方法不仅可用于数组，也可用于字符串和类型数组（TypedArray）。

如果参数位置超出了数组范围，at()返回undefined。

## 实例方法：toReversed()，toSorted()，toSpliced()，with()

- Array.prototype.toReversed() -> Array
- Array.prototype.toSorted(compareFn) -> Array
- Array.prototype.toSpliced(start, deleteCount, ...items) -> Array
- Array.prototype.with(index, value) -> Array -> with(index, value)对应splice(index, 1, value)，用来将指定位置的成员替换为新的值。

## 实例方法：group()，groupToMap()

可以根据分组函数的运行结果，将数组成员分组

- group()的参数是一个分组函数，原数组的每个成员都会依次执行这个函数，确定自己是哪一个组。
- 分组函数可以接受三个参数，依次是数组的当前成员、该成员的位置序号、原数组（上例是num、index和array）。
- 分组函数的返回值应该是字符串（或者可以自动转为字符串），以作为分组后的`组名`。
- group()的返回值是一个对象，该对象的键名就是每一组的组名，即分组函数返回的每一个字符串（上例是even和odd）；该对象的键值是一个数组，包括所有产生当前键名的原数组成员。
- 第二个参数，一个对象，该对象会绑定分组函数（第一个参数）里面的this

## 实例方法：sort()