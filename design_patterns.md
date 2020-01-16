# 设计模式

## js发布订阅模式

```js
class Event {
    constructor() {
        this.callbacks = {};
    }
    $off(name) {
        this.callbacks[name] = null;
    }
    $emit(name, args) {
        let cbs = this.callbacks[name];
        if (cbs) {
            cbs.forEach(c => {
                c.call(this, args);
            });
        }
    }
    $on(name, fn) {
        (this.callbacks[name] || (this.callbacks[name] = [])).push(fn);
    }
}

let event = new Event();
event.$on("event1", function(arg) {
    console.log("事件1", arg);
});
event.$on("event1", function(arg) {
    console.log("又一个时间1", arg);
});
event.$on("event2", function(arg) {
    console.log("事件2", arg);
});
event.$emit("event1", { name: "开课吧" });
event.$emit("event2", { name: "全栈" });

```

## 发布订阅模式与观察者模式的区别

https://blog.csdn.net/Firvana_Mutex/article/details/82696406

在观察者模式中，观察者是知道Subject的，Subject一直保持对观察者进行记录。然而，在发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信。

在发布订阅模式中，组件是松散耦合的，正好和观察者模式相反。

## 单例模式

## 策略模式
将算法的使用算法的实现分离开来
应用：优化表单校验

## 代理模式
防抖截流也算代理模式

## 中介者模式
redux，vuex 都属于中介者模式的实际应用，我们把共享的数据，抽离成一个单独的store， 每个都通过store这个 中介来操作对象

## 装饰器模式
装饰者模式的定义:在不改变对象自身的基础上，在程序运行期间给对象动态地添加方法。常见应用，react的高 阶组件, 或者react-redux中的@connect 或者自己定义一些高阶组件。

## 外观模式
外观模式即让多个方法一起被调用
涉及到兼容性，参数支持多格式，有很多这种代码，对外暴露统一的api，比如上面的$on 支持数组，$off参数支持多个情况， 对外只用一个函数，内部判断实现

## 工厂模式
提供创建对象的接口，把成员对象的创建工作转交给一个外部对象，好处在于消除对象之间的耦合(也就是相互影响)
常见的例子，我们的弹窗，message，对外提供api然后新建一个弹窗或者Message的实例就是典型的工厂模式

## 建造者模式
和工厂模式相比，参与了更多创建的过程或者更复杂

## 迭代器模式

## 享元模式
如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就非常有用了。在 JavaScript 中，浏览器特别是移动端的浏览器分配的内存并不算多，如何节省内存就成了一件非常有意义的事情。

例子：elementUi dialog
Dialog只会在项目初始化时被 new 一次，每次使用Message组件通过改变Dialog的状态更新组件DOM，其实很容易知道new一个组件的成本要比一个组件的更新成本高很多

## 职责链模式？？

## 适配器模式

## 模板方法模式？？

## 备忘录模式
可以恢复到对象之前的某个状态，其实大家学习react或者redux的时候，时间旅行的功能，就算是备忘录模式的一 个应用



