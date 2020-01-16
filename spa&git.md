## SPA

单页Web应用（single page web application，SPA），就是只有一张Web页面的应用，是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。
单页应用是对原来 Ajax 组件的一种延伸，相较于传统的网页应用，将 MVC 前置到了浏览器端。

> 优缺点

优点： 
1.分离前后端关注点，前端负责view，后端负责model，各司其职； 
2.服务器只接口提供数据，不用展示逻辑和页面合成，提高性能； 
3.同一套后端程序代码，不用修改兼容Web界面、手机； 
4.**用户体验好、快，内容的改变不需要重新加载整个页面**
5.可以缓存较多数据，减少服务器压力 
6.单页应用像网络一样，几乎随处可以访问—不像大多数的桌面应用，用户可以通过任务网络连接和适当的浏览器访问单页应用。如今，这一名单包括智能手机、平板电脑、电视、笔记本电脑和台式计算机。 

缺点： 
1.SEO问题没有html抓不到什么。。。 
2.刚开始的时候加载可能慢很多 
3.用户操作需要写逻辑，前进、后退等； 
4.页面复杂度提高很多，复杂逻辑难度成倍

> seo
1. 服务端渲染
利于SEO
加速首屏渲染速度
享受React组件式开发的优势：高复用、低耦合
前后端维护一套代码（代码同构）

2. Phantom
太耗内存，不推荐

## 模板引擎 

> 原理

板引擎的工作就是,将你的template转化为实际的HTML。 更具体来说,就是将template转化为string.

## git

> Git fetch和git pull的区别

 git fetch：相当于是从远程获取最新版本到本地，不会自动merge

 git pull：相当于是从远程获取最新版本并merge到本地

> 重命名项目分支

重命名本地分支： 

```
git branch -m <old_branch_name> <new_branch_name>  
```

如果想在远程重命一个分支名，则须使用以下思路： 

在本地的clone版本中重命名分支
删除远程待修改的分支名
```
git push origin --delete <branchName>

```
则本地的新分支名push到远程



## 工程化

> 为什么前端模块化、工程化

https://www.zhihu.com/question/24558375/answer/139920107

资源模块化后，有三个好处：
1.依赖关系单一化。所有CSS和图片等资源的依赖关系统一走JS路线，无需额外处理CSS预处理器的依赖关系，也不需处理代码迁移时的图片合并、字体图片等路径问题；
2.资源处理集成化。现在可以用loader对各种资源做各种事情，比如复杂的vue-loader等等。
3.项目结构清晰化。使用Webpack后，你的项目结构总可以表示成这样的函数： dest = webpack(src, config)

https://www.zhihu.com/question/24558375/answer/34303092

工程化：提高效率
就是把一整套前端工作流程中能用工具搞定的部分，用工具搞定。
比如：以前创建配置初始项目文件结构和基本文件，以前靠复制，现在输入命令自动生成。
以前校验 JS 文件是否规范，你可能复制一下放到 jshint 上校验一下，现在配置 grunt 监听文件变动自动校验显示校验结果。
以前修改代码查看效果，要手动刷新浏览器，现在有一大堆插件可以监听文件变动自动刷新。
以前压缩合并文件用手工复制到压缩工具然后复制到一个文件里面，现在配置一下 grunt 等自动监听文件变动，自动合并压缩。
以前发布到服务器上，要手动使用 FTP 软件上传，现在也可以用工具自动打包上传。把这些玩意规范一下，给一堆通用的命令来调用这些功能，就是前端工程化。





### babel

> babel实现

https://juejin.im/entry/589d2904128fe1006cd9f09c

- Babel 的处理步骤
Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。

1.解析
解析步骤接收代码并输出 AST。 这个步骤分为两个阶段：词法分析（Lexical Analysis）(把字符串形式的代码转换为 令牌（tokens） 流) 和 语法分析（Syntactic Analysis）(令牌流转换成 AST 的形式)。

2.转换
程序转换(Program transformation)步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分。

3.生成
代码生成(Code generation)步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）。.

代码生成其实很简单：深度优先遍历(DFS) 整个 AST，然后构建可以表示转换后代码的字符串。


- babel的polyfill和runtime的区别:

Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Set、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

> plugins 和 presets 

具体而言，plugins优先于presets进行编译。
plugins按照数组的index增序(从数组第一个到最后一个)进行编译。
presets按照数组的index倒序(从数组最后一个到第一个)进行编译。因为作者认为大部分会把presets写成["es2015", "stage-0"]。具体细节可以看这个。


> babel配置

### gulp

> gulp基本原理
gulp可以认为是grunt的升级版，运用了node的流来处理文件，大大强化了性能。通过各种 Transform Stream 来实现文件的处理，然后再进行输出。Transform Streams 是 NodeJS Stream 的一种，是可读又可写的.



## 架构

### 单向数据绑定 双向数据绑定

https://www.zhihu.com/question/49964363/answer/118715469

对于非UI控件来说，不存在双向，只有单向。只有UI控件才有双向的问题。单向绑定使得数据流也是单向的，对于复杂应用来说这是实施统一的状态管理（如redux）的前提。双向绑定在一些需要实时反应用户输入的场合会非常方便（比如多级联动菜单）。但通常认为复杂应用中这种便利比不上引入状态管理带来的优势。注意，Vue 虽然通过 v-model 支持双向绑定，但是如果引入了类似redux的vuex，就无法同时使用 v-model

