# Set 和 Map 数据结构

## Set

类似于数组，但是**成员的值都是唯一**的，没有重复的值

`Set`本身是一个构造函数，用来生成 Set 数据结构

- `Set`函数可以接受一个**数组**（或者具有 **iterable** 接口的其他数据结构）作为参数，用来初始化
- 向 Set 加入值的时候，不会发生类型转换
- Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”
- 它类似于`===`，主要的区别是向 Set 加入值时**认为NaN等于自身**，而`===`认为NaN不等于自身
- 两个对象总是不相等的

``` JS
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set] // [1, 2, 3, 4]
// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5
// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56
// 类似于
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
// NaN等于自身
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
```

### Set 实例的属性和方法

属性

- `Set.prototype.constructor`：构造函数，默认就是Set函数。
- `Set.prototype.size`：返回Set实例的成员总数。

方法

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为Set的成员。
- `Set.prototype.clear()`：清除所有成员，没有返回值。

`Array.from`方法可以将 Set 结构转为数组

``` JS
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false


// 对象的写法
const properties = {
  'width': 1,
  'height': 1
};
if (properties[someName]) {
  // do something
}

// Set的写法
const properties = new Set();
properties.add('width');
properties.add('height');
if (properties.has(someName)) {
  // do something
}


// Array.from
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
```

数组去重实现

``` JS
const arr = [1, 1, 2, 3]

// Array.from 把 Set 转为 Array
function dedupe(array) {
  return Array.from(new Set(array));
}
dedupe([arr]) // [1, 2, 3]

// ...扩展运算符
[... new Set(arr)] // [1, 2, 3]
```

### 遍历操作

Set 结构的实例有4个遍历方法，可以用于遍历成员

- `Set.prototype.keys()`：返回键名的遍历器
- `Set.prototype.values()`：返回键值的遍历器
- `Set.prototype.entries()`：返回键值对的遍历器
- `Set.prototype.forEach()`：使用回调函数遍历每个成员
- `扩展运算符（...）`内部使用for...of循环，所以也可以用于 Set 结构

Set的遍历顺序就是插入顺序 => 使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用

使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）

`keys`方法、`values`方法、`entries`方法返回的都是遍历器对象 => 由于 Set 结构**没有键名**，**只有键值**（或者说键名和键值是同一个值），所以**keys方法和values方法的行为完全一致**

``` JS
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

Set 结构的实例**默认可遍历**，它的**默认遍历器生成函数就是它的values方法**，这意味着，可以省略values方法，**直接用for...of循环遍历 Set**

``` JS
Set.prototype[Symbol.iterator] === Set.prototype.values
// true

let set = new Set(['red', 'green', 'blue']);
for (let x of set) {
  console.log(x);
}
// red
// green
// blue
```

Set 结构的实例与数组一样，也拥有`forEach`方法，用于对每个成员执行某种操作，没有返回值

- forEach方法还可以有第二个参数，表示绑定处理函数内部的`this`对象

``` JS
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```

`扩展运算符（...）`内部使用for...of循环，所以也可以用于 Set 结构

``` JS
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']

let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)];
// [3, 5, 2]

let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）

``` JS
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

## WeakSet

- WeakSet 的**成员只能是对象**，而不能是其他类型的值
- WeakSet 中的对象都是**弱引用**，即垃圾回收机制不考虑 WeakSet 对该对象的引用，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中
- 垃圾回收机制根据对象的可达性（reachability）来判断回收，如果对象还能被访问到，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。**WeakSet 里面的引用，都不计入垃圾回收机制**，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失
- **WeakSet 的成员是不适合引用的，因为它会随时消失**。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 **ES6 规定 WeakSet 不可遍历**

### 语法

- WeakSet 是一个构造函数，可以使用new命令，创建 WeakSet 数据结构
- WeakSet 可以接受一个数组或类似数组的对象作为参数。该数组的所有成员，都会自动成为 WeakSet 实例对象的成员
- 3个方法：
  - `WeakSet.prototype.add(value)`：向 WeakSet 实例添加一个新成员。
  - `WeakSet.prototype.delete(value)`：清除 WeakSet 实例的指定成员。
  - `WeakSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
- WeakSet **没有`size`属性**，**没有办法遍历它的成员**
- **WeakSet 不能遍历**，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。
- WeakSet 的一个用处，是**储存 DOM 节点**，而不用担心这些节点从文档移除时，会引发内存泄漏

``` JS
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

// WeakSet的3个方法
const ws = new WeakSet();
const obj = {};
const foo = {};
ws.add(window);
ws.add(obj);
ws.has(window); // true
ws.has(foo);    // false
ws.delete(window);
ws.has(window);    // false

// 无size属性，不可遍历（弱引用）
ws.size // undefined
ws.forEach // undefined
ws.forEach(function(item){ console.log('WeakSet has ' + item)})
// TypeError: undefined is not a function

// 保证了Foo的实例方法，只能在Foo的实例上调用。
// 这里使用 WeakSet 的好处是，foos对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑foos，也不会出现内存泄漏
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
```

## Map

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是**“键”的范围不限于字符串**，各种类型的值（包括对象）都可以当作键。

Object 结构提供了`“字符串—值”`的对应，Map 结构提供了`“值—值”`的对应，是一种更完善的 Hash 结构实现。

Map 构造函数：任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数

- Map 的键实际上是**跟内存地址绑定**的，只要内存地址不一样，就视为两个键 => 解决了同名属性碰撞（clash）的问题
- Map 的键是一个简单类型的值（数字、字符串、布尔值），则**只要两个值严格相等**，Map 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，**undefined和null也是两个不同的键**。虽然**NaN不严格相等于自身，但 Map 将其视为同一个键**

``` JS
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"


const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1
const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3


let map = new Map();
map.set(-0, 123);
map.get(+0) // 123
map.set(true, 1);
map.set('true', 2);
map.get(true) // 1
map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3
map.set(NaN, 123);
map.get(NaN) // 123
```

### 实例的属性和操作方法

- `size`属性：返回 Map 结构的成员总数
- `Map.prototype.set(key, value)`：set方法设置键名key对应的键值为value，然后**返回整个 Map 结构**，返回的是当前的Map对象，因此**可以采用链式写法**
- `Map.prototype.get(key)`：get方法读取key对应的键值，如果找不到key，返回`undefined`
- `Map.prototype.has(key)`：has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中
- `Map.prototype.delete(key)`：delete方法删除某个键，返回true。如果删除失败，返回false
- `Map.prototype.clear()`：clear方法清除所有成员，没有返回值

### 遍历方法

Map 结构原生提供**三个遍历器生成函数**和**一个遍历方法**，Map 的遍历顺序就是插入顺序

- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器。
- `Map.prototype.entries()`：返回所有成员的遍历器。
- `Map.prototype.forEach()`：遍历 Map 的所有成员。forEach方法还可以接受第二个参数，用来绑定this
- Map 结构的**默认遍历器接口**（Symbol.iterator属性），就是entries方法。
- 使用扩展运算符（...）
- 结合数组的map方法、filter方法

### 与其他数据结构的互相转换

1. Map 转为数组(使用...)

   ``` JS
   const myMap = new Map()
     .set(true, 7)
     .set({foo: 3}, ['abc']);
   [...myMap]
   // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
   ```

2. 数组转为Map(数组传入构造函数new Map())

   ``` JS
   new Map([
     [true, 7],
     [{foo: 3}, ['abc']]
   ])
   // Map {
   //   true => 7,
   //   Object {foo: 3} => ['abc']
   // }
   ```

3. Map转为对象

   ``` JS
   // 如果所有 Map 的键都是字符串，它可以无损地转为对象
   // 如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名
   function strMapToObj(strMap) {
     let obj = Object.create(null);
     for (let [k,v] of strMap) {
       obj[k] = v;
     }
     return obj;
   }

   const myMap = new Map()
     .set('yes', true)
     .set('no', false);
   strMapToObj(myMap)
   // { yes: true, no: false }
   ```

4. 对象转为Map(`Object.entries()`)

   ``` JS
   let obj = {"a":1, "b":2};
   let map = new Map(Object.entries(obj));

   function objToStrMap(obj) {
     let strMap = new Map();
     for (let k of Object.keys(obj)) {
       strMap.set(k, obj[k]);
     }
     return strMap;
   }
   objToStrMap({yes: true, no: false})
   // Map {"yes" => true, "no" => false}
   ```

5. Map转为JSON

   ``` JS
   // Map 的键名都是字符串，这时可以选择转为对象 JSON
   function strMapToJson(strMap) {
     return JSON.stringify(strMapToObj(strMap));
   }

   let myMap = new Map().set('yes', true).set('no', false);
   strMapToJson(myMap) // '{"yes":true,"no":false}'

   // Map 的键名有非字符串，这时可以选择转为数组 JSON
   function mapToArrayJson(map) {
     return JSON.stringify([...map]);
   }

   let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
   mapToArrayJson(myMap)
   // '[[true,7],[{"foo":3},["abc"]]]'
   ```

6. JSON转为Map

   ``` JS
   // 正常情况下，所有键名都是字符串
   function jsonToStrMap(jsonStr) {
     return objToStrMap(JSON.parse(jsonStr));
   }

   jsonToStrMap('{"yes": true, "no": false}') // Map {'yes' => true, 'no' => false}
   
   // 有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。
   // 这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作
   function jsonToMap(jsonStr) {
     return new Map(JSON.parse(jsonStr));
   }

   jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
   // Map {true => 7, Object {foo: 3} => ['abc']}
   ```

## WeakMap

- WeakMap**只接受对象作为键名（null除外）**，不接受其他类型的值作为键名
- WeakMap的**键名所指向的对象，不计入垃圾回收机制**
- 它的键名所引用的对象都是**弱引用**，即垃圾回收机制不将该引用考虑在内。
- 只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。
- 也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
- 一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。
- WeakMap的专用场合就是，**它的键所对应的对象，可能会在将来消失**。
- WeakMap结构有助于防止内存泄漏。
- 注意，WeakMap 弱引用的只是键名，而不是键值,**键值依然是正常引用**。

``` JS
const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information');
wm.get(element) // "some information"


const wm = new WeakMap();
let key = {};
let obj = {foo: 1};
wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```

### WeakMap 的语法

- WeakMap **没有遍历操作**（即没有`keys()`、`values()`和`entries()`方法），也**没有`size属性`**。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。
- WeakMap无法清空，即**不支持`clear`方法**。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()

### WeakMap 的用途

- DOM 节点作为键名
- 部署私有属性

``` JS
// DOM 节点作为键名
// document.getElementById('logo')是一个 DOM 节点，每当发生click事件，就更新一下状态。
// 我们将这个状态作为键值放在 WeakMap 里，对应的键名就是这个节点对象。
// 一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0})
;

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);

// 部署私有属性
// Countdown类的两个内部属性_counter和_action，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec() // DONE
```
