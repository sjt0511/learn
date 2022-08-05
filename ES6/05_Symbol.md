# Symbol

表示独一无二的值，从根本上防止属性名的冲突

**JavaScript数据类型**： undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、大整数（BigInt）、Symbol、对象（Object）

Symbol 值通过`Symbol()`函数生成

Symbol函数前不能使用new命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性

- Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述
- 如果 Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串
- Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的
- Symbol 值不能与其他类型的值进行运算，会报错
- Symbol 值可以显式转为字符串，Symbol 值也可以转为布尔值，但是不能转为数值
- **Symbol 值作为属性名时，该属性还是公开属性，不是私有属性**

``` JS
let s1 = Symbol('foo');
let s2 = Symbol('bar');
s1 // Symbol(foo)
s2 // Symbol(bar)
s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"

const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
sym // Symbol(abc)

// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();
s1 === s2 // false
// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');
s1 === s2 // false

let sym = Symbol('My symbol');
"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string

let sym = Symbol('My symbol');
String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

let sym = Symbol();
Boolean(sym) // true
!sym  // false
if (sym) {
  // ...
}
Number(sym) // TypeError
sym + 2 // TypeError
```

## Symbol.prototype.description

创建 Symbol 的时候，可以添加一个描述，读取这个描述需要将 Symbol 显式转为字符串 => ES2019 提供了一个实例属性description，直接返回 Symbol 的描述

`sym.description`

``` JS
const sym = Symbol('foo');

String(sym) // "Symbol(foo)"
sym.toString() // "Symbol(foo)"

sym.description // "foo"
```

## 作为属性名的 Symbol

每一个 Symbol 值都是不相等的，这意味着 Symbol 值**可以作为标识符**，用于对象的属性名 => 能防止某一个键被不小心改写或覆盖

Symbol 类型还可以**用于定义一组常量**，保证这组常量的值都是不相等的。**Symbol 值作为属性名时，该属性还是公开属性，不是私有属性**

``` JS
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

## 实例：消除魔术字符串

在代码之中多次出现、与代码形成强耦合的某一个**具体的字符串或者数值**，应该尽量消除魔术字符串，改由**含义清晰的变量**代替

## 属性名的遍历

Symbol 作为属性名，遍历对象的时候，该属性**不会出现**在`for...in`、`for...of`循环中，**也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回**

- 但它也不是私有属性，有一个`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
- 可以利用这个特性，为对象定义一些**非私有的、但又希望只用于内部**的方法。
- `Reflect.ownKeys()`方法可以返回所有类型的键名，包括常规键名和 Symbol 键名

``` JS
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'Hello';
obj[b] = 'World';
const objectSymbols = Object.getOwnPropertySymbols(obj);
objectSymbols
// [Symbol(a), Symbol(b)]

const obj = {};
const foo = Symbol('foo');
obj[foo] = 'bar';
for (let i in obj) {
  console.log(i); // 无输出
}
Object.getOwnPropertyNames(obj) // []
Object.getOwnPropertySymbols(obj) // [Symbol(foo)]
```

## Symbol.for()，Symbol.keyFor()

`Symbol.for()`与`Symbol()`这两种写法，都会生成新的 Symbol => 前者会被登记在全局环境中供搜索，后者不会

- 接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值
- 如果有，就返回这个 Symbol 值
- 否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局
- Symbol.for()为 Symbol 值登记的名字，是全局环境的，不管有没有在全局环境运行
- Symbol.for()的这个全局登记特性，可以用在不同的 iframe 或 service worker 中取到同一个值

`Symbol.keyFor()`方法返回一个已登记的 Symbol 类型值的key，未登记的 Symbol 值，返回`undefined`

``` JS
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
s1 === s2 // true

let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"
let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

## 内置的 Symbol 值

- `Symbol.hasInstance`
- `Symbol.isConcatSpreadable`
- `Symbol.species`
- `Symbol.match`
- `Symbol.replace`
- `Symbol.search`
- `Symbol.split`
- **`Symbol.iterator`**
- `Symbol.toPrimitive`
- `Symbol.toStringTag`
- `Symbol.unscopables`

### Symbol.hasInstance

指向一个内部方法，当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法 => `foo instanceof Foo`在语言内部，实际调用的是`Foo[Symbol.hasInstance](foo)`。

``` JS
// MyClass是一个类，new MyClass()会返回一个实例。
// 该实例的Symbol.hasInstance方法，会在进行instanceof运算时自动调用，判断左侧的运算子是否为Array的实例
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}
[1, 2, 3] instanceof new MyClass() // true


class Even {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
}
// 等同于
const Even = {
  [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
};
1 instanceof Even // false
2 instanceof Even // true
12345 instanceof Even // false
```

### Symbol.isConcatSpreadable

等于一个布尔值，表示该对象用于`Array.prototype.concat()`时，是否可以展开

- **数组的默认行为是可以展开**，Symbol.isConcatSpreadable默认等于undefined。该属性等于true时，也有展开的效果
- **类似数组的对象正好相反，默认不展开**。它的Symbol.isConcatSpreadable属性设为true，才可以展开
- `Symbol.isConcatSpreadable`属性也可以定义在类里面

``` JS
// 数组
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']

// 类数组对象
let obj = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']

// 类
// 类A1是可展开的，类A2是不可展开的
// A1是定义在实例上，A2是定义在类本身，效果相同
class A1 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = true;
  }
}
class A2 extends Array {
  constructor(args) {
    super(args);
  }
  get [Symbol.isConcatSpreadable] () {
    return false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2)
// [1, 2, 3, 4, [5, 6]]
```

### Symbol.species

指向一个构造函数，创建衍生对象，用于返回基类实例而不是子类实例

``` JS
class MyArray extends Array {
}

const a = new MyArray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(x => x > 1);

b instanceof MyArray // true
c instanceof MyArray // true
```

子类`MyArray`继承了父类`Array`，`a`是`MyArray`的实例，`b`和`c`是`a`的衍生对象。你可能会认为，b和c都是调用数组方法生成的，所以应该是数组（Array的实例），但**实际上它们也是MyArray的实例** => `Symbol.species`属性就是为了解决这个问题而提供的

定义了`Symbol.species`属性，创建衍生对象时就会**使用这个属性返回的函数，作为构造函数**。这个例子也说明，定义`Symbol.species`属性**要采用`get`取值器**。

``` JS
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}

// 默认的Symbol.species属性等同于
static get [Symbol.species]() {
  return this;
}

// 
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}

const a = new MyArray();
const b = a.map(x => x);

b instanceof MyArray // false
b instanceof Array // true
```

T2定义了Symbol.species属性，T1没有。结果就导致了创建衍生对象时（then方法），**T1调用的是自身的构造方法，而T2调用的是Promise的构造方法**。

``` JS
class T1 extends Promise {
}

class T2 extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}

new T1(r => r()).then(v => v) instanceof T1 // true
new T2(r => r()).then(v => v) instanceof T2 // false
```

`Symbol.species`的作用在于，实例对象在运行过程中，**需要再次调用自身的构造函数时，会调用该属性指定的构造函数**。它主要的用途是，有些类库是在基类的基础上修改的，那么子类使用继承的方法时，作者可能**希望返回基类的实例**，而不是子类的实例

### Symbol.match

指向一个函数，执行`str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值

``` JS
String.prototype.match(regexp)
// 等同于
regexp[Symbol.match](this)

class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}

'e'.match(new MyMatcher()) // 1
```

### Symbol.replace

指向一个方法，当该对象被`String.prototype.replace`方法调用时，会返回该方法的返回值

``` JS
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue)

const x = {};
x[Symbol.replace] = (...s) => console.log(s);
'Hello'.replace(x, 'World') // ["Hello", "World"]
```

### Symbol.search

指向一个方法，当该对象被`String.prototype.search`方法调用时，会返回该方法的返回值

``` JS
String.prototype.search(regexp)
// 等同于
regexp[Symbol.search](this)

class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
'foobar'.search(new MySearch('foo')) // 0
```

### Symbol.split

指向一个方法，当该对象被`String.prototype.split`方法调用时，会返回该方法的返回值

### Symbol.iterator

**指向该对象的默认遍历器方法**，对象进行`for...of`循环时，会调用`Symbol.iterator`方法，**返回该对象的默认遍历器**

``` JS
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]



class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

### Symbol.toPrimitive

指向一个方法。该**对象被转为原始类型的值时**，会调用这个方法，返回该对象对应的**原始类型值**

`Symbol.toPrimitive`被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式：

- Number：该场合需要转成数值
- String：该场合需要转成字符串
- Default：该场合可以转成数值，也可以转成字符串

``` JS
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};

2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'
```

### Symbol.toStringTag

指向一个方法。在该对象上面调用`Object.prototype.toString`方法时，如果这个属性存在，它的返回值会**出现在toString方法返回的字符串之中，表示对象的类型**。也就是说，这个属性可以**用来定制[object Object]或[object Array]中object后面的那个字符串**

ES6 新增内置对象的Symbol.toStringTag属性值：

- JSON[Symbol.toStringTag]：'JSON'
- Math[Symbol.toStringTag]：'Math'
- Module 对象M[Symbol.toStringTag]：'Module'
- ArrayBuffer.prototype[Symbol.toStringTag]：'ArrayBuffer'
- DataView.prototype[Symbol.toStringTag]：'DataView'
- Map.prototype[Symbol.toStringTag]：'Map'
- Promise.prototype[Symbol.toStringTag]：'Promise'
- Set.prototype[Symbol.toStringTag]：'Set'
- %TypedArray%.prototype[Symbol.toStringTag]：'Uint8Array'等
- WeakMap.prototype[Symbol.toStringTag]：'WeakMap'
- WeakSet.prototype[Symbol.toStringTag]：'WeakSet'
- %MapIteratorPrototype%[Symbol.toStringTag]：'Map Iterator'
- %SetIteratorPrototype%[Symbol.toStringTag]：'Set Iterator'
- %StringIteratorPrototype%[Symbol.toStringTag]：'String Iterator'
- Symbol.prototype[Symbol.toStringTag]：'Symbol'
- Generator.prototype[Symbol.toStringTag]：'Generator'
- GeneratorFunction.prototype[Symbol.toStringTag]：'GeneratorFunction'

``` JS
// 例一
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"

// 例二
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
let x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"
```

### Symbol.unscopables

指向一个对象。该对象指定了使用`with`关键字时，**哪些属性会被`with`环境排除**。
