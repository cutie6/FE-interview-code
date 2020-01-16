
# node

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 
Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 
Node.js 的包管理器 npm，是全球最大的开源库生态系统。

- 特点
下面我们来说说Node.js的特点。事件驱动、异步编程的特点刚才已经详细说过了，这里不再重复。

Node.js的性能不错。按照创始人Ryan Dahl的说法，性能是Node.js考虑的重要因素，选择C++和V8而不是Ruby或者其他的虚拟机也是基于性能的目的。Node.js在设计上也是比较大胆，它以单进程、单线程模式运行。事件驱动机制是Node.js通过内部单线程高效率地维护事件循环队列来实现的，没有多线程的资源占用和上下文切换，这意味着面对大规模的http请求，Node.js凭借事件驱动搞定一切。

## nodemon
用nodemon执行js文件可以自动更新

## http模块
response.end('a response from server'); 这句话里面的response的原型链上有stream,eventEmitter
```js
const http = require('http');
const server = http.createServer((request, response) => {
    console.log('there is a request');
    response.end('a response from server');
});
server.listen(3000);

// 打印原型链
function getPrototypeChain(obj) {
        var protoChain = [];
        while (obj = Object.getPrototypeOf(obj)) {//返回给定对象的原型。如果没有继承属 性，则返回 null 。
            protoChain.push(obj);
        }
        protoChain.push(null);
        return protoChain;
    }
```

## 仿写一个简版Express

体验express，07-express.js:

```js
// npm i express
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.end("Hello World");
});
app.get("/users", (req, res) => {
  res.end(JSON.stringify([{ name: "tom", age: 20 }]));
});
app.listen(3000, () => {
  console.log("Example app listen at 3000");
});
```

实现kexpress, 08-kexpress.js:

```js
const http = require("http");
const url = require("url");
const router = [];
class Application {
    get(path, handler) {
        if (typeof path === "string") {
            router.push({
                path,
                method: "get",
                handler
            });
            const server = http.createServer((req, res) => {
                const { pathname } = url.parse(req.url, true);
                for (const route of router) {
                    const { path, method, handler } = route;
                    if (
                        pathname == path &&
                        req.method.toLowerCase() == method
                    ) {
                        return handler(req, res);
                    }
                }
            });
        }
    }
    listen() {
        const server = http.createServer((req, res) => {
            const { pathname } = url.parse(req.url, true);
            for (const route of router) {
                const { path, method, handler } = route;
                if (pathname == path && req.method.toLowerCase() == method) {
                    return handler(req, res);
                }
            }
        });
        server.listen(...arguments);
    }
}
module.exports = function createApplication() {
    return new Application();
};

```

## eventLoop

- microtasks(微任务):
process.nextTick
promise.then 
- tasks(宏任务):
setTimeout setInterval setImmediate

### setTimeout和setImmediate执行顺序随机
https://segmentfault.com/a/1190000013102056?utm_source=tag-newes

### process.nextTick 早于 promise.then
https://segmentfault.com/q/1010000011914016/a-1020000011915491
在Node中，_tickCallback在每一次执行完TaskQueue中的一个任务后被调用，而这个_tickCallback中实质上干了两件事：

1.nextTickQueue中所有任务执行掉(长度最大1e4，Node版本v6.9.1)

2.第一步执行完后执行_runMicrotasks函数，执行microtask中的部分(promise.then注册的回调)

所以很明显 process.nextTick 早于 promise.then

```js
// 等待下一下事件队列
(new Promise(resolve => {
    console.log('A resolve')
    resolve()
}))
.then(() => console.log('B promise then...'))
setImmediate(() => {
    console.log('C set Immediate ...')
})
// setTimeout，放入Event Table中，1秒后将回调函数放入宏任务的Event Queue中 
setTimeout(() => {
    console.log('D setTimeout ...')
}, 0)
process.nextTick(() => {
    console.log('E nextTick ...')
})
```
执行结果： 
A E B D C


## require顺序

当 Node 遇到 require(X) 时，按下面的顺序处理。

（1）如果 X 是内置模块（比如 require('http'）) 
　　a. 返回该模块。 
　　b. 不再继续执行。

（2）如果 X 以 "./" 或者 "/" 或者 "../" 开头 
　　a. 根据 X 所在的父模块，确定 X 的绝对路径。 
　　b. 将 X 当成文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。
    X   如果 X 是一个文件, 将 X 作为 JavaScript 文本载入并停止执行。
    X.js  如果 X.js 是一个文件, 将 X.js 作为 JavaScript 文本载入并停止执行。
    X.json  如果 X.json 是一个文件, 解析 X.json 为 JavaScript 对象并停止执行。
    X.node  如果 X.node 是一个文件, 将 X.node 作为二进制插件载入并停止执行。
　　c. 将 X 当成目录，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。
    X/package.json（main字段）
    X/index.js
    X/index.json
    X/index.node
（3）如果 X 不带路径 
　　a. 根据 X 所在的父模块，确定 X 可能的安装目录。 
　　b. 依次在每个目录中，将 X 当成文件名或目录名加载。

（4） 抛出 "not found"

> node 在之前项目中的作用

https://www.zhihu.com/question/61505504/answer/189152717

其实node在前端主要是做两方面：一个是前端工程化部分，也就是代码的编译打包，偶尔跑个本地服务器用于方便开发项目。这部分主要就是用到node的一些系统库，文件操作，路径操作等。还有一方面就是在server端部分，就是用node做服务器，这部分就需要用到node关于网络方面的能力了，也需要考虑node和数据库，和web服务器或者别的web服务之间的配合等。也就是你最开始说的node处理高并发这些。目前你接触的是我上面说的第一部分，所以可能只用到了node的一小撮功能。

> RESTful

 REpresentational State Transfer 直接翻译：表现层状态转移。
 **URL定位资源，用HTTP动词（GET,POST,DELETE,DETC）描述操作。**


以下来自 https://www.w3ctech.com/topic/1969


> 什么是error-first回调模式？

应用error-first回调模式是为了更好的进行错误和数据的传递。第一个参数保留给一个错误error对象，一旦出错，错误将通过第一个参数error返回。其余的参数将用作数据的传递。
```
fs.readFile(filePath, function(err, data) {  
  if (err) {
    // handle the error, the return is important here
    // so execution stops here
    return console.log(err)
  }
  // use the data object
  console.log(data)
})
```

> 如何避免“回调地狱”？

模块化设计: 讲回调拆分成几个独立的函数

使用 流程控制库, 比如 async

组合使用 generators和Promises

使用async/await 函数

> 什么是Promises？

Promise 对象用于表示一个异步操作的最终状态（完成或失败），以及其返回的值。

promise的概念早在上个世纪八十年代就被提出，现在已经是大多数现代编程语言中支持的特性，让你能更轻松地实现异步模型。

举个简单的例子, 正常来说100ms 之后将会输出 result 。一旦失败, catch可以抛出异常。Promises允许链式操作。

```
new Promise((resolve, reject) => {  
  setTimeout(() => {
    resolve('result')
  }, 100)
})
  .then(console.log)
  .catch(console.error)
```



> 什么时候应当用npm？什么时候应当用yarn？
http://www.zcfy.cc/article/why-we-switched-from-npm-to-yarn-2140.html?t=new

对比来看，NPM发送请求来下载包的时候，会一次全部执行完，并且每个包都是边下载边安装。这意味着，如果你项目中有15个依赖包，就会一个接着一个地下载和安装，无论任一一个包的日志都可能输出到控制台。

然而，Yarn处理这个过程更为精细化了，当Yarn发起下载包请求的时候，会并行执行。如果你项目中有15个依赖，这些依赖会在同一时间全部下载完。当所有依赖全部下载之后，Yarn会安装要求安装的包（并不是所有的模块都需要安装），并且显示在安装该包过程中的任意可能结果。

Yarn提供了处理过程中更多的可见性，而NPM则倾向于将其模糊掉。当使用Yarn做了实验并且发现所提供的好处之后，我们决定做此转变（就像这个案例这么容易）。Yarn是多年来使用NPM管理JS依赖实践后的产品，并且致力于解决JS开发者遇到的诸多问题，而这些问题往往将其归因于“JavaScript工作方式”（而作为一个常见问题存在着而很难理解）。

如果在使用NPM过程中有任何不爽，强烈鼓励你选择Yarn！

> 什么是桩代码（stub）？ 请描述一个应用场景！

桩代码（stub）就是在某些组件或模块中，模拟某些功能的代码。桩代码（stub）的作用是占位，让代码在测试过程中顺利运行。

一个例子，它实际的作用是写一个文件，但是这段代码并没有真正的做这件事。
```
var fs = require('fs')

var writeFileStub = sinon.stub(fs, 'writeFile', function (path, data, cb) {  
  return cb(null)
})

expect(writeFileStub).to.be.called  
writeFileStub.restore()
```

> 什么是测试金字塔？请举例说明！

测试金字塔描述了单元测试（unit test），集成测试（integration tests），端到端测试（end-to-end test）在测试中占的比例。

举个例子，测试一个HTTP API需要:

大量关于models 的单元测试(使用桩代码处理),

一些关于models如何和其他models交互的集成测试 (未使用桩代码处理),

少量的端到端测试，也就是真实环境下的调用 ( 未使用桩代码处理).

> 什么时候应该在后台进程中使用消息服务？怎么处理工作线程的任务/怎么给worker安排任务？

消息队列适用于后台数据传输服务，比如发送邮件和数据图像处理。

消息队列有很多解决方案，比如RabbitMQ 和Kafka.

> 如果保证你的cookie安全？如何阻止XSS攻击？

XSS攻击是指攻击者向Html页面里插入恶意JavaScript代码。

为了防止攻击，你需要对HTTP header里的set-cookie 进行处理:

HttpOnly - 这个属性帮助防止跨站脚本攻击，它禁止通过JavaScript访问cookie。

secure - 这个属性告诉浏览器，仅允许通过HTTPS协议访问cookie。

所以，你需要做的是在请求头里写 Set-Cookie: sid=; HttpOnly;secure。如果你正在使用Express框架，可以使用 express-cookie session，他会默认做出上述防止XSS攻击的设置。

> 如何确认项目的相关依赖安全？

使用Node.js开发, 很容易出现有成百上千个依赖的情况。

举例来说，如果你依赖Express，准确的说这意味着也依赖 27 个其他的模块 , 手动检测更新这些模块不是一个好的选择！

唯一的选择就是**自动的安全的更新你的依赖**，你有如下免费或付费的选择：

npm outdated

Trace by RisingStack

NSP

GreenKeeper

Snyk

> 下面的代码有什么错误？
```
new Promise((resolve, reject) => {  
  throw new Error('error')
}).then(console.log)
```

答案
在 then后没有catch ，没有捕捉异常。这样做会造成故障沉默，不会抛出异常。

为了完善这段代码，我们可以做如下操作:
```
new Promise((resolve, reject) => {  
  throw new Error('error')
}).then(console.log).catch(console.error)
```
如果你调试一个巨大的代码库，并且比不知道哪个Promise函数有潜在的问题, 你可以使用unhandledRejection 这个工具。它将会打印出所有未处理的reject状态的Promise。
```
process.on('unhandledRejection', (err) => {  
  console.log(err)
})
```

> 下面的代码有什么错误？
```
function checkApiKey (apiKeyFromDb, apiKeyReceived) {  
  if (apiKeyFromDb === apiKeyReceived) {
    return true
  }
  return false
}
```
答案
在进行数据校验(security credentials)时，避免任何信息泄露是最重要的。所以，我们要控制数据校验的执行时间。**我们要保证，不管传过来的数据是什么，我们校验数据消耗的时间是相同的。如果你做不到这一点，你的程序对时序攻击的抵抗力很低**。

为什么会有这种现象?

Node.js使用的V8 JavaScript引擎会从性能角度优化你的代码。 **V8引擎比较数据的方式是字节比较, 一旦发现有一个字节不一致, 比较运算就会停止。 因此，攻击者传入的password校验时间越长，说明password正确的部分越多**。

为了修复这个问题, 你可以**使用npm模块cryptiles**。

```
function checkApiKey (apiKeyFromDb, apiKeyReceived) {  
  return cryptiles.fixedTimeComparison(apiKeyFromDb, apiKeyReceived)
}
```

以下来自 https://www.jianshu.com/p/2e0284db8e1d

> 如何用Node监听80端口

这题有陷阱！**在类Unix系统中你不应该尝试去监听80端口，因为这需要超级用户权限**。 因此不推荐让你的应用直接监听这个端口。
目前，如果你一定要让你的应用监听80端口的话，你可以有通过在Node应用的前方再增加一层反向代理 （例如nginx）来实现，如下图所示。否则，建议你直接监听大于1024的端口。

反向代理指的是以代理服务器来接收Internet上的连接请求，然后将请求转发给内部网络上的服务器， 并且将服务器返回的结果发送给客户端。

在计算机网络中，反向代理是代理服务器的一种。服务器根据客户端的请求，从其关系的一组或多组后端服务器（如Web服务器）上获取资源，然后再将这些资源返回给客户端，客户端只会得知反向代理的IP地址，而不知道在代理服务器后面的服务器簇的存在[1]。

与前向代理不同，前向代理作为客户端的代理，将从互联网上获取的资源返回给一个或多个的客户端，服务器端（如Web服务器）只知道代理的IP地址而不知道客户端的IP地址；而反向代理是作为服务器端（如Web服务器）的代理使用，而不是客户端。客户端借由前向代理可以间接访问很多不同互联网服务器（簇）的资源，而反向代理是供很多客户端都通过它间接访问不同后端服务器上的资源，而不需要知道这些后端服务器的存在，而以为所有资源都来自于这个反向代理服务器。

解释：这个问题用于检查被面试者是否有实际运行Node应用的经验。

> 什么是事件循环
Node采用的是单线程的处理机制（所有的I/O请求都采用非阻塞的工作方式），至少从Node.js开发者的角度是这样的。 而在底层，Node.js借助libuv来作为抽象封装层， 从而屏蔽不同操作系统的差异，Node可以借助livuv来来实现多线程。下图表示了Node和libuv的关系。

![](imgs/libuv.png)

Libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个事件循环， 以异步的方式将任务的执行结果返回给V8引擎。

每一个I/O都需要一个回调函数——一旦执行完便推到事件循环上用于执行。 如果你需要更多详细的解释，可以参考这个视频。 你也可以参考这篇文章。
解释：这用于检查Node.js的底层知识，例如什么是libuv，它的作用是什么。

> 多线程

https://cnodejs.org/topic/518b679763e9f8a5424406e9

Jorge为我们开发出了一个让node支持多线程模型的模块：threads_a_gogo
github地址：https://github.com/xk/node-threads-a-gogo

有了threads-a-gogo（以下简称TAGG）这个模块之后，我们可以让node做更多的事情

> 多进程

https://segmentfault.com/a/1190000004621734

pm2的内部和cluster内部实现其实是一个道理，都是封装了一层child_process--fork. 而child_process--fork 则是封装了unix 系统的fork 方法。 既然，都到这了，我们来看看官方给出的解释吧。

fork其实就是创建子进程的方法，新创建的进程被认为是子进程，而调用fork的进程则是父进程。 子进程和父进程本来是在独立的内存空间中的。但当你使用了fork之后，两者就处在同一个作用域内了。 但是，内存的读写，文件的map,都不会影响对方。

上面那段的意思就是，你创建的进程其实可以相互通信，并且被master进程 管理。 

## 代理服务器
https://cnodejs.org/topic/584605103ebad99b336b1dc1

```
var express = require(‘express’);
var request = require(‘request’);
var app = express();
app.use(’/’, function(req, res) {
  var url = ‘https://www.baidu.com/’ + req.url;
  req.pipe(request(url)).pipe(res);
});
app.listen(process.env.PORT || 3000);
```


## npm & package.json

> --save --save-dev
--save-dev 是你开发时候依赖的东西，--save 是你发布之后还依赖的东西。

> dependencies devDependencies
Dependencies are specified in a simple object that maps a package name to a version range. 


If someone is planning on downloading and using your module in their program, then they probably don't want or need to download and build the external test or documentation framework that you use.

In this case, it's best to map these additional items in a devDependencies object.

These things will be installed when doing npm link or npm install from the root of a package, and can be managed like any other npm configuration param. See npm-config for more on the topic.

> peerDependencies

有时，你的项目和所依赖的模块，都会同时依赖另一个模块，但是所依赖的版本不一样。比如，你的项目依赖A模块和B模块的1.0版，而A模块本身又依赖B模块的2.0版。

大多数情况下，这不构成问题，B模块的两个版本可以并存，同时运行。但是，有一种情况，会出现问题，就是这种依赖关系将暴露给用户。

最典型的场景就是插件，比如A模块是B模块的插件。用户安装的B模块是1.0版本，但是A插件只能和2.0版本的B模块一起使用。这时，用户要是将1.0版本的B的实例传给A，就会出现问题。因此，需要一种机制，在模板安装的时候提醒用户，如果A和B一起安装，那么B必须是2.0模块。

peerDependencies字段，就是用来供插件指定其所需要的主工具的版本。

```
{
  "name": "chai-as-promised",
  "peerDependencies": {
    "chai": "1.x"
  }
}
```

上面代码指定，安装chai-as-promised模块时，主程序chai必须一起安装，而且chai的版本必须是1.x。如果你的项目指定的依赖是chai的2.0版本，就会报错。

注意，从npm 3.0版开始，peerDependencies不再会默认安装了。


> scripts

scripts指定了运行脚本命令的npm命令行缩写，比如start指定了运行npm run start时，所要执行的命令。

下面的设置指定了npm run preinstall、npm run postinstall、npm run start、npm run test时，所要执行的命令。

```
"scripts": {
    "preinstall": "echo here it comes!",
    "postinstall": "echo there it goes!",
    "start": "node index.js",
    "test": "tap test/*.js"
}
```

> main

The main field is a module ID that is the primary entry point to your program. That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module's exports object will be returned.

This should be a module ID relative to the root of your package folder.

For most modules, it makes the most sense to have a main script and often not much else.

### 语义化版本号

http://blog.kankanan.com/article/package.json-65874ef6-dependencies-4e2d7684540479cd7248672c53f75f625f0f.html

https://docs.npmjs.com/misc/semver

版本号格式： 主版本号.次版本号.修订号
[major, minor, patch]

- 1.2.1
匹配指定版本，这里是匹配1.2.1。

- Tilde Ranges ~1.2.3 ~1.2 ~1
Allows patch-level changes if a minor version is specified on the comparator. Allows minor-level changes if not

- ^Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4
Allows changes that do not modify the left-most non-zero digit in the [major, minor, patch] tuple. In other words, this allows patch and minor updates for versions 1.0.0 and above, patch updates for versions 0.X >=0.1.0, and no updates for versions 0.0.X.

Many authors treat a 0.x version as if the x were the major "breaking-change" indicator.

Caret ranges are ideal when an author may make breaking changes between 0.2.4 and 0.3.0 releases, which is a common practice. However, it presumes that there will not be breaking changes between 0.2.4 and 0.2.5. It allows for changes that are presumed to be additive (but non-breaking), according to commonly observed practices.




## pm2

> 原理

https://www.jianshu.com/p/ac843b516fda

pm2基于cluster进行了封装，它能自动监控进程状态、重启进程、停止不稳定的进程（避免无限循环）等。利用pm2时，可以在不修改代码（如果自己实现，需要参考上面的例子进行修改）的情况下实现负载均衡集群。

pm2也是采用cluster.fork实现的集群，这也就是所谓的万变不离其宗。由于God Deamon这个Master进程一直执行，可以保证对每一个子进程监听事件，从而进行相应的操作。