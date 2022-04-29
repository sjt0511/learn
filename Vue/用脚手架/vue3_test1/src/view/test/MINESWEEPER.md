# 扫雷游戏

## 规则

### 1.模式

1. 初级 9 × 9  宫格 10个雷
2. 中级 12 × 9 宫格 20个雷
3. 高级 16 × 9 宫格 30个雷
4. 顶级 16 × 16 宫格 50个雷
5. 地狱 30 × 16 宫格 99个雷

### 2.操作

#### PC 端

1. 翻开方格：鼠标左键单击
2. 标记雷|取消标记雷：鼠标右键单击
3. 当某个已翻好的数字方块，周围标记的雷数===该方块数字，双击该方块能把所有可以展开的方块都展开

### 3. 具体实现

生成一个 m*n 的方格

### 知识点

#### 1. v-model

- v-model 的默认事件名和prop已更改
  - prop: `value` ====> `modelValue`
  - 事件: `input` ====> `update:modelValue`
- v-bind 的 .sync 修饰符和组件的 model 选项已移除，可在 v-model 上加一个参数代替
- 可以在同一个组件上使用多个 v-model 绑定
- 可以自定义 v-model 修饰符

  ``` HTML
  <!-- 简写 -->
  <ChildComponent v-model="pageTitle" v-model.title="pageTitle2"/>
  <!-- 详细写法 -->
  <ChildComponent :modelValue="pageTitle" @update:modelValue="pageTitle=$event"
                  :title="pageTitle2" @update:title="pageTitle2=$event"/>
  ```
