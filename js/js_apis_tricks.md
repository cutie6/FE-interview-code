# js details and tricks

## 判断数据类型
http://www.cnblogs.com/onepixel/p/5126046.html

在 ECMAScript 规范中，共定义了 7 种数据类型，分为 基本类型 和 引用类型 两大类，如下所示：

基本类型：String、Number、Boolean、Symbol(ES6)、Undefined、Null 

引用类型：Object

1. typeof
typeof 是一个操作符，其右侧跟一个一元表达式，并返回这个表达式的数据类型。返回的结果用该类型的字符串(全小写字母)形式表示，包括以下 7 种：number、boolean、symbol、string、object、undefined、function 等。

有些时候，typeof 操作符会返回一些令人迷惑但技术上却正确的值：

对于基本类型，除 null 以外，均可以返回正确的结果。
对于引用类型，除 function 以外，一律返回 object 类型。
对于 null ，返回 object 类型。
对于 function 返回  function 类型。
对于 NaN,返回 "number"

2. instanceof

```
object instanceof constructor
```

**instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 这个实例对象的原型链上。**

数字2是基本数据类型，不是对象
```
> 2 instanceof Number
> false
```

```
var b=new Number();
b instanceof Number //true
```
instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型。

instanceof 操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。

```
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[0].Array;
var arr = new xArray(1,2,3); // [1,2,3]
arr instanceof Array; // false
```

针对数组的这个问题，ES5 提供了** Array.isArray() 方法 。该方法用以确认某个对象本身是否为 Array 类型，而不区分该对象在哪个环境中创建**。

```
if (Array.isArray(value)){
   //对数组执行某些操作
}

```

Array.isArray() 本质上检测的是对象的 [[Class]] 值，[[Class]] 是对象的一个内部属性，里面包含了对象的类型信息，其格式为 [object Xxx] ，Xxx 就是对应的具体类型 。对于数组而言，[[Class]] 的值就是 [object Array] 。

3. constructor
当一个函数 F被定义时，JS引擎会为F添加 prototype 原型属性，然后再在 prototype上添加一个 constructor 属性，并让其指向 F 的引用。
当执行 var f = new F() 时，F 被当成了构造函数，f 是F的实例对象，f的 __proto__ 指向 F.prototype 。此时 F 原型上的 constructor 传递到了 f 上，因此 f.constructor == F.prototype.constructor == F。

    当代码 new Foo(...) 执行时，会发生以下事情：
    一个**继承自 Foo.prototype 的新对象**被创建。
    使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。
    由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

细节问题：

null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。

函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object。
为什么变成了 Object？
**因为 prototype 被重新赋值的是一个 { }， { } 是 new Object() 的字面量，因此 new Object() 会将 Object 原型上的 constructor 传递给 { }，也就是 Object 本身。**
**因此，为了规范开发，在重写对象原型时一般都需要重新给 constructor 赋值，以保证对象实例的类型不被篡改。**

4. Object.prototype.toString.call
toString() 是 Object 的原型方法，调用该方法，默认返回当前对象的 [[Class]] 。这是一个内部属性，其格式为 [object Xxx] ，其中 Xxx 就是对象的类型。

对于 Object 对象，直接调用 toString()  就能返回 [object Object] 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。

```
Object.prototype.toString.call(a)
```


## 操作符

### 全等号优先级大于逻辑与

```
var a=1===2&&3?4:5
```

### 逗号操作符

逗号操作符  对它的每个操作数求值（从左到右），并返回最后一个操作数的值。


```
var x=(0,1) //x=1
```

### 比较对象

两个独立声明的对象永远也不会相等，即使他们有相同的属性，只有在比较一个对象和这个对象的引用时，才会返回true.

### JS按位非运算符(~)及双非(~~)的使用

https://segmentfault.com/a/1190000003731938

https://www.ecma-international.org/ecma-262/8.0/

12.5.8Bitwise NOT Operator ( ~ )
12.5.8.1Runtime Semantics: Evaluation
UnaryExpression:~UnaryExpression

Let expr be the result of evaluating UnaryExpression.
Let oldValue be ? ToInt32(? GetValue(expr)).
Return the result of applying bitwise complement to oldValue. The result is a signed 32-bit integer.

对任一有符号数值 x 进行按位非操作的结果为 -(x + 1)

那么, ~~x就为 -(-(x+1) + 1)

**对于浮点数，~~value可以代替parseInt(value)，而且前者效率更高些**

在 JS 里面，所有位操作符里面都先执行 ToInt32,但是parseInt 并不会执行这一步。

## 什么是三元表达式 (Ternary expression)？“三元 (Ternary)” 表示什么意思？

条件（三元）运算符是 JavaScript 仅有的使用三个操作数的运算符。本运算符经常作为 if 语句的简短形式来使用。


## 方法

###  encodeURI   encodeURIComponent

> encodeURI
encodeURI 会替换所有的字符，但不包括以下字符，即使它们具有适当的UTF-8转义序列：

```
类型	     包含
保留字符	; , / ? : @ & = + $
非转义的字符	字母 数字 - _ . ! ~ * ' ( )
数字符号	#
```

**encodeURI自身无法产生能适用于HTTP GET 或 POST 请求的URI，例如对于 XMLHTTPRequests, 因为 "&", "+", 和 "=" 不会被编码，然而在 GET 和 POST 请求中它们是特殊字符。然而encodeURIComponent这个方法会对这些字符编码。**

> encodeURIComponent
转义除了字母、数字、(、)、.、!、~、*、'、-和_之外的所有字符。

dangerouslysethtml会过滤掉__html属性里的 \ ，是因为用了encodeURI函数来避免xss攻击

 ```
encodeURI('/\/\//') -->”////“
encodeURI('\') --> Uncaught SyntaxError: Invalid or unexpected token
encodeURIComponent('/\/\//') -->"%2F%2F%2F%2F"
encodeURIComponent('/') --> "%2F"
encodeURIComponent('\') --> Uncaught SyntaxError: Invalid or unexpected token
```

### URL.searchParams

如果你的url是 https://example.com/?name=Jonathan&age=18 ，你可以这样解析url，然后得到name和age的值。

```
let params = (new URL(document.location)).searchParams;
let name = params.get("name"); // "Jonathan"
let age = parseInt(params.get("age")); // 18
```

## 在什么时候你会使用 document.write()？

将一个文本字符串写入由 document.open() 打开的一个文档流。

注意: 因为 document.write 写入文档流，在关闭(已加载)的文档上调用 document.write 会自动调用 document.open，这将清除该文档。

The only seem appropriate usage for document.write() is when working third parties like Google Analytics and such for including their scripts. This is because document.write() is mostly available in any browser. Since third party companies have no control over the user’s browser dependencies (ex. jQuery), document.write() can be used as a fallback or a default method.

## 描述以下变量的区别：null，undefined 或 undeclared，该如何检测它们？

undefined和null在if语句中，都会被自动转为false，相等运算符甚至直接报告两者相等。

undefined和null的含义与用法都差不多，只有一些细微的差别。

null是一个表示"无"的对象，转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。

null表示"没有对象"，即该处不应该有值。典型用法是：

（1） 作为函数的参数，表示该函数的参数不是对象。

（2） 作为对象原型链的终点。

 undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义。典型用法是：

（1）变量被声明了，但没有赋值时，就等于undefined。

（2) 调用函数时，应该提供的参数没有提供，该参数等于undefined。

（3）对象没有赋值的属性，该属性的值为undefined。

（4）函数没有返回值时，默认返回undefined。

- 检测 

typeof undefined  //undefined

typeof null  //object

## immutable对象

> 概念
An immutable object is one whose content cannot be changed.
An object can be immutable for various reasons, for example:

To improve performance (no planning for the object's future changes)
To reduce memory use (make object references instead of cloning the whole object)
Thread-safety (multiple threads can reference the same object without interfering with one other)

> 实现
The object being frozen is immutable.  However, it is not necessarily constant. 
To be a constant object, the entire reference graph (direct and indirect references to other objects) must reference only immutable frozen objects.  

```
// To do so, we use this function.
function deepFreeze(obj) {

  // Retrieve the property names defined on obj
  //方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
  var propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach(function(name) {
    var prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
}

obj2 = {
  internal: {}
};

deepFreeze(obj2);
obj2.internal.a = 'anotherValue';
obj2.internal.a; // undefined
```

## symbol
http://es6.ruanyifeng.com/#docs/symbol

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。

## 数组

### 判断变量是不是数组的几个方法

```
var a=[];
a.constructor===Array //true
a instanceof Array === true //true

```

**⚠️ 注意：以上方法在跨frame时会有问题，跨frame实例化的对象不共享原型**


```
var iframe = document.createElement('iframe');   //创建iframe  
document.body.appendChild(iframe);   //添加到body中  
xArray = window.frames[window.frames.length-1].Array;     
var arr = new xArray(1,2,3); // 声明数组[1,2,3]     
  
alert(arr instanceof Array); // false     
  
alert(arr.constructor === Array); // false   
```

**解决：**

**Object.prototype.toString**可以用来判断所有复合类型
**Array.isArray该方法用以确认某个对象本身是否为 Array 类型，而不区分该对象在哪个环境中创建**。

```
Object.prototype.toString.call(a) // "[object Array]"
Array.isArray(a) //true
```


### 理解下sort排序的原理

数组的sort方法，默认是按照ascii排序的，为了对数字进行区分，还是手动传入一个sort函数。

```
var arr = [11,2,28,5,8,4]
arr.sort(function(a,b){return a-b})
```

如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。备注： ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；
如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。

### 在Javascript中什么是伪数组？如何将伪数组转化为标准数组？

伪数组（类数组）：
1.拥有length属性
2、不具有数组所具有的方法,但仍可以对真正数组遍历方法来遍历它们。典型的是函数的argument参数，还有像调用getElementsByTagName,document.childNodes之类的,它们都返回NodeList对象都属于伪数组。可以使用Array.prototype.slice.call(fakeArray)将数组转化为真正的Array对象。

### 数组去重

```
let arr=[1,1,1,2]
[...new Set(arr)]
```

```
function unique(array){
    var n = [];//临时数组
    for(var i = 0;i < array.length; i++){
        if(n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
}
```

### 多维数组转化为一维数组

https://blog.csdn.net/luohe1234/article/details/78295931

1. 方法一:使用join()

join() 方法用于把数组中的所有元素放入一个字符串，split() 方法用于把一个字符串分割成字符串数组。
```
var a = [1,3,4,5,[6,7,9],[2],[5]];

a = a.join(",").split(","); 
```

输出结果a=[1,3,4,5,6,7,9,2,5];

2. 方法二:使用toString()

toString() 方法可把一个逻辑值转换为字符串，并返回结果。
```
var a = [1,3,4,5,[6,7,9],[2],[5]];

a = a.toString().split(",");
```
输出结果a=[1,3,4,5,6,7,9,2,5];

3. 方法三:空字符串
```
var a = [1,3,4,5,[6,7,9,[10,11]]];

a = (a+'').split(',');
```
输出结果a=[1,3,4,5,6,7,9,2,5];

### 二维数组转一维
使用apply结合concat，缺点是只能将二维转一维，多维数组则不对了。
```
const arr = [1,[2,3],[4,5]];
console.log([].concat.apply([],arr));
```

### 数组方法map和reduce区别

![](imgs/map_reduce.jpg)

map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。
reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。

### []与 new Array()申明区别

http://www.jb51.net/article/129589.htm
性能上并没有区别

https://stackoverflow.com/questions/3500115/difference-between-new-array-and-in-javascript

There is a difference if you have only one item, and it's numeric. This will create an array with a single item:

```
var myNumbers = [42];
```

but this will create an array with the length 42:

```
var myNumbers = new Array(42);
```

## es6

### let

let声明的变量只在其声明的块或子块中可用，这一点，与var相似。二者之间最主要的区别在于var声明的变量的作用域是整个封闭函数。

在程序或者函数的顶层，let并不会像var一样在全局对象上创造一个属性，比如：

```
var x = 'global';
let y = 'global';
console.log(this.x); // "global"
console.log(this.y); // undefined
```

在相同的函数或块作用域内重新声明同一个变量会引发SyntaxError。

let绑定不受变量提升的约束

### const

常量是块级作用域，很像使用 let 语句定义的变量。常量的值不能通过重新赋值来改变，并且不能重新声明。

此声明创建一个常量，其作用域可以是全局或本地声明的块。 与var变量不同，全局常量不会变为窗口对象的属性。需要一个常数的初始化器；也就是说，您必须在声明的同一语句中指定它的值（这是有道理的，因为以后不能更改）。

**const声明创建一个值的只读引用。但这并不意味着它所持有的值是不可变的**，只是变量标识符不能重新分配。例如，在引用内容是对象的情况下，这意味着可以改变对象的内容（例如，其参数）。



### 箭头函数

- this
引入箭头函数有两个方面的作用：更简短的函数并且不绑定this。

在箭头函数出现之前，每个新定义的函数都有它自己的 this值（在构造函数的情况下是一个新对象，在严格模式的函数调用中为 undefined，普通函数调用为window,如果该函数被称为“对象方法”则为基础对象等）。

箭头函数不会创建自己的this；它使用封闭执行上下文的this值。

- 与严格模式的关系
鉴于 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略。

```
var f = () => {'use strict'; return this};
f() === window; // 或全局对象
```

- 通过 call 或 apply 调用
**由于 this 已经在词法层面完成了绑定，通过 call() 或 apply() 方法调用一个函数时，只是传入了参数而已，对 this 并没有什么影响**：

```
var adder = {
  base : 1,
    
  add : function(a) {
    var f = v => v + this.base;
    return f(a);
  },

  addThruCall: function(a) {
    var f = v => v + this.base;
    var b = {
      base : 2
    };
            
    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2（而不是3 ——译者注）
```

- 箭头函数不绑定Arguments 对象
因此，在本示例中，参数只是在封闭范围内引用相同的名称：

```
var arguments = 42;
var arr = () => arguments;

arr(); // 42
```

在大多数情况下，使用剩余参数是使用arguments对象的好选择。

```
function foo() { 
  var f = (...args) => args[0]; 
  return f(2); 
}

foo(1); 
// 2
```

**箭头函数表达式对非方法函数是最合适的。让我们看看当我们试着把它们作为方法时,箭头函数没有定义this绑定。**

- 箭头函数不能用作构造器，和 new一起用会抛出错误。

- 箭头函数没有prototype属性。

-  yield 关键字通常不能在箭头函数中使用（除非是嵌套在允许使用的函数内）。因此，箭头函数不能用作生成器。

- 返回对象字面量
记住用params => {object:literal}这种简单的语法返回对象字面量是行不通的。

这是因为花括号（{} ）里面的代码被解析为一系列语句（即 foo 被认为是一个标签，而非对象字面量的组成部分）。

所以，**记得用圆括号把对象字面量包起来**：

```
var func = () => ({foo: 1});
```

- 解析顺序
虽然箭头函数中的箭头不是运算符，但箭头函数具有与常规函数不同的特殊运算符优先级解析规则。

```
let callback;

callback = callback || function() {}; // ok

callback = callback || () => {};      
// SyntaxError: invalid arrow-function arguments

callback = callback || (() => {});    // ok
```

### 展开运算符

扩展语法允许一个表达式在期望多个参数（用于函数调用）或多个元素（用于数组字面量）或多个变量（用于解构赋值）的位置扩展。

- 复制一个数组

```
let arr = [1, 2, 3];
let arr2 = [...arr]; // 就像是 arr.slice()
```

Note: 复制数组时候, 拓展语句只会进行浅复制, 因此如下所示, 它并不适合复制多维数组 (与Object.assign() 相同)。

- 将类数组对象转换成数组

```
var nodeList = document.querySelectorAll('div');
var array = [...nodeList];
```
 - 使用Math函数
当然了，展开运算符将数组“展开”成为不同的参数，所以任何可接收任意数量的参数的函数，都能够使用展开运算符来传参。

```
let numbers = [9, 4, 7, 1];
Math.min(...numbers); // 1
```

