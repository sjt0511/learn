# Less(Leaner Style Sheets)

## 变量 Variables

``` CSS
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

``` CSS
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

``` CSS
.block {
  color: red; 
  .inner {
    background-color: $color; 
  }
  color: blue;  
} 
```

``` CSS
.block {
  color: red; 
  color: blue;  
} 
.block .inner {
  background-color: blue; 
}
```

## 父选择器 &

引用父选择器 `&`
