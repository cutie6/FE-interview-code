# DOM

## 事件处理程序

1.html事件处理程序
```html
<div onclick="alert(1)"></div>
```
2.dom0级
```javascript
var btn=document.getElementById('myBtn)
btn.onclick=function(){
    alert(1)
}
```
3.dom2
```javascript
btn.addEventListener('click',funciton(){
    alert(1)
},false)
4.ie
btn.attachEvent('onclick',function(){
    alert(1)
})
```

## 跨浏览器的事件模型 

```javascript
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);//ie
        } else {
            element["on" + type] = handler;//<ie8>
        }
    },
    getEvent: function(event) {
        return event ? event: window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};

```

## event对象的兼容性考察
|ie|dom|
|-|-|
|cancelBubble=true | stopPropagation()|
|returnValue=false | preventDefault()|
|srcElement | targe|

> style 属性与getComputedStyle()

通常，要了解元素样式的信息，仅仅使用 style 属性是不够的，这是因为它只包含了在元素内嵌 style 属性（attribute）上声明的的 CSS 属性，而不包括来自其他地方声明的样式，如 <head> 部分的内嵌样式表，或外部样式表。要获取一个元素的所有 CSS 属性，你应该使用 window.getComputedStyle()。

```
let style = window.getComputedStyle(element, [pseudoElt]);
```

> 你所知道的DOM元素操作方法（获取元素或者操作元素），尽可能多；

https://www.jianshu.com/p/0f2b13682319

对DOM的操作主要是围绕元素节点和属性节点的增删改查。

- （1）查：对DOM进行增删改之前，首先要找到对应的元素。
具体的查找方法如下：

```
getElementById()  // 查找指定id属性值的对象，返回所查找到的一个对象 
getElementsByTagName() // 查找指定的标签对象,返回所查找到的节点数组NodeList
getElementsByName() //查找指定name属性的对象，返回所查找到的节点数组NodeList
getElementsByClassName() //查找指定class属性的对象，返回所查找到的节点数组NodeList
```

同时还可以利用元素节点的属性获取它的父子节点和文本节点：
子节点:

```
Node.childNodes  //获取子节点列表NodeList; 注意换行在浏览器中被算作了text节点，如果用这种方式获取节点列表，需要进行过滤
Node.firstChild  //返回第一个子节点
Node.lastChild  //返回最后一个子节点
```

父节点:

```
Node.parentNode // 返回父节点
Node.ownerDocument //返回祖先节点（整个document）
```

同胞节点:

```
Node.previousSibling // 返回前一个节点，如果没有则返回null
Node.nextSibling // 返回后一个节点
```

- （2）增：新增节点首先要创建节点，然后将新建的节点插入DOM中。

具体方法如下：

创建节点:
document.createElement() //按照指定的标签名创建一个新的元素节点

创建代码片段:（为避免频繁刷新DOM，可以先创造代码片段，完成所有节点操作之后统一添加到DOM中）
document.createDocumentFragment()

复制节点:
node.cloneNode(boolean) //只有一个参数，传入一个布尔值，true表示复制该节点下的所有子节点；false表示只复制该节点

插入节点:
appendChild(childNode) //将childNode节点追加到子节点列表的末尾
insertBefore(newNode, targetNode) //将newNode插入targetNode之前

（3）替换：

replaceChild(newNode, targetNode) //使用newNode替换targetNode

（4）删除：

removeChild(childNode) //移除childNode节点
node.parentNode.removeChild(node) //在不清楚父节点的情况下使用

注释：
1>节点列表是一个节点数组，我们可以通过下标号访问这些节点，下标号从 0 开始；
2>length 属性定义节点列表中节点的数量，我们可以使用 length 属性来循环节点列表；
3>有两个特殊的属性，可以访问全部文档：
document.documentElement - 全部文档
document.body - 文档的主体

## 你所知道的DOM事件

onabort	图像的加载被中断。
onblur	元素失去焦点。
onchange	域的内容被改变。
onclick	当用户点击某个对象时调用的事件句柄。
ondblclick	当用户双击某个对象时调用的事件句柄。
onerror	在加载文档或图像时发生错误。
onfocus	元素获得焦点。
onkeydown	某个键盘按键被按下。
onkeypress	某个键盘按键被按下并松开。
onkeyup	某个键盘按键被松开。
onload	一张页面或一幅图像完成加载。
onmousedown	鼠标按钮被按下。
onmousemove	鼠标被移动。
onmouseout	鼠标从某元素移开。
onmouseover	鼠标移到某元素之上。
onmouseup	鼠标按键被松开。
onreset	重置按钮被点击。
onresize	窗口或框架被重新调整大小。
onselect	文本被选中。
onsubmit	确认按钮被点击。
onunload	用户退出页面。



## attribute" 和 "property" 的区别是什么？

https://segmentfault.com/a/1190000008781121

- Attribute（特性）
attribute特性由HTML定义，所有出现在HTML标签内的描述节点都是attribute特性。
attribute特性的类型总是字符串类型。

- Property（属性）
property属性属于DOM对象，DOM实质就是javascript中的对象。我们可以跟在js中操作普通对象一样获取、设置DOM对象的属性，并且property属性可以是任意类型。

当我们在html中写非自定义的attribute特性时，DOM对象会自动映射对应的property.

当对应的property改变的时候，attribute特性value的值一直未默认值，并不会随之改变。

- 最佳实践

在javascript中我们推荐使用property属性因为这个属性相对attribute更快，更简便。尤其是有些类型本该是布尔类型的attribute特性。比如："checked", "disabled", "selected"。浏览器会自动将这些值转变成布尔值传给property属性。

http://www.cnblogs.com/elcarim5efil/p/4698980.html

property是DOM中的属性，是JavaScript里的对象；
attribute是HTML标签上的特性，它的值只能够是字符串；


- 创建

DOM对象初始化时会在创建默认的基本property；
只有在HTML标签中定义的attribute才会被保存在property的attributes属性中；
attribute会初始化property中的同名属性，但自定义的attribute不会出现在property中；
attribute的值都是字符串；

- 数据绑定

attributes的数据会同步到property上，然而property的更改不会改变attribute；
对于value，class这样的属性/特性，数据绑定的方向是单向的，attribute->property；
对于id而言，数据绑定是双向的，attribute<=>property；
对于disabled而言，property上的disabled为false时，attribute上的disabled必定会并存在，此时数据绑定可以认为是双向的；

- 使用

可以使用DOM的setAttribute方法来同时更改attribute；
直接访问attributes上的值会得到一个Attr对象，而通过getAttribute方法访问则会直接得到attribute的值；
大多数情况（除非有浏览器兼容性问题），jQuery.attr是通过setAttribute实现，而jQuery.prop则会直接访问DOM对象的property；

All attributes starting with “data-” are reserved for programmers’ use. They are available in dataset property.


## offsetWidth/offsetHeight,clientWidth/clientHeight与scrollWidth/scrollHeight的区别

- clientWidth/clientHeight返回值只包含content + padding，如果有滚动条，也不包含滚动条
对于inline的元素这个属性一直是0，单位px，只读元素。

- offsetWidth/offsetHeight返回值包含content + padding + border + 滚动条
对于inline的元素这个属性有值，单位px，只读元素。

- scrollWidth/scrollHeight返回值包含content + padding + 溢出内容的尺寸

![](imgs/element-size.png)

## focus/blur与focusin/focusout的区别与联系

focus/blur不冒泡，focusin/focusout冒泡

focus/blur兼容性好，focusin/focusout在除FireFox外的浏览器下都保持良好兼容性，如需使用事件托管，可考虑在FireFox下使用事件捕获elem.addEventListener('focus', handler, true)(这里将useCapture设置成了true)

可获得焦点的元素：
window
链接被点击或键盘操作
表单空间被点击或键盘操作
设置tabindex属性的元素被点击或键盘操作

> mouseover/mouseout与mouseenter/mouseleave的区别与联系

mouseover/mouseout是标准事件，所有浏览器都支持；

mouseenter/mouseleave是IE5.5引入的特有事件后来被DOM3标准采纳，现代标准浏览器也支持

**mouseover/mouseout是冒泡事件；mouseenter/mouseleave不冒泡。需要为多个元素监听鼠标移入/出事件时，推荐mouseover/mouseout托管，提高性能**

标准事件模型中event.target表示发生移入/出的元素,vent.relatedTarget对应移出/如元素；在老IE中event.srcElement表示发生移入/出的元素，event.toElement表示移出的目标元素，event.fromElement表示移入时的来源元素

例子：鼠标从div#target元素移出时进行处理，判断逻辑如下：

```
<div id="target"><span>test</span></div>

<script type="text/javascript">
var target = document.getElementById('target');
if (target.addEventListener) {
  target.addEventListener('mouseout', mouseoutHandler, false);
} else if (target.attachEvent) {
  target.attachEvent('onmouseout', mouseoutHandler);
}

function mouseoutHandler(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;

  // 判断移出鼠标的元素是否为目标元素
  if (target.id !== 'target') {
    return;
  }

  // 判断鼠标是移出元素还是移到子元素
  var relatedTarget = event.relatedTarget || e.toElement;
  while (relatedTarget !== target
    && relatedTarget.nodeName.toUpperCase() !== 'BODY') {
    relatedTarget = relatedTarget.parentNode;
  }

  // 如果相等，说明鼠标在元素内部移动
  if (relatedTarget === target) {
    return;
  }

  // 执行需要操作
  //alert('鼠标移出');

}
</script>

```

>DOM事件模型是如何的,编写一个EventUtil工具类实现事件管理兼容

DOM事件包含捕获（capture）和冒泡（bubble）两个阶段：捕获阶段事件从window开始触发事件然后通过祖先节点一次传递到触发事件的DOM元素上；冒泡阶段事件从初始元素依次向祖先节点传递直到window

标准事件监听elem.addEventListener(type, handler, capture)/elem.removeEventListener(type, handler, capture)：handler接收保存事件信息的event对象作为参数，event.target为触发事件的对象，handler调用上下文this为绑定监听器的对象，event.preventDefault()取消事件默认行为，event.stopPropagation()/event.stopImmediatePropagation()取消事件传递

老版本IE事件监听elem.attachEvent('on'+type, handler)/elem.detachEvent('on'+type, handler)：handler不接收event作为参数，事件信息保存在window.event中，触发事件的对象为event.srcElement，handler执行上下文this为window使用闭包中调用handler.call(elem, event)可模仿标准模型，然后返回闭包，保证了监听器的移除。event.returnValue为false时取消事件默认行为，event.cancleBubble为true时取消时间传播

通常利用事件冒泡机制托管事件处理程序提高程序性能。

```
/**
 * 跨浏览器事件处理工具。只支持冒泡。不支持捕获
 * @author  (qiu_deqing@126.com)
 */

var EventUtil = {
    getEvent: function (event) {
        return event || window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    // 返回注册成功的监听器，IE中需要使用返回值来移除监听器
    on: function (elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
            return handler;
        } else if (elem.attachEvent) {
            var wrapper = function () {
              var event = window.event;
              event.target = event.srcElement;
              handler.call(elem, event);
            };
            elem.attachEvent('on' + type, wrapper);
            return wrapper;
        }
    },
    off: function (elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handler);
        }
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if ('returnValue' in event) {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else if ('cancelBubble' in event) {
            event.cancelBubble = true;
        }
    },
    /**
     * keypress事件跨浏览器获取输入字符
     * 某些浏览器在一些特殊键上也触发keypress，此时返回null
     **/
     getChar: function (event) {
        if (event.which == null) {
            return String.fromCharCode(event.keyCode);  // IE
        }
        else if (event.which != 0 && event.charCode != 0) {
            return String.fromCharCode(event.which);    // the rest
        }
        else {
            return null;    // special key
        }
     }
};
```

> 请指出浏览器特性检测，特性推断和浏览器 ua 字符串嗅探的区别 

- 浏览器特性检测

```
// 好的写法
function getById(id) {
    var element = null;
    
    if (document.getElementById) { // DOM
        element = document.getElementById(id);
    } else if (document.all) { // IE
        element = document.all[id];
    } else if (document.layers) { // Netscape <= 4
        element = document.layers[id];
    }
    
    return element;
}
```

这么使用特性检测是正确和恰当的，因为代码对特性做检测，当特性存在时才使用。

正确检测的顺序：

探测标准的方法

探测不同浏览器的特定方法

均不存在时提供一个合乎逻辑的备用方法

- 避免特性推断
特性推断尝试使用多个特性但仅验证了其中之一。根据一个特性的存在推断另一个特性是否存在。问题是，推断是假设并非事实，而且可能会导致维护性的问题。

```
// 不好的写法 - 特性推断
function getById(id) {
    
    var element = null;
    
    if (document.getElementByTagName) { // DOM
        element = document.getElementById(id);
    } else if (window.ActiveXObject) { // IE
        element = document.all[id];
    } else { // Netscape <= 4
        element = document.layers[id];
    }
    
    return element;
}
```

-  避免浏览器推断
```
// 不好的写法
if (document.all) { // IE
    id = document.uniqueID;
} else {
    id = Math.random();
}
```
所做的所有探测仅仅说明 document.all 是否存在，而并不能用于判断浏览器是否是 IE。document.all 的存在并不意味着 document.uniqueID 也是可用的。因此这是一个错误的隐式推断，可能会导致代码不能正常运行。

- User-Agent 检测

服务器可以获取到浏览器的 user-agent 字符串，客户端通过 JavaScript 的 navigator.userAgent 也可以获取。

```
// 不好的做法
if (navigator.userAgent.indexOf("MSIE") > -1) {
    // 是 IE
} else {
    // 不是 IE
}
```

**解析 user-agent 字符串并非易事，由于浏览器为了确保其兼容性，都会复制另一个浏览器的用户代理字符串，因此随着每一个新浏览器的出现，用于用户代理检测的代码都需要更新。整个方法长期而言并不具备很好的可维护性。**

**选择使用用户代理检测，最安全的方法是只检测旧的浏览器。**

```
if (isInternetExplorer8OrEarlier) {
    // 处理 IE8 及更早版本
} else {
    // 处理其他浏览器
}
```

**几乎所有的浏览器的 user-agent 都可以被工具修改，因此要尽可能避免检测 user-agent。**

- 应当如何取舍

**特性推断和浏览器推断都是糟糕的做法，应当不惜一切代价避免使用。纯粹的特性检测是一种很好的做法。不要试图推断特性间的关系，否则最终得到的结果也是不可靠的。**

**如果想要使用用户代理嗅探，记住这一点：这么做唯一安全的方式是针对旧的或特定版本的浏览器。而绝不应当针对最新版本或者未来的浏览器。**

> target和currentTarget

当事件遍历DOM时，标识事件的当前目标。它总是引用事件处理程序附加到的元素，而不是event.target，它标识事件发生的元素。

> Inline events与Event Listeners的区别

http://www.cnblogs.com/Rosefxd/p/4037232.html

Inline events:

使用方式：
1.

```
<a id="testing" href="#" onclick="alert('did stuff inline');">点我</a>
```

2.
```
<a id="test" href="#">点我</a>
```
```
var element = document.getElementById('test');
element.onclick = function () { alert('did stuff #1'); };
```

Event Listeners:
- addEventListener：很多浏览器支持addEventListener(IE9、IE10、IE11、chrome、firefox、opera、safari支持)
- attachEvent:（IE7、IE8支持）

addEventListener和attachEvent除了使用浏览器的差别，还有参数的差别。addEventListener中有第3个参数，attachEvent没有。第3个参数传递的是false或true。这个参数可选，默认是false。
false--表示事件处理将在冒泡阶段执行。
true--表示事件处理将在捕获阶段执行。

理论上，Event Listeners (addEventListener and IE's attachEvent)可以无限增加事件监听给某个一元素。实际应用的约束就是客户端内存的限制，这一点因每个浏览器而异。

**Inline events与Event Listeners的区别：Event Listeners可以添加无数个(理论上)事件，Inline events只能添加1个事件，且下面的会覆盖上面的。**


```
function addEvent(element, evnt, funct){
  if (element.attachEvent)
   return element.attachEvent('on'+evnt, funct);
  else
   return element.addEventListener(evnt, funct, false);
}

// example
addEvent(document.getElementById('myElement'),'click',function () { alert('hi!'); }
);


```

## 其他
> 推送消息

```
function notifyMe() {
  // 先检查浏览器是否支持
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // 检查用户是否同意接受通知
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // 否则我们需要向用户获取权限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // 如果用户同意，就可以向他们发送通知
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  
  // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
  // 出于尊重，我们不应该再打扰他们了
}
```

## 动画

> 动画与性能

应尽可能避免给触发布局或绘制的属性设置动画。对于大部分现代浏览器，这意味着**将动画限制为 opacity 或 transform，两种都可经浏览器高度优化**；动画是由 JavaScript 还是由 CSS 处理并不重要。

CSS的最终表现分为以下四步：Recalculate Style -> Layout -> Paint Setup and Paint -> Composite Layers

按照中文的意思大致是 查找并计算样式 -> 排布 -> 绘制 -> 组合层

这上面的几个步骤有点类似于上文说到的重排必定导致重绘，而查询属性会强制发生重排。所以上文提到的重排重绘内容可以结合这里进行理解。

由于transform是位于Composite Layers层，而width、left、margin等则是位于Layout层，在Layout层发生的改变必定导致Paint Setup and Paint -> Composite Layers，所以相对而言使用transform实现的动画效果肯定比left这些更加流畅。

而且就算抛开这一角度，在另一方面浏览器也会针对transform等开启GPU加速。

- transform
Changing transform does not trigger any geometry changes or painting, which is very good. This means that the operation can likely be carried out by the compositor thread with the help of the GPU.


- 使用 will-change 属性
使用 will-change 来确保浏览器知道您打算改变元素的属性。这使浏览器能够在您做出更改之前进行最合适的优化。但是，请勿过度使用 will-change，因为过度使用可能导致浏览器浪费资源，进而引起其他性能问题。

一般经验法则是，如果动画可能在接下来的 200 毫秒内触发（由用户交互触发或由应用的状态触发），则对动画元素使用 will-change 是个好主意。对于大多数情况，在应用的当前视图中您打算设置动画的任何元素都应启用 will-change，无论您打算改变哪个属性。在我们在之前的指南中一直使用的方框示例中，为变形和透明度加上 will-change 属性将产生如下结果：

```
.box {
  will-change: transform, opacity;
}
```

现在支持此属性的浏览器有 Chrome、Firefox 和 Opera，这些浏览器将在后台进行相应的优化，以支持这些属性的更改或动画设置。

> CSS 对比 JavaScript 的性能

网络上有很多网页和评论从性能的角度讨论了 CSS 和 JavaScript 动画的相对优点。以下是要记住的几个要点：

基于 CSS 的动画以及原生支持的网络动画通常由一个名为“合成器线程”的线程处理。这不同于在其中执行样式、布局、绘制和 JavaScript 的浏览器“主线程”。这意味着，如果浏览器正在主线程上运行一些高开销任务，则这些动画可以继续运行而不中断。

在许多情况下，变形和透明度的其他更改还可由合成器线程来处理。

如果任何动画触发绘制、布局或同时触发这两者，则“主线程”将必须执行工作。这点同时适用于基于 CSS 和 JavaScript 的动画，并且布局或绘制的开销可能拖慢与 CSS 或 JavaScript 执行相关的任何工作，使问题变得无意义。

> 选择CSS还是JavaScript动画

当您为 UI 元素采用较小的独立状态时，使用 CSS。 CSS 变换和动画非常适合于从侧面引入导航菜单，或显示工具提示。最后，可以使用 JavaScript 来控制状态，但动画本身是采用 CSS。

在需要对动画进行大量控制时，使用 JavaScript。 Web Animations API 是一个基于标准的方法，现已在 Chrome 和 Opera 中提供。该方法可提供实际对象，非常适合复杂的对象导向型应用。在需要停止、暂停、减速或倒退时，JavaScript 也非常有用。

如果您需要手动协调整个场景，可直接使用 requestAnimationFrame。这属于高级 JavaScript 方法，但如果您构建游戏或绘制到 HTML 画布，则该方法非常有用。

或者，如果您已使用包括动画功能的 JavaScript 框架，比如通过 jQuery 的 .animate() 方法或 GreenSock 的 TweenMax，则可能发现继续使用该方法实现动画在总体上更方便。

> requestAnimationFrame

当你准备好更新屏幕画面时你就应用此方法。这会要求你的动画函数在浏览器下次重绘前执行。回调的次数常是每秒60次，但大多数浏览器通常匹配 W3C 所建议的刷新率。如果网页于后台或隐藏在 \<iframe> 里面，重绘频率可能会大大降低以提升性能和电池耐久度。

> 在视图之间设置动画

https://developers.google.com/web/fundamentals/design-and-ux/animations/animating-between-views?hl=zh-cn

使用变换来切换不同视图；**避免使用 left、top 或任何其他会触发布局的属性。尽量用transform属性**
确保使用的所有动画简洁明快，并且设置较短的持续时间。

Success：力求使所有动画保持 60fps(Frame per Second)。这样，用户不会觉得动画卡顿，从而不会影响其使用体验。确保任何动画元素为您打算在动画开始之前更改的任何内容设置了 will-change。对于视图变换，您很可能要使用 will-change: transform。

js处理部分：

```
var container = document.querySelector('.container');
var backButton = document.querySelector('.back-button');
var listItems = document.querySelectorAll('.list-item');

/**
 * Toggles the class on the container so that
 * we choose the correct view.
 */
function onViewChange(evt) {
  container.classList.toggle('view-change');
}

// When you click a list item, bring on the details view.
for (var i = 0; i < listItems.length; i++) {
  listItems[i].addEventListener('click', onViewChange, false);
}

// And switch it back again when you click the back button
backButton.addEventListener('click', onViewChange);
```

- Element.classList 
是一个只读属性，返回一个元素的类属性的实时 DOMTokenList集合。

方法
add( String [, String] )
添加指定的类值。如果这些类已经存在于元素的属性中，那么它们将被忽略。
remove( String [,String] )
删除指定的类值。
item ( Number )
按集合中的索引返回类值。
toggle ( String [, force] )
当只有一个参数时：切换 class value; 即如果类存在，则删除它并返回false，如果不存在，则添加它并返回true。
当存在第二个参数时：如果第二个参数的计算结果为true，则添加指定的类值，如果计算结果为false，则删除它
contains( String )
检查元素的类属性中是否存在指定的类值。


- 跨浏览器
Note: 以跨浏览器的方式设计此类层次结构可能很难。例如，**iOS 需要额外的 CSS 属性 -webkit-overflow-scrolling: touch 来“重新启用”抛式滚动**，但是您不能像使用标准溢出属性一样，控制动作所针对的轴。一定要在各种设备上测试您的实现方法！


> 自定义缓动的动画

```
transition: transform 500ms cubic-bezier(0.465, 0.183, 0.153, 0.946);
```

前两个数字是第一个控制点的 X 和 Y 坐标，后两个数字是第二个控制点的 X 和 Y 坐标。

制作自定义曲线很有趣，您可以有效控制对动画的感觉。以上述曲线为例，您可以看到曲线与经典的缓入缓出曲线相似，但缓入即“开始”部分缩短，而结尾减速部分拉长。

>  GPU
GPU 加速计算是指同时利用图形处理器 (GPU) 和 CPU，加快科学、分析、工程、消费和企业应用程序的运行速度。GPU 加速器于 2007 年由 NVIDIA® 率先推出，现已在世界各地为政府实验室、高校、公司以及中小型企业的高能效数据中心提供支持。GPU 能够使从汽车、手机和平板电脑到无人机和机器人等平台的应用程序加速运行.

GPU 如何加快软件应用程序的运行速度
GPU 加速计算可以提供非凡的应用程序性能，能将应用程序计算密集部分的工作负载转移到 GPU，同时仍由 CPU 运行其余程序代码。从用户的角度来看，应用程序的运行速度明显加快.

## dom性能优化

> 使用 passive 改善的滚屏性能
https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
https://developers.google.com/web/updates/2016/06/passive-event-listeners

```
var elem = document.getElementById('elem'); 
elem.addEventListener('touchmove', function listener() { /* do something */ }, { passive: true });
```

添加passive参数后，touchmove事件不会阻塞页面的滚动（同样适用于鼠标的滚轮事件）。

options 可选
一个指定有关 listener 属性的可选参数对象。可用的选项如下：
capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
passive: Boolean，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。

- How it works
When you scroll a page and there's such a delay that the page doesn't feel anchored to your finger, that's called scroll jank. Many times when you encounter scroll jank, the culprit is a touch event listener. Touch event listeners are often useful for tracking user interactions and creating custom scroll experiences, such as cancelling the scroll altogether when interacting with an embedded Google Map.**Currently, browsers can't know if a touch event listener is going to cancel the scroll, so they always wait for the listener to finish before scrolling the page.** Passive event listeners solve this problem by enabling you to set a flag in the options parameter of addEventListener indicating that the listener will never cancel the scroll. That information enables browsers to scroll the page immediately, rather than after the listener has finished.
