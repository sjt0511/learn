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
