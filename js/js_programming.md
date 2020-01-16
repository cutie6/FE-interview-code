# js代码实现

## element-ui借鉴
### 自适应高度的列头固定的表格
目前看着是为fix的部分也建立了\<table>,把除固定内容外的其他td隐藏，主体表格把fix部分的td隐藏

### 防止遮罩层下边滑动是怎么做的
https://segmentfault.com/q/1010000003075681
弹窗显示时让html元素的overflow设置成hidden,弹窗关闭时再恢复成auto

## 其他

### 实现jq的one()方法
https://www.php.cn/js-tutorial-370476.html

```js
function once(dom,event,cb){
    let handle=function(){
        cb()
        dom.removeEventListener(event,cb)
    }
    dom.addEventListener(event,handle)
}
```


### 原生 js 如何实现 jquery 的 closest()方法

element.matches(selector)主要是用来判断当前DOM节点能否完全匹配对应的CSS选择器规则；如果匹配成功，返回true，反之则返回false
```js
function closest(el, selector) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}
```


### 请用原生js实现一个函数,给页面制定的任意一个元素添加一个透明遮罩(透明度可变,默认0.2),使这个区域点击无效,要求兼容IE8+及各主流浏览器

```html
<style>
#target {
    width: 200px;
    height: 300px;
    margin: 40px;
    background-color: tomato;
}
</style>

<div id="target"></div>

<script>
function addMask(elem, opacity) {
    opacity = opacity || 0.2;

    var rect = elem.getBoundingClientRect();
    var style = getComputedStyle(elem, null);

    var mask = document.createElement('div');
    mask.style.position = 'absolute';
    var marginLeft = parseFloat(style.marginLeft);
    mask.style.left = (elem.offsetLeft - marginLeft) + 'px';
    var marginTop = parseFloat(style.marginTop);
    mask.style.top = (elem.offsetTop - marginTop) + 'px';
    mask.style.zIndex = 9999;
    mask.style.opacity = '' + opacity;
    mask.style.backgroundColor = '#000';

    mask.style.width = (parseFloat(style.marginLeft) +
        parseFloat(style.marginRight) + rect.width) + 'px';
    mask.style.height = (parseFloat(style.marginTop) +
        parseFloat(style.marginBottom) + rect.height) + 'px';

    elem.parentNode.appendChild(mask);
}

var target = document.getElementById('target');
addMask(target);

target.addEventListener('click', function () {
    console.log('click');
}, false);
</script>
```

```js
// 在单个语句中设置多个样式
elt.style.cssText = "color: blue; border: 1px solid black"; 

// 在单个语句中设置多个样式
elt.setAttribute("style", "color:red; border: 1px solid blue;");

// 直接设置样式属性
elt.style.color = "blue"; 

// 间接设置样式属性
let st = elt.style; 
st.color = "blue";
```

### 下面这段代码想要循环延时输出结果0 1 2 3 4,请问输出结果是否正确,如果不正确,请说明为什么,并修改循环内的代码使其输出正确结果

```js
for (var i = 0; i < 5; ++i) {
  setTimeout(function () {
    console.log(i + ' ');
  }, 100);
}
```

不能输出正确结果，因为循环中setTimeout接受的参数函数通过闭包访问变量i。javascript运行环境为单线程，setTimeout注册的函数需要等待线程空闲才能执行，此时for循环已经结束，i值为5.五个定时输出都是5 
修改方法：将setTimeout放在函数立即调用表达式中，将i值作为参数传递给包裹函数，创建新闭包

```js
for (var i = 0; i < 5; ++i) {
  (function (i) {
    setTimeout(function () {
      console.log(i + ' ');
    }, 100);
  }(i));
}
```

### 现有一个Page类,其原型对象上有许多以post开头的方法(如postMsg);另有一拦截函数chekc,只返回ture或false.请设计一个函数,该函数应批量改造原Page的postXXX方法,在保留其原有功能的同时,为每个postXXX方法增加拦截验证功能,当chekc返回true时继续执行原postXXX方法,返回false时不再执行原postXXX方法

```js
function Page() {}

Page.prototype = {
  constructor: Page,

  postA: function (a) {
    console.log('a:' + a);
  },
  postB: function (b) {
    console.log('b:' + b);
  },
  postC: function (c) {
    console.log('c:' + c);
  },
  check: function () {
    return Math.random() > 0.5;
  }
}

function checkfy(obj) {
  for (var key in obj) {
    if (key.indexOf('post') === 0 && typeof obj[key] === 'function') {
      (function (key) {
        var fn = obj[key];
        obj[key] = function () {
          if (obj.check()) {
            fn.apply(obj, arguments);
          }
        };
      }(key));
    }
  }
} // end checkfy()

checkfy(Page.prototype);

var obj = new Page();

obj.postA('checkfy');
obj.postB('checkfy');
obj.postC('checkfy');
```

### 深度克隆

```js
function deepClone(obj) {
    var _toString = Object.prototype.toString;

    // null, undefined, non-object, function
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    // DOM Node
    if (obj.nodeType && 'cloneNode' in obj) {
        return obj.cloneNode(true);
    }

    // Date
    if (_toString.call(obj) === '[object Date]') {
        return new Date(obj.getTime());
    }

    // RegExp
    if (_toString.call(obj) === '[object RegExp]') {
        var flags = [];
        if (obj.global) { flags.push('g'); }
        if (obj.multiline) { flags.push('m'); }
        if (obj.ignoreCase) { flags.push('i'); }

        return new RegExp(obj.source, flags.join(''));
    }

    var result = Array.isArray(obj) ? [] :
        obj.constructor ? new obj.constructor() : {};

    for (var key in obj ) {
        result[key] = deepClone(obj[key]);
    }

    return result;
}

function A() {
    this.a = a;
}

var a = {
    name: 'qiu',
    birth: new Date(),
    pattern: /qiu/gim,
    container: document.body,
    hobbys: ['book', new Date(), /aaa/gim, 111]
};

var c = new A();
var b = deepClone(c);
console.log(c.a === b.a); //false 
console.log(c, b);
```

### 网页中实现一个计算当年还剩多少时间的倒数计时程序,要求网页上实时动态显示"××年还剩××天××时××分××秒"

```js
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>TEst</title>
</head>
<body>

    <span id="target"></span>


<script type="text/javascript">
    // 为了简化。每月默认30天
    function getTimeString() {
        var start = new Date();
        var end = new Date(start.getFullYear() + 1, 0, 1);
        var elapse = Math.floor((end - start) / 1000);

        var seconds = elapse % 60 ;
        var minutes = Math.floor(elapse / 60) % 60;
        var hours = Math.floor(elapse / (60 * 60)) % 24;
        var days = Math.floor(elapse / (60 * 60 * 24)) % 30;
        var months = Math.floor(elapse / (60 * 60 * 24 * 30)) % 12;
        var years = Math.floor(elapse / (60 * 60 * 24 * 30 * 12));

        return start.getFullYear() + '年还剩' + years + '年' + months + '月' + days + '日'
            + hours + '小时' + minutes + '分' + seconds + '秒';
    }

    function domText(elem, text) {
        if (text == undefined) {

            if (elem.textContent) {
                return elem.textContent;
            } else if (elem.innerText) {
                return elem.innerText;
            }
        } else {
            if (elem.textContent) {
                elem.textContent = text;
            } else if (elem.innerText) {
                elem.innerText = text;
            } else {
                elem.innerHTML = text;
            }
        }
    }

    var target = document.getElementById('target');

    setInterval(function () {
        domText(target, getTimeString());
    }, 1000)
</script>

</body>
</html>
```

> 完成一个函数,接受数组作为参数,数组元素为整数或者数组,数组元素包含整数或数组,函数返回扁平化后的数组
如：[1, [2, [ [3, 4], 5], 6]] => [1, 2, 3, 4, 5, 6]

```js
    var data = [1, [2, [[3, 4], 5], 6]];

        function flat0(data,init) {
            var i, d, len, result = init|| [];
            for (i = 0, len = data.length; i < len; ++i) {
                d = data[i];
                if (typeof d === 'number') {
                    // console.log(d)
                    result.push(d);
                } else {
                    flat0(d, result);
                }
            }
            // console.log(result)
            return result
        }

        console.log(flat0(data));
```

> 如何判断一个对象是否为函数

```js
/**
 * 判断对象是否为函数，如果当前运行环境对可调用对象（如正则表达式）
 * 的typeof返回'function'，采用通用方法，否则采用优化方法
 *
 * @param {Any} arg 需要检测是否为函数的对象
 * @return {boolean} 如果参数是函数，返回true，否则false
 */
function isFunction(arg) {
    if (arg) {
        if (typeof (/./) !== 'function') {
            return typeof arg === 'function';
        } else {
            return Object.prototype.toString.call(arg) === '[object Function]';
        }
    } // end if
    return false;
}
```

> 判断对象是否为空对象
https://www.jianshu.com/p/972d0f277d45

1.最常见的思路，for...in...遍历属性

```js
for (var i in obj) { // 如果不为空，则会执行到这一步，返回true
    return true
}
return false // 如果为空,返回false
```

2.通过JSON自带的stringify()方法来判断:

JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。

```
if (JSON.stringify(data) === '{}') {
    return false // 如果为空,返回false
}
return true // 如果不为空，则会执行到这一步，返回true
```

3. ES6新增的方法Object.keys():

```js
if (Object.keys(object).length === 0) {
    return false // 如果为空,返回false
}
return true // 如果不为空，则会执行到这一步，返回true
```


作者：言墨儿
链接：https://www.jianshu.com/p/972d0f277d45
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

> 编写一个函数接受url中query string为参数,返回解析后的Object,query string使用application/x-www-form-urlencoded编码

```js
/**
 * 解析query string转换为对象，一个key有多个值时生成数组
 *
 * @param {String} query 需要解析的query字符串，开头可以是?，
 * 按照application/x-www-form-urlencoded编码
 * @return {Object} 参数解析后的对象
 */
function parseQuery(query) {
    var result = {};

    // 如果不是字符串返回空对象
    if (typeof query !== 'string') {
        return result;
    }

    // 去掉字符串开头可能带的?
    if (query.charAt(0) === '?') {
        query = query.substring(1);
    }

    var pairs = query.split('&');
    var pair;
    var key, value;
    var i, len;

    for (i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i].split('=');
        // application/x-www-form-urlencoded编码会将' '转换为+
        key = decodeURIComponent(pair[0]).replace(/\+/g, ' ');
        value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');

        // 如果是新key，直接添加
        if (!(key in result)) {
            result[key] = value;
        }
        // 如果key已经出现一次以上，直接向数组添加value
        else if (isArray(result[key])) {
            result[key].push(value);
        }
        // key第二次出现，将结果改为数组
        else {
            var arr = [result[key]];
            arr.push(value);
            result[key] = arr;
        } // end if-else
    } // end for

    return result;
}

function isArray(arg) {
    if (arg && typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
}
/**
console.log(parseQuery('sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8'));
 */
```

> 解析一个完整的url,返回Object包含域与window.location相同

```js
/**
 * 解析一个url并生成window.location对象中包含的域
 * location:
 * {
 *      href: '包含完整的url',
 *      origin: '包含协议到pathname之前的内容',
 *      protocol: 'url使用的协议，包含末尾的:',
 *      username: '用户名', // 暂时不支持
 *      password: '密码',  // 暂时不支持
 *      host: '完整主机名，包含:和端口',
 *      hostname: '主机名，不包含端口'
 *      port: '端口号',
 *      pathname: '服务器上访问资源的路径/开头',
 *      search: 'query string，?开头',
 *      hash: '#开头的fragment identifier'
 * }
 *
 * @param {string} url 需要解析的url
 * @return {Object} 包含url信息的对象
 */
function parseUrl(url) {
    var result = {};
    var keys = ['href', 'origin', 'protocol', 'host',
                'hostname', 'port', 'pathname', 'search', 'hash'];
    var i, len;
    var regexp = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

    var match = regexp.exec(url);//返回的数组将完全匹配成功的文本作为第一项，将正则括号里匹配成功的作为数组填充到后面。

    if (match) {
        for (i = keys.length - 1; i >= 0; --i) {
            result[keys[i]] = match[i] ? match[i] : '';
        }
    }

    return result;
}
```

> 完成函数getViewportSize返回指定窗口的视口尺寸

```js
/**
* 查询指定窗口的视口尺寸，如果不指定窗口，查询当前窗口尺寸
**/
function getViewportSize(w) {
    w = w || window;

    // IE9及标准浏览器中可使用此标准方法
    if ('innerHeight' in w) {
        return {
            width: w.innerWidth,
            height: w.innerHeight
        };
    }

    var d = w.document;
    // IE 8及以下浏览器在标准模式下
    if (document.compatMode === 'CSS1Compat') {
        return {
            width: d.documentElement.clientWidth,
            height: d.documentElement.clientHeight
        };
    }

    // IE8及以下浏览器在怪癖模式下
    return {
        width: d.body.clientWidth,
        height: d.body.clientHeight
    };
}
```

> 完成函数getScrollOffset返回窗口滚动条偏移量
```js
/**
 * 获取指定window中滚动条的偏移量，如未指定则获取当前window
 * 滚动条偏移量
 *
 * @param {window} w 需要获取滚动条偏移量的窗口
 * @return {Object} obj.x为水平滚动条偏移量,obj.y为竖直滚动条偏移量
 */
function getScrollOffset(w) {
    w =  w || window;
    // 如果是标准浏览器
    if (w.pageXOffset != null) {
        return {
            x: w.pageXOffset,
            y: w.pageYOffset
        };
    }

    // 老版本IE，根据兼容性不同访问不同元素
    var d = w.document;
    if (d.compatMode === 'CSS1Compat') {
        return {
            x: d.documentElement.scrollLeft,
            y: d.documentElement.scrollTop
        }
    }

    return {
        x: d.body.scrollLeft,
        y: d.body.scrollTop
    };
}
```

### 请实现一个Event类,继承自此类的对象都会拥有两个方法on,off,once和trigger
```js
function Event() {
    if (!(this instanceof Event)) {
        return new Event();
    }
    this._callbacks = {};
}
Event.prototype.on = function (type, handler) {
    this_callbacks = this._callbacks || {};
    this._callbacks[type] = this.callbacks[type] || [];
    this._callbacks[type].push(handler);

    return this;
};

Event.prototype.off = function (type, handler) {
    var list = this._callbacks[type];

    if (list) {
        for (var i = list.length; i >= 0; --i) {
            if (list[i] === handler) {
                list.splice(i, 1);
            }
        }
    }

    return this;
};

Event.prototype.trigger = function (type, data) {
    var list = this._callbacks[type];

    if (list) {
        for (var i = 0, len = list.length; i < len; ++i) {
            list[i].call(this, data);
        }
    }
};

Event.prototype.once = function (type, handler) {
    var self = this;

    function wrapper() {
        handler.apply(self, arguments);
        self.off(type, wrapper);
    }
    this.on(type, wrapper);
    return this;
};
```

### 编写一个函数将列表子元素顺序反转

```html
<ul id="target">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
</ul>

<script>
    var target = document.getElementById('target');
    var children=target.children;
    var i;
    var frag = document.createDocumentFragment();

    for (i = children.length - 1; i &gt;= 0; --i) {
        frag.appendChild(children[i]);
    }
    target.appendChild(frag);
</script>
```

### 以下函数的作用是?空白区域应该填写什么
```js
// define
(function (window) {
    function fn(str) {
        this.str = str;
    }

    fn.prototype.format = function () {
        var arg = __1__;
        return this.str.replace(__2__, function (a, b) {
            return arg[b] || '';
        });
    };

    window.fn = fn;
})(window);

// use
(function () {
    var t = new fn('<p><a href="{0}">{1}</a><span>{2}</span></p>');
    console.log(t.format('http://www.alibaba.com', 'Alibaba', 'Welcome'));
})();
```
define部分定义一个简单的模板类，使用{}作为转义标记，中间的数字表示替换目标，format实参用来替换模板内标记 横线处填：

```js
Array.prototype.slice.call(arguments, 0)
/\{\s*(\d+)\s*\}/g
```

### 现有一个字符串richText,是一段富文本,需要显示在页面上.有个要求,需要给其中只包含一个img元素的p标签增加一个叫pic的class.请编写代码实现.可以使用jQuery或KISSY.

```js
function richText(text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    var p = div.getElementsByTagName('p');
    var i=0, len=p.length;

    for (; i < len; ++i) {
        if (p[i].getElementsByTagName('img').length === 1) {
            p[i].classList.add('pic');
        }
    }

    return div.innerHTML;
}
```

### 编写一个函数实现form的序列化(即将一个表单中的键值序列化为可提交的字符串)

```html
<form id="target">
    <select name="age">
        <option value="aaa">aaa</option>
        <option value="bbb" selected>bbb</option>
    </select>
    <select name="friends" multiple>
        <option value="qiu" selected>qiu</option>
        <option value="de">de</option>
        <option value="qing" selected>qing</option>
    </select>
    <input name="name" value="qiudeqing">
    <input type="password" name="password" value="11111">
    <input type="hidden" name="salery" value="3333">
    <textarea name="description">description</textarea>
    <input type="checkbox" name="hobby" checked value="football">Football
    <input type="checkbox" name="hobby" value="basketball">Basketball
    <input type="radio" name="sex" checked value="Female">Female
    <input type="radio" name="sex" value="Male">Male
</form>


<script>

/**
 * 将一个表单元素序列化为可提交的字符串
 *
 * @param {FormElement} form 需要序列化的表单元素
 * @return {string} 表单序列化后的字符串
 */
function serializeForm(form) {
  if (!form || form.nodeName.toUpperCase() !== 'FORM') {
    return;
  }

  var result = [];

  var i, len;
  var field, fieldName, fieldType;

  for (i = 0, len = form.length; i < len; ++i) {
    field = form.elements[i];
    fieldName = field.name;
    fieldType = field.type;

    if (field.disabled || !fieldName) {
      continue;
    } // enf if

    switch (fieldType) {
      case 'text':
      case 'password':
      case 'hidden':
      case 'textarea':
        result.push(encodeURIComponent(fieldName) + '=' +
            encodeURIComponent(field.value));
        break;

      case 'radio':
      case 'checkbox':
        if (field.checked) {
          result.push(encodeURIComponent(fieldName) + '=' +
            encodeURIComponent(field.value));
        }
        break;

      case 'select-one':
      case 'select-multiple':
        for (var j = 0, jLen = field.options.length; j < jLen; ++j) {
          if (field.options[j].selected) {
            result.push(encodeURIComponent(fieldName) + '=' +
              encodeURIComponent(field.options[j].value || field.options[j].text));
          }
        } // end for
        break;

      case 'file':
      case 'submit':
        break; // 是否处理？

      default:
        break;
    } // end switch
  } // end for

    return result.join('&');
}

var form = document.getElementById('target');
console.log(serializeForm(form));
</script>
```

### 用setTimeOut实现setInterVal
[原文](https://www.jianshu.com/p/32479bdfd851)
```js
function mySetInterval(fn, millisec){
  function interval(){
    fn();
    setTimeout(interval, millisec);
  }
  setTimeout(interval, millisec)
}

```

One important case to note is that the function or code snippet cannot be executed until the thread that called setTimeout() has terminated. For example:
**调用setTimeout的线程结束后才会执行setTimeout里面的代码**
```js
function foo() {
  console.log('foo has been called');
}
setTimeout(foo, 0);
console.log('After setTimeout');
```
Will write to the console:

```
After setTimeout
foo has been called

```
This is because even though setTimeout was called with a delay of zero, it's placed on a queue and scheduled to run at the next opportunity; not immediately. Currently-executing code must complete before functions on the queue are executed, thus the resulting execution order may not be as expected.

### 自己实现个jQuery，可以传选择器进去，然后实现css()与height()方法

1.网上的

```js
 (function () {
    //暴露外部的引用
    var jQuery = window.jQuery = window.$ = function (selector) {
        return new jQuery.fn.init(selector);
    }

    //添加原型事件
    jQuery.fn = jQuery.prototype = {
        //
        init: function (selector) {
            // var element = document.getElementsByTagName(selector);
            var element = document.querySelectorAll(selector);
            Array.prototype.push.apply(this, element);
            return this;
        },
        myjQuery: "the test one",
        length: 0,
        size: function () {
            return this.length;
        }
    }

    //将init的原型引用成jQuery的原型
    jQuery.fn.init.prototype = jQuery.fn;

})();
```

2.之前自己写的
[demo](https://lujing2.github.io/FE-demo/myJquery/)

```js
var myJquery4 = function (selector) {
        //console.log(this) //window
        return new jqNodes(selector) //new会创造一个对象实例，对象实例继承自构造函数的prototype,这里是jqNodes.prototype
    }

    var jqNodes = function (selector) {
        console.log(this)
        //1.以new调用时this指向即将创建的新对象 
        //2.直接调用则指向 window
        this._items = document.querySelectorAll(selector)
        return this
    }

    var myJqueryCore = {
        //放核心方法
        css: function () {
            console.log(this) //myJquery4('li').css('color') 这样调用时是作为new出来的对象原型里的方法调用的，this指向new出来的对象
            var prop = arguments[0],
                val = arguments[1]
            if (!val) return getComputedStyle(this._items[0]).getPropertyValue(prop);

            Array.prototype.map.call(this._items, function (c) {
                return c.setAttribute('style', prop + ':' + val)
            })
            return this
        }
    }

    jqNodes.prototype = myJqueryCore //关键
```


> 写个轮播图


之前感觉比较困扰的是从最后一页到第一页如何无缝滑动。无缝滑动的关键在于在第一页前放上最后一页，在最后一页后面再放上第一页。在最后一页点击后一页时，先滑动到放置在后边的第一页，滑动完成后立刻改变父元素的left值到排列在第二个的第一页。

[demo](https://lujing2.github.io/FE-demo/carousel/)

html结构：

```html
<div id="list" style="left: -600px;">
    <div>5</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>1</div>
</div>
```

关键js:

```js
$('#list').animate({ left: newLeft }, function () {
    if (newLeft < -3000) {
        list.style.left = -600 + 'px';
    } else if (newLeft > -600) {
        list.style.left = -3000 + 'px';
    }
})
```


### 菜单高亮滚动监听

主要参考了 http://blog.csdn.net/sinrryzhang/article/details/51177774
我修改成了可以有多个固定导航的

[demo](https://lujing2.github.io/FE-demo/scrollspy/)

关键代码如下：

```js

    <script src="../jquery.min.js" type="text/javascript"></script>
    <script>
        (function ($, win, doc) {
            var scroll_highlight = function (obj) {
                return new scroll_rsilder(obj)
            }
            var scroll_rsilder = function (obj) {
                this.init(obj)
            }
            scroll_rsilder.prototype = {
                win_evet: function () {
                    var _this = this._this
                    $(win).on("scroll", function () {
                        var scrollTop = $(this).scrollTop();
                        _this.ele_evet(scrollTop);

                    })
                },
                ele_evet: function (scrollTop) {
                    var _this = this._this
                    $(this.cloumn).each(function (index) {
                        var offsetTop = $(this).offset().top;
                        var xd = parseInt(offsetTop - scrollTop);
                       
                        //console.log(index, offsetTop, scrollTop, xd, _this)

                        if (xd < _this.spacing) {
                            $(_this.silder).eq(index).addClass(_this.curr).siblings().removeClass();
                        }
                    })
                },
                init: function (obj) {
                    this._this = this,
                        this.cloumn = obj.cloumn,
                        this.silder = obj.silder,
                        this.spacing = obj.spacing || 100,
                        this.curr = obj.curr || "curr";
                    if (!this.cloumn) return;
                    this.win_evet();
                }

            }
            win.scroll_highlight = scroll_highlight;
        })(jQuery, window, document)
    </script>
    <script>
        $(function () {
            scroll_highlight({
                cloumn: "#main1 .m-cloumn",
                silder: "#menu1 a",
                spacing: 80,
                curr: "curr"
            })

            scroll_highlight({
                cloumn: "#main2 .m-cloumn",
                silder: "#menu2 a",
                spacing: 80,
                curr: "curr"
            })

        })
    </script>

```

> 编写一个JavaScript函数，输入指定类型的选择器(仅需支持id，class，tagName三种简单CSS选择器，无需兼容组合选择器)可以返回匹配的DOM节点，需考虑浏览器兼容性和性能。

```js
var query = function(selector) {
    var reg = /^(#)?(\.)?(\w+)$/img;
    var regResult = reg.exec(selector);
    var result = [];
    //如果是id选择器
    if(regResult[1]) {
        if(regResult[3]) {
            if(typeof document.querySelector === "function") {
                result.push(document.querySelector(regResult[3]));
            }
            else {
                result.push(document.getElementById(regResult[3]));
            }
        }
    }
    //如果是class选择器
    else if(regResult[2]) {
        if(regResult[3]) {
            if(typeof document.getElementsByClassName === 'function') {
                var doms = document.getElementsByClassName(regResult[3]);
                if(doms) {
                    result = converToArray(doms);
                }
            }
            //如果不支持getElementsByClassName函数
            else {
                var allDoms = document.getElementsByTagName("*") ;
                for(var i = 0, len = allDoms.length; i < len; i++) {
                    if(allDoms[i].className.search(new RegExp(regResult[2])) > -1) {
                        result.push(allDoms[i]);
                    }
                }
            }
        }
    }
    //如果是标签选择器
    else if(regResult[3]) {
        var doms = document.getElementsByTagName(regResult[3].toLowerCase());
        if(doms) {
            result = converToArray(doms);
        }
    }
    return result;
}

function converToArray(nodes){
        var array = null;         
        try{        
            array = Array.prototype.slice.call(nodes,0);//针对非IE浏览器         
        }catch(ex){
            array = new Array();         
            for( var i = 0 ,len = nodes.length; i < len ; i++ ) { 
                array.push(nodes[i])         
            }         
        }      
        return array;
}
```    

### 实现一个函数clone，可以对JavaScript中的5种主要的数据类型（包括Number、String、Object、Array、Boolean）进行值复制
考察点1：对于基本数据类型和引用数据类型在内存中存放的是值还是指针这一区别是否清楚
考察点2：是否知道如何判断一个变量是什么类型的
考察点3：递归算法的设计

```js

// 方法一：
Object.prototype.clone = function(){
        var o = this.constructor === Array ? [] : {};
        for(var e in this){
                o[e] = typeof this[e] === "object" ? this[e].clone() : this[e];
        }
        return o;
}

//方法二：
  /**
     * 克隆一个对象
     * @param Obj
     * @returns
     */
    function clone(Obj) {
        var buf;
        if (Obj instanceof Array) {
            buf = [];                    //创建一个空的数组 
            var i = Obj.length;
            while (i--) {
                buf[i] = clone(Obj[i]);
            }
            return buf;
        }else if (Obj instanceof Object){
            buf = {};                   //创建一个空对象 
            for (var k in Obj) {           //为这个对象添加新的属性 
                buf[k] = clone(Obj[k]);
            }
            return buf;
        }else{                         //普通变量直接赋值
            return Obj;
        }
    }   
```

### 写一个function，清除字符串前后的空格。(兼容所有浏览器)

```js
if (!String.prototype.trim) { 
 String.prototype.trim = function() { 
 return this.replace(/^\s+/, "").replace(/\s+$/,"");
 } 
} 

// test the function 
var str = " \t\n test string ".trim(); 
alert(str == "test string"); // alerts "true"
```

### 为了保证页面输出安全，我们经常需要对一些特殊的字符进行转义，请写一个函数escapeHtml，将<, >, &, “进行转义

```js
function escapeHtml(str) {
return str.replace(/[<>”&]/g, function(match) {
    switch (match) {
                   case “<”:
                      return “&lt;”;
                   case “>”:
                      return “&gt;”;
                   case “&”:
                      return “&amp;”;
                   case “\””:
                      return “&quot;”;
      }
  });
}
```

### 将一个#fffff类型的数据转换为rgb(255,255,255)形式

http://laker.me/blog/2015/10/10/15_1010_rgb_hex_color/

```js
var hexToRgb = function(hex) {
    var rgb = [];

    hex = hex.substr(1);//去除前缀 # 号

    if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
        hex = hex.replace(/(.)/g, '$1$1');
    }

    hex.replace(/../g, function(color){
        rgb.push(parseInt(color, 0x10));//按16进制将字符串转换为数字
    });

    return "rgb(" + rgb.join(",") + ")";
};
```

### 怎样添加、移除、移动、复制、创建和查找节点

添加
parentNode.appendChild(node)

移除
Node.removeChild() 

移动
replaceChild()

parentElement.insertBefore(newElement, referenceElement);

复制
Node.cloneNode()

创建
```js
createDocumentFragment()    //创建一个DOM片段

createElement()   //创建一个具体的元素

createTextNode()   //创建一个文本节点
```

查找节点

```js
getElementsByTagName()    //通过标签名称

getElementsByName()    //通过元素的Name属性的值

getElementById()    //通过元素Id，唯一性
```



下面是在web和XML页面脚本中使用DOM时，一些常用的API简要列表。

document.getElementById(id)
document.getElementsByTagName(name)
document.createElement(name)
parentNode.appendChild(node)
element.innerHTML
element.style.left
element.setAttribute()
element.getAttribute()
element.addEventListener()
window.onload
window.scrollTo()

### 已知有字符串foo=”get-element-by-id”,写一个function将其转化成驼峰表示法”getElementById”

replace 方法原字符串不会改变。
```js
function tF(s){
   var s1= s.replace(/-\w/g,function(match){
        return match.substring(1).toUpperCase()
   })
   return s1
}
```

### 使得 sum(1,2,3)，sum(1)(2)(3) 都能返回正确的结果
```js
// 这种实现要取得结果，得调用valueOf方法 sum(1)(2).valueOf()
function sum(...args) {
    if (args.length === 1) {
        let result = args[0];
        const _sum = function(y) {
            result += y;
            return _sum;
        }
        //覆盖自定义对象的 valueOf 方法
        _sum.valueOf=function(){
            return result
        }
        return _sum
    } else {
        let result = 0;
        for (let i = 0; i < args.length; i++) {
            result += args[i];
        }
        return result;
    }
}
```


### 创建一个函数，赋予page的一个dom元素，将访问自身和它所有的子元素（不仅仅是直接子元素）。因为每个元素都要访问到，需要传人一个回掉函数。函数的参数如下：一个Dom元素，一个回调函数。

答：可以采用深度优先算法。如下：

```js
function Traverse(p_element,p_callback) {

   p_callback(p_element);

   var list = p_element.children;

   for (var i = 0; i < list.length; i++) {

       Traverse(list[i],p_callback);  // recursive call

   }

}
```

### js银行卡四个数字一个空格

http://www.cnblogs.com/xinhang/p/7640113.html

```js
(function () {
document.getElementById('bankCard').onkeyup = function (event) {
var v = this.value;
if(/\S{5}/.test(v)){
this.value = v.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
}
};
})();


//想的末尾补空格的方案： 
.replace(/([^\s]{4})$/,'$1 ');
```

### 图片懒加载

https://segmentfault.com/a/1190000010744417

- 什么是懒加载
懒加载其实就是延迟加载，是一种对网页性能优化的方式，比如当访问一个页面的时候，优先显示可视区域的图片而不一次性加载所有图片，当需要显示的时候再发送图片请求，避免打开网页时加载过多资源。

- 懒加载原理

\<img>标签有一个属性是src，用来表示图像的URL，当这个属性的值不为空时，浏览器就会根据这个值发送请求。如果没有src属性，就不会发送请求。

我们先不给\<img>设置src，把图片真正的URL放在另一个属性data-src中，在需要的时候也就是图片进入可视区域的之前，将URL取出放到src中。

- 如何判断元素是否在可视区域

1. 方法一

通过document.documentElement.clientHeight获取屏幕可视窗口高度
通过element.offsetTop获取元素相对于文档顶部的距离
通过document.documentElement.scrollTop获取浏览器窗口顶部与文档顶部之间的距离，也就是滚动条滚动的距离
然后判断②-③<①是否成立，如果成立，元素就在可视区域内。

2. 方法二（推荐）
通过getBoundingClientRect()方法来获取元素的大小以及位置，MDN上是这样描述的：

```
The Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
```

假设const bound = el.getBoundingClientRect();来表示图片到可视区域顶部距离；
并设 const clientHeight = window.innerHeight;来表示可视区域的高度。

在bound.top<=clientHeight时，图片是在可视区域内的。

- 加载图片
页面打开时需要对所有图片进行检查，是否在可视区域内，如果是就加载。
可以设一个标识符标识已经加载图片的index，当滚动条滚动时就不需要遍历所有的图片，只需要遍历未加载的图片即可。

3. 方法三 IntersectionObserver

IntersectionObserver可以自动观察元素是否在视口内。

```js
var io = new IntersectionObserver(callback, option);
// 开始观察
io.observe(document.getElementById('example'));
// 停止观察
io.unobserve(element);
// 关闭观察器
io.disconnect();
```

callback的参数是一个数组，每个数组都是一个IntersectionObserverEntry对象，我们需要用到intersectionRatio来判断是否在可视区域内，当intersectionRatio > 0 && intersectionRatio <= 1即在可视区域内。

```js
function checkImgs() {
  const imgs = Array.from(document.querySelectorAll(".my-photo"));
  imgs.forEach(item => io.observe(item));
}

function loadImg(el) {
  if (!el.src) {
    const source = el.dataset.src;
    el.src = source;
  }
}

const io = new IntersectionObserver(ioes => {
  ioes.forEach(ioe => {
    const el = ioe.target;
    const intersectionRatio = ioe.intersectionRatio;
    if (intersectionRatio > 0 && intersectionRatio <= 1) {
      loadImg(el);
    }
    el.onload = el.onerror = () => io.unobserve(el);
  });
});
```

### 图片上传组件开发

https://segmentfault.com/a/1190000013038300org/zh-CN/docs/Web/API/File/Using_files_from_web_applications

- 图片的选择

第一，会有一个输入框傻乎乎的在那里…
直接各种方式hide这个input标签即可，再主动触发 click()：
使用label元素来触发一个隐藏的file input元素

```html
<input type="file" id="fileElem" multiple accept="image/*" style="display:none" onchange="handleFiles(this.files)">
<label for="fileElem">Select some files</label>
```

第二，用Ajax怎么才能get到表单当中的文件呢？
FormData对象

```
XMLHttpRequest Level 2添加了一个新的接口FormData.利用FormData对象,我们可以通过JavaScript用一些键值对来模拟一系列表单控件,我们还可以使用XMLHttpRequest的send()方法来异步的提交这个"表单".比起普通的ajax,使用FormData的最大优点就是我们可以异步上传一个二进制文件.
```

- 图片的展现
我的得到的图片是一个 File对象，而 File对象是特殊的 Blob对象

```
Blob 对象表示不可变的类似文件对象的原始数据。Blob表示不一定是JavaScript原生形式的数据。File 接口基于Blob，继承了 blob的功能并将其扩展使其支持用户系统上的文件。
```

**怎么展示这个 File对象**

FileReader对象

```
FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

其中File对象可以是来自用户在一个<input>元素上选择文件后返回的FileList对象,也可以来自拖放操作生成的 DataTransfer对象,还可以是来自在一个HTMLCanvasElement上执行mozGetAsFile()方法后返回结果。
```

用readAsDataURL()把文件转换为data:URL

- 利用canvas的图片截取

canvas的API中自带 drawImage()函数

- canvas中图片的截取
利用getImageData()函数即可 
当然我们不光要把图像信息获取到，最好还能展现出来我们的截图结果，这里就要用到与之相对的putImageData()函数

- 要画一个圈／框

其实现存的主流解决方案就做的非常好了：在图上拖动鼠标，拉出一个框，这个框内就是用户希望截取的区域。

在画布上画出一个框很简单，只需用到strokeRect()函数

但是让用户自己拖出一个框就比较复杂了，先分析一下用户的一套动作都有什么

用户选定起始点，点下鼠标左键
用户选定截图区域的大小，保持鼠标左键不抬起，同时移动鼠标选择
用户完成选择，抬起鼠标左键
回过头再来看程序需要干什么

获取起始点的坐标，并记录为已点击状态
判断一下如果为已点击状态那么，获取每一次移动／帧的鼠标坐标，并计算出与起始点之间的横纵坐标距离，而这距离就是所画框的长度和宽度，清除上一帧的整个画面，再绘制一个新的图片再画一个新的框，同时按照框的起始坐标及宽高，截取图像信息，再清除预览区域的上一帧的画布，再将这一帧的图像信息载入
鼠标抬起后，停止记录及绘制，保持最终一帧的框停留在画面上

- canvas图片上传
通过Ajax上传，需要将图像数据转化为File，而在canvas的API中自带toBlob()函数

### js判断手机滑动方向,滑动距离
http://www.izhangchao.com/fe/fe_99.html

```js
var doc = document;
doc.addEventListener("touchstart",  startTouchScroll, false);
doc.addEventListener("touchmove", moveTouchScroll, false);
doc.addEventListener("touchend",  endTouchScroll, false);
var startY, endY, startX, endX;
function startTouchScroll(event)
{
        var touch = event.touches[0];
        startX = touch.pageX;
        startY = touch.pageY;
}
function moveTouchScroll(event)
{
        var touch = event.touches[0];
        endX = touch.pageX;
        endY = touch.pageY;
}
function endTouchScroll(event)
{
  //在这里判断也可以
  /*var touch = event.touches[0];
        if(!touch){
            return ;
        }
        endX = touch.pageX;
        endY = touch.pageY;
  */
                                              
        //判断移动的点,1为手指向下滑动,-1为手指向上滑动
        var scrollDirection = (endY - startY) > 0 ? 1 : -1;
        //判断移动的点,1为手指向右滑动,-1为手指向左滑动
        var scrollTranslation = (endX - startX) > 0 ? 1 : -1;
        //计算滑动距离
        var scrollDistance = Math.abs(endY - startY);             
                                              
}
```

### JavaScript 保留两位小数

http://www.runoob.com/w3cnote/javascript-two-decimal.html

- 四舍五入
以下处理结果会四舍五入:

```js
var num =2.446242342;
num = num.toFixed(2);  // 输出结果为 2.45
```

- 不四舍五入
以下处理结果不会四舍五入:

第一种，先把小数变整数：
```js
Math.floor(15.7784514000 * 100) / 100   // 输出结果为 15.77
```

**注意：Math.floor()容易出现精度问题**，举个最简单例子:

对小数 8.54 保留两位小数(虽然它已经保留了 2 位小数)：

```js
Math.floor(8.54*100)/100 // 输出结果为 8.53, 注意是 8.53 而不是 8.54。

> 8.54*100
< 853.9999999999999
```

所以这种函数慎用。



第二种，当作字符串，使用正则匹配：
```js
Number(15.7784514000.toString().match(/^\d+(?:\.\d{0,2})?/))   // 输出结果为 15.77,不能用于整数如 10 必须写为10.0000
```
注意：如果是负数，请先转换为正数再计算，最后转回负数
