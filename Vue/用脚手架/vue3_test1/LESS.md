# Less(Leaner Style Sheets)

## 变量 Variables

``` LESS
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

``` LESS
#header {
  width: 10px;
  height: 20px;
}
```

### 变量插值 @

用 `@xxx` 表示一个变量 `xxx`，`@{xxx}` 使用该变量，效果就是插入了一个xxx

控制 CSS 规则中的值，选择器名称、属性名称、URL 和语句

`backgound-@{xxx}`: 如果定义 @xxx: color 那么就相当于 background-color

### 属性作为变量 $

Less 会选择当前/父作用域中的最后一个属性作为“最终”值

``` LESS
.block {
  color: red; 
  .inner {
    background-color: $color; 
  }
  color: blue;  
} 
```

``` LESS
.block {
  color: red; 
  color: blue;  
} 
.block .inner {
  background-color: blue; 
}
```

## 混合 Mixins .xxx()

将一组属性从一个规则集包含（或混入）到另一个规则集的方法

``` LESS
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}


#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

### 不输出 mixin

不想让 mixin 样式出现在最终得到的 CSS 中，那就在定义这个 mixin 的时候加上()

``` LESS
.my-mixin {
  color: black;
}
/* 这个样式会消失 */
.my-other-mixin() {
  background: white;
}
.class {
  .my-mixin();
  .my-other-mixin();
}
```

``` LESS
.my-mixin {
  color: black;
}
.class {
  color: black;
  background: white;
}
```

### Mixins 中的选择器

Mixins不仅可以包含属性，还可以包含选择器

``` LESS
.my-hover-mixin() {
  &:hover {
    border: 1px solid red;
  }
}
button {
  .my-hover-mixin();
}
```

``` LESS
button:hover {
  border: 1px solid red;
}
```

### Mixins 命名空间

``` LESS
#outer() {
  .inner {
    color: red;
  }
}

.c {
  #outer > .inner();
}
```

``` LESS
/* all do the same thing */
#outer > .inner();
#outer .inner();
#outer.inner();
```

如果命名空间具有保护，则仅当保护条件返回 true 时，才使用由其定义的 mixin。命名空间保护的计算方式与 mixin 上的保护完全相同，因此以下两个 mixin 的工作方式相同：

``` LESS
#namespace when (@mode = huge) {
  .mixin() { /* */ }
}

#namespace {
  .mixin() when (@mode = huge) { /* */ }
}
```

## 父选择器 &

引用父选择器 `&`

### 多重 &

``` LESS
.link {
  & + & {
    color: red;
  }

  & & {
    color: green;
  }

  && {
    color: blue;
  }

  &, &ish {
    color: cyan;
  }
}

.link + .link {
  color: red;
}
.link .link {
  color: green;
}
.link.link {
  color: blue;
}
.link, .linkish {
  color: cyan;
}
```

引起排列组合

``` LESS
p, a, ul, li {
  border-top: 2px dotted #366;
  & + & {
    border-top: 0;
  }
}


p,
a,
ul,
li {
  border-top: 2px dotted #366;
}
p + p,
p + a,
p + ul,
p + li,
a + p,
a + a,
a + ul,
a + li,
ul + p,
ul + a,
ul + ul,
ul + li,
li + p,
li + a,
li + ul,
li + li {
  border-top: 0;
}
```

## 运算

算术运算符 +、-、*、/ 可以对任何数字、颜色或变量进行运算。如果可能的话，算术运算符在加、减或比较之前会进行单位换算。计算的结果以**最左侧**操作数的单位类型为准。如果单位换算无效或失去意义，则忽略单位。无效的单位换算例如：px 到 cm 或 rad 到 % 的转换。

``` LESS
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

// example with variables
@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```

**乘法和除法不作转换**。因为这两种运算在大多数情况下都没有意义，一个长度乘以一个长度就得到一个区域，而 CSS 是不支持指定区域的。Less 将按数字的原样进行操作，并将为计算结果指定明确的单位类型。

``` LESS
@base: 2cm * 3mm; // 结果是 6cm
```

可以对颜色进行算术运算

``` LESS
@color: #224488 / 2; //结果是 #112244
background-color: #112244 + #111; // 结果是 #223355
```

### calc() 特例

为了与 CSS 保持兼容，calc() 并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。

``` LESS
@var: 50vh/2;
width: calc(50% + (@var - 20px));  // 结果是 calc(50% + (25vh - 20px))
```

## 转义

转义（Escaping）允许你使用**任意字符串**作为属性或变量值。任何 ~"anything" 或 ~'anything' 形式的内容都将按原样输出，除非 interpolation。

``` LESS
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
// 简写
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}

// 编译为
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

## 函数（Function）

Less 内置了多种函数用于转换颜色、处理字符串、算术运算等

[LESS函数手册](https://less.bootcss.com/functions/)

## Extend

Extend是一个 Less 伪类，它将它所在的选择器与它所引用的内容相匹配的选择器合并。

``` LESS
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}

nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}
```

``` LESS
.a:extend(.b) {}
// the above block does the same thing as the below block
.a {
  &:extend(.b);
}

.c:extend(.d all) {
  // extends all instances of ".d" e.g. ".x.d" or ".d.x"
}
.c:extend(.d) {
  // extends only instances where the selector will be output as just ".d"
}

// 它可以包含一个或多个要扩展的类，以逗号分隔
.e:extend(.f) {}
.e:extend(.g) {}
// the above and the below do the same thing
.e:extend(.f, .g) {}
  
```

### 扩展附加到选择器

附加到选择器的扩展看起来像一个普通的伪类，选择器作为参数。一个选择器可以包含多个扩展子句，但所有扩展都必须位于选择器的末尾。

## 命名空间

## 映射 Map

## 作用域 Scope

## 导入 Importing
