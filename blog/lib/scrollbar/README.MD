
## scrollbar自定义滚动条

>scrollbar是一个自定义滚动样式的样式工具，可以让网页滚动条显示得更加漂亮。

## 兼容性

scrollbar自定义滚动条样式主要基于webkit内核提供的`::-webkit-scrollbar`等伪元素实现的，所以非webkit内核浏览器没有效果。

## 使用

### 只使用样式
  使用scrollbar.css样式，并在需要显示自定义滚动条的标签加 `.scrollbar 滚动条类型`类名即可。

  例子(应用icon-scrollbar样式)：
  ```
  <link rel="stylesheet" type="text/css" href="./scrollbar.css">
  <body class="scrollbar icon-scrollbar">...</body>
  ```
  滚动条类型：'icon-scrollbar','simple-scrollbar','pretty-scrollbar-white','pretty-scrollbar','pretty-scrollbar-white'
  控制类：'scrollbar-min'(小滚动条),'scrollbar-btn-none'(去除两边按钮位置)

> 注： `::-webkit-scrollbar`伪元素设置的是浏览器滚动条，如果你需要滚动条还需要在对应的元素上应用样式'overflow:auto'才能显示。

### 使用样式与运动效果

 传统的滚动条滑动比较生硬，所以专门编写了个scrollbar.js的小工具，使滚动条滚动时具有比较平滑的过渡。

 >目前实现的是垂直滚动方向的效果，暂时没有水平方向效果

兼容

ie10+，其他浏览器暂时没测试

 使用

 ```
<script type="text/javascript" src="scrollbar.js"></script>
<link rel="stylesheet" type="text/css" href="./scrollbar.css">

 ```

 > scrollbar.js插件会查找类名为`.scrollbar`的元素(可以在脚本执行之前改变`window['css-scrollbar']`)，并使其滚动滚动条是具有平滑的运动效果，所以如果只是想使用样式而不使用scrollbar.js可以在使用 `.scrollbar no-scroll`类，
 当然如果`no-scroll`存在类名冲突时可以通过`window['no-scroll']`重新设置其他类名。

设置

滚动条滚动配置不是必须的，如果需要设置也可以通过`data-scroll="{}"`指定。

参数：
 + nowel 阻力 int ，默认15
 + step 步长 int ， 默认为滚动视窗高度

例子：
  ```
<div class="container icon-scrollbar"  data-scroll="{nowel:50,step:100}">
...
</div>
  ```
### 接口
  + scrollTo(int) 滚动到指定int
  + scrolltoTop() 滚动到顶部
  + scrolltoBottom() 滚动到底部

### 事件

>因为目前兼容性不是很好，所以暂时没有实现事件
