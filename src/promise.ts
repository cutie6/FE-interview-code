// 手写 promise
// 参考珠峰公开课 https://www.bilibili.com/video/av83168380/?p=3&t=2835
// 这次调成了 ts 版本

// 用法
// (1) 同步
// let promise = new Promise((resolve, reject) => {
//     reject("reject");
//     resolve("resolve"); // resolve 不会执行
// }).then(
//     data => {
//         console.log(data);
//     },
//     err => {
//         console.log("err: ", err);
//     }
// );

// (2) 异步
// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("成功");
//     }, 1000);
// });
// promise.then(
//     data => {
//         console.log(1, data);
//     },
//     err => {
//         console.log(1, "err: ", err);
//     }
// );
// promise.then(
//     data => {
//         console.log(2, data);
//     },
//     err => {
//         console.log(2, "err: ", err);
//     }
// );

// (3) then 的处理
// 1. 判断成功和失败函数的返回结果
// 2. 判读是不是 promise，如果是 promise ，就采用它的状态
// 3. 如果不是 promise，直接将结果传递下去

// let p = new Promise((resolve, reject) => {
//     resolve(100);
// });

// let promise2 = p.then(data => {
//     // return 1000;
//     throw new Error("失败");
// });
// promise2
//     .then(
//         data => {
//             console.log(data);
//         },
//         err => {
//             console.log(err);
//         }
//     )
//     .then(data => {
//         console.log(data);
//     });

// 实现
const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";

const resolvePromise = (
    basePromise: MyPromise | {},
    toResolve: any,
    resolve: Function,
    reject: Function
) => {
    // 传入 basePromise 就为了验证是不是和 toResolve 相等

    // let p1 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(p1);
    //   }, 100);
    // });

    // 上面这种写法的确会报错：
    //           resolve(p1)
    //         ^

    // TypeError: Chaining cycle detected for promise #<Promise>

    if (basePromise === toResolve) {
        return reject(new TypeError("chaning cycle detected for promise"));
    }
    if (
        (typeof toResolve === "object" && toResolve !== null) ||
        typeof toResolve === "function"
    ) {
        // 这个 called 变量的作用是啥？？
        // 估计就是保证不用再次取 then 的值
        // 目前不知道啥场景会再次取 then 的值？
        let called: boolean = false;

        // 万一 then.call(...) 报错了，用 try catch 捕获下
        try {
            let then = toResolve.then;
            if (typeof then === "function") {
                then.call(
                    toResolve,
                    (res: any) => {
                        if (called) return;
                        called = true;
                        // res 可能还是一个 thenable 对象
                        // 递归调用，直到是普通值为止
                        resolvePromise(basePromise, res, resolve, reject);
                    },
                    (err: Error) => {
                        if (called) return;
                        called = true;
                        reject(err);
                    }
                );
            } else {
                resolve(toResolve);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(toResolve);
    }
};

type Excutor = (resolve: Function, reject: Function) => unknown

class MyPromise {
    status: typeof PENDING | typeof RESOLVED | typeof REJECTED
    value: any
    reason: Error | undefined
    onResolvedCallbacks: Function[]
    onRejectedCallbacks: Function[]


    constructor(executor: Excutor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        // 箭头函数可以保证 this 指向 Mypromise 实例
        let resolve = (value: any) => {
            // 避免调用了 reject 后又调用 resolve
            if (this.status === PENDING) {
                // TODO 这里的 value 不用展开吗？
                this.value = value;
                this.status = RESOLVED;
                this.onResolvedCallbacks.forEach((fn) => fn());
            }
        };
        let reject = (reason: any) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach((fn) => fn());
            }
        };
        try {
            // try catch 只能捕获同步异常
            // TODO 那这种实现里 resolve reject 后面的代码，得等走完 callBacks 的 forEach 才执行呗？
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    // (4) then的参数可选  ...这里感觉挺偏的，一般不会这么用吧
    // let p = new Promise((resolve, reject) => {
    //     resolve(123);
    // });
    // p.then()
    //     .then()
    //     .then(data => {
    //         console.log(data);
    //     });

    // then 实例方法需要返回一个新的 promise 实例
    // ✨ then 方法是核心方法
    then(onFulfilled?: ((value: any) => unknown) | undefined | null, onRejected?: ((reason: any) => unknown) | Function | undefined | null) {
        // ts 里的类型守卫：
        // 如果这是一个库的话，那就要做运行时检查
        // 只是业务代码的话，不需要，ts 的编译时检查就可以了
        onFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : (data: any) => data;
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (err: any) => {
                    throw err;
                };

        let promise2 = new MyPromise((resolve, reject) => {
            // 如果 excutor 里是同步函数，
            // 执行 then 方法的时候，
            // status 就已经是 RESOLVED 或者 REJECTED
            if (this.status === RESOLVED) {
                // 实现 then 的时候用到了 setTimeout，其实本身就和真正的 then 不一样了
                setTimeout(() => {
                    // setTimeout 里才可以获取到 promise2
                    try {
                        let res = (onFulfilled as Function)(this.value);
                        resolvePromise(promise2, res, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = (onRejected as Function)(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            // 如果 excutor 里是异步函数，
            // 没有立刻调用 resolve 或者 reject
            // 就先订阅
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    try {
                        let x = (onFulfilled as Function)(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = (onRejected as Function)(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });
        return promise2;
    }

    // (8) 实例方法 catch
    catch(cb: Function) {
        return this.then(null, cb);
    }

    // (9) 实例方法 finally
    // finally 与 then 不同，finally 不会改变 promise 的状态
    finally(cb: Function) {
        try {
            let value = cb();

            return this.then(
                (data: any) => {
                    // Promise.resolve() 可以等待 promise 执行完成
                    return MyPromise.resolve(value).then(
                        () => data,
                        (err: Error) => {
                            throw err;
                        }
                    );
                },
                (err: Error) => {
                    return MyPromise.resolve(value).then(
                        () => {
                            throw err;
                        },
                        (err: Error) => {
                            throw err;
                        }
                    );
                }
            );
        } catch (err) {
            console.log("err333: ", err);
            // 这里应该也得抛出错误吧，还是说不用抛出错误？
        }
    }

    //（7）Promise.resolve
    // **Promise.resolve(value)** 方法返回一个以给定值解析后的 Promise 对象。
    static resolve(value: any) {
        let promise2 = new MyPromise((resolve, reject) => {
            // 感觉这里不用 try catch 也没事
            try {
                // 真正调用 resolve 函数时， 参数 value 和 这里的 promise2 不可能相同，
                // 就不用 setTimeout 将 promise2 当作第一个参数传入了
                resolvePromise({}, value, resolve, reject);
            } catch (err) {
                reject(err);
            }
        });
        return promise2;
    }

    // (5) Promise.defer 解决封装嵌套的问题
    // 这个方法 mdn 文档上并没有，不是标准里规定的方法
    // let fs =require('fs')
    // function read(url){
    //     let dfd=Promise.defer()
    //     fs.readFile(url,'utf8',function(err,data){
    //         if(err) dfd.reject(err)
    //         dfd.resolve(data)
    //     })
    //     return dfd.promise;
    // }
    // read('./name.txt').then(data=>{
    //     console.log(data)
    // })
    static defer() {
        type Dfd = {
            myPromise?: MyPromise
            resolve?: Function
            reject?: Function
        }

        let dfd: Dfd = {};
        dfd.myPromise = new MyPromise((resolve, reject) => {
            dfd.resolve = resolve;
            dfd.reject = reject;
        });
        return dfd
    }

    // (6) Promise.all
    // 静态方法
    // Promise.all([1,2,3,read('./name.txt'),6,7]).then(data=>{
    //     console.log(data)
    // })

    // 注意：
    // 结果也要是有序的
    // 任何一个出错就 reject
    static all(values: any[]) {
        return new MyPromise((resolve, reject) => {
            let arr: any[] = [];

            // 使用计数器解决多个异步的并发问题
            let index = 0;
            function processData(ind: number, value: any) {
                arr[ind] = value;
                index++;

                // 不能直接判断 arr.length 与 values.length 是否相等
                // 因为可能会给 arr 后面的项目先赋值，这样前面异步的项目会变为 <empty>，
                // 这时有异步结果没有返回，但是 arr.length 可能就已经和 values.length 相同了
                if (index === values.length) {
                    resolve(arr);
                }
            }

            for (let i = 0; i < values.length; i++) {
                const current = values[i];

                MyPromise.resolve(current).then(
                    (data) => {
                        processData(i, data);
                    },
                    (reason) => {
                        reject(reason)
                    }
                );
            }
        });
    }



    //（10）静态方法 Promise.race
    static race(values: MyPromise[]) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < values.length; i++) {
                const current = values[i];

                MyPromise.resolve(current).then((data) => {
                    resolve(data);
                }, reject);
            }
        });
    }

    get [Symbol.toStringTag]() {
        return 'MyPromise'
    }

}


// 直接通过这种 Classname.staticFn 的方法追加静态属性，
// 比在 class 的定义里通过 static 的好处是
// 可以避免在 class 的定义里写太多内容
// 但是 ts 里目前试着不支持这种写法


// let p=new MyPromise((resolve,reject)=>{
//     // reject(333)
//     setTimeout(()=>{
//         resolve(111)
//     })
// })
// // const promise1 = MyPromise.resolve(p);

// // 想看看人家官方 ts 里是怎么写的。。。
// // 但是官方写的太复杂了吧。。。
// p.then(function(value) {
//     console.log('value:'+value);
// },err=>{
//     console.log('err: '+err)
// });


// let p = new MyPromise((resolve, reject) => {
//     reject(1000);
// });
// p.then(data => {
//     console.log(data);
// })
//     .catch(e => {
//         console.log("err: " + e);
//     })
//     .then(data => {
//         console.log(data);
//     });

// 目前看着 ts 里不支持用 xxClasss.prototype.xxFn 的方式给类添加实例方法
// 也不支持 xxClasss.xxStaticFn 的方式给类添加静态方法


// let p = new MyPromise((resolve, reject) => {
//     // reject(1000);
//     resolve(1000);
// });
// p.finally(() => {
//     console.log("最终的");
//     return new MyPromise((resolve, reject) => {
//         console.log("finally 中的 promise");

//         reject(11111);
//         // resolve(11111);
//     });
// })
//     .then(data => {
//         console.log("then: " + data);
//     })
//     .catch(e => {
//         console.log("err: " + e);
//     });


// const promise1 = new MyPromise(function (resolve, reject) {
//     setTimeout(resolve, 500, "one");
// });

// const promise2 = new MyPromise(function (resolve, reject) {
//     setTimeout(resolve, 200, "two");
// });

// MyPromise.race([promise1, promise2]).then(function(value) {
//     console.log(value);
// },err=>{
//     console.log('err: '+err)
// });

// MyPromise.all([promise1, promise2]).then(
//     function (value) {
//         console.log(value);
//     },
//     (err) => {
//         console.log("err: " + err);
//     }
// );

// https://leohxj.gitbooks.io/front-end-database/content/javascript-modules/about-umd.html
// UMD (Universal Module Definition), 希望提供一个前后端跨平台的解决方案(支持AMD与CommonJS模块方式)。
// UMD的实现很简单：

// 先判断是否支持Node.js模块格式（exports是否存在），存在则使用Node.js模块格式。
// 再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。
// 前两个都不存在，则将模块公开到全局（window或global）。

// ✨ 所以 UMD 的确没有考虑 esModule

// Rollup allows you to write your code using the new module system, and will then compile it back down to existing supported formats such as CommonJS modules, AMD modules, and IIFE-style scripts. 
