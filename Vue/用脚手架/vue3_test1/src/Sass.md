# Sass

Sass 支持两种不同的语法：SCSS
提供了变量（variables）、嵌套（nested rules）、 混合（mixins）、 函数（functions）

- SCSS：使用 .scss 文件扩展名，它是 CSS 的超集，**所有有效的 CSS 也同样都是有效的 SCSS**
- 缩进的语法：Sass 的原始语法，使用文件 扩展名 .sass，使用缩进而不是花括号和分号来描述文档的格式

## 解析样式表

Sass 样式表是经由 Unicode 编码序列解析而来的。 解析是直接进行的，没有转换为标记流（token stream）的过程。

当 Sass 在样式表中遇到无效语法时，解析将失败， 并向用户展示错误信息，其中包含了无效语法的位置 以及错误的原因。

## 样式表结构

### 语句

在 SCSS 中，语句由分号分隔（如果语句使用块，则分号是可选的）。在缩进语法中，它们仅由换行符分隔。$var: value、控制流 @if@each、@error、@warn和@debug规则

#### 顶级语句

这些语句只能在样式表的顶层使用，或者嵌套在顶级的 CSS 语句中：

- 模块加载，使用 @use
- 导入，使用 @import
- Mixin 定义，使用 @mixin
- 函数定义，使用 @function

#### 其他声明

属性声明（如）只能在样式规则和某些 CSS at-rules 中使用。width: 100px

@extend 规则只能在样式规则中使用

### 表达式

表达式是位于属性或变量声明右侧的任何内容。每个表达式都会生成一个值。任何有效的 CSS 属性值也是 Sass 表达式，但 Sass 表达式比普通 CSS 值强大得多。它们作为参数传递给 mixin 和函数，用于具有@if规则的控制流，并使用算术进行操作。我们将 Sass 的表达式语法称为 `SassScript`

- 文字：表示静态值--数字、字符串、颜色、布尔、值列表、映射（"background": red）
- 操作：== != 检查两个值是否相同, +-*/% 数学含义, < <= > >= , and or not , +-/ 连接字符串, () 显示控制操作的优先顺序
- 其他表达式：变量 $xxx , 函数调用 , 特殊函数 , 父选择器 & , 一个被解析为不带引号的值 !important

### 注释

- `单行注释（静默注释）`: 以//开头，一直到行尾。单行注释中的任何内容都不会以 CSS 形式发出，不产生任何CSS
- `多行注释`: /**/。会将其编译为 CSS 注释(当注释出现在原生css不允许的地方，如在css属性或选择器中，sass将不知如何将其生成到对应css文件中的相应位置，于是这些注释被抹掉)。编译为 CSS 的多行注释可能包含插值，将在编译注释之前对其进行评估
  
  ``` SCSS
  body {
    // 这种注释内容不会出现在生成的css文件中
    /* 这种注释内容会出现在生成的css文件中 */
    color /* 这块注释内容不会出现在生成的css中 */: #333;
    padding: 1; /* 这块注释内容也不会出现在生成的css中 */ 0;
  }
  ```

## 预处理

Sass 提供了 CSS 中还不存在的特性（例如嵌套、mixin、 继承和其它实用的功能）辅助编写健壮、 可维护的 CSS 代码

## 变量

可以在变量中存储颜色、字体 或任何 CSS 值，并在将来重复利用。Sass 使用 $ 符号 作为变量的标志

$link-color和$link_color其实指向的是同一个变量。实际上，在sass的大多数地方，中划线命名的内容和下划线命名的内容是互通的，除了变量，也包括对混合器和Sass函数的命名。但是在sass中纯css部分不互通，比如类名、ID或属性名。

## 嵌套

Sass 允许嵌套 CSS 选择器，嵌套方式 与 HTML 的视觉层次结构相同。请注意，不要过度嵌套的规则

## 片段

可以创建包含少量 CSS 片段的局部 Sass 文件，这些片段可以包含在其他 Sass 文件中--`@use xxx`
是以前导下划线命名 Sass 文件，下划线让 Sass 知道该文件只是部分文件，不应将其生成到 CSS 文件中

## 模块

不必将所有 Sass 写入一个文件中。您可以使用规则将其拆分为任意方式。此规则将另一个 Sass 文件作为模块加载，这意味着您可以使用基于文件名的命名空间在 Sass 文件中引用其变量、mixin 和函数。使用文件还将包含它在编译输出中生成的CSS `@use xxx`
··

``` SCSS
// _base.scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}

// styles.scss
@use 'base';

.inverse {
  background-color: base.$primary-color;
  color: white;
}


// 编译出的CSS
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}

.inverse {
  background-color: #333;
  color: white;
}
```

## 混合 Mixins

``` SCSS
@mixin theme($theme: DarkGray) {
  background: $theme;
  box-shadow: 0 0 1px rgba($theme, .25);
  color: #fff;
}

.info {
  @include theme;
}
.alert {
  @include theme($theme: DarkRed);
}
.success {
  @include theme($theme: DarkGreen);
}

// 编译出的CSS
.info {
  background: DarkGray;
  box-shadow: 0 0 1px rgba(169, 169, 169, 0.25);
  color: #fff;
}

.alert {
  background: DarkRed;
  box-shadow: 0 0 1px rgba(139, 0, 0, 0.25);
  color: #fff;
}

.success {
  background: DarkGreen;
  box-shadow: 0 0 1px rgba(0, 100, 0, 0.25);
  color: #fff;
}
```

## 扩展/继承 @extend

允许将一组 CSS 属性从一个选择器共享到另一个选择器

## 操作符
