# webpack

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

整理知识点到脑图上：
https://www.processon.com/mindmap/5dfb13e4e4b051b174bd078b

## htmlWebpackPlugin

使用变量：
```html
<title><%= htmlWebpackPlugin.options.title %></title>
```

多入口多出口：
```js
plugins: [
  new HtmlWebpackPlugin({
    template:'./index.html',
    chunks: ['index']
  }),
  new HtmlWebpackPlugin({
    template:'./index.html',
    chunks: ['list']
  })
]
```

## hot module replacement

hot 和 hotOnly 的区别是在某些模块不支持热更新的情况下，前者会自动刷新页面，后者不会刷新页面，而是在控制台输出热更新失败
```js
devServer: {
    contentBase: "./dist",
    open: true,
    hot:true, 
    //hotOnly:true
},
```

在插件配置处添加:
```js
plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
```

###  js模块HMR 
需要使用 module.hot.accept来观察模块

```js
//index.js
import counter from "./counter";
import number from "./number";
counter();
number();
if (module.hot) {
  module.hot.accept("./b", function() {
    document.body.removeChild(document.getElementById("number"));
    number();
  });
}
```

## babel

```
npm i babel-loader @babel/core @babel/preset-env -D
```

babel-loader: This package allows transpiling JavaScript files using Babel and webpack.

@babel/preset-env: 包含 es6转es5的转换规则

Promise等 些还有转换过来，这时候需要借助@babel/polyfill，把es的新特 性都装进来，来弥补低版本浏览 中缺失的特性

@babel/polyfill
以全局变量的方式注入进来的。windows.Promise，它会造成全局对象的污染 
```
npm install --save @babel/polyfill
```

```js
//index.js 顶部
import "@babel/polyfill"
```

假如我想我用到的es6+才注入：
修改Webpack.config.js
```js
options: {
    [
        presets: [
            "@babel/preset-env",
            {
            targets: {
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11.1"
            },
            useBuiltIns: "usage"//按需注入
            } 
        ]
    ] 
}
```

当我们开发的是组件库，工具库这些场景的时候，polyfill就不适合了，因为polyfill是注入到全局变量window下的，会污染全局环境，所以推荐闭包方式:@babel/plugin-transform-runtime
@babel/plugin-transform-runtime不会造成全局污染

```
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```


## tree shaking原理
https://www.webpackjs.com/guides/tree-shaking/
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的**静态结构特性**，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

> 静态结构特性
https://exploringjs.com/es6/ch_modules.html#static-module-structure

Current JavaScript module formats have a dynamic structure: What is imported and exported can change at runtime. One reason why ES6 introduced its own module format is to enable a static structure, which has several benefits. But before we go into those, let’s examine what the structure being static means.

It means that you can determine imports and exports at compile time (statically) – you only need to look at the source code, you don’t have to execute it. ES6 enforces this syntactically: You can only import and export at the top level (never nested inside a conditional statement). And import and export statements have no dynamic parts (no variables etc. are allowed).

## development production 模式区分

1. webpack-merge

```
npm install webpack-merge -D
```

```js
module.exports = merge(commonConfig,devConfig)
```

2. 环境变量

```js
//外部传 的全局变  module.exports = (env)=>{
  if(env && env.production){
    return merge(commonConfig,prodConfig)
  }else{
    return merge(commonConfig,devConfig)
} }
```

//外部传变量 
scripts:" --env.production"

## 代码分割
业务逻辑会变化，第三方工具库不会，没有分割时，业务逻辑一变 ，第三方工具库也要跟着变。

```js
optimization:{ 
    //帮我们自动做代码分割 
    splitChunks:{
        chunks:"all",//默认是支持异步
    }
}
```

### commonsChunkPlugin-->splitChunksPlugin
The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。

配置splitChunksPlugin:
如上配置 optimization.splitChunks. This configuration object represents the default behavior of the SplitChunksPlugin.

### 预取/预加载模块(prefetch/preload module) 
webpack v4.6.0+ 添加了预取和预加载的支持。

在声明 import 时，使用下面这些内置指令，可以让 webpack 输出 "resource hint(资源提示)"，来告知浏览器：

prefetch(预取)：将来某些导航下可能需要的资源
preload(预加载)：当前导航下可能需要资源

```js
//...
import(/* webpackPrefetch: true */ 'LoginModal');
```
这会生成 \<link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部，指示着浏览器在闲置时间预取 login-modal-chunk.js 文件。

与 prefetch 指令相比，preload 指令有许多不同之处：

preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
浏览器支持程度不同。

## 插件
一个插件就是一个类，里面包含一个apply函数，apply接受一个compiler参数,compiler.hooks可以配置plugin在什么时刻运行。

## webpack-dev-server
webpack-dev-server 为你提供了一个简单的 web server，并且具有 live reloading(实时重新加载) 功能。

webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 publicPath 选项进行修改。

源码中是使用express搭建的服务器。

---- 下面是之前整理的内容，待会整理重构下



> loader如何处理非js 如图片类型

Loaders enable webpack to process more than just JavaScript files (webpack itself only understands JavaScript). They give you the ability to leverage webpack's bundling capabilities for all kinds of files by converting them to valid modules that webpack can process.

Essentially, webpack loaders transform all types of files into modules that can be included in your application's dependency graph.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  }
}
```

- Dependency Graph

Any time one file depends on another, webpack treats this as a dependency. This allows webpack to take non-code assets, such as images or web fonts, and also provide them as dependencies for your application.

When webpack processes your application, it starts from a list of modules defined on the command line or in its config file. Starting from these entry points, webpack recursively builds a dependency graph that includes every module your application needs, then packages all of those modules into a small number of bundles - often, just one - to be loaded by the browser.

Bundling your application is especially powerful for HTTP/1.1 clients, as it minimizes the number of times your app has to wait while the browser starts a new request. For HTTP/2, you can also use Code Splitting and bundling through webpack for the best optimization.

> 如何写loader

简单用法
当一个 loader 在资源中使用，这个 loader 只能传入一个参数 - 这个参数是一个包含包含资源文件内容的字符串

同步 loader 可以简单的返回一个代表模块转化后的值。在更复杂的情况下，loader 也可以通过使用 this.callback(err, values...) 函数，返回任意数量的值。错误要么传递给这个 this.callback 函数，要么扔进同步 loader 中。

loader 会返回一个或者两个值。第一个值的类型是 JavaScript 代码的字符串或者 buffer。第二个参数值是 SourceMap，它是个 JavaScript 对象。

loader 可以被链式调用意味着不一定要输出 JavaScript。只要下一个 loader 可以处理这个输出，这个 loader 就可以返回任意类型的模块。



http://www.alloyteam.com/2016/01/webpack-loader-1/

A loader is a node module exporting a function.

既然是 node module，那么基本的写法可以是

```js
// base loader
module.exports = function(source) {
  return source;
};
```
- 缓存
Webpack Loader 同样可以利用缓存来提高效率，并且只需在一个可缓存的 Loader 上加一句 this.cacheable(); 就是这么简单

- 异步
异步并不陌生，当一个 Loader 无依赖，可异步的时候我想都应该让它不再阻塞地去异步。在一个异步的模块中，回传时需要调用 Loader API 提供的回调方法 this.async()，使用起来也很简单

以下来自 https://segmentfault.com/a/1190000011383224



> Loader

loader的作用： 
1、实现对不同格式的文件的处理，比如说将scss转换为css，或者typescript转化为js
2、转换这些文件，从而使其能够被添加到依赖图中
loader是webpack最重要的部分之一，通过使用不同的Loader，我们能够调用外部的脚本或者工具，实现对不同格式文件的处理，loader需要在webpack.config.js里边单独用module进行配置，配置如下：

test: 匹配所处理文件的扩展名的正则表达式（必须）
loader: loader的名称（必须）
include/exclude: 手动添加处理的文件，屏蔽不需要处理的文件（可选）
query: 为loaders提供额外的设置选项

ex: 
```js
var baseConfig = {
    // ...
    module: {
        rules: [
            {
                test: /*匹配文件后缀名的正则*/,
                use: [
                    loader: /*loader名字*/,
                    query: /*额外配置*/
                ]
            }
        ]
    }
}
```

要是loader工作，我们需要一个正则表达式来标识我们要修改的文件，然后有一个数组表示
我们表示我们即将使用的Loader,当然我们需要的loader需要通过npm 进行安装。例如我们需要解析less的文件，那么webpack.config.js的配置如下：

```js     
var baseConfig = {
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./build')
    },
    devServer: {
        contentBase: './src',
        historyApiFallBack: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'}
                ],
                exclude: /node_modules/
            }
        ]
    }
}
```

这里介绍几个常用的loader：
babel-loader： This package allows transpiling JavaScript files using Babel and webpack.
babel有些复杂，所以大多数都会新建一个.babelrc进行配置
css-loader,style-loader:两个建议配合使用，用来解析css文件，能够解释@import,url()如果需要解析less就在后面加一个less-loader
file-loader: 生成的文件名就是文件内容的MD5哈希值并会保留所引用资源的原始扩展名
url-loader: 功能类似 file-loader,但是文件大小低于指定的限制时，可以返回一个DataURL事实上，在使用less,scss,stylus这些的时候，npm会提示你差什么插件，差什么，你就安上就行了

> Plugins
plugins和loader很容易搞混，说都是外部引用有什么区别呢？ 事实上他们是两个完全不同的东西。这么说loaders负责的是处理源文件的如css、jsx，一次处理一个文件。而plugins并不是直接操作单个文件，它直接对整个构建过程起作用下面列举了一些我们常用的plugins和他的用法

- ExtractTextWebpackPlugin: 
它会将入口中引用css文件，都打包都独立的css文件中，而不是内嵌在js打包文件中。下面是他的应用

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
        var lessRules = {
            use: [
                {loader: 'css-loader'},
                {loader: 'less-loader'}
            ]
        }
        
        var baseConfig = {
            // ... 
            module: {
                rules: [
                    // ...
                    {test: /\.less$/, use: ExtractTextPlugin.extract(lessRules)}
                ]
            },
            plugins: [
                new ExtractTextPlugin('main.css')
            ]
        }
```

- HtmlWebpackPlugin:
作用： 依据一个简单的index.html模版，生成一个自动引用你打包后的js文件的新index.html
```
var HTMLWebpackPlugin = require('html-webpack-plugin')
            var baseConfig = {
                // ...
                plugins: [
                    new HTMLWebpackPlugin()
                ]
            }
```

- HotModuleReplacementPlugin: 
它允许你在修改组件代码时，自动刷新实时预览修改后的结果注意永远不要在生产环境中使用HMR。这儿说一下一般情况分为开发环境，测试环境，生产环境。

用法如 new webpack.HotModuleReplacementPlugin()

webapck.config.js的全部内容
    
```js
const webpack = require("webpack")
        const HtmlWebpackPlugin = require("html-webpack-plugin")
        var ExtractTextPlugin = require('extract-text-webpack-plugin')
        var lessRules = {
            use: [
                {loader: 'css-loader'},
                {loader: 'less-loader'}
            ]
        }
        module.exports = {
            entry: {
                    main: './src/index.js'
                },
                output: {
                    filename: '[name].js',
                    path: path.resolve('./build')
                },
                devServer: {
                    contentBase: '/src',
                    historyApiFallback: true,
                    inline: true,
                    hot: true
                },
                module: {
                    rules: [
                        {test: /\.less$/, use: ExtractTextPlugin.extract(lessRules)}
                    ]
                },
                plugins: [
                new ExtractTextPlugin('main.css')
            ]
        }
```

> 图片打包

http://www.cnblogs.com/ghost-xyx/p/5812902.html

在实际生产中有以下几种图片的引用方式：

1. HTML文件中img标签的src属性引用或者内嵌样式引用
由于 webpack 对 html 的处理不太好，打包 HTML 文件中的图片资源是相对来说最麻烦的。这里需要引用一个插件—— html-withimg-loder

2. CSS文件中的背景图等设置
不做任务修改即能访问到图片

3. js中的图片
JavaScript文件中动态添加或者改变的图片引用
ReactJS中图片的引用

通过模块化的方式引用图片路径
    
> 模块热替换

http://www.cnblogs.com/stoneniqiu/p/6496425.html

HMR基于WDS，style-loader可以通过它来实现无刷新更新样式。但是对于JavaScript模块就需要做一点额外的处理

启用此功能实际上相当简单。而我们要做的，就是更新 webpack-dev-server 的配置，和使用 webpack 内置的 HMR 插件。

我们还添加了 NamedModulesPlugin，以便更容易查看要修补(patch)的依赖。

修改 index.js 文件，以便当 print.js 内部发生变更时可以告诉 webpack 接受更新的模块。

```
- document.body.appendChild(component());
+ let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
+ document.body.appendChild(element);
  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
-     printMe();
+     document.body.removeChild(element);
+     element = component(); // 重新渲染页面后，component 更新 click 事件处理
+     document.body.appendChild(element);
    })
  }
```

> 产品阶段的构建
目前为止，在开发阶段的东西我们已经基本完成了。但是在产品阶段，还需要对资源进行别的
处理，例如压缩，优化，缓存，分离css和js。首先我们来定义产品环境

```js
var ENV = process.env.NODE_ENV
    var baseConfig = {
        // ... 
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(ENV)
            })
        ]
    }
```

然后还需要修改我们的script命令

```js
"scripts": {
            "start": "NODE_ENV=development webpack-dev-server",
            "build": "NODE_ENV=production webpack"
        }

```        
process.env.NODE_ENV 将被一个字符串替代，它运行压缩器排除那些不可到达的开发代码分支。
当你引入那些不会进行生产的代码，下面这个代码将非常有用。

```js
if (process.env.NODE_ENV === 'development') {
            console.warn('这个警告会在生产阶段消失')
        }
```

> 优化插件
下面介绍几个插件用来优化代码

OccurenceOrderPlugin: 为组件分配ID,通过这个插件webpack可以分析和优先考虑使用最多 的模块，然后为他们分配最小的ID

UglifyJsPlugin: 压缩代码

下面是他们的使用方法

```js
var baseConfig = {

// ...
 new webpack.optimize.OccurenceOrderPlugin()
 new webpack.optimize.UglifyJsPlugin()
}
```

然后在我们使用npm run build会发现代码是压缩的

> webpack打包优化

利用UglifyPlugin删除引用未使用的无用代码，压缩js代码，css添加minimize参数压缩css

通过commonsChunkPlugin提取公共代码

通过ParallelUglifyPlugin多线程压缩js代码

缩小文件范围，通过exclude ，inclue等配置路径，优化打包效率

通过happypack插件多线程处理loader

通过dllplugin接入动态链接库

> 打包速度优化

http://www.cnblogs.com/imwtr/p/7801973.html

1. 使用监听模式或热更新热替换

webpack支持监听模式，此时需要重新编译时就可以进行增量构建，增量构建是很快的，基本不到一秒或几秒之内就能重新编译好

注意区分一下开发环境和线上环境，开发环境启用热更新替换

2. 开发环境不做无意义的操作

很多配置，在开发阶段是不需要去做的，我们可以区分出开发和线上的两套配置，这样在需要上线的时候再全量编译即可

比如说 代码压缩、目录内容清理、计算文件hash、提取CSS文件等

3. 选择一个合适的devtool属性值

配置devtool可以支持使用sourceMap，但有些是耗时严重的，这个得多试试

4. 代码压缩用ParallelUglifyPlugin代替自带的 UglifyJsPlugin插件

自带的JS压缩插件是单线程执行的，而webpack-parallel-uglify-plugin可以并行的执行，在我的小demo中使用后，速度直接从25s变成了14s

5. 使用fast-sass-loader代替sass-loader

fast-sass-loader可以并行地处理sass,在提交构建之前会先组织好代码，速度也会快一些

6. babel-loader开启缓存

babel-loader在执行的时候，可能会产生一些运行期间重复的公共文件，造成代码体积大冗余，同时也会减慢编译效率

可以加上cacheDirectory参数或使用 transform-runtime 插件试试

7. 不需要打包编译的插件库换成全局\<script>标签引入的方式

比如jQuery插件，react, react-dom等，代码量是很多的，打包起来可能会很耗时

可以直接用标签引入，然后在webpack配置里使用 expose-loader  或 externals 或 ProvidePlugin  提供给模块内部使用相应的变量

8. 提取公共代码

使用CommonsChunkPlugin提取公共的模块，可以减少文件体积，也有助于浏览器层的文件缓存，还是比较推荐的

9. 使用ModuleConcatenationPlugin插件来加快JS执行速度
这是webpack3的新特性（Scope Hoisting），其实是借鉴了Rollup打包工具来的，它将一些有联系的模块，放到一个闭包函数里面去，通过减少闭包函数数量从而加快JS的执行速度

10. 使用noParse
webpack打包的时候，有时不需要解析某些模块的依赖（这些模块并没有依赖，或者并根本就没有模块化），我们可以直接加上这个参数，直接跳过这种解析

```
module: {
    noParse: /node_modules\/(jquey\.js)/
  }
```

11. 使用异步的模块加载
这个算是可以减小模块的体积吧，在一定程度上也是为用户考虑的，使用require.ensure来设置哪些模块需要异步加载，webpack会将它打包到一个独立的chunk中，

在某个时刻（比如用户点击了查看）才异步地加载这个模块来执行

```js
$('.bg-input').click(() => {
    console.log('clicked, loading async.js')

    require.ensure([], require => {

        require('./components/async2').log();
        require('./components/async1').log();
        console.log('loading async.js done');
    });
});
```

12. 以模块化来引入
有些模块是可以以模块化来引入的，就是说可以只引入其中的一部分，比如说lodash

```js
// 原来的引入方式
 import {debounce} from 'lodash';

//按模块化的引入方式
import debounce from 'lodash/debounce';
```

