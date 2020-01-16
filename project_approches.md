# 项目思路

## 主题切换
https://blog.csdn.net/qq_20343517/article/details/82795071

### 常规做法
编写两个CSS主题文件，然后借助js来切换加载

### CSS 变量
定义变量： --variable name
使用变量： var(--variable name)

全局变量由 :root 伪类中定义，适用于所有元素
:root 这个CSS 伪类匹配文档的根元素。对于HTML来说，:root表示\<html>元素，除了优先级更高之外，与 html 选择器相同
```css
:root{
    --color:blue;
}

.box{
    color:var(--color)
}
```

通过js切换全局变量颜色：
```js
function change(color){
    let root=document.documentElement.style;
    root.setProperty('--color',color)
}
```



## 富文本编辑器

https://developer.aliyun.com/article/712971

### 原生编辑器

浏览器提供了两个原生特性：
contenteditable：
https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content
document.execCommand()：
https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
contenteditable 特性，可以指定某一容器变成可编辑器区域，即用户可以在容器内直接输入内容，或者删减内容。

execCommand API，可以对选中的某一段结构体，执行一个命令，譬如赋予黑体格式。

基于以上，可以做出最简单的富文本编辑器。

原来富文本编辑器是这么简单？当然不止如此简单！

首先问题集中在 execCommand() 身上：

在不同浏览器上表现存在差异，以及各种疑似浏览器bug的问题
只接受有限的 commands
https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands
*第一个是兼容性问题，第二个是能力局限问题。

### 传统编辑器

针对上述痛点，出现了第一代传统编辑器，他们主要的思路是：解决各种浏览器兼容差异，以及规避一些bug；同时对有限的命令集进行扩充。

其中具有代表性的包括：CKEditor(4-)、TinyMCE、UEditor、KindEditor、KissyEditor...

但这些耳熟能详的编辑器，还是会有许多问题：

对浏览器差异的屏蔽，和bug的规避，成本巨大，而且不稳定，时不时发现一些新问题；
对有限的命令集进行扩充，但不是基于execCommand() 进行扩展，而是自行封装实现效果，通过工具栏调用；
只是能力扩充，但并没有提供通用扩展接口，开发者无法自定义一种符合业务需要的格式；
归结下来，最大的问题是：缺乏扩展性。

### 现代编辑器

虽有不足，但传统编辑器仍然被广泛使用，因为大部分业务都首先要解决从无到有的问题。大约到了2013年，开始出现一批现代编辑器（Modern Editor），他们有一个共同的特点：摒弃 execCommnand()，完全自实现各种格式、撤销、重做等功能，而且都是基于自建的数据模型，提供通用扩展接口。

其中具有代表性的包括：CKEditor 5、Slate.js、Quill.js、Draft.js、ProseMirror...

现代编辑器风风火火发展了几年，的确解决了传统编辑器的老大难问题：扩展性。基于现代编辑器的扩展接口，开发者可以自行定义格式，定义内容等，并且可以实现更复杂的编辑器内交互，使用户体验有所提升。

然而现代编辑也并非银弹，真正接入到业务系统后，会发现各种大小问题，而在深入使用后更会发现一个几乎无解的极大的挑战：不受控输入。

### 新一代编辑器

如图，编辑器的编辑区域不再是一个 contenteditable容器，而是由三个层（layer）层叠而成，从上而下分别是 overlay-layer, render-layer, shadow-layer。

overlay-layer 负责模拟selection，即用户可见的光标、选中区间；

render-layer 负责渲染内容，即文本、图片等；

shadow-layer 负责承接用户输入，即各种输入法输入；

可见，三层layer实质上是将原来contenteditable容器的三种职责拆分了：

原来的光标，都是浏览器自带的，现在通过overlay模拟实现了；

原来的内容，都是直接可以在contenteditable 容器中编辑的，现在则强制通过 model-drive-render 方式更新了；

原来的不受控输入，都是直接落入contenteditable 容器中，现在则是重定向到了一个 shadow buffer中；

这里最重要的一点就是，我们将用户的输入重定向放到一个 shadow buffer 中，我们让用户的输入在一个不可见区域完整生效了之后，再去做内容检测，然后推断出用户的输入，以此来解决不可识别不受控的输入法输入。

