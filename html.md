# html

## 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

行内元素：a、b、span、img、input、strong、select、label、em、button、textarea
块级元素：div、ul、li、dl、dt、dd、p、h1-h6、blockquote
空元素：
空元素就是没有内容的 HTML 元素,是在开始标签中就关闭的元素。
通俗点来讲空元素就是能不成对出现的标签
例如：br、meta、hr、link、input、img

## src与href的区别

href 是指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，用于超链接。

src是指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素。
当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部。

## meta标签作用

HTML \<meta> 元素表示那些不能由其它HTML元相关元素 (\<base>, \<link>, \<script>, \<style> 或 \<title>) 之一表示的任何元数据信息.

## \<img>的title和alt有什么区别

- title是global attributes之一，用于为元素提供附加的 advisory information。通常当鼠标滑动到元素上的时候显示。
- alt是\<img>的特有属性，是图片内容的等价描述，用于图片无法加载时显示、读屏器阅读图片。可提图片高可访问性，除了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析。

## doctype 是什么,举例常见 doctype 及特点

<!doctype>声明必须处于 HTML 文档的头部，在\<html>标签之前，HTML5 中不区分大小写
<!doctype>声明不是一个 HTML 标签，是一个用于告诉浏览器当前 HTMl 版本的指令
现代浏览器的 html 布局引擎通过检查 doctype 决定使用兼容模式还是标准模式对文档进行渲染，一些浏览器有一个接近标准模型。
在 HTML4.01 中<!doctype>声明指向一个 DTD，由于 HTML4.01 基于 SGML，所以 DTD 指定了标记规则以保证浏览器正确渲染内容
HTML5 不基于 SGML，所以不用指定 DTD

示例：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```
