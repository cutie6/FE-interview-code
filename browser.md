# browser

## 浏览器加载和渲染html的顺序

https://www.jianshu.com/p/57c35067c8dd

**1.浏览器加载和渲染html的顺序**
1、IE下载的顺序是从上到下，渲染的顺序也是从上到下，下载和渲染是同时进行的。
2、在渲染到页面的某一部分时，其上面的所有部分都已经下载完成（并不是说所有相关联的元素都已经下载完）
3、如果遇到语义解释性的标签嵌入文件（JS脚本，CSS样式），那么此时IE的下载过程会启用单独连接进行下载。
4、并且在下载后进行解析，解析过程中，停止页面所有往下元素的下载。阻塞加载
5、样式表在下载完成后，将和以前下载的所有样式表一起进行解析，解析完成后，将对此前所有元素（含以前已经渲染的）重新进行渲染。
6、JS、CSS中如有重定义，后定义函数将覆盖前定义函数

**2. JS的加载**
2.1 不能并行下载和解析（阻塞下载）
2.2 当引用了JS的时候，浏览器发送1个js request就会一直等待该request的返回。因为浏览器需要1个稳定的DOM树结构，而JS中很有可能有代码直接改变了DOM树结构，比如使用 document.write 或 appendChild,甚至是直接使用的location.href进行跳转，浏览器为了防止出现JS修改DOM树，需要重新构建DOM树的情况，所以 就会阻塞其他的下载和呈现.

**3.HTML页面加载和解析流程**
1.用户输入网址（假设是个html页面，并且是第一次访问），浏览器向服务器发出请求，服务器返回html文件；
2.浏览器开始载入html代码，发现＜head＞标签内有一个＜link＞标签引用外部CSS文件；
3.浏览器又发出CSS文件的请求，服务器返回这个CSS文件；
4.浏览器继续载入html中＜body＞部分的代码，并且CSS文件已经拿到手了，可以开始渲染页面了；
5.浏览器在代码中发现一个＜img＞标签引用了一张图片，向服务器发出请求。此时浏览器不会等到图片下载完，而是继续渲染后面的代码；
6.服务器返回图片文件，由于图片占用了一定面积，影响了后面段落的排布，因此浏览器需要回过头来重新渲染这部分代码；
7.浏览器发现了一个包含一行Javascript代码的＜script＞标签，赶快运行它；
8.Javascript脚本执行了这条语句，它命令浏览器隐藏掉代码中的某个＜div＞ （style.display=”none”）。杯具啊，突然就少了这么一个元素，浏览器不得不重新渲染这部分代码；
9.终于等到了＜/html＞的到来，浏览器泪流满面……
10.等等，还没完，用户点了一下界面中的“换肤”按钮，Javascript让浏览器换了一下＜link＞标签的CSS路径；
11.浏览器召集了在座的各位＜div＞＜span＞＜ul＞＜li＞们，“大伙儿收拾收拾行李，咱得重新来过……”，浏览器向服务器请求了新的CSS文件，重新渲染页面。

## 浏览器常见兼容性问题
https://segmentfault.com/a/1190000009481604
https://www.jianshu.com/p/e0e6aaf81327
https://www.jianshu.com/p/c0b758a88c7c?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation

1. 不同浏览器的标签默认的外补丁和内补丁不同
2. 图片默认有间距
3. event.x与event.y问题
说明:IE下,event对象有x,y属性,但是没有pageX,pageY属性;
Firefox下,event对象有pageX,pageY属性,但是没有x,y属性. 
解决方法：
使用
**mX(mX   =   event.x   ?   event.x   :   event.pageX;)**
来代替IE下的event.x或者Firefox下的event.pageX.

4. window.location.href问题
说明:IE或者Firefox2.0.x下,可以使用window.location或window.location.href;
Firefox1.5.x下,只能使用window.location. 
解决方法：**使用window.location来代替window.location.href**.

## polyfill

A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.

For example a polyfill could be used to mimic the functionality of an HTML Canvas element on Microsoft Internet Explorer 7 using a Silverlight plugin, or mimic support for CSS rem units, or text-shadow, or whatever you want.







