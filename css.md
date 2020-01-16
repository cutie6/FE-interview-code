
# css

## 盒子模型

在CSS中，使用标准盒模型描述这些矩形盒子中的每一个。这个模型描述了元素所占空间的内容。每个盒子有四个边：外边距边, 边框边, 内填充边 与 内容边。 

## link与@import

例如当我们写：
\<link href="style.css" rel="stylesheet" />
浏览器知道这是个样式表文件，html的解析和渲染不会暂停，css文件的加载是同时进行的，这不同于在style标签里面的内置样式，用@import添加的样式是在页面载入之后再加载，这可能会导致页面因重新渲染而闪烁。所以我们建议使用link而不是@import。

## css优先级，属性选择器的优先级在哪

!important>元素内的样式>id选择器>类选择器，属性和伪类>标签选择器和伪元素>通配符选择器>浏览器自定义或继承

**直接定位(定位更加精准)的样式权重大于继承的样式，无论继承的规则的特异性（优先级）如何。**

Styles for a directly targeted element will always take precedence over inherited styles, regardless of the specificity of the inherited rule.

```css
h1 {
  color: purple;
}
#parent {
  color: green;
}
```

当它应用在下面的HTML时:

```html
<html>
<body id="parent">
  <h1>Here is a title!</h1>
</body>
</html>
```

浏览器会将h1渲染成紫色。
因为h1选择器清晰地定位了元素。



### ~ 组合器

A + B	匹配任意元素，满足条件：B是A的下一个兄弟节点（AB有相同的父结点，并且B紧跟在A的后面）

A ~ B	满足条件：B是A之后的兄弟节点中的任意一个（AB有相同的父节点，B在A之后，但不一定是紧挨着A）(会尽可能多匹配) 

## 浮动

### 解释浮动 (Floats) 及其工作原理

任何元素 element 都可以被浮动。段落、div、list、tables,以及图像都可以被浮动，事实上即使是像 span 和strong 这样的行内置元素也可以很好地进行浮动。

任何申明为 float 的元素自动被设置为一个"块级元素", 这表示它可以具有申明的"width"和"height"属性。事实上，floats当前被要求具有一个申明的宽度，但这不是现代浏览器制造者的思路，W3C以及开始同意这样的作法。现在大多数人的意见是没有指定宽度的float应当伸缩包装到浮动内容的宽度。因此，内部带有图片的一个float将和图片一样宽，带有文本的一个浮动将与该浮动内的最长文本行一样宽。

浮动的框可以左右移动，直至它的外边缘遇到包含框或者另一个浮动框的边缘。浮动框不属于文档中的普通流，当一个元素浮动之后，不会影响到块级框的布局而只会影响内联框（通常是文本）的排列，文档中的普通流就会表现得和浮动框不存在一样，当浮动框高度超出包含框的时候，也就会出现包含框不会自动伸高来闭合浮动元素（“高度塌陷”现象）。

浮动布局是CSS中规定的第二种定位机制。 (CSS 有三种基本的定位机制：普通流、浮动和绝对定位。)
能够实现横向多列布局。（常见的为横向两列布局，横向三列布局）
通过设置float属性实现。

### clear 含义   

none
元素不会向下移动清除之前的浮动。
left
元素被向下移动用于清除之前的左浮动。
right
元素被向下移动用于清除之前的右浮动。
both
元素被向下移动用于清除之前的左右浮动。

### 清除浮动

两种方式： clear 与  bfc

1.容器元素闭合标签前添加额外元素并设置clear: both

```
.clearfix::before, .clearfix::after{
    overflow: hidden;
    display: table;
    visibility: hidden;
    content: '';
    clear: both;
}
```
2.父元素触发块级格式化上下文


## 块级格式上下文 

一个块格式化上下文（block formatting context） 是Web页面的可视化CSS渲染出的一部分。它是块级盒布局出现的区域，也是浮动层元素进行交互的区域。

一个块格式化上下文由以下之一创建：

- 根元素或其它包含它的元素
- 浮动元素 (元素的 float 不是 none)
- 绝对定位元素 (元素的 position 为 absolute 或 fixed)
- 内联块 (元素具有 display: inline-block)
- 表格单元格 (元素具有 display: table-cell，HTML表格单元格默认属性)
- 表格标题 (元素具有 display: table-caption, HTML表格标题默认属性)
- 具有overflow 且值不是 visible 的块元素，
- display: flow-root
- column-span: all 应当总是会创建一个新的格式化上下文，即便具有 column-span: all 的元素并不被包裹在一个多列容器中。
一个块格式化上下文包括创建它的元素内部所有内容，除了被包含于创建新的块级格式化上下文的后代元素内的元素。

块格式化上下文对于定位 (参见 float) 与清除浮动 (参见 clear) 很重要。定位和清除浮动的样式规则只适用于处于同一块格式化上下文内的元素。浮动不会影响其它块格式化上下文中元素的布局，并且清除浮动只能清除同一块格式化上下文中在它前面的元素的浮动。

> 作用：

可以包含浮动元素

不被浮动元素覆盖，创建自适应两栏布局

阻止父子元素的margin折叠


## 外边距合并（塌陷）

**垂直外边距可能会合并，水平外边距不会合并**

- 相邻的兄弟姐妹元素
毗邻的两个兄弟元素之间的外边距会塌陷（除非后者兄弟姐妹需要清除过去的浮动）

- 块级父元素与其第一个/最后一个子元素
如果块级父元素中，不存在上边框、上内边距、内联元素、块格式化上下文、 清除浮动 这五条（也可以说，当上边框宽度及上内边距距离为0时），那么这个块级元素和其第一个子元素的上边距就可以说”挨到了一起“。此时这个块级父元素和其第一个子元素就会发生上外边距合并现象，换句话说，此时这个父元素对外展现出来的外边距将直接变成这个父元素和其第一个子元素的margin-top的较大者。

- 空块元素
如果存在一个空的块级元素，其 border、padding、inline content、height、min-height 都不存在。那么此时它的上下边距中间将没有任何阻隔，此时它的上下外边距将会合并

**只有普通文档流中块框的垂直外边距才会发生外边距合并。行内框、浮动框或绝对定位之间的外边距不会合并。**

- BFC（Block Formatting Context 块格式化上下文）与元素外边距合并 :
当两个元素属于不同的BFC时，这两个元素的外边距不会合并。
但在同一个BFC内，两个相邻元素的外边距仍会合并。

## css属性细节


## white-space

|      |换行符	|空格和制表符	|文字转行|
| ------| ------ | ------ |  ------ |
|normal	|合并	|合并	|转行|
|nowrap|	合并|	合并|	不转行|
|pre	|保留|	保留|	不转行|
|pre-wrap|	保留|	保留|	转行|
|pre-line|	保留|	合并|	转行|

### display: block;和display: inline;的区别

- block元素特点：

1.处于常规流中时，如果width没有设置，会自动填充满父容器

2.可以应用margin/padding 

3.在没有设置高度的情况下会扩展高度以包含常规流中的子元素 

4.处于常规流中时布局时在前后元素位置之间（独占一个水平空间） 

5.忽略vertical-align

- inline元素特点:

1.水平方向上根据direction依次布局 

2.不会在元素前后进行换行 

3.受white-space控制 

4.margin/padding在竖直方向上无效，水平方向上有效 

5.width/height属性对非替换行内元素无效，宽度由元素内容决定 

6.非替换行内元素的行框高由line-height确定，替换行内元素的行框高由height,margin,padding,border决定 

6.浮动或绝对定位时会转换为block 

7.vertical-align属性生效

- inline-block

简单来说就是将对象呈现为inline对象，但是对象的内容作为block对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个link（a元素）inline-block属性值，使其既具有block的宽度高度特性又具有inline的同行特性。

### 罗列出你所知道的 display属性的全部值

none	此元素不会被显示。
block	此元素将显示为块级元素，此元素前后会带有换行符。
inline	默认。此元素会被显示为内联元素，元素前后没有换行符。
inline-block	行内块元素。（CSS2.1 新增的值）
list-item	此元素会作为列表显示。
run-in	此元素会根据上下文作为块级元素或内联元素显示。
table	此元素会作为块级表格来显示（类似 \<table>），表格前后带有换行符。
inline-table	此元素会作为内联表格来显示（类似 \<table>），表格前后没有换行符。
table-row-group	此元素会作为一个或多个行的分组来显示（类似 \<tbody>）。
table-header-group	此元素会作为一个或多个行的分组来显示（类似 \<thead>）。
table-footer-group	此元素会作为一个或多个行的分组来显示（类似 \<tfoot>）。
table-row	此元素会作为一个表格行显示（类似 \<tr>）。
table-column-group	此元素会作为一个或多个列的分组来显示（类似 \<colgroup>）。
table-column	此元素会作为一个单元格列显示（类似 \<col>）
table-cell	此元素会作为一个表格单元格显示（类似 \<td> 和 \<th>）
table-caption	此元素会作为一个表格标题显示（类似 \<caption>）
inherit	规定应该从父元素继承 display属性的值。

### position 属性值

static
该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 top, right, bottom, left 和 z-index 属性无效。

relative
该关键字下，元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。position:relative 对 table-*-group, table-row, table-column, table-cell, table-caption 元素无效。

absolute
不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。

fixed
不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform  属性非 none 时，容器由视口改为该祖先。

sticky 
盒位置根据正常流计算(这称为正常流动中的位置)，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。在所有情况下（即便被定位元素为 table 时），该元素定位均不对后续元素造成影响。当元素 B 被粘性定位时，后续元素的位置仍按照 B 未定位时的位置来确定。position: sticky 对 table 元素的效果与 position: relative 相同。 

- 注解

对于相对定位元素，top 和 bottom 属性指定它相对于正常位置的垂直偏移，left 和 right 属性指定水平偏移。

对于绝对定位元素，top、right、bottom 和 left 属性指定元素相对于其包含块的偏移，即此时位置为与包含块的相对位置。元素的边距（margin）定位在这些偏移之中。

在大多数时候，绝对定位元素的 height 和 width 属性的值为 auto，它们会自动计算以适合元素的内容。但是非替换（non-replaced）绝对定位元素可以占据 top 和 bottom 的值（除 auto 外）所共同指定的可用空间，而不必设置 height（也就是设其为 auto）。left、right 与 width 也类似。

绝对定位元素的定位值发生冲突时的解决方法:

如果同时指定 top 和 bottom（非 auto），优先采用 top。
如果同时指定 left 和 right，若 direction 为 ltr（英语、汉语等），则优先采用 left；若 direction 为 rtl（阿拉伯语、希伯来语等），则优先采用 right。

### display: none;与visibility: hidden;的区别

联系：它们都能让元素不可见

区别：

display:none;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；visibility: hidden;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见

display: none;是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；visibility: hidden;是继承属性，子孙节点消失由于继承了hidden，通过设置visibility: visible;可以让子孙节点显式

修改常规流中元素的display通常会造成文档重排。修改visibility属性只会造成本元素的重绘。

读屏器不会读取display: none;元素内容；会读取visibility: hidden;元素内容

### position的值

- absolute	

- fixed	

- relative	
生成相对定位的元素，**相对于其正常位置进行定位**。

因此，"left:20" 会向元素的 LEFT 位置添加 20 像素。

- static	
默认值。没有定位，元素出现在正常的流中**（忽略 top, bottom, left, right 或者 z-index 声明）**。

### margin padding 百分数根据什么

margin与padding 的百分比值参照其包含块的宽度进行计算。

### line-height 取值
 
normal
取决于用户代理。桌面浏览器（包括火狐浏览器）使用默认值，约为1.2，这取决于元素的 font-family。
\<number>
该属性的应用值是这个无单位数字\<number>乘以该元素的字体大小。计算值与指定值相同。大多数情况下，**使用这种方法设置line-height是首选方法**，在继承情况下不会有异常的值。
\<length>
指定\<length>  用于计算 line box 的高度。查看\<length> 获取可能的单位。**以em为单位的值可能会产生非预期的结果**(可能用的是父级的字体大小)。
\<percentage>
与元素自身的字体大小有关。计算值是给定的百分比值乘以元素计算出的字体大小。
Percentage可能会带来意想不到的结果。


## 如何确定一个元素的包含块(containing block)

根元素的包含块叫做初始包含块，在连续媒体中他的尺寸与viewport相同并且anchored at the canvas origin；对于paged media，它的尺寸等于page area。初始包含块的direction属性与根元素相同。

position为relative或者static的元素，它的包含块由最近的块级（display为block,list-item, table）祖先元素的内容框组成

如果元素position为fixed。对于连续媒体，它的包含块为viewport；对于paged media，包含块为page area

如果元素position为absolute，它的包含块由祖先元素中最近一个position为relative,absolute或者fixed,sticky的元素产生

![](imgs/containingBlock.png)

## flex布局
https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout
css弹性盒子布局定义了一种针对用户界面设计而优化的css盒子模型。在弹性布局模型中，弹性容器的字元素可以在任何方向上排布，也可以“弹性伸缩”其尺寸。既可以增加尺寸以填满未使用的空间，也可以收缩尺寸以避免父元素溢出。子元素的水平对齐和垂直对齐都能很方便地进行操纵。

https://developer.mozilla.org/zh-CN/docs/Web/CSS/display
display CSS 属性指定了元素的显示类型，它包含两类基础特征，用于指定元素怎样生成盒模型——外部显示类型定义了元素怎样参与流式布局的处理，内部显示类型定义了元素内子元素的布局方式。
```css
/* <display-outside> values
外部显示类型 */
display: block;
display: inline;
display: run-in;

/* <display-inside> values
内部显示类型 */
display: flow;
display: flow-root;
display: table;
display: flex;
display: grid;
display: ruby;
```

https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox

文档中采用了 flexbox 的区域就叫做 flex 容器。为了创建 flex 容器， 我们把一个容器的 display 属性值改为 flex 或者 inline-flex。 完成这一步之后，容器中的直系子元素就会变为 flex 元素。所有CSS属性都会有一个初始值，**所以 flex 容器中的所有 flex 元素都会有下列行为**：

元素排列为一行 (flex-direction 属性的初始值是 row)。
元素从主轴的起始线开始。
元素不会在主维度方向拉伸，但是可以缩小。
元素被拉伸来填充交叉轴大小。
flex-basis 属性为 auto。
flex-wrap 属性为 nowrap。

### Flexbox

https://css-tricks.com/snippets/css/a-guide-to-flexbox/

```css
//水平分布
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
//竖直分布
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

任何一个容器都可以指定为 Flex 布局。

```css
.box{
  display: flex;
}
```
设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

- 容器的属性
以下6个属性设置在容器上。

flex-direction
flex-wrap
flex-flow
justify-content 属性定义了项目在主轴上的对齐方式。
align-items 属性定义项目在交叉轴上如何对齐。
align-content 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

- 项目的属性
以下6个属性设置在项目上。

order

flex-grow 属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

flex-shrink 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。负值对该属性无效。

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

flex 属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。


## 层叠上下文布局规则

- z轴上的默认层叠顺序如下（从下到上）：

根元素的边界和背景
常规流中的元素按照html中顺序
浮动块
positioned元素按照html中出现顺序

- 如何创建stacking context：

根元素 (HTML),

z-index 值不为 "auto"的 绝对/相对定位，

一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，

opacity 属性值小于 1 的元素（参考 the specification for opacity），

transform 属性值不为 "none"的元素，

mix-blend-mode 属性值不为 "normal"的元素，

filter值不为“none”的元素，(CSS滤镜（filter）属提供的图形特效，像模糊，锐化或元素变色。过滤器通常被用于调整图片，背景和边界的渲染。)

perspective值不为“none”的元素，

isolation 属性被设置为 "isolate"的元素，(isolation CSS属性定义该元素是否必须创建一个新的stacking context。

该属性的主要作用是当和background-blend-mode属性一起使用时，可以只混合一个指定元素栈的背景：它允许使一组元素从它们后面的背景中独立出来，只混合这组元素的背景。)

position: fixed

在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值（参考 这篇文章）

-webkit-overflow-scrolling 属性被设置 "touch"的元素



## 请问 "resetting" 和 "normalizing" CSS 之间的区别？你会如何选择，为什么？
http://jerryzou.com/posts/aboutNormalizeCss/

reset.css能够重置浏览器的默认属性。normalize.css保护有用的浏览器默认样式而不是完全去掉它们。 
Normalize.css 修复了浏览器的bug.

normalize优点：
保护有用的浏览器默认样式而不是完全去掉它们
一般化的样式：为大部分HTML元素提供
修复浏览器自身的bug并保证各浏览器的一致性
优化CSS可用性：用一些小技巧
解释代码：用注释和详细的文档来

## 什么是 FOUC (无样式内容闪烁)？你如何来避免 FOUC

其实原理很清楚：当样式表晚于结构性html加载，当加载到此样式表时，页面将停止之前的渲染。此样式表被下载和解析后，将重新渲染页面，也就出现了短暂的花屏现象。

解决方法：
使用LINK标签将样式表放在文档HEAD中

## 常用长度单位
相对长度：

相对字体大小单位
- em
相对长度单位，**这个单位表示元素的font-size的计算值。如果用在font-size 属性本身，它会继承父元素的font-size。**
- rem
这个单位代表根元素的 font-size 大小（例如 \<html> 元素的font-size）。当用在根元素的font-size上面时 ，它代表了它的初始值
- lh
等于元素行高line-height的计算值
- rlh
等于根元素行高line-height的计算值。当用于设置根元素的行高line-height或是字体大小font-size 时，该rlh指的是根元素行高line-height或字体大小font-size 的初始值

视口比例的长度
视口比例长度定义了相对于视口的长度大小，视口即文档可视的部分。 当视口的大小被修改（通过更改桌面计算机窗口大小或旋转手机或平板设备的方向）时，只有基于Gecko的浏览器才动态更新视口值。

如果html和body设置了overflow:auto，滚动条占据的空间不会从视口中减去（译者注：大概就是说会算在视口里，视口大小是包括滚动条的），但当设置为overflow:scroll时，滚动条占据的空间反而会从视口中减去（译者注：大概就是此时视口大小不包括滚动条）。

- vh
视口高度的 1/100。
- vw
视口宽度的 1/100。
- vmin
视口高度和宽度之间的最小值的 1/100。**可用于画出充满视图窗口的正方形**
- vmax
视口高度和宽度之间的最大值的 1/100。




## specified value,computed value,used value计算方法

- specified value: 计算方法如下：

如果样式表设置了一个值，使用这个值
如果没有设置值，这个属性是继承属性，从父元素继承
如果没设置，并且不是继承属性，使用css规范指定的初始值

- computed value: 
以specified value根据规范定义的行为进行计算，通常将相对值计算为绝对值，例如em根据font-size进行计算。一些使用百分数并且需要布局来决定最终值的属性，如width，margin。百分数就直接作为computed value。line-height的无单位值也直接作为computed value。这些值将在计算used value时得到绝对值。**computed value的主要作用是用于继承**

- used value：
属性计算后的最终值，对于大多数属性可以通过window.getComputedStyle获得，尺寸值单位为像素。以下属性依赖于布局，

background-position
bottom, left, right, top
height, width
margin-bottom, margin-left, margin-right, margin-top
min-height, min-width
padding-bottom, padding-left, padding-right, padding-top
text-indent




## 替换元素与非替换元素

替换元素：

替换元素是浏览器根据其标签的元素与属性来判断显示具体的内容。

比如：\<input /> type="text" 时这是一个文本输入框，换一个其他的时候，浏览器显示就不一样

(X)HTML中的\<img>、\<input>、\<textarea>、\<select>、\<object>都是替换元素，这些元素都没有实际的内容。

非替换元素：

(X)HTML 的大多数元素是不可替换元素，他们将内容直接告诉浏览器，将其显示出来。

比如\<p>wanmei.com\</p>

浏览器将把这段内容直接显示出来。


## 浏览器是如何判断元素是否匹配某个 CSS 选择器
https://www.zhihu.com/question/24959507

从后往前判断。
浏览器先产生一个元素集合，这个集合往往由最后一个部分的索引产生（如果没有索引就是所有元素的集合）。然后向上匹配，如果不符合上一个部分，就把元素从集合中删除，直到真个选择器都匹配完，还在集合中的元素就匹配这个选择器了。举个例子，有选择器：
```
body.ready #wrapper > .lol233
```
先把所有 class 中有 lol233 的元素拿出来组成一个集合，然后上一层，对每一个集合中的元素，如果元素的 parent id 不为 #wrapper 则把元素从集合中删去。 再向上，从这个元素的父元素开始向上找，没有找到一个 tagName 为 body 且 class 中有 ready 的元素，就把原来的元素从集合中删去。至此这个选择器匹配结束，所有还在集合中的元素满足。




## CSS有哪些继承属性
- 关于文字排版的属性如：
font
word-break
letter-spacing
text-align
text-rendering
word-spacing
white-space
text-indent
text-transform
text-shadow
- 其他
line-height
color
visibility
cursor

## css模块

http://web.jobbole.com/88300/

- 作用

CCS模块将作用域限制于组件中，从而避免了全局作用域的问题。

- 它是如何工作的
CSS模块需要在构建步骤进行管道化，这也就是说，它不是自动驱动的。它可以看成是webpack 或 Browserify的一个插件。其基本工作方式是：当你在一个JavaScript模块中导入一个CSS文件时（例如，在一个 React 组件中），CSS模块将会定义一个对象，将文件中类的名字动态的映射为JavaScript作用域中可以使用的字符串。

- debug
sourcemap

- 复用 
全局样式：定义全局样式也是可以的，只要使用:global()

继承：composes

## css加载是否会阻塞dom树渲染？
这里说的是头部引入css的情况
首先，我们都知道：css是由**单独的下载线程异步下载的**。

然后再说下几个现象：

    css加载不会阻塞DOM树解析（异步加载时DOM照常构建）

    但会阻塞render树渲染（渲染时需等css加载完毕，因为render树需要css信息）

这可能也是浏览器的一种优化机制。
因为你加载css的时候，可能会修改下面DOM节点的样式，
如果css加载不阻塞render树渲染的话，那么当css加载完之后，
render树可能又得重新重绘或者回流了，这就造成了一些没有必要的损耗。
所以干脆就先把DOM树的结构先解析完，把可以做的工作做完，然后等你css加载完之后，再根据最终的样式来渲染render树，这种做法性能方面确实会比较好一点。

## 响应式设计 (responsive design) 和自适应设计 (adaptive design)
https://css-tricks.com/the-difference-between-responsive-and-adaptive-design/

Responsive sites and adaptive sites are the same in that they both change appearance based on the browser environment they are being viewed on (the most common thing: the browser's width).

Responsive websites respond to the size of the browser at any given point. No matter what the browser width may be, the site adjusts its layout (and perhaps functionality) in a way that is optimized to the screen. Is the browser 300px wide or 30000px wide? It doesn't matter because the layout will respond accordingly. Well, at least if it's done correctly!

Adaptive websites adapt to the width of the browser at a specific points. In other words, the website is only concerned about the browser being a specific width, at which point it adapts the layout.




## 如果设计中使用了非标准的字体，你该如何去实现？

1、用图片代替

2、web
 fonts在线字库，如Google Webfonts，Typekit 等等；http://www.chinaz.com/free/2012/0815/269267.shtml

 
 3、@font-face

 这是一个叫做@font-face 的CSS @规则 ，它允许网页开发者为其网页指定在线字体。 通过这种作者自备字体的方式，@font-face 可以消除对用户电脑字体的依赖。 @font-face 不仅可以放在在CSS的最顶层, 也可以放在 @规则 的 条件规则组 中。

 ```html
 <html>
<head>
  <title>Web Font Sample</title>
  <style type="text/css" media="screen, print">
    @font-face {
      font-family: "Bitstream Vera Serif Bold";
      src: url("http://developer.mozilla.org/@api/deki/files/2934/=VeraSeBd.ttf");
    }
    
    body { font-family: "Bitstream Vera Serif Bold", serif }
  </style>
</head>
<body>
  This is Bitstream Vera Serif Bold.
</body>
</html>
 ```



## 优化网页的打印样式

http://blog.csdn.net/xujie_0311/article/details/42271273

\<link rel="stylesheet" type="text/css" media="screen" href="xxx.css" />
其中media指定的属性就是设备，显示器上就是screen，打印机则是print，电视是tv，投影仪是projection。
\<link rel="stylesheet" type="text/css" media="print" href="yyy.css" />
 但打印样式表也应有些注意事项：
 1、打印样式表中最好不要用背景图片，因为打印机不能打印CSS中的背景。如要显示图片，请使用html插入到页面中。
 2、最好不要使用像素作为单位，因为打印样式表要打印出来的会是实物，所以建议使用pt和cm。
 3、隐藏掉不必要的内容。（@print div{display:none;}）
 4、打印样式表中最好少用浮动属性，因为它们会消失。
 5、揭露链接
 6、突现链接文字
 7、如果想要知道打印样式表的效果如何，直接在浏览器上选择打印预览就可以了。


## 如何解决特定浏览器的样式问题
 https://www.jianshu.com/p/f47a545203b8

1.针对IE浏览器，新建一个css文件
2.在ＨＴＭＬ文档头部添加　条件注释　代码
```html
<!--[if IE 5]><link rel="stylesheet" href="ie5.css"><![endif]-->
```


## animation

```css
.eye{
  animation: move_eye 4s linear 0s infinite alternate;
}
@keyframes move_eye {
   from { margin-left:-20%; }
   to { margin-left:100%; }  
}

```

CSS animation属性是如下属性的一个简写属性形式:
 animation-name, 
 animation-duration, 
 animation-timing-function, 
 animation-delay,  CSS属性定义动画于何时开始，即从动画应用在元素上到动画开始的这段时间的长度。
 animation-iteration-count, 
 animation-direction 和 
 animation-fill-mode. 这个 CSS 属性用来指定在动画执行之前和之后如何给动画的目标应用样式。forwards
目标保持动画最后一帧的样式;backwards动画采用相应第一帧的样式

## css3

### 新属性

https://leohxj.gitbooks.io/front-end-database/html-and-css-basic/css3-news.html

- @Font-face 特性
加载字体样式，而且它还能够加载服务器端的字体文件，让客户端显示客户端所没有安装的字体。

- Word-wrap & Text-overflow 样式
Word-wrap
设置word-wrap: break-word的话，在单词换行的情况下，可保持单词的完整性。

- Text-overflow
它与 word-wrap 是协同工作的，word-wrap 设置或检索当当前行超过指定容器的边界时是否断开转行，而 text-overflow 则设置或检索当当前行超过指定容器的边界时如何显示, 我们在父容器设置overflow: hidden, 然后设置“text-overflow”属性，有“clip”和“ellipsis”两种可供选择。"clip"表示直接切割，"ellipsis"表示用省略号代替。

- 文字渲染（Text-decoration）
Text-fill-color: 文字内部填充颜色
Text-stroke-color: 文字边界填充颜色
Text-stroke-width: 文字边界宽度

- CSS3 的多列布局（multi-column layout）
Column-count：表示布局几列。
Column-rule：表示列与列之间的间隔条的样式
Column-gap：表示列于列之间的间隔

- 边框和颜色（color, border）
支持rgba和hsl表示颜色, 支持圆角，阴影等效果。

- CSS3 的渐变效果（Gradient）
支持线性渐变和径向渐变。

- CSS3 的阴影（Shadow）和反射（Reflect）效果
阴影效果，阴影效果既可用于普通元素，也可用于文字。

- CSS3 的背景效果
“Background Clip”，该属确定背景画区
“Background Origin”，用于确定背景的位置，它通常与 background-position 联合使用，您可以从 border、padding、content 来计算 background-position（就像 background-clip）。
“Background Size”，常用来调整背景图片的大小，注意别和 clip 弄混，这个主要用于设定图片本身。
“Background Break”属性，CSS3 中，元素可以被分成几个独立的盒子（如使内联元素 span 跨越多行），background-break 属性用来控制背景怎样在这些不同的盒子中显示。
多背景图片支持

- CSS3 的盒子模型
display: -webkit-box; 
display: -moz-box; 
-webkit-box-orient: horizontal; 
-moz-box-orient: horizontal;
“display: -webkit-box; display: -moz-box;”，它针对 webkit 和 gecko 浏览器定义了该元素的盒子模型。注意这里的“-webkit-box-orient: horizontal;”，他表示水平排列的盒子模型。如果配合元素的box-flex属性：

```css
.flex { 
     -webkit-box-flex: 1; 
     -moz-box-flex: 1; 
 } 

 .flex2 { 
     -webkit-box-flex: 2; 
     -moz-box-flex: 2; 
 }
 ```
水平方向设下的宽度，就可以按照1:2的比例关系自动去计算了。

- CSS3 的 Transitions, Transforms 和 Animation
Transitions
transition-property：用于指定过渡的性质，比如 transition-property:backgrond 就是指 backgound 参与这个过渡
transition-duration：用于指定这个过渡的持续时间
transition-delay：用于制定延迟过渡的时间
transition-timing-function：用于指定过渡类型，有 ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier
Transforms
指拉伸，压缩，旋转，偏移等等一些图形学里面的基本变换。

Animation
```css
@-webkit-keyframes anim1 { 
    0% { 
        Opacity: 0; 
 Font-size: 12px; 
    } 
    100% { 
        Opacity: 1; 
 Font-size: 24px; 
    } 
 } 
 .anim1Div { 
    -webkit-animation-name: anim1 ; 
    -webkit-animation-duration: 1.5s; 
    -webkit-animation-iteration-count: 4; 
    -webkit-animation-direction: alternate; 
    -webkit-animation-timing-function: ease-in-out; 
 }
 ```

 > transform-origin
```css
 transform-origin: 2px 30% 10px;     /* x-offset y-offset z-offset */
```
## scss

> 使用 CSS 预处理器的优缺点有哪些？(SASS，Compass，Stylus，LESS) 描述下你曾经使用过的 CSS 预处理的优缺点。

缺点：学习成本的。

优点：可以在CSS中使用变量、简单的逻辑程序、函数等等在编程语言中的一些基本特性，可以让你的CSS更加简洁、适应性更强、可读性更佳，更易于代码的维护等诸多好处。

> %

占位符选择器
Placeholder selectors look like class and id selectors, except the # or . is replaced by %. They can be used anywhere a class or id could, and on their own they prevent rulesets from being rendered to CSS. 例如：

```scss
// This ruleset won't be rendered on its own.
#context a%extreme {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```

However, placeholder selectors can be extended, just like classes and ids. The extended selectors will be generated, but the base placeholder selector will not. 例如：

```scss
.notice {
  @extend %extreme;
}
```

被编译为：

```css
#context a.notice {
  color: blue;
  font-weight: bold;
}
```

## 瀑布流

https://www.w3cplus.com/css/pure-css-create-masonry-layout.html

https://blog.csdn.net/weixin_44135121/article/details/98629830#flex__208

1. 通过Multi-columns相关的属性column-count、column-gap配合break-inside来实现瀑布流布局。

```css
.masonry { column-count: 3;  }
```

2. 通过flex-flow

flex-flow是flex-direction和flex-wrap两个属性的速记属性。

```css
.masonry { 
  display: flex; 
  flex-flow: column wrap; 
  width: 100%; height: 800px; 
  }

```

3. grid

Grid制作瀑布流，对于结构而言和Multi-columns示例中的一样。只不过在.masonry使用display:grid来进行声明：

```css
.masonry {
    display: grid;
    grid-gap: 40px;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(50px, auto);
}
```

对于.item较为蛋疼，需要分别通过grid-row和grid-column来指定列表项目所在的区域，比如：

```css
.masonry > div:nth-child(1) {
    grid-row: 1 / 4;
    grid-column: 1;
}

.masonry > div:nth-child(2) {
    grid-row: 1 / 3;
    grid-column: 2;
}
```

## 优化

### gpu

#### gpu是什么
GPU英文全称Graphic Processing Unit，中文翻译为“图形处理器”。与CPU不同，GPU是专门为处理图形任务而产生的芯片。

对于GPU来说，它的任务是在屏幕上合成显示数百万个像素的图像——也就是同时拥有几百万个任务需要并行处理，因此GPU被设计成可并行处理很多任务，而不是像CPU那样完成单任务。

因此CPU和GPU架构差异很大，CPU功能模块很多，能适应复杂运算环境；GPU构成则相对简单，目前流处理器和显存控制器占据了绝大部分晶体管。CPU中大部分晶体管主要用于构建控制电路（比如分支预测等）和Cache，只有少部分的晶体管来完成实际的运算工作。而GPU的控制相对简单，且对Cache的需求小，所以大部分晶体管可以组成各类专用电路、多条流水线，使得GPU的计算速度有了突破性的飞跃，拥有了更强大的处理浮点运算的能力。

原生的移动端应用(Native mobile applications)总是可以很好的运用GPU，这是为什么它比网页应用(Web apps)表现更好的原因。硬件加速在移动端尤其有用，因为它可以有效的减少资源的利用(麦时注：移动端本身资源有限)。

CSS animations, transforms 以及 transitions 不会自动开启GPU加速，而是由浏览器的缓慢的软件渲染引擎来执行。那我们怎样才可以切换到GPU模式呢，很多浏览器提供了某些触发的CSS规则。

现在，像Chrome, FireFox, Safari, IE9+和最新版本的Opera都支持硬件加速，当它们检测到页面中某个DOM元素应用了某些CSS规则时就会开启，最显著的特征的元素的3D变换。

小心使用这些方法，如果通过你的测试，结果确是提高了性能，你才可以使用这些方法。使用GPU可能会导致严重的性能问题，因为它增加了内存的使用，而且它会减少移动端设备的电池寿命。

#### 如何开启gpu加速

1.最常用的方式：translate3d(0,0,0)、translateZ(0)

2.opacity属性/过渡动画（需要动画执行的过程中才会创建合成层，动画没有开始或结束后元素还会回到之前的状态）


### 使用仅由合成器单独处理的属性
https://developers.google.cn/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count
坚持更改可以由合成器单独处理的属性。目前只有两个属性符合条件：transforms 和 opacity。

使用 transform 和 opacity 时要注意的是，您更改这些属性所在的元素应处于其自身的合成器层。要做一个层，您必须提升元素：
```css
.moving-element {
  will-change: transform;
}
```
或者，对于旧版浏览器，或者不支持 will-change 的浏览器：
```css
.moving-element {
  transform: translateZ(0);
}
```

**这可以提前警示浏览器即将出现更改，根据您打算更改的元素，浏览器可能可以预先安排，如创建合成器层**。

#### 居中为什么用transform，而不是margin top/left
https://blog.csdn.net/weixin_33895475/article/details/87964023
https://blog.csdn.net/callmeCassie/article/details/89290945

结合上面谷歌的开发者文档，transform是可以由合成器单独处理的属性，不会引起整个页面的重排重绘。
margin属性属于布局属性，该属性的变化会导致重排。


### PNG,GIF,JPG的区别及如何选

参考资料： https://yuiblog.com/blog/2008/11/04/imageopt-2/

GIF:
8位像素，256色
无损压缩
支持简单动画
支持boolean透明
适合简单动画

JPEG：
颜色限于256
有损压缩
可控制压缩质量
不支持透明
适合照片

PNG：
有PNG8和truecolor PNG
PNG8类似GIF颜色上限为256，文件小，支持alpha透明度，无动画
适合图标、背景、按钮

### 高效css

 https://www.jianshu.com/p/7c0b185b17d5

- 避免使用通用规则
避免一个规则的结束是通用规则这一类。

- 不要使用tag或者class修饰ID rule
如果一个规则使用了ID选择器作为key selector，不要再添加tag标签指定。因为ID是唯一的，增加tag name会增加不必要的额外的匹配工作。

- 不要使用tag修饰class规则

尽管class可以在同一个页面重复出现，但是它的唯一性比tag更强。
你可以约定在class名称中包含tag名称，但是这会损失一些灵活性。当设计改变tag时，class也会跟着变化。最好的是使用语义名称的class name。

- 使用最特定的一类规则
tag这类会匹配太多的规则，这会大大的降低效率。通过给元素增加class,我们可以回class分类进行细分，减少匹配时间。

- 避免使用后代选择器
**后代选择器是css中最耗时的选择器。尤其当选择器是tag或者通用这一类。子选择器比后代选择器好点**

- tag分类规则永远不要包含孩子选择器

- 质疑所有使用孩子选择器的地方
使用孩子选择器时务必谨慎，尽可能避免使用。
特别是，子选择器频繁适用于RDF树(这个自行Google吧)和menus，如下：

- 依靠继承
了解哪些属性继承，然后使用继承。


## 实现

### 两列布局，左侧定宽，右侧自适应

```
<div class="wra">
   <div class="left"></div>
   <div class="right"></div>
</div>
```

1.
.right宽度100%可以
因为 flex 容器中的所有 flex 元素都会有下列行为：
元素排列为一行 (flex-direction 属性的初始值是 row)。
元素从主轴的起始线开始。
元素不会在主维度方向拉伸，但是可以缩小。
元素被拉伸来填充交叉轴大小。
```css
.wra{
      display: flex;
      height: 300px;
  }
  .left{
      width:200px;
      flex-shrink: 0;
      background:red;
  }
  .right{
      width:100%;
      background:yellow;
  }
```

https://blog.csdn.net/qq_41524596/article/details/82288681

第一种：绝对定位+margin
```css
 .left {
        background-color: red;
        width: 200px;
        position: absolute;
    }
    .right {
        background-color: rgb(255, 0, 255);
        margin-left: 200px;
    }

```
第二种：float+margin
```css
.left {
        background-color: red;
        width: 200px;
        float: left;
    }
 .right {
        background-color: rgb(255, 0, 255);
        margin-left: 200px;
    }
```
第三种：flex 按照我上面👆的也能行

flex 属性是 flex-grow、flex-shrink 和 flex-basis 属性的简写，描述弹性项目的整体的伸缩性。

```css
.wra {
    display: flex;
    height: 200px;
    align-items: stretch;
}
.left{
    flex: 0 0 130px;
    background: pink;
}
.right {
    flex: auto;
    background: yellowgreen;
}
```

第四种：利用BFC清除浮动
BFC的区域不会与float box重叠。
```css
.left {
    background-color: red;
    width: 200px;
    float: left;
}
.right {
    overflow: hidden;
    background-color: rgb(255, 0, 255);
}

```

### 多列等高

http://www.cnblogs.com/2050/archive/2012/07/31/2616460.html

- padding补偿法
首先把列的padding-bottom设为一个足够大的值，再把列的margin-bottom设一个与前面的padding-bottom的正值相抵消的负值，父容器设置超出隐藏。

> 自适应正方形
[原文](https://idiotwu.me/css-responsive-square/)

1.vw单位

有些浏览器不支持

```css
.placeholder {
  width: 100%;
  height: 100vw;
}
```

2.利用伪元素的 margin(padding)-top 撑开容器
在 CSS 盒模型中，一个比较容易被忽略的就是 margin, padding 的百分比数值计算。按照规定，**margin, padding 的百分比数值是相对父元素宽度 的数值计算的**。

```css
.placeholder {
  width: 100%;
  overflow:hidden;//避免容器与伪元素在垂直方向发生外边距折叠，在父元素上触发 BFC
}

.placeholder:after {
  content: '';
  display: block;
  margin-top: 100%; /* margin 百分比相对父元素宽度计算 */
}
```

### 水平居中

1.如果需要居中的元素为常规流中inline元素，为父元素设置text-align: center;即可实现

2.如果需要居中的元素为常规流中block元素，1）为元素设置宽度，2）设置左右margin为auto。3）IE6下需在父元素上设置text-align: center;,再给子元素恢复需要的值

3.如果需要居中的元素为浮动元素，1）为元素设置宽度，2）position: relative;，3）浮动方向偏移量（left或者right）设置为50%，4）浮动方向上的margin设置为元素宽度一半乘以-1(或者 transform:translateX(-50%);)

4.如果需要居中的元素为绝对定位元素，
1）为元素设置宽度，
2）偏移量设置为50%，
3）偏移方向外边距设置为元素宽度一半乘以-1

4.2 如果需要居中的元素为绝对定位元素，
1）为元素设置宽度，
2）设置左右偏移量都为0,
3）设置左右外边距都为auto


### div的水平居中和垂直居中

1.display: table-cell; ,vertical-align: middle; 垂直居中
父text-align: center; 子display: inline-block; 水平居中
```css
.parent {
    width: 100px;
    height: 100px;
    background: red;
    display: table-cell; 
    vertical-align: middle;
    text-align: center;
}
.child {
    width: 50px;
    height: 50px;
    background: yellow;
    display: inline-block;
}
```

2.父级flex

```css
.parent {
    width: 100px;
    height: 100px;
    background: red;
    display: flex;
    align-items: center;//垂直居中
    justify-content: center;//水平居中
}
```

3.transform：translate属性

4.父元素大小控制子级宽高，只需要保证left和right的百分数一样就可以实现水平居中，保证top和bottom的百分数一样就可以实现垂直居中。

```css
        .parent {
            position: relative;
            width: 500px;
            height: 500px;
            border: 1px solid red;
            margin: auto;
        }

        .child {
            position: absolute;
            left: 30%;
            right: 30%;
            top: 20%;
            bottom: 20%;
            background: blue;
        }
```

### inline-block 垂直排布

by default inline-block is vertical-align:baseline

https://stackoverflow.com/questions/35529582/vertical-align-not-working-on-inline-block

vertical-align sets the alignment of inline-level contents with respect to their line box, not their containing block.

Using vertical-align: middle centers .content vertically inside that line box. But the problem is that the line box is not vertically centered inside the containing block.

### 多行文本省略

http://www.css88.com/archives/5206

1.text-overflow: ellipsis;单行省略

```css
{
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}
```

2.WebKit浏览器或移动端的页面 -webkit-line-clamp

在WebKit浏览器或移动端（绝大部分是WebKit内核的浏览器）的页面实现比较简单，可以直接使用WebKit的CSS扩展属性(WebKit是私有属性)-webkit-line-clamp ；注意：这是一个 不规范的属性（unsupported WebKit property），它没有出现在 CSS 规范草案中。

-webkit-line-clamp用来限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他的WebKit属性。
常见结合属性：

display: -webkit-box; 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。
-webkit-box-orient 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。
text-overflow: ellipsis;，可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。

```css
{
overflow : hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
}
```

- 跨浏览器兼容的方案
比较靠谱简单的做法就是设置相对定位的容器高度，用包含省略号(…)的元素模拟实现；

```css
p {
    position:relative;
    line-height:1.4em;
    /* 3 times the line-height to show 3 lines */
    height:4.2em;
    overflow:hidden;
}
p::after {
    content:"...";
    font-weight:bold;
    position:absolute;
    bottom:0;
    right:0;
    padding:0 20px 1px 45px;
    background:white;
}
```