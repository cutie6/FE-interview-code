# js 核心概念

## 内存泄漏

https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/

1、定义和用法：

内存泄露是指一块被分配的内存既不能使用，又不能回收，直到浏览器进程结束。C#和 Java 等语言采用了自动垃圾回收方法管理内存，几乎不会发生内存泄露。我们知道，浏览器中也是采用自动垃圾回收方法管理内存，但由于浏览器垃圾回收方法有 bug，会产生内存泄露。？？？

2、出现的情况

1. 意外的全局变量

```js
function foo(arg) {
    bar = "this is a hidden global variable";
}

function foo() {
    this.variable = "potential accidental global";
}
```

使用严格模式可以避免

2. 被忘记的定时器与回调函数

Nowadays, most browsers can and will collect observer handlers once the observed object becomes unreachable, even if the listener is not explicitly removed. It remains good practice, however, to explicitly remove these observers before the object is disposed.

```js
var element = document.getElementById("button");

function onClick(event) {
    element.innerHtml = "text";
}

element.addEventListener("click", onClick);
// Do stuff
element.removeEventListener("click", onClick);
element.parentNode.removeChild(element);
// Now when element goes out of scope,
// both element and onClick will be collected even in old browsers that don't
// handle cycles well.
```

3. dom 引用

```js
var elements = {
    button: document.getElementById("button"),
    image: document.getElementById("image"),
    text: document.getElementById("text")
};

function doStuff() {
    image.src = "http://some.url/image";
    button.click();
    console.log(text.innerHTML);
    // Much more logic
}

function removeButton() {
    // The button is a direct child of body.
    document.body.removeChild(document.getElementById("button"));

    // At this point, we still have a reference to #button in the global
    // elements dictionary. In other words, the button element is still in
    // memory and cannot be collected by the GC.
}
```

4. 闭包

## proxy 作用

Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

-   无操作转发代理
-   验证
-   通过属性查找数组中的特定对象

## 浏览器多进程与 js 单线程

https://juejin.im/post/5a6547d0f265da3e283a1df7

> 浏览器是多进程的

浏览器是多进程的

浏览器之所以能够运行，是因为系统给它的进程分配了资源（cpu、内存）

简单点理解，每打开一个 Tab 页，就相当于创建了一个独立的浏览器进程。

**注意：**在这里浏览器应该也有自己的优化机制，有时候打开多个 tab 页后，可以在 Chrome 任务管理器中看到，有些进程被合并了 （所以每一个 Tab 标签对应一个进程并不一定是绝对的）

> 浏览器都包含哪些进程？
> 知道了浏览器是多进程后，再来看看它到底包含哪些进程：（为了简化理解，仅列举主要进程）

1.Browser 进程：浏览器的主进程（负责协调、主控），只有一个。作用有

    负责浏览器界面显示，与用户交互。如前进，后退等

    负责各个页面的管理，创建和销毁其他进程

    将Renderer进程得到的内存中的Bitmap，绘制到用户界面上

    网络资源的管理，下载等

2.第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建

3.GPU 进程：最多一个，用于 3D 绘制等

4.浏览器渲染进程（浏览器内核）（Renderer 进程，内部是多线程的）：默认每个 Tab 页面一个进程，互不影响。主要作用为

页面渲染，脚本执行，事件处理等

强化记忆：在浏览器中打开一个网页相当于新起了一个进程（进程内有自己的多线程）
当然，浏览器有时会将多个进程合并（譬如打开多个空白标签页后，会发现多个空白标签页被合并成了一个进程）

> 浏览器多进程的优势
> 相比于单进程浏览器，多进程有如下优点：

避免单个 page crash 影响整个浏览器

避免第三方插件 crash 影响整个浏览器

多进程充分利用多核优势

方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

简单点理解：如果浏览器是单进程，那么某个 Tab 页崩溃了，就影响了整个浏览器，体验有多差；同理如果是单进程，插件崩溃了也会影响整个浏览器；而且多进程还有其它的诸多优势。。。
当然，内存等资源消耗也会更大，有点空间换时间的意思。

> 重点是浏览器内核（渲染进程）
> 对于普通的前端操作来说，最重要的是渲染进程
> 可以这样理解，页面的渲染，JS 的执行，事件的循环，都在这个进程内进行。接下来重点分析这个进程
> 浏览器的渲染进程是多线程的

列举一些主要常驻线程：

1.GUI 渲染线程

负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。

当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行

注意，GUI 渲染线程与 JS 引擎线程是互斥的，当 JS 引擎执行时 GUI 线程会被挂起（相当于被冻结了），GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行。

2.JS 引擎线程

也称为 JS 内核，负责处理 Javascript 脚本程序。（例如 V8 引擎）

JS 引擎线程负责解析 Javascript 脚本，运行代码。

JS 引擎一直等待着任务队列中任务的到来，然后加以处理，浏览器无论什么时候都只有一个 JS 线程在运行 JS 程序

同样注意，GUI 渲染线程与 JS 引擎线程是互斥的，所以如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

3.事件触发线程

归属于浏览器而不是 JS 引擎，用来控制事件循环（可以理解，JS 引擎自己都忙不过来，需要浏览器另开线程协助）

当 JS 引擎执行代码块如 setTimeOut 时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX 异步请求等），会将对应任务添加到事件线程中

当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理

注意，由于 JS 的单线程关系，所以这些待处理队列中的事件都得排队等待 JS 引擎处理（当 JS 引擎空闲时才会去执行）

4.定时触发器线程

传说中的 setInterval 与 setTimeout 所在线程

浏览器定时计数器并不是由 JavaScript 引擎计数的,（因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）

因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待 JS 引擎空闲后执行）

注意，W3C 在 HTML 标准中规定，规定要求 setTimeout 中低于 4ms 的时间间隔算为 4ms。

5.异步 http 请求线程

在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求

将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。

> Browser 进程和浏览器内核（Renderer 进程）的通信过程
> 看到这里，首先，应该对浏览器内的进程和线程都有一定理解了，那么接下来，再谈谈浏览器的 Browser 进程（控制进程）是如何和内核通信的，
> 这点也理解后，就可以将这部分的知识串联起来，从头到尾有一个完整的概念。
> 如果自己打开任务管理器，然后打开一个浏览器，就可以看到：任务管理器中出现了两个进程（一个是主控进程，一个则是打开 Tab 页的渲染进程），
> 然后在这前提下，看下整个的过程：(简化了很多)

1.Browser 进程收到用户请求，首先需要获取页面内容（譬如通过网络下载资源），随后将该任务通过 RendererHost 接口传递给 Render 进程

2.Renderer 进程的 Renderer 接口收到消息，简单解释后，交给渲染线程，然后开始渲染

    渲染线程接收请求，加载网页并渲染网页，这其中可能需要Browser进程获取资源和需要GPU进程来帮助渲染

    当然可能会有JS线程操作DOM（这样可能会造成回流并重绘）

    最后Render进程将结果传递给Browser进程

3.Browser 进程接收到结果并将结果绘制出来

> WebWorker，JS 的多线程？
> 前文中有提到 JS 引擎是单线程的，而且 JS 执行时间过长会阻塞页面，那么 JS 就真的对 cpu 密集型计算无能为力么？
> 所以，后来 HTML5 中支持了 Web Worker。

MDN 的官方解释是：
Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面

一个 worker 是使用一个构造函数创建的一个对象(e.g. Worker()) 运行一个命名的 JavaScript 文件

这个文件包含将在工作线程中运行的代码; workers 运行在另一个全局上下文中,不同于当前的 window

因此，使用 window 快捷方式获取当前全局的范围 (而不是 self) 在一个 Worker 内将返回错误

这样理解下：

    创建Worker时，JS引擎向浏览器申请开一个子线程（子线程是浏览器开的，完全受主线程控制，而且不能操作DOM）

    JS引擎线程与worker线程间通过特定的方式通信（postMessage API，需要通过序列化对象来与线程交互特定的数据）

所以，如果有非常耗时的工作，请单独开一个 Worker 线程，这样里面不管如何翻天覆地都不会影响 JS 引擎主线程，
只待计算出结果后，将结果通信给主线程即可，perfect!
而且注意下，JS 引擎是单线程的，这一点的本质仍然未改变，Worker 可以理解是浏览器给 JS 引擎开的外挂，专门用来解决那些大量计算问题。
其它，关于 Worker 的详解就不是本文的范畴了，因此不再赘述

## ECMAScript 中所有参数传递都是值，不可能通过引用传递参数

## Event Loop

JS 分为同步任务和异步任务

同步任务都在主线程上执行，形成一个执行栈

主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。

一旦执行栈中的所有同步任务执行完毕（此时 JS 引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行

> 定时器线程
> 当使用 setTimeout 或 setInterval 时，它需要定时器线程计时，计时完成后就会将特定的事件推入事件队列中。

譬如:

```js
setTimeout(function() {
    console.log("hello!");
}, 1000);
```

这段代码的作用是当 1000 毫秒计时完毕后（由定时器线程计时），将回调函数推入事件队列中，等待主线程执行

### setTimeout 而不是 setInterval

The setInterval() method, offered on the Window and Worker interfaces, repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.

Ensure that execution duration is shorter than interval frequency
If there is a possibility that your logic could take longer to execute than the interval time, it is recommended that you recursively call a named function using WindowOrWorkerGlobalScope.setTimeout. For example, if using setInterval to poll a remote server every 5 seconds, network latency, an unresponsive server, and a host of other issues could prevent the request from completing in its allotted time. As such, you may find yourself with queued up XHR requests that won't necessarily return in order.

In these cases, a recursive setTimeout() pattern is preferred:

```js
function mySetInterval(fn, interval) {
    setTimeout(() => {
        fn();
        mySetInterval(fn, interval);
    }, interval);
}
```

### macrotask 与 microtask

譬如下面这题：

```js
console.log("script start");

setTimeout(function() {
    console.log("setTimeout");
}, 0);

Promise.resolve()
    .then(function() {
        console.log("promise1");
    })
    .then(function() {
        console.log("promise2");
    });

console.log("script end");
```

嗯哼，它的正确执行顺序是这样子的：

```
script start
script end
promise1
promise2
setTimeout
```

https://juejin.im/post/5a6fd5ce6fb9a01c9406208d

宏任务和微任务
一 概念

1. 宏任务：当前调用栈中执行的代码成为宏任务。（主代码快，定时器等等）。

2. 微任务： 当前（此次事件循环中）宏任务执行完，在下一个宏任务开始之前需要执行的任务,可以理解为回调事件。（promise.then，process.nextTick 等等）。

3. 宏任务中的事件放在 callback queue 中，由事件触发线程维护；微任务的事件放在微任务队列中，由 js 引擎线程维护。

二. 运行机制

1. 在执行栈中执行一个宏任务。

2. 执行过程中遇到微任务，将微任务添加到微任务队列中。

3. 当前宏任务执行完毕，立即执行微任务队列中所有的任务。

4. 当前微任务队列中的任务执行完毕，检查渲染，GUI 线程接管渲染。

5. 渲染完毕后，js 线程接管，开启下一次事件循环，执行下一次宏任务（事件队列中取）。

补充：在 node 环境下，process.nextTick 的优先级高于 Promise，也就是可以简单理解为：在宏任务结束后会先执行微任务队列中的 nextTickQueue 部分，然后才会执行微任务中的 Promise 部分。

另外，请注意下 Promise 的 polyfill 与官方版本的区别：

    官方版本中，是标准的microtask形式

    polyfill，一般都是通过setTimeout模拟的，所以是macrotask形式

请特别注意这两点区别

注意，有一些浏览器执行结果不一样（因为它们可能把 microtask 当成 macrotask 来执行了），
但是为了简单，这里不描述一些不标准的浏览器下的场景（但记住，有些浏览器可能并不标准）

https://www.cnblogs.com/heshan1992/p/6650593.html

**在 JS 中 ES6 中新增的任务队列（promise）是在事件循环之上的，事件循环每次 tick 后会查看 ES6 的任务队列中是否有任务要执行，也就是 ES6 的任务队列比事件循环中的任务（事件）队列优先级更高。**

如 Promise 就使用了 ES6 的任务队列特性。也即在执行完任务栈后首先执行的是任务队列中的 promise 任务。其他的上面常见的异步操作加入队列的时间没有相应的优先级。

**await 会将 await 语句后面的代码加到微任务队列中，然后继续执行函数后面的同步代码**

https://segmentfault.com/q/1010000016147496

根据提示

```js
async function async1() {
    await async2();
    console.log("async1 end");
}
```

等价于

```js
async function async1() {
    return new Promise(resolve => {
        resolve(async2());
    }).then(() => {
        console.log("async1 end");
    });
}
```

```js
setTimeout(() => console.log("a"), 0);
var p = new Promise(resolve => {
    console.log("b");
    resolve();
});
p.then(() => console.log("c"));
p.then(() => console.log("d"));
console.log("e");
// 结果：b e c d a

async function async1() {
    console.log("a");
    await async2(); //执行这一句后，await会让出当前线程，将后面的代码加到微任务队列中，然后继续执行函数后面的同步代码
    console.log("b");
}
async function async2() {
    console.log("c");
}
console.log("d");
setTimeout(function() {
    console.log("e");
}, 0);
async1();
new Promise(function(resolve) {
    console.log("f");
    resolve();
}).then(function() {
    console.log("g");
});
console.log("h");

// 在页面的script标签中运行结果：d a c f h b g e
```

## 异步

### 同步函数异步函数

（1） 同步函数：当一个函数是同步执行时，那么当该函数被调用时不会立即返回，直到该函数所要做的事情全都做完了才返回。

（2） 异步函数：如果一个异步函数被调用时，该函数会立即返回尽管该函数规定的操作任务还没有完成。

## 遍历对象属性(for in、Object.keys、Object.getOwnProperty)

1.for in
主要用于遍历对象的可枚举属性，**包括自有属性、继承自原型的属性**(可枚举的属性可以通过 for...in 循环进行遍历（除非该属性名是一个 Symbol）。)

2.Object.keys

```js
Object.keys(obj);
```

返回一个数组，元素均为对象自有的可枚举属性

3.Object.getOwnProperty
用于返回对象的自有属性，包括可枚举和不可枚举的

## 深拷贝

https://segmentfault.com/a/1190000008637489

1.

```js
// 对对象类型的拷贝，不包括函数与简单数据类型
function deepClone(source) {
    if (!source || typeof source !== "object") {
        throw new Error("error arguments", "shallowClone");
    }
    var targetObj = source.constructor === Array ? [] : {};
    for (var keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === "object") {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            } else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
}
```

2.还有一种实现深拷贝的方式是利用 JSON 对象中的 parse 和 stringify，JOSN 对象中的 stringify 可以把一个 js 对象序列化为一个 JSON 字符串，parse 可以把 JSON 字符串反序列化为一个 js 对象，通过这两个方法，也可以实现对象的深复制。

源对象的方法在拷贝的过程中丢失了，这是因为在序列化 JavaScript 对象时，所有函数和原型成员会被有意忽略，这个实现可以满足一些比较简单的情况，能够处理 JSON 格式所能表示的所有数据类型，同时如果在对象中存在循环应用的情况也无法正确处理。

> 考虑循环引用
> 2019.10 月新东方面试 高级前端岗

https://blog.csdn.net/qq_41846861/article/details/102296436

```js
// 木易杨
function cloneDeep3(source, uniqueList) {
    if (!isObject(source)) return source;
    if (!uniqueList) uniqueList = []; // 新增代码，初始化数组

    var target = Array.isArray(source) ? [] : {};

    // ============= 新增代码
    // 数据已经存在，返回保存的数据
    var uniqueData = find(uniqueList, source);
    if (uniqueData) {
        return uniqueData.target;
    }

    // 数据不存在，保存源数据，以及对应的引用
    uniqueList.push({
        source: source,
        target: target
    });
    // =============

    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep3(source[key], uniqueList); // 新增代码，传入数组
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 新增方法，用于查找
function find(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i];
        }
    }
    return null;
}
```

## 工具和技术来调试 JavaScript 代码

1.技术：

-   console.log() console.dir() 方法

-   设置断点
    在调试窗口中，你可以设置 JavaScript 代码的断点。

在每个断点上，都会停止执行 JavaScript 代码，以便于我们检查 JavaScript 变量的值。

在检查完毕后，可以重新执行代码（如播放按钮）。

-   debugger 关键字
    debugger 关键字用于停止执行 JavaScript，并调用调试函数。

这个关键字与在调试工具中设置断点的效果是一样的。

如果没有调试可用，debugger 语句将无法工作。

2.工具：
浏览器开发者工具

## 闭包

闭包是在某个作用域内定义的函数，它可以访问这个作用域内的所有变量。

函数与对其状态即词法环境（lexical environment）的引用共同构成闭包（closure）。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript，函数在每次创建时生成闭包。
闭包是由函数以及**创建**该函数的词法环境组合而成。这个环境包含了这个闭包创建时所能访问的所有局部变量。

-   闭包作用域链通常包括三个部分：

函数本身作用域。
闭包定义时的作用域。
全局作用域。

-   闭包常见用途：
闭包很有用，因为它允许将函数与其所操作的某些数据（环境）关联起来。

1.事件处理程序及回调 具体方便的例子还木有找到

2.用闭包模拟私有方法：
可以使用闭包来定义公共函数，并令其可以访问私有函数和变量。这个方式也称为模块模式。

优点：减少全局变量污染

缺点：影响脚本性能

### 闭包与循环

考虑一下以下的代码片段

```js
for (var i = 0; i < 5; i++) {
    var btn = document.createElement("button");

    btn.appendChild(document.createTextNode("Button " + i));

    btn.addEventListener("click", function() {
        console.log(i);
    });

    document.body.appendChild(btn);
}
```

（a)当用户点击“Button4”的时候会打印什么？并解释为什么？

（b)提供一个或多个正确的实现方式。

答：
(a)无论点击哪个按钮，都将打印 5.因为任何按钮在调用 onclick 方法时，for 循环已经完成了，变量 i 的值变成了 5.

(b)关键是要**抓住在每一次循环 for 的时候要把 i 的值传人到最近创建的函数对象中**，下面有三个可能的方式解决这个问题：

```js
for (var i = 0; i < 5; i++) {
    var btn = document.createElement("button");

    btn.appendChild(document.createTextNode("Button " + i));

    btn.addEventListener(
        "click",
        (function(i) {
            return function() {
                console.log(i);
            };
        })(i)
    );

    document.body.appendChild(btn);
}
```

二种：你可以将整个 btn.addEventListener 封装在一个新的匿名函数里。

```js
for (var i = 0; i < 5; i++) {
    var btn = document.createElement("button");

    btn.appendChild(document.createTextNode("Button " + i));

    (function(i) {
        btn.addEventListener("click", function() {
            console.log(i);
        });
    })(i);

    document.body.appendChild(btn);
}
```

三种：可以将 for 循环换成 array 对象的本地调用方法 forEach.

```js
["a", "b", "c", "d", "e"].forEach(function(value, i) {
    var btn = document.createElement("button");

    btn.appendChild(document.createTextNode("Button " + i));

    btn.addEventListener("click", function() {
        console.log(i);
    });

    document.body.appendChild(btn);
});
```

## javascript 有哪几种方法定义函数

1. 函数声明

```js
function name([param,[, param,[..., param]]]) {
   [statements]
}
```

2. 函数表达式

```js
var notHoisted = function() {
    console.log("bar");
};
```

3. Function 构造函数
   JavaScript 提供了一个 Function 类，该类可以用于定义函数，Function 类的构造器的参数个数可以不受限制，Function 可以接受一系列的字符串函数，其中最后一个字符串参数是函数的执行体，执行体的各语句以分号隔开，而前面的字符串参数是函数的参数。

```js
       <script type="text/javascript">

			var f = new Function('name',"document.writeln('Function 定义的函数<br>');"+
			"document.writeln( '你好' + name );");
			f('百度');

	   </script>


```

4. ES6:arrow function

```
var arguments = [1, 2, 3];
var arr = () => arguments[0];
```

## javascript 有哪些方法定义对象

1. 对象字面量： var obj = {};

2. 构造函数： var obj = new Object();

3. Object.create(): var obj = Object.create(Object.prototype);

## 函数内部 arguments 变量有哪些特性,有哪些属性,如何将它转换为数组

arguments 所有函数中都包含的一个局部变量，是一个类数组对象，对应函数调用时的实参。如果函数定义同名参数会在调用时覆盖默认对象
arguments[index]分别对应函数调用时的实参，并且通过 arguments 修改实参时会同时修改实参
arguments.length 为实参的个数（Function.length 表示形参长度）
arguments.callee 为当前正在执行的函数本身，使用这个属性进行递归调用时需注意 this 的变化
arguments.caller 为调用当前函数的函数（已被遗弃）
转换为数组：var args = Array.prototype.slice.call(arguments, 0);

## this

### this 的优先级

1. 函数是否在 new 中调用(new 绑定)?如果是的话 this 绑定的是新创建的对象。

```js
var bar = new foo();
```

2. 函数是否通过 call、apply(显式绑定)或者硬绑定调用?如果是的话，this 绑定的是 指定的对象。

```js
var bar = foo.call(obj2);
```

3. 函数是否在某个上下文对象中调用(隐式绑定)?如果是的话，this 绑定的是那个上 下文对象。

```js
var bar = obj1.foo();
```

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。

```js
var bar = foo();
```

### this 的值

i. 全局上下文
无论是否在严格模式下，在全局执行上下文中（在任何函数体外部）this 都指代全局对象。

ii. 函数上下文

1. 简单调用
   因为下面的代码不是在严格模式下执行，且 this 的值不是通过调用设置的，所以 this 的值默认指向全局对象。

```js
function f1() {
    return this;
}
//在浏览器中：
f1() === window; //在浏览器中，全局对象是window

//在Node中：
f1() === global;
```

然而，在严格模式下，this 将保持他进入执行上下文时的值，所以下面的 this 将会默认为 undefined。

```js
function f2() {
    "use strict"; // 这里是严格模式
    return this;
}

f2() === undefined; // true
```

2. bind 方法
   ECMAScript 5 引入了 Function.prototype.bind。调用 f.bind(someObject)会创建一个与 f 具有相同函数体和作用域的函数，但是在这个新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的。

3. 箭头函数
   在箭头函数中，this 与封闭词法上下文的 this 保持一致。在全局代码中，它将被设置为全局对象。
   **默认指向在定义它时所处的对象而不是执行时的对象**

4. 作为对象的方法
   当以对象里的方法的方式调用函数时，它们的 this 是调用该函数的对象.

5. 原型链中的 this
   相同的概念在定义在原型链中的方法也是一致的。如果该方法存在于一个对象的原型链上，那么 this 指向的是调用这个方法的对象，就好像该方法本来就存在于这个对象上。

6. getter 与 setter 中的 this
   再次，相同的概念也适用时的函数作为一个 getter 或者 一个 setter 调用。用作 getter 或 setter 的函数都会把 this 绑定到正在设置或获取属性的对象。

7. 作为构造函数
   当一个函数用作构造函数时（使用 new 关键字），它的 this 被绑定到正在构造的新对象。

8. 作为一个 DOM 事件处理函数
   当函数被用作事件处理函数时，它的 this 指向触发事件的元素（一些浏览器在使用非 addEventListener 的函数动态添加监听函数时不遵守这个约定）。

9. 作为一个内联事件处理函数
   当代码被内联 on-event 处理函数调用时，它的 this 指向监听器所在的 DOM 元素：

> 下面代码的输出结果是什么，并解释原因？如何修改。

```js
var hero = {
    _name: "John Doe",

    getSecretIdentity: function() {
        return this._name;
    }
};

var stoleSecretIdentity = hero.getSecretIdentity;

console.log(stoleSecretIdentity());

console.log(hero.getSecretIdentity());
```

答：输出结果为 undefined JohnDoe。

第一个为 undefined 是因为我们直接从 hero 对象中提取 stoleSecretIdentity()，stoleSecretIdentity()是从全局上下文里调用的（window 对象），不存在\_name 属性。可以采用下面的方式正确实现预期。

```js
var stoleSecretIdentity = hero.getSecretIdentity.bind(hero);
```

### bind,call,apply 用法与区别

用法：都是改变函数内 this 指向

bind 返回一个新的函数，调用新的函数才执行，新函数里 this 永久地被绑定到了 bind 的第一个参数上.绑定函数被调用时，bind() 也接受预设的参数提供给原函数。一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

而 call 与 apply 能直接执行

```js
fuc.call(thisObj, a, b, c);

fuc.apply(thisObj, [a, b, c]); // apply 传数组
```

> 偏函数
> bind()的另一个最简单的用法是使一个函数拥有预设的初始参数。这些参数（如果有的话）作为 bind()的第二个参数跟在 this（或其他对象）后面，之后它们会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们的后面。

```js
function list() {
    return Array.prototype.slice.call(arguments);
}

var list1 = list(1, 2, 3); // [1, 2, 3]

// Create a function with a preset leading argument
var leadingThirtysevenList = list.bind(undefined, 37);

var list2 = leadingThirtysevenList(); // [37]
var list3 = leadingThirtysevenList(1, 2, 3); // [37, 1, 2, 3]
```

## JavaScript 宿主对象 (host objects) 和原生对象 (native objects) 的区别

> 宿主对象

何为“宿主对象”？ ECMAScript 中的“宿主”当然就是我们网页的运行环境，即“操作系统”和“浏览器”。所有非原生对象都是宿主对象（host object），即由 ECMAScript 实现的宿主环境提供的对象。

所有的 BOM 和 DOM 对象都是宿主对象。因为其对于不同的“宿主”环境所展示的内容不同。其实说白了就是，ECMAScript 官方未定义的对象都属于宿主对象，因为其未定义的对象大多数是自己通过 ECMAScript 程序创建的对象。TML DOM 是 W3C 标准（是 HTML 文档对象模型的英文缩写，Document Object Model for HTML）。

HTML DOM 定义了用于 HTML 的一系列标准的对象，以及访问和处理 HTML 文档的标准方法。

通过 DOM，可以访问所有的 HTML 元素，连同它们所包含的文本和属性。可以对其中的内容进行修改和删除，同时也可以创建新的元素。

> 原生对象

ECMA-262 把原生对象（native object）定义为“独立于宿主环境的 ECMAScript 实现提供的对象”。
Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError、ActiveXObject(服务器方面)、Enumerator(集合遍历类)、RegExp（正则表达式）

由此可以看出，简单来说，原生对象就是 ECMA-262 定义的类（引用类型）。

## 标准内置对象

也称为全局对象（global objects）。注意这里的全局对象指的是具有全局作用域的“一组”对象，而全局对象这个词还有一层意思，用来指代当前环境中的顶层对象，该对象在全局作用域中可以通过 this 访问（但只有在非严格模式下才可以，在严格模式下得到的是 undefined）。事实上，全局作用域就是由顶层对象的属性组成的，包括继承而来的属性（如果有的话）。

全局作用域中的其他对象可以由用户的脚本创建或由宿主程序提供。

## 原型

JavaScript 常被描述为一种基于原型的语言 (prototype-based language)——每个对象拥有一个原型对象，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。这种关系常被称为原型链。

### 原型链

JavaScript 的对象中都包含了一个" \[[Prototype]]"内部属性，这个属性所对应的就是该对象的原型。对象从原型继承方法与属性。原型可能也有原型，这种关系被称为原型链。

JavaScript 对象是动态的属性“包”（指其自己的属性）。JavaScript 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

### **proto** prototype

理解对象的原型（可以通过 Object.getPrototypeOf(obj)或者已被弃用的\_\_proto\_\_属性获得）与构造函数的 prototype 属性之间的区别是很重要的。**前者是每个实例上都有的属性，后者是构造函数的属性**。也就是说，Object.getPrototypeOf(new Foobar())和 Foobar.prototype 指向着同一个对象。

**js 在创建对象的时候，都有一个叫做\_\_proto\_\_的内置属性，用于指向创建它的函数对象的原型对象 prototype**.

```js
function fn() {}

fn.__proto__ === Function.prototype;

Function.prototype.__proto__ === Object.prototype;

console.log(fn.prototype);
// {
//     constructor: ƒ fn(),
//     __proto__: Object
// }

fn.prototype.constructor === fn;
fn.prototype.__proto__ === Object.prototype;
```

![](./imgs/prototype.png)

### constructor

每个对象实例都具有 constructor 属性，它指向创建该实例的构造器函数。

可以将此属性作为构造器使用：

```js
var person3 = new person1.constructor("Karen", "Stephenson", 26, "female", [
    "playing drums",
    "mountain climbing"
]);
```

获得某个对象实例的构造器的名字，可以这么用：

```js
person1.constructor.name;
```

该属性的值是那个函数本身，而不是一个包含函数名称的字符串。对于原始值（js 中有 5 种：null undefined number boolean string），该属性为只读。

```js
var a = 1;
console.log(a.prototype); //undefined
console.log(a.constructor); //ƒ Number() { [native code] }

var b = [];
console.log(b.prototype); //undefined
console.log(b.constructor); //ƒ Array() { [native code] }

//改变 a b 的constructor为 {}
a.constructor = {};
b.constructor = {};
console.log(a.constructor); //没有变，还是 ƒ Number() { [native code] }
console.log(b.constructor); //{}
```

### new

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。
语法：

```js
new constructor[[arguments]]();
```

当代码 new foo(...) 执行时：

1.一个新对象被创建。它继承自**foo.prototype**. 2.构造函数 foo 被执行。执行的时候，相应的传参会被传入，同时上下文(this)会被指定为这个新实例。new foo 等同于 new foo(), 只能用在不传递任何参数的情况。 3.如果构造函数返回了一个“对象”，那么这个对象会取代整个 new 出来的结果。如果构造函数没有返回对象，那么 new 出来的结果为步骤 1 创建的对象。(一般情况下构造函数不返回任何值，不过用户如果想覆盖这个返回值，可以自己选择返回一个普通对象来覆盖。当然，返回数组也会覆盖，因为数组也是对象。)

## js 继承

1.使用 prototype
https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Inheritance

```js
function Person(first, last) {
    this.name = {
        first,
        last
    };
}

Person.prototype.greeting = function() {
    alert("Hi! I'm " + this.name.first + ".");
};

function Teacher(first, last, subject) {
    // Person.call(this, first, last);
    Person.apply(this, arguments);

    this.subject = subject;
}

//用Object.create改变子类的原型也不会影响父类
Teacher.prototype = Object.create(Person.prototype);
//现在Teacher()的prototype的constructor属性指向的是Person(), 我们需要将其正确设置
Teacher.prototype.constructor = Teacher;

//每一个函数对象（Function）都有一个prototype属性，并且只有函数对象有prototype属性，因为prototype本身就是定义在Function对象下的属性。当我们输入类似var person1=new Person(...)来构造对象时，JavaScript实际上参考的是Person.prototype指向的对象来生成person1。另一方面，Person()函数是Person.prototype的构造函数，也就是说Person===Person.prototype.constructor（不信的话可以试试）。

//任何您想要被继承的方法都应该定义在构造函数的prototype对象里，并且永远使用父类的prototype来创造子类的prototype，这样才不会打乱类继承结构。

Teacher.prototype.greeting = function() {
    alert(
        "Hello. My name is  " +
            this.name.last +
            ", and I teach " +
            this.subject +
            "."
    );
};

var teacher1 = new Teacher("Dave", "Griffiths", "mathematics");
```

2.使用 classes
ECMAScript 2015 中引入的 JavaScript 类(classes) 实质上是 JavaScript 现有的基于原型的继承的语法糖。 类语法不是向 JavaScript 引入一个新的面向对象的继承模型。JavaScript 类提供了一个更简单和更清晰的语法来创建对象并处理继承。

```js
class Person {
    constructor(first, last) {
        this.name = {
            first,
            last
        };
    }

    greeting() {
        alert("Hi! I'm " + this.name.first + ".");
    }
}

class Tacher extends Person {
    constructor(first, last, subject) {
        super();
        this.subject = subject;
    }

    greeting() {
        alert(
            "Hello. My name is  " +
                this.name.last +
                ", and I teach " +
                this.subject +
                "."
        );
    }
}

var t = new Tacher("jing", "lu", "en");
t.greeting();
```

> 上边例子设置 constructor 的必要性

https://stackoverflow.com/questions/8453887/why-is-it-necessary-to-set-the-prototype-constructor

It's not always necessary, but it does have its uses. Suppose we wanted to make a copy method on the base Person class. Like this:

```js
// define the Person Class
function Person(name) {
    this.name = name;
}

Person.prototype.copy = function() {
    // return new Person(this.name); // just as bad
    return new this.constructor(this.name);
};

// define the Student class
function Student(name) {
    Person.call(this, name);
}

// inherit Person
Student.prototype = Object.create(Person.prototype);
```

Now what happens when we create a new Student and copy it?

```js
var student1 = new Student("trinth");
console.log(student1.copy() instanceof Student); // => false
```

The copy is not an instance of Student. This is because (without explicit checks), we'd have no way to return a Student copy from the "base" class. We can only return a Person. However, if we had reset the constructor:

```js
// correct the constructor pointer because it points to Person
Student.prototype.constructor = Student;
```

...then everything works as expected:

```js
var student1 = new Student("trinth");
console.log(student1.copy() instanceof Student); // => true
```

### 评价一下三种方法实现继承的优缺点,并改进

```js
function Shape() {}

function Rect() {}

// 方法1
Rect.prototype = new Shape();

// 方法2
Rect.prototype = Shape.prototype;

// 方法3
Rect.prototype = Object.create(Shape.prototype);

Rect.prototype.area = function() {
    // do something
};
```

方法 1：
优点：正确设置原型链实现继承
优点：父类实例属性得到继承，原型链查找效率提高，也能为一些属性提供合理的默认值
缺点：父类实例属性为引用类型时，不恰当地修改会导致所有子类被修改
缺点：创建父类实例作为子类原型时，可能无法确定构造函数需要的合理参数，这样提供的参数继承给子类没有实际意义，当子类需要这些参数时应该在构造函数中进行初始化和设置
总结：继承应该是继承方法而不是属性，为子类设置父类实例属性应该是通过在子类构造函数中调用父类构造函数进行初始化

方法 2：
优点：正确设置原型链实现继承
缺点：父类构造函数原型与子类相同。修改子类原型添加方法会修改父类

方法 3：
优点：正确设置原型链且避免方法 1.2 中的缺点
缺点：ES5 方法需要注意兼容性

改进：

1.所有三种方法应该在子类构造函数中调用父类构造函数实现实例属性初始化:

```js
function Rect() {
    Shape.call(this);
}
```

2.用新创建的对象替代子类默认原型，设置 Rect.prototype.constructor = Rect;保证一致性

3.第三种方法的 polyfill：

```js
function create(obj) {
    if (Object.create) {
        return Object.create(obj);
    }

    function f() {}
    f.prototype = obj;
    return new f();
}
```

### 构造函数里定义 function 和 prototype 定义 function 有什么区别？

1. 构造函数里定义 function，每一个类的实例都会拷贝这个函数，弊端就是浪费内存。prototype 方式定义的方式，函数不会拷贝到每一个实例中，所有的实例共享 prototype 中的定义，节省了内存。

2. 如果使用 prototype 调用的函数，一旦改变，所有实例的方法都会改变。

## 函数堆栈

函数被调用时，就会被加入到调用栈顶部，执行结束之后，就会从调用栈顶部移除该函数，这种数据结构的关键在于后进先出。

## ECMAScript 中变量的两种类型

-   原始值
    存储在栈（stack）中的简单数据段，也就是说，它们的值直接存储在变量访问的位置。
-   引用值
    存储在堆（heap）中的对象，也就是说，存储在栈处的值是一个指针（point），指向堆中的对象。

为变量赋值时，ECMAScript 的解释程序必须判断该值是原始类型，还是引用类型。要实现这一点，解释程序则需尝试判断该值是否为 ECMAScript 的原始类型之一，即 Undefined、Null、Boolean、Number 和 String 型。由于这些原始类型占据的空间是固定的，所以可将他们存储在较小的内存区域 - 栈中。这样存储便于迅速查寻变量的值。
在许多语言中，字符串都被看作引用类型，而非原始类型，因为字符串的长度是可变的。ECMAScript 打破了这一传统。
如果一个值是引用类型的，那么它的存储空间将从堆中分配。由于引用值的大小会改变，所以不能把它放在栈中，否则会降低变量查寻的速度。相反，放在变量的栈空间中的值是该对象存储在堆中的地址。地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响。

![Alt text](../imgs/WechatIMG1.png)

可以用 typeof 运算符判断一个值是否表示一种原始类型：如果它是原始类型，还可以判断它表示哪种原始类型(null 除外)。

## js 三大组成部分

1.ECMAScript 提供核心语言功能
2.dom 提供访问和操作网页内容的方法和接口
3.bom 提供与浏览器交互的方法和接口

## 事件代理

原理：
当事件被冒泡到更上层的父节点的时候，我们通过检查事件的目标对象（target）来判断并获取事件源 Li。下面的代码可以完成我们想要的效果：

```
// 获取父节点，并为它添加一个click事件
document.getElementById("parent-list").addEventListener("click",function(e) {
  // 检查事件源e.targe是否为Li
  if(e.target && e.target.nodeName.toUpperCase == "LI") {
    // 真正的处理过程在这里
    console.log("List item ",e.target.id.replace("post-")," was clicked!");
  }
});
```

优点：

1.减少监听函数。对于同一个父节点下面类似的子元素，可以通过委托给父元素的监听函数来处理事件。

2.可以方便地动态添加和修改元素，不需要因为元素的改动而修改事件绑定。对于给未来的元素（比如通过请求接口拿到数据后再渲染的元素）绑定事件很方便。

3.JavaScript 和 DOM 节点之间的关联变少了，这样也就减少了因循环引用而带来的内存泄漏发生的概率。

### react 里的事件代理

React 采用的是顶层的事件代理机制，能够保持事件冒泡的一致性，可以跨浏览器执行，甚至可以在 IE8 中使用 HTML5 的事件。 React 实现了一个“合成事件”层，这个事件层消除了 IE 与 W3C 标准实现之间的兼容问题。首 就是浏览器原生事件，使用原生事件的时候注意在 componentWillUnmount 解除绑定 removeEventListener，所有通过 JSX 这种方式绑定的事件都是绑定到“合成事件”。 “合成事件”会以事件委托（event delegation）的方式绑定到组件最上层，并且在组件卸载（unmount）的时候自动销毁绑定的事件。

## 异步

### fetch

Fetch API 提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的部分，例如请求和响应。它还提供了一个全局 fetch()方法，该方法提供了一种简单，合乎逻辑的方式来跨网络异步获取资源。

这种功能以前是使用 XMLHttpRequest 实现的。Fetch 提供了一个更好的替代方法，可以很容易地被其他技术使用，例如 Service Workers。Fetch 还提供了单个逻辑位置来定义其他 HTTP 相关概念，例如 CORS 和 HTTP 的扩展。

#### fetch 规范与 jQuery.ajax() 主要有两种方式的不同：

**当接收到一个代表错误的 HTTP 状态码时，从 fetch()返回的 Promise 不会被标记为 reject， 即使该 HTTP 响应的状态码是 404 或 500**。相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ）， 仅当网络故障时或请求被阻止时，才会标记为 reject。

**默认情况下, fetch 不会从服务端发送或接收任何 cookies**, 如果站点依赖于用户 session，则会导致未经认证的请求（要发送 cookies，必须设置 credentials 选项）.

### Promise 的基本用法

生成一个 promise:

```
let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```

```
new Promise( function(resolve, reject) {...} /* executor */  );
Promise.prototype.catch(onRejected)
Promise.prototype.then(onFulfilled, onRejected)
```

### Promise 原理

https://segmentfault.com/a/1190000009478377

极简 promise 雏形：

```js
function Promise(fn) {
    var value = null,
        callbacks = []; //callbacks为数组，因为可能同时有很多个回调

    this.then = function(onFulfilled) {
        callbacks.push(onFulfilled);
    };

    function resolve(value) {
        callbacks.forEach(function(callback) {
            callback(value);
        });
    }

    fn(resolve);
}
```

完善后：

```js
function Promise(fn) {
    var state = "pending",
        value = null,
        callbacks = [];

    this.then = function(onFulfilled, onRejected) {
        return new Promise(function(resolve, reject) {
            handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        });
    };

    function handle(callback) {
        if (state === "pending") {
            callbacks.push(callback);
            return;
        }

        var cb =
                state === "fulfilled"
                    ? callback.onFulfilled
                    : callback.onRejected,
            ret;
        if (cb === null) {
            cb = state === "fulfilled" ? callback.resolve : callback.reject;
            cb(value);
            return;
        }
        try {
            ret = cb(value);
            callback.resolve(ret);
        } catch (e) {
            callback.reject(e);
        }
    }

    function resolve(newValue) {
        if (
            newValue &&
            (typeof newValue === "object" || typeof newValue === "function")
        ) {
            var then = newValue.then;
            if (typeof then === "function") {
                then.call(newValue, resolve, reject);
                return;
            }
        }
        state = "fulfilled";
        value = newValue;
        execute();
    }

    function reject(reason) {
        state = "rejected";
        value = reason;
        execute();
    }

    function execute() {
        setTimeout(function() {
            callbacks.forEach(function(callback) {
                handle(callback);
            });
        }, 0);
    }

    fn(resolve, reject);
}
```

#### 使用 Promises 而非回调 (callbacks) 优缺点是什么？

> cons

1.统一异步 API
Promise 的一个重要优点是它将逐渐被用作浏览器的异步 API ，统一现在各种各样的 API ，以及不兼容的模式和手法。让我们看两个即将到来的基于 Promise 的 API 。

fetch API 是基于 Promise 的

2.与回调函数比较， Promise 有更干净的函数

> pros

Promise 可以很好地处理单一异步结果，不适用于：

1.多次触发的事件：如果要处理这种情况，可以了解一下响应式编程（ reactive programming ），这是一种很聪明的链式的处理普通事件的方法。

2.数据流：支持此种情形的标准正在制定中。

3.ECMAScript 6 Promise 缺少两个有时很有用的特性：

不能取消执行。
无法获取当前执行的进度信息（比如，要在用户界面展示进度条）。
Q Promise 库对于后者提供了支持，并且有计划将两种能力都添加到 Promises/A+ 规范中去。

### async await

调用 async 函数时会返回一个 Promise 对象。async 函数中可能会有 await 表达式，这会使 async 函数暂停执行，等待表达式中的 Promise 解析完成后继续执行 async 函数并返回解决结果。
async/await 的目的是在 promises 的基础上进一步简化异步的同步调用，它能对一组 Promises 执行一些操作。

```js
function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}

async function add1(x) {
    var a = resolveAfter2Seconds(20);
    var b = resolveAfter2Seconds(30);
    return x + (await a) + (await b);
}

add1(10).then(v => {
    console.log(v); // prints 60 after 2 seconds.
});

async function add2(x) {
    var a = await resolveAfter2Seconds(20);
    var b = await resolveAfter2Seconds(30);
    return x + a + b;
}

add2(10).then(v => {
    console.log(v); // prints 60 after 4 seconds.
});
```

await 操作符用于等待一个 Promise 对象。返回 Promise 对象的处理结果。如果等待的不是 Promise 对象，则返回该值本身。
Promise.all(iterable) 方法返回一个 Promise 实例

```js
var promise1 = Promise.resolve(3);
var promise2 = 42;
var promise3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "foo");
});
async function fn() {
    const result = await Promise.all([promise1, promise2, promise3]);
    alert(result); // expected output: Array [3, 42, "foo"]
}
fn();
Promise.all([promise1, promise2, promise3]).then(function(values) {
    console.log(values);
});
// expected output: Array [3, 42, "foo"]
```

#### async await 错误处理

https://cloud.tencent.com/developer/article/1470715
async await 从语法层面给人一种非常直观的方式，可以让我们避免 callback hell 与 Promise hell.

```js
async function getUserInfo() {
    const id = await request.getCurrentId();
    const info = await request.getUserInfo(id);

    return info;
}
```

但是每一步 await 的都可能出错，为了捕获这些错误，我们使用 try...catch...
Promise.reject()啥都可以作为参数

```js
async function getUserInfo(cb){
    try{
        const id = await request.getCurrentId().catch(err => Promise.reject('an error in getCurrentId))
        const info= await request.getUserInfo(id).catch(err => Promise.reject(()=>{
            anotherErrorHandler()
        }))
    }catch(err){
        if (typeof err === 'function'){
            err()
        } else {
            errorHandler(err)
        }
    }
}
```

### Object.create ( O [, Properties] )

The create function creates a new object with a specified prototype. When the create function is called, the following steps are taken:

If Type(O) is not Object or Null throw a TypeError exception.
Let obj be the result of creating a new object **as if by the expression new Object()** where Object is the standard built-in constructor with that name
Set the \[[Prototype]] internal property of obj to O.
If the argument Properties is present and not undefined, add own properties to obj as if by calling the standard built-in function Object.defineProperties with arguments obj and Properties.
Return obj.

## bind

### bind 与函数柯里化

```js
function bind(fun, context) {
    return function() {
        return fn.apply(context, arguments);
    };
}
```

### bind polyfill

```js
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError(
                "Function.prototype.bind - what is trying to be bound is not callable"
            );
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                //估计是为了实现 `new funcA.bind(thisArg, args)`
                return fToBind.apply(
                    this instanceof fNOP ? this : oThis,
                    // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };

        // 维护原型关系
        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}
```

2019.11.30 自测：

在不能用展开运算符展开参数的时候，要用 Array.prototype.slice.call(arguments)

**剩余参数语法允许我们将一个不定数量的参数表示为一个数组。**

```js
Function.prototype.myBind = function(thisObj, ...args) {
    let fn = this; //如果上一行用的是箭头函数，运行起来这里的this是window
    return function() {
        //如果这里是箭头函数，是没有arguments的
        let _args = args.concat(...arguments);
        fn.apply(thisObj, _args);
    };
};

function fn() {
    console.log(...arguments);
}
var newBindFn = fn.myBind(null, "a");
newBindFn(1, "b");
```

> Function.prototype.bind (thisArg [, arg1 [, arg2, …]])
> The bind method takes one or more arguments, thisArg and (optionally) arg1, arg2, etc, and returns a new function object by performing the following steps:

Let Target be the this value.

If IsCallable(Target) is false, throw a TypeError exception.
Let A be a new (possibly empty) internal list of all of the argument values provided after thisArg (arg1, arg2 etc), in order.

Let F be a new native ECMAScript object .

Set all the internal methods, except for [[Get]], of F as specified in 8.12.

Set the [[Get]] internal property of F as specified in 15.3.5.4.
Set the [[TargetFunction]] internal property of F to Target.
Set the [[BoundThis]] internal property of F to the value of thisArg.
Set the [[BoundArgs]] internal property of F to A.
Set the [[Class]] internal property of F to "Function".
Set the [[Prototype]] internal property of F to the standard built-in Function prototype object as specified in 15.3.3.1.
Set the [[Call]] internal property of F as described in 15.3.4.5.1.
Set the [[Construct]] internal property of F as described in 15.3.4.5.2.
Set the [[HasInstance]] internal property of F as described in 15.3.4.5.3.
If the [[Class]] internal property of Target is "Function", then
Let L be the length property of Target minus the length of A.
Set the length own property of F to either 0 or L, whichever is larger.
Else set the length own property of F to 0.

Set the attributes of the length own property of F to the values specified in 15.3.5.1.

Set the [[Extensible]] internal property of F to true.

Let thrower be the [[ThrowTypeError]] function Object (13.2.3).

Call the [[DefineOwnProperty]] internal method of F with arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false}, and false.

Call the [[DefineOwnProperty]] internal method of F with arguments "arguments", PropertyDescriptor {[[Get]]: thrower, [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false}, and false.

Return F.

The length property of the bind method is 1.

**NOTE Function objects created using Function.prototype.bind do not have a prototype property** or the [[Code]], [[FormalParameters]], and [[Scope]] internal properties.

## ajax

### 原生实现 ajax

http://www.cnblogs.com/Webcom/p/3415295.html

这里也得手敲，有些变态考官考贼细致

```js
function Ajax(type, url, data, success, failed) {
    // 创建ajax对象
    let xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        //为了兼容IE6
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let type = type.toUpperCase();
    // 用于清除缓存
    let random = Math.random();

    // 转数据，很关键，会考
    if (typeof data == "object") {
        let str = "";
        for (let key in data) {
            //这里可能要用到encodeUrlComponent
            str += key + "=" + data[key] + "&";
        }
        data = str.replace(/&$/, "");
    }

    //xhrReq.open(method,url,async,user,password)
    if (type == "GET") {
        if (data) {
            xhr.open("GET", url + "?" + data, true);
        } else {
            xhr.open("GET", url + "?t=" + random, true);
        }
        xhr.send();
    } else if (type == "POST") {
        xhr.open("POST", url, true);
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xhr.send(data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                success(xhr.responseText);
            } else {
                if (failed) {
                    failed(xhr.status);
                }
            }
        }
    };
}

// 测试调用
var sendData = { name: "asher", sex: "male" };
Ajax(
    "get",
    "data/data.html",
    sendData,
    function(data) {
        console.log(data);
    },
    function(error) {
        console.log(error);
    }
);
```

### XMLHttpRequest 通用属性和方法

XMLHttpRequest 是一个 API，它为客户端提供了在客户端和服务器之间传输数据的功能

1.readyState:表示请求状态的整数，取值：

UNSENT（0）：对象已创建
OPENED（1）：open()成功调用，在这个状态下，可以为 xhr 设置请求头，或者使用 send()发送请求
HEADERS_RECEIVED(2)：所有重定向已经自动完成访问，并且最终响应的 HTTP 头已经收到
LOADING(3)：响应体正在接收
DONE(4)：数据传输完成或者传输产生错误

onreadystatechange：readyState 改变时调用的函数

status：服务器返回的 HTTP 状态码（如，200， 404）

statusText:服务器返回的 HTTP 状态信息（如，OK，No Content）

responseText:作为字符串形式的来自服务器的完整响应

responseXML: Document 对象，表示服务器的响应解析成的 XML 文档

abort():取消异步 HTTP 请求

getAllResponseHeaders(): 返回一个字符串，包含响应中服务器发送的全部 HTTP 报头。每个报头都是一个用冒号分隔开的名/值对，并且使用一个回车/换行来分隔报头行

getResponseHeader(headerName):返回 headName 对应的报头值

open(method, url, asynchronous [, user, password]):初始化准备发送到服务器上的请求。method 是 HTTP 方法，不区分大小写；url 是请求发送的相对或绝对 URL；asynchronous 表示请求是否异步；user 和 password 提供身份验证

setRequestHeader(name, value):设置 HTTP 报头

send(body):对服务器请求进行初始化。参数 body 包含请求的主体部分，对于 POST 请求为键值对字符串；对于 GET 请求，为 null

### POST请求的编码类型

假设表单字段为：
foo=bar
baz=The first line.
The second line
1. application/x-www-form-urlencoded(默认)
```
Content-Type: application/x-www-form-urlencoded

foo=bar&baz=The+first+line.%0D%0AThe+second+line.%0D%0A
```
2. text/plain
```
Content-Type: text/plain

foo=bar
baz=The first line.
The second line.
```
3. multipart/form-data
```
Content-Type: multipart/form-data; boundary=---------------------------314911788813839

-----------------------------314911788813839
Content-Disposition: form-data; name="foo"

bar
-----------------------------314911788813839
Content-Disposition: form-data; name="baz"

The first line.
The second line.

-----------------------------314911788813839--
```

## 采用 strict 模式的主要好处:

a.使得 debugging 更容易：在一些被忽略或者潜在的错误会产生 error 或者 exceptions，会很快的在你的代码中显示警告，引导你很快的找到对应的源码。

b.阻止出现意外的全局变量：如果不是在 strict 模式里，那么赋值给一个没有声明的变量时，会自动的创建一个同名的全局变量，这是 JavaScript 中最常见的错误之一。在 strict 模式里，会尝试抛出一个 error.

c.强制排除 this 错误：在非 strict 模式里，this 引用为 null 或者 undefined 时，会自动强制指向全局，这会导致各种错误的引用。在 strict 模式里，this 值为 null 或者 undefined 将会抛出 error.

d.不允许重名的属性名或者参数名.在 strict 模式里，如果定义了如：var object={foo:’bar’,foo:’baz’};或者定义一个重名参数的函数，如:function foo(val1,val2,val1){}.会产生一个 error,而这个 bug 几乎一定会产生，但你可能浪费大量的时间才能找到。

e.使 eval()更加安全。在 strict 模式和非 strict 模式里，eval()存在很多不同。在 strict 模式里，变量和函数在 eval()中声明，但语句不在内部块创建，但是在非 strict 模式里，语句也会在内部块里创建，这也是常见的源码问题。

f.不正确使用 delete 会抛出 error:delete 操作（用于从 object 中删除一个属性）不能用于没有配置的属性，在非 strict 模式的代码里删除一个没有配置的属性会失败，但不会有提示，在 strict 模式里，则会抛出 error。

## 为什么扩展 JavaScript 内置对象不是好的做法？

因为你不知道哪一天浏览器或 javascript 本身就会实现这个方法，而且和你扩展的实现有不一致的表现。到时候你的 javascript 代码可能已经在无数个页面中执行了数年，而浏览器的实现导致所有使用扩展原型的代码都崩溃了。

##o 请解释为什么接下来这段代码不是 IIFE (立即调用的函数表达式)：function foo(){ }();.要做哪些改动使它变成 IIFE?

**以 function 关键字开头的语句会被解析为函数声明，而函数声明是不允许直接运行的。**
只有当解析器把这句话解析为函数表达式，才能够直接运行，你可以加上括号使他变成 function expression。



## 架构

> 前端渲染后端渲染及优缺点
> https://github.com/camsong/blog/issues/8

「后端渲染」指传统的 ASP、Java 或 PHP 的渲染机制；「前端渲染」指使用 JS 来渲染页面大部分内容，代表是现在流行的 SPA 单页面应用；「同构渲染」指前后端共用 JS，首次渲染时使用 Node.js 来直出 HTML。一般来说同构渲染是介于前后端中的共有部分

前端渲染的优势

局部刷新。无需每次都进行完整页面请求
懒加载。如在页面初始时只加载可视区域内的数据，滚动后 rp 加载其它数据，可以通过 react-lazyload 实现
富交互。使用 JS 实现各种酷炫效果
节约服务器成本。省电省钱，JS 支持 CDN 部署，且部署极其简单，只需要服务器支持静态文件即可
天生的关注分离设计。服务器来访问数据库提供接口，JS 只关注数据获取和展现
JS 一次学习，到处使用。可以用来开发 Web、Serve、Mobile、Desktop 类型的应用

后端渲染的优势

服务端渲染不需要先下载一堆 js 和 css 后才能看到页面（首屏性能）
SEO
服务端渲染不用关心浏览器兼容性问题（随着浏览器发展，这个优点逐渐消失）
对于电量不给力的手机或平板，减少在客户端的电量消耗很重要
以上服务端优势其实只有首屏性能和 SEO 两点比较突出。但现在这两点也慢慢变得微不足道了。React 这类支持同构的框架已经能解决这个问题，尤其是 Next.js 让同构开发变得非常容易。还有静态站点的渲染，但这类应用本身复杂度低，很多前端框架已经能完全囊括。

## 词法作用域

https://github.com/mqyqingfeng/Blog/issues/3

> 作用域
> 作用域是指程序源代码中定义变量的区域。

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。

> 静态作用域与动态作用域

词法作用域，函数的作用域在函数定义的时候就决定了。

而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

JavaScript 采用的是词法作用域
但是，它的 eval()、with、this 机制某种程度上很像动态作用域，使用上要特别注意。

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar(); //1
```

https://www.zhihu.com/question/20032419/answer/49183240

动态作用域就是整个程序运行的时候只有一个 env。什么是 env 呢？env 就是一组 binding。binding 是什么呢？binding 就是从 identifer 到 value 的映射。dynamic scope 在每次函数求值的时候都会在这唯一的一个 env 里查询或更新。而 static scope 是每次函数求值的时候都创建一个新的 env，包含了函数定义时候的所能访问到的各种 binding。这个新的 env 连同那个函数一起，俗称闭包 Closure。

## 作用域 作用域链

https://github.com/mqyqingfeng/Blog/issues/6

-   作用域
    在 JavaScript 中, 作用域为可访问变量，对象，函数的集合。

-   作用域链

当 JavaScript 代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：

变量对象(Variable object，VO)
作用域链(Scope chain)
this

**当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链**。

**函数的作用域在函数定义的时候就决定了。**

## VO AO

https://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html

如果变量与执行上下文相关，那变量自己应该知道它的数据存储在哪里，并且知道如何访问。这种机制称为变量对象(variable object)。

变量对象(缩写为 VO)是一个与执行上下文相关的特殊对象，它存储着在上下文中声明的以下内容：
变量 (var, 变量声明);
函数声明 (FunctionDeclaration, 缩写为 FD);
函数的形参

抽象变量对象 VO (变量初始化过程的一般行为)
║
╠══> 全局上下文变量对象 GlobalContextVO
║ (VO === this === global)
║
╚══> 函数上下文变量对象 FunctionContextVO
(VO === AO, 并且添加了<arguments>和<formal parameters>)

在函数执行上下文中，VO 是不能直接访问的，此时由活动对象(activation object,缩写为 AO)扮演 VO 的角色。

VO(functionContext) === AO;
活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性的值是 Arguments 对象：

AO = {
arguments: \<ArgO>
};
Arguments 对象是活动对象的一个属性，它包括如下属性：

callee — 指向当前函数的引用
length — 真正传递的参数个数
properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes 内部元素的个数等于 arguments.length. properties-indexes 的值和实际传递进来的参数之间是共享的

### 处理上下文代码的 2 个阶段

现在我们终于到了本文的核心点了。执行上下文的代码被分成两个基本的阶段来处理：
进入执行上下文
执行代码
变量对象的修改变化与这两个阶段紧密相关。

注：这 2 个阶段的处理是一般行为，和上下文的类型无关（也就是说，在全局上下文和函数上下文中的表现是一样的）。

#### 进入执行上下文

当进入执行上下文(代码执行之前)时，VO 里已经包含了下列属性(前面已经说了)：

-   函数的所有形参(如果我们是在函数执行上下文中)

由名称和对应值组成的一个变量对象的属性被创建；没有传递对应参数的话，那么由名称和 undefined 值组成的一种变量对象的属性也将被创建。

-   所有函数声明(FunctionDeclaration, FD)

由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建；如果变量对象已经存在相同名称的属性，则完全替换这个属性。

-   所有变量声明(var, VariableDeclaration)

由名称和对应值（undefined）组成一个变量对象的属性被创建；如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。

#### 代码执行

例题：

```js
var a = 1;
function b(a) {
    console.log(a);
    function a() {}
    var a = 2;
}
b(3); //ƒ a() { }
```

## 防抖节流

https://www.jianshu.com/p/c8b86b09daf0

```js
//防抖
function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this; //在dom元素上绑定事件时，这里的this是dom元素
        let args = arguments;

        //调用clearTimeout之后，timeout还是有数值的
        if (timeout) clearTimeout(timeout);

        let callNow=!timeout
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
        if(callNow) func.apply(context,args)
    };
}

//节流
// 时间戳 这个思路好想些
function throttle(func, wait) {
    let previous = Date.now(); //要用Date.now()返回数字，new Date()返回时间对象，两个时间对象相减也能得到数字
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    };
}

//定时器
function throttle(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        }
    };
}
```

## 函数重载

什么是函数重载？
https://www.jianshu.com/p/9d2da144f01e
首先想声明下，什么是函数重载，javascript 中不存在函数重载的概念，(其实是个伪命题)但一个函数通过不同参数列表（arguments）来实现各个功能，我们都叫函数重载，这就是牛逼闪闪的 JavaScript 函数重载。

实现：

1.根据 arguments 对象的 length 值进行判断

https://www.cnblogs.com/yugege/p/5539020.html

```js
function overLoading() {
    // 根据arguments.length，对不同的值进行不同的操作
    switch (arguments.length) {
        case 0 /*操作1的代码写在这里*/:
            break;
        case 1 /*操作2的代码写在这里*/:
            break;
        case 2: /*操作3的代码写在这里*/ //后面还有很多的case......
    }
}
```

2.利用闭包
https://blog.fundebug.com/2017/07/24/javascript_metho_overloading/

addMethod 函数的秘诀之一在于 fn.length。或许很多人并不清楚，**所有函数都有一个 length 属性，它的值等于定义函数时的参数个数。**

函数重载可以通过 if…else 或者 switch 实现，这就不去管它了。另外的方式难点在于，users.find 事实上只能绑定一个函数，那它为何可以处理 3 种不同的输入呢？它不可能同时绑定 3 个函数 find0,find1 与 find2 啊！这里的关键在于 old 属性。

由 addMethod 函数的调用顺序可知，users.find 最终绑定的是 find2 函数。然而，在绑定 find2 时，old 为 find1；同理，绑定 find1 时，old 为 find0。3 个函数 find0,find1 与 find2 就这样通过闭包链接起来了。

根据 addMethod 的逻辑，当 fn.length 与 arguments.length 不匹配时，就会去调用 old，直到匹配为止。

缺陷:

重载只能处理输入参数个数不同的情况，它不能区分参数的类型、名称等其他要素。(ECMAScript 4 计划支持这一特性，称作 Multimethods，然而该版本已被放弃)。
重载过的函数将会有一些额外的负载，对于性能要求比较高的应用，使用这个方法要慎重考虑。

```js
function addMethod(object, name, fn) {
    var old = object[name];
    object[name] = function() {
        if (fn.length == arguments.length) return fn.apply(this, arguments);
        else if (typeof old == "function") return old.apply(this, arguments);
    };
}

// 不传参数时，返回所有name
function find0() {
    return this.names;
}

// 传一个参数时，返回firstName匹配的name
function find1(firstName) {
    var result = [];
    for (var i = 0; i < this.names.length; i++) {
        if (this.names[i].indexOf(firstName) === 0) {
            result.push(this.names[i]);
        }
    }
    return result;
}

// 传两个参数时，返回firstName和lastName都匹配的name
function find2(firstName, lastName) {
    var result = [];
    for (var i = 0; i < this.names.length; i++) {
        if (this.names[i] === firstName + " " + lastName) {
            result.push(this.names[i]);
        }
    }
    return result;
}

function Users() {
    addMethod(Users.prototype, "find", find0);
    addMethod(Users.prototype, "find", find1);
    addMethod(Users.prototype, "find", find2);
}

var users = new Users();
users.names = ["John Resig", "John Russell", "Dean Tom"];

console.log(users.find()); // 输出[ 'John Resig', 'John Russell', 'Dean Tom' ]
console.log(users.find("John")); // 输出[ 'John Resig', 'John Russell' ]
console.log(users.find("John", "Resig")); // 输出[ 'John Resig' ]
console.log(users.find("John", "E", "Resig")); // 输出undefined
```

## 下面的代码，如果队列太长会导致栈溢出，怎样解决这个问题并且依然保持循环部分。

```js
var list = readHugeList();

var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...

        nextListItem();
    }
};
```

答：为了避免栈溢出，循环部分改为如下代码：

```js
var list = readHugeList();

var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...

        setTimeout(nextListItem, 0);
    }
};
```

栈溢出主要是因为循环事件，而不是栈。当执行 nextListItem 时，如果 item 不是 null,在 timeout 函数中的 nextListItem 会推入到事件队列中。当事件空闲，则会执行 nextListItem,因此，这种方法从开始到结束没有直接进行循环调用，可以不用考虑循环次数。

## 尾递归

http://es6.ruanyifeng.com/#docs/function
https://baike.baidu.com/item/尾递归/554682?fr=aladdin

函数调用自身，称为递归。
当递归调用是整个函数体中最后执行的语句且它的返回值不属于表达式的一部分时，这个递归调用就是尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。

但对于尾递归没有必要去保存任何局部变量。当编译器检测到一个函数调用是尾递归的时候，它就覆盖当前的活动记录而不是在栈中去创建一个新的，这样所使用的栈空间就大大缩减了，这使得实际的运行效率会变得更高。

```js
function factorial(n) {
    if (n === 1) return 1;
    return n * factorial(n - 1);
}

factorial(5); // 120
```

上面代码是一个阶乘函数，计算 n 的阶乘，最多需要保存 n 个调用记录，复杂度 O(n) 。

如果改写成尾递归，只保留一个调用记录，复杂度 O(1) 。

```js
function factorial(n, total) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
}

factorial(5, 1); // 120 ==> fac(4,5)==>fac(3,20)==>fac(2,60)
```

还有一个比较著名的例子，就是计算 Fibonacci 数列，也能充分说明尾递归优化的重要性。

非尾递归的 Fibonacci 数列实现如下。

```js
function Fibonacci(n) {
    if (n <= 1) {
        return 1;
    }

    return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10); // 89
Fibonacci(100); // 堆栈溢出
Fibonacci(500); // 堆栈溢出
```

Fi(0)==>1
Fi(1)==>1
Fi(2)==>2
Fi(3)==>3

尾递归优化过的 Fibonacci 数列实现如下。

```js
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
    if (n <= 1) {
        return ac2;
    }

    return Fibonacci2(n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100); // 573147844013817200000
Fibonacci2(1000); // 7.0330367711422765e+208
Fibonacci2(10000); // Infinity
```

Fi(0)==>1
Fi(1)==>1
Fi(2)==>Fi(2,1,1)==>Fi(1,1,2)==>2
Fi(3)==>Fi(3,1,1)==>Fi(2,1,2)==>Fi(1,2,3)==>3

由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存。
