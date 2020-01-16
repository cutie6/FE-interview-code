# 移动端css

## 移动端布局

https://segmentfault.com/a/1190000010211016

- 响应式的优缺点
优点：兼容性好，@media在ie9以上是支持的，PC和MOBILE是同一套代码的，不用分开。

缺点：要写得css相对另外两个多很多，而且各个断点都要做好。css样式会稍微大点，更麻烦。

- REM优缺点
优点：能维持能整体的布局效果，移动端兼容性好，不用写多个css代码，而且还可以利用@media进行优化。

缺点：开头要引入一段js代码，单位都要改成rem(font-size可以用px)，计算rem比较麻烦(可以引用预处理器，但是增加了编译过程，相对麻烦了点)。pc和mobile要分开。

- 设置viewport中的width
优点：和REM相同，而且不用写rem，直接使用px，更加快捷。

缺点：效果可能没rem的好，图片可能会相对模糊，而且无法使用@media进行断点，不同size的手机上显示，高度间距可能会相差很大。

## 像素级还原视觉稿
http://coderlt.coding.me/2016/12/29/retina-mobile/

手淘 Flexible.js 可伸缩布局方案

Ant.desigin的方案

这两种方案都是动态的根据屏幕宽度和当前设置的DPR的值，设置根字体的大小。

https://github.com/amfe/article/issues/17
使用Flexible实现手淘H5页面的终端适配

## DPR

设备像素比DPR(devicePixelRatio)是默认缩放为100%的情况下，设备像素和CSS像素的比值

DPR = 设备像素 / CSS像素(某一方向上)

### 查询dpr
1. js中用 window.devicePixelRatio 查看

2. css中用媒体查询来设置不同dpr下的样式
该特性是非标准的，请尽量不要在生产环境中使用它！

```css
@media (-webkit-min-device-pixel-ratio: 2) { ... }
/* is equivalent to */
@media (min-resolution: 2dppx) { ... }

/* And likewise */
@media (-webkit-max-device-pixel-ratio: 2) { ... }
/* is equivalent to */
@media (max-resolution: 2dppx) { ... }
```

## Difference between visual viewport and layout viewport?

https://stackoverflow.com/questions/6333927/difference-between-visual-viewport-and-layout-viewport

The visual viewport is the part of the page that’s currently shown on-screen.

The layout viewport can be considerably wider than the visual viewport, and contains elements that appear and do not appear on the screen.

Imagine the layout viewport as being a large image which does not change size or shape. Now imagine you have a smaller frame through which you look at the large image. The small frame is surrounded by opaque material which obscures your view of all but a portion of the large image. The portion of the large image that you can see through the frame is the visual viewport. You can back away from the large image while holding your frame (zoom out) to see the entire image at once, or you can move closer (zoom in) to see only a portion. You can also change the orientation of the frame, but the size and shape of the large image (layout viewport) never changes.

For a great treatment of the issue, see: http://www.quirksmode.org/mobile/viewports2.html


## viewports
https://www.w3cplus.com/css/viewports.html

## overflow-scrolling属性让IOS设备的滚动更流畅

IOS系统的惯性滑动效果非常赞，但是一般我们对div加overflow-y:auto;后是不会出这个效果的，滑动的时候会感觉很生涩。

这时候如果想要我们自己的div有IOS独有的惯性滑动效果，可以有两个选择，一个就是用iscroll插件来模拟，不过现在有个更简单的方法，加个IOS独有的属性：

```css
{
-webkit-overflow-scrolling: touch;
}
```

属性可以直接对body加或者对需要滑动的div加都可以。



## 移动端1px边框
https://www.jianshu.com/p/3a262758abcf

transform方案是最通用最常用的

1. 用媒体查询，当-webkit-min-device-pixel-ratio: 2时使用0.5px
注意：该特性是非标准的，请尽量不要在生产环境中使用它！
```css
p{
    border:1px solid #000;
}

@media (-webkit-min-device-pixel-ratio: 2) {
     p{
         border:0.5px solid #000;
     }
}

```
2. 使用伪类+transform 通用方案

```css
.border_radius {
    position: relative;
}
 
.border_radius:before {
    content: "";
    border: 1px solid red;
    border-radius: 0px;
    height: 200%;
    width: 200%;
    top: 0;
    left: 0;
    pointer-events: none;
    position: absolute;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
    box-sizing: border-box;
}

```