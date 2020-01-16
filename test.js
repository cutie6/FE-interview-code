//光看不自己闭卷写是过不了面试的！！！
//就好像数学、语文、英语、物理、跳舞、绘画等等等等，只看不自己独立练习是没法把事情做好的。

//解算法的步骤：
//1.清晰题意，确定输入输出
//2.按照自己自然的逻辑去推导过程
//3.将推导过程变成代码
//4.调试优化代码

//手写某功能的步骤：
//1.写出该功能核心用法
//2.对照核心用法自己实现其功能
//3.调试优化代码

// let obj = {
//     0: 1,
//     1: 2,
//     length: 2,
//     // [Symbol.iterator]() {
//     //     let index = 0;
//     //     return {
//     //         next() {
//     //             return {
//     //                 value: this[index],
//     //                 done:this.length===index++
//     //             };
//     //         }
//     //     };
//     // },
//     // generator 可以生成 iterator
//     *[Symbol.iterator]() {
//         for (let i = 0; i < this.length; i++) {
//             yield this[i];
//         }
//     }
// };
// console.log([...obj]);

// function* read() {
//     let a = yield "hello";
//     console.log(a);
//     let b = yield "world";
//     console.log(b);
// }
// let it = read();
// console.log(it.next()); // 第一次 next 方法传递的参数没有任何意义
// console.log(it.next(1)); // 会传递给上一次 yield 的返回值
// console.log(it.next(2));

function co(it) {
    return new Promise((resolve,reject)=>{
        function next(data) {
            let {
                value,done
            }=it.next(data)
            if(!done){
                Promise.resolve(value).then(data=>{
                    next(data)
                },reject)
            }else{
                resolve(data)
            }
        }
        next()
    })
}

// let promise = new Promise((resolve, reject) => {
//     reject("reject");
//     resolve("resolve");
// });

// 调用多少次后让回调函数执行
// function after(times, callback) {
//     return function() {
//         if (--times === 0) {
//             callback();
//         }
//     };
// }
// let fn = after(3, function() {
//     console.log("real");
// });
// fn();
// fn();
// fn();

// AOP 面向切片编程

// react 事务
// function perform(anyMethod, wrappers) {
//     return function() {
//         wrappers.forEach(wrapper => wrapper.initialize());
//         anyMethod();
//         wrappers.forEach(wrapper => wrapper.close());
//     };
// }

// let newFn = perform(
//     function() {
//         console.log("say");
//     },
//     [
//         {
//             // wrapper1
//             initialize() {
//                 console.log("wrapper1 beforesay");
//             },
//             close() {
//                 console.log("wrapper1 close");
//             }
//         },
//         {
//             // wrapper2
//             initialize() {
//                 console.log("wrapper2 beforesay");
//             },
//             close() {
//                 console.log("wrapper2 close");
//             }
//         }
//     ]
// );

// newFn();

//  Vue 2.0 函数劫持
// let oldPush=Array.prototype.push
// function push(...args){
//     console.log('数据更新')
//     oldPush.call(this,...args)
// }
// let arr=[1,2,3]
// push.call(arr,4,5,6)
// console.log(arr)

// // vue-2.6/src/core/observer/array.js
// methodsToPatch.forEach(function(method) {
//     // cache original method
//     const original = arrayProto[method];
//     def(arrayMethods, method, function mutator(...args) {
//         const result = original.apply(this, args);
//         const ob = this.__ob__;
//         let inserted;
//         switch (method) {
//             case "push":
//             case "unshift":
//                 inserted = args;
//                 break;
//             case "splice":
//                 inserted = args.slice(2);
//                 break;
//         }
//         if (inserted) ob.observeArray(inserted);
//         // notify change
//         ob.dep.notify();
//         return result;
//     });
// });

// function say() {
//     //todo
//     console.log("说话");
// }

// Function.prototype.before = function(beforeFunc) {
//     // 这里的 this 是函数 say
//     let that = this;

//     return function() {
//         beforeFunc();
//         // 这里的 this 是全局对象
//         // 在绝大多数情况下，函数的调用方式决定了this的值
//         that()
//     };
// };

// let newFn = say.before(function() {
//     console.log("说话前");
// });
// newFn();

//学堂在线动态规划题目
// integerLinear();
// function integerLinear() {
//     let Max=10;//此题 x1 x2 x3 都为0时的结果

//     for (let x1 = 0; x1 <= 4; x1++) {
//         for (let x2 = 4 - x1; x2 >= 0; x2--) {
//             for (let x3 = 4 - x1 - x2; x3 >= 0; x3--) {
//                     let value =
//                         5 * x1 * x1 +
//                         3 * x2 * x2 +
//                         x3 * x3 -
//                         10 * x1 -
//                         3 * x2 +
//                         2 * x3 +
//                         10;
//                         if(value>Max){
//                             Max=value
//                         }
//             }
//         }
//     }
//     console.log(Max)
//     return Max
// }

// function knapsack(capacity, items) {
//     let M = [],
//         len = items.length;
//     for (let i = 0; i <= len; i++) {
//         M[i] = [0];
//     }
//     for (let c = 0; c <= capacity; c++) {
//         M[0][c] = 0;
//     }
//     for (let i = 1; i <= len; i++) {
//         for (let w = 1; w <= capacity; w++) {
//             let curItemValue = items[i - 1];
//             if (curItemValue > w) {
//                 M[i][w] = M[i - 1][w];
//             } else {
//                 M[i][w]=Math.max(M[i-1][w],curItemValue+M[i-1][w-curItemValue])
//             }
//         }
//         console.log("M[i]");
//         console.log(M[i]);
//     }

//     console.log(M[len][capacity]);
//     return M[len][capacity];
// }

// knapsack(69, [1, 5, 10, 15, 22, 25, 30]);
// knapsack(4, [1,2]);

// function steps(n) {
//     //第几个元素（元素下标+1）代表有多少个台阶，元素值代表此台阶级数（第几个元素）下有多少种走法
//     let M = [0, 1, 1];
//     for (let i = 3; i < n; i++) {
//         M[i] = M[i - 2] + M[i - 3];
//     }
//     return M[n - 1];
// }
// console.log(steps(10));

// mergeSort
// function merge(arr1, arr2) {
//     let i = (j = 0);
//     let result = [];
//     while (i < arr1.length && j < arr2.length) {
//         if (arr1[i] < arr2[j]) {
//             result.push(arr1[i]);
//             i++;
//         } else {
//             result.push(arr2[j]);
//             j++;
//         }
//     }
//     return result.concat(arr1.slice(i), arr2.slice(j));
// }

// function mergeSort(arr) {
//     if (arr.length === 1) return arr;
//     const mid = Math.floor(arr.length / 2);

//     let left = mergeSort(arr.slice(0, mid));
//     let right = mergeSort(arr.slice(mid));
//     return merge(left, right);

//     // 不推荐写成一行
//     // 这样写成一行时括号特别容易写错，写错了就会有奇怪的问题
//     // 并且可读性低
//     // 写成一行的时候，是先给第二个参数求值
//     // return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
// }

// console.log(mergeSort([5, 1]));
// console.log(mergeSort([5, 1,9,7,2]));

// 手敲ajax 加深印象 防止变态考官考这也麻痹考很细，傻逼考官，去死吧
// function ajax(type, url, data, success, failed) {
//     let xhr = null;
//     if (window.XMLHttpRequest) {
//         xhr = new XMLHttpRequest();
//     } else {
//         xhr = new ActiveXObject("Microsoft.XMLHTTP");
//     }

//     let type = type.toUpperCase();
//     let random = Math.random();

//     if (typeof data === "object") {
//         let str = "";
//         for (let key in data) {
//             str += key + "=" + data[key] + "&";
//         }
//         data = str.replace(/&$/, "");
//     }

//     if (type === "GET") {
//         if (data) {
//             xhr.open("GET", url + "?" + data, true);
//         } else {
//             xhr.open("GET", url + "?t=" + random, true);
//         }
//         xhr.send();
//     } else if (type === "POST") {
//         xhr.open("POST", url, true);
//         xhr.setRequestHeader('Content-type','application/x-www-form-usrlencoded')
//         xhr.send(data)
//     }

//     xhr.onreadystatechange=function(){
//         if(xhr.readyState===4){
//             if(xhr.status===200){
//                 success(xhr.responseText)
//             }else{
//                 if(failed){
//                     failed(xhr.status)
//                 }
//             }
//         }
//     }
// }

// 百度百科的方案，抄抄，看能不能抄懂
// 为位置数组的某一项选值，也就是为棋盘的某一行选列的值
// let count=0
// queen([1,1,1,1,1,1,1,1],0)
// function queen(arr, cur_index) {
//     if (cur_index === arr.length) {
//         console.log(++count)
//         console.log(arr);
//         return;
//     }
//     for (let i = 0; i < arr.length; i++) {
//         arr[cur_index] = i;
//         let flag = true;
//         //检查新插入的皇后位置是否符合要求
//         for (let j = 0; j < cur_index; j++) {
//             let ab = i - arr[j];
//             ab = ab > 0 ? ab : -ab;
//             if (arr[j] === i || ab === cur_index - j) {
//                 flag = false;
//                 break;
//             }
//         }
//         if (flag) {
//             queen(arr, cur_index + 1);
//         }
//     }
// }

// // 八皇后 12.20日闭卷手写
// // 输出所有解决方案
// // 8*8棋盘的里面的位置描述：
// // 或者就用二维数组吧，按行来 [[0,1,2...,7],[0,1,...,7],...[0,1,...,7]]
// // 一个解决方案的格式 x:哪一行，y:哪一列  [arr[x1][y1],arr[x2][y2]...]
// // 一个解决方案的格式 x:哪一行，y:哪一列  [[x1,y1],[x2,y2]]
// // eightQueen();
// function eightQueen() {
//     //这里的count一定要放在调用processLine方法的前面
//     let count = 0;
//     processLine(0, []);
//     function processLine(n, result) {
//         // 奇怪，这里n还能变小
//         if (n === 8) {
//             //出口 处理结果
//             console.log(result);
//             console.log(++count);
//             return result;
//         }
//         //每一列
//         for (let j = 0; j < 8; j++) {
//             let curPos = [n, j];
//             // 判断是否和之前的项目不冲突
//             if (!isConflict(result, curPos)) {
//                 //不冲突，推入到结果数组
//                 // result.push(curPos);
//                 // 这里感觉也不能改原result数组，不然在同一行遍历下一个位置的时候，result数组已经被塞过上一轮的数值了
//                 //进入下一行
//                 processLine(n + 1, result.concat([curPos]));
//             }
//         }
//     }
//     function isConflict(arr, item) {
//         for (let i = 0; i < arr.length; i++) {
//             const ele = arr[i];
//             if (isConflictWithItem(ele, item)) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     function isConflictWithItem(item1, item2) {
//         //这个题目中对比的item，都不在同一行，
//         //只需要比较是否在同一列，或者在同一斜线上
//         if (item1[0] === item2[0]) return true;
//         if (item1[1] === item2[1]) return true;
//         if (
//             item1[0] - item2[0] === item1[1] - item2[1] ||
//             item1[0] - item2[0] === item2[1] - item1[1]
//         )
//             return true;
//         return false;
//     }
// }

// 全排序 2019.12.18 闭卷手写成功哎 开心
// [1,2,3]=>
// [1,2,3] [1,3,2]
// [2,1,3] [2,3,1]
// [3,1,2] [3,2,1]
// function allSequence(arr) {
//     // 思路是result是用来保存排列结果的数组
//     // 这个函数每次都会循环source中的项目，将项目从source中移走一项，push到result数组的后面
//     const arrangeOneFromSource = function(result, source) {
//         if (source.length === 0) {
//             // 递归出口 一个排列完成了
//             // process 排列结果 这里就打印好了
//             console.log(result);
//             return result;
//         }
//         for (let i = 0; i < source.length; i++) {
//             const ele = source[i];

//             // 递归调用时不能改变原 result 与 source，不然一次排列完成后，原result已经是第一种排列的结果，source也成了空数组，source.length===0，这个循环体也不会再执行了
//             // 要生成新的数组当递归函数的入参
//             // concat 与 slice 都不会改变原数组
//             // 这个函数算尾递归
//             arrangeOneFromSource(
//                 result.concat([ele]),
//                 source.slice(0, i).concat(source.slice(i + 1))
//             );
//         }
//     };
//     arrangeOneFromSource([], arr);
// }
// allSequence([1, 2]);

// 这种实现要取得结果，得调用valueOf方法 sum(1)(2).valueOf()
// function sum(...args) {
//     if (args.length === 1) {
//         let result = args[0];
//         const _sum = function(y) {
//             result += y;
//             return _sum;
//         }
//         //覆盖自定义对象的 valueOf 方法
//         _sum.valueOf=function(){
//             return result
//         }
//         return _sum
//     } else {
//         let result = 0;
//         for (let i = 0; i < args.length; i++) {
//             result += args[i];
//         }
//         return result;
//     }
// }

// pid数组转树结构
// var nodes = [
//     { id: 10, title: "dw10", parentId: 4 },
//     { id: 2, title: "dw2", parentId: 0 },
//     { id: 7, title: "dw7", parentId: 30 },
//     { id: 4, title: "dw4", parentId: 2 },
//     { id: 12, title: "dw12", parentId: 2 },
//     { id: 8, title: "dw8", parentId: 4 }
// ];

// // sort 这里真的是需要排序啊，不然运行到第四项时，把map里key为4的项目删除了，运行到最后一项又得添加一个key为4的项目
// function cmp(a, b) {
//     return a.parentId - b.parentId;
// }
// nodes.sort(cmp);
// //sort之后数组按照pId是 0 2 2 4 4 30

// var childMap = {};
// // 从后向前遍历
// for (var i = nodes.length - 1; i >= 0; i--) {
//     var nowPid = nodes[i].parentId;
//     var nowId = nodes[i].id;
//     // 建立当前节点的父节点的children 数组
//     if (childMap[nowPid]) {
//         childMap[nowPid].push(nodes[i]);
//     } else {
//         childMap[nowPid] = [];
//         childMap[nowPid].push(nodes[i]);
//     }
//     // 将children数组的引用赋值给数组项的children属性，并删除childMap中对children数组的引用
//     if (childMap[nowId]) {
//         nodes[i].children = childMap[nowId];
//         delete childMap[nowId];
//     }
// }

// console.log(childMap);

//快速排序

//大爷的 新建两个数组来保存左边的小数组与又边的大数组思路要简单很多 移动指针mmb的 真他妈难想
// function quicksort(arr) {
//     let flag = arr[0],
//         len = arr.length,
//         i = 1,
//         j = len - 1;
//     if (len === 1) {
//         return arr;
//     }

//     //如果数组是两个元素，i==j 直接给两个元素排序？？？
//     if(len===2){
//         if(arr[0]<=arr[1]) return arr
//         else return [arr[1],arr[0]]
//     }

//     //我傻逼了 不用<=
//     while (i < j) {
//         debugger
//         // while (i < j) {
//             //这样可能会无限循环 跳不出去
//         //     debugger
//         //     if (arr[i] <= flag) {
//         //         i++;
//         //     }
//         //     if (arr[j] > flag) {
//         //         j--;
//         //     }
//         // }

//         while (arr[i]<=flag&&i<j) {
//             i++
//         }

//          while (arr[j] > flag && i < j) {
//             j--;
//          }

//         //交换
//         let temp = arr[i];
//         arr[i] = arr[j];
//         arr[j] = temp;
//     }

//     let left=arr.slice(1,i),right=arr.slice(i+1)
//     return [...quicksort(left),flag,...quicksort(right)]
// }

// console.log(quicksort([2, 1,5,0,9,3]));

// //开课吧pdf 数组中是两个元素时应该也有问题啊 [1,2]排序有问题 [2,1]倒是正确 呵呵了
// function quick_sort1(arr) {
//     if (arr.length <= 1) {
//         return arr;
//     }
//     let pivot = arr[0];
//     let i = 1;
//     let j = arr.length - 1;
//     while (i < j) {
//         let pivot = arr[0];
//         while (arr[j] >= pivot && i < j) {
//             j--;
//         }
//         while (arr[i] <= pivot && i < j) {
//             i++;
//         }
//         let temp = arr[i];
//         arr[i] = arr[j];
//         arr[j] = temp;
//     }
//     let left = arr.slice(1, i + 1);
//     let right = arr.slice(j + 1);
//     debugger;
//     return [...quick_sort1(left), pivot, ...quick_sort1(right)];
// }
// console.log(quick_sort1([1,2]));

// 自己实现promise
// promise的用法：
// var a = new Promise((resolve, reject) => {
//     resolve("111111");
//     setTimeout(() => {
//         resolve("hhhh");
//         reject("errrrrr");
//     }, 1000);
// })
//     .then(res => {
//         const msg = "then1: " + res;
//         console.log(msg);
//         return msg;
//     })
//     .then(
//         res => {
//             const msg = "then2: " + res;
//             console.log(msg);
//             return msg;
//         },
//         err => {
//             console.log(err);
//             return err;
//         }
//     )
//     .then(res => {
//         console.log("after catch: " + res);
//     });

// class myPromise {
//     constructor(excutor) {
//         excutor(this.resolve.bind(this), this.reject.bind(this));
//     }
//     sucCbs = [];
//     errCbs = [];
//     state = "pending";
//     value = "";

//     //resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。
//     resolve(val) {
//         this.value = val;
//         this.state = "fulfilled";
//         debugger;
//         //如果resolve是在同步代码里调用的，那会比then方法先执行，用setTimeout来保证then方法里面的回调函数注册完成
//         setTimeout(() => {
//             debugger;
//             let len = this.sucCbs.length;
//             for (let ind = 0; ind < len; ind++) {
//                 const fn = this.sucCbs[ind];
//                 //如果传入另一个myPromise实例
//                 if (this.value.constructor === this.constructor) {
//                     debugger;
//                     let newP = this.value;
//                     for (ind++; ind < len; ind++) {
//                         // newP.sucCbs.push(fn);
//                         newP.then(fn);
//                     }
//                 } else {
//                     this.value = fn(this.value);
//                 }
//             }

//             return this;
//         }, 0);
//     }
//     reject(err) {
//         this.state = "rejected";
//         this.errCbs.length && this.errCbs.shift()(err);
//         return this;
//     }
//     then(successHandler, errHandler) {
//         let isSuccessHandlerFunction = typeof successHandler == "function";
//         switch (this.state) {
//             case "pending":
//                 isSuccessHandlerFunction && this.sucCbs.push(successHandler);
//                 break;
//             case "fulfilled":
//                 if (isSuccessHandlerFunction) {

//                     //展开参数里面的myPromise对象 thenable没有考虑到 先不抠这么细致
//                     while (this.value.constructor === this.constructor) {
//                         this.value = this.value.value;
//                     }
//                     this.value = successHandler(this.value);
//                 }
//             default:
//                 break;
//         }

//         typeof errHandler == "function" && this.errCbs.push(errHandler);
//         return this;
//     }
// }

// var b = new myPromise((resolve, reject) => {
//     debugger;
//     resolve("bbbb");
// });
// var a = new myPromise((resolve, reject) => {
//     debugger;
//     // resolve("111111");
//     resolve(b);
//     // setTimeout(() => {
//     //     resolve("hhhh"); //如果同步里有个resolve,异步回调里还有个resolve??
//     //     // debugger;
//     //     // reject("errrrrr");
//     // }, 1000);
// })
//     .then(res => {
//         debugger;
//         const msg = "then1: " + res;
//         console.log(msg);
//         return msg;
//     })
//     .then(
//         res => {
//             const msg = "then2: " + res;
//             console.log(msg);
//             return msg;
//         },
//         err => {
//             console.log(err);
//             return err;
//         }
//     )
//     .then(res => {
//         console.log("then3 : " + res);
//     });

// 归并排序
// function mergeSort(arr) {
//     if (arr.length <= 1) return arr;
//     let len = arr.length;
//     let mid = Math.ceil(len / 2),
//         left = arr.slice(0, mid),
//         right = arr.slice(mid);
//     return mergeTwoSortedArr(mergeSort(left), mergeSort(right));
// }

// function mergeTwoSortedArr(arr1, arr2) {
//     let len1 = arr1.length,
//         len2 = arr2.length;
//     let i = 0,
//         j = 0;
//     let result = [];
//     while (i < len1 && j < len2) {
//         if (arr1[i] <= arr2[j]) {
//             result.push(arr1[i]);
//             i++;
//         } else {
//             result.push(arr2[j]);
//             j++;
//         }
//     }

//     if (i < len1) {
//         result = result.concat(arr1.slice(i));
//     }
//     if (j < len2) {
//         result = result.concat(arr2.slice(j));
//     }
//     console.log("=====>" + result);
//     return result;
// }

// mergeTwoSortedArr([1, 3, 5], [2, 4, 7]);
// console.log(mergeSort([2,1,7,3,0]))
