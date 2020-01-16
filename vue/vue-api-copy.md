# 手敲核心概念核心api增强记忆 能用图不用表 能用表不用文字 直接用脑图去记忆好了

学习优秀框架步骤：
1.初步了解、使用
2.了解核心原理，看优秀的核心源码教程
3.手敲核心api整理成脑图，边敲边理解边思考创作者的想法，包括大的结构与小的细节。脑图的好处在既见森林又见树木。（和临摹名画，小时候手抄好词好句一样，不过我之前做这两件事情时，都忽略了对结构的理解，之前太没有大局观与结构化意识了。）
4.看优秀的更细节一些的源码教程

迁移到了processon脑图：
https://www.processon.com/mindmap/5dd131f1e4b094d785afd5c6

## 全局api

### Vue.extend(options)
使用基础Vue构造器，创建一个“子类”。参数是一个包含组件选项的对象。
data选项是特例，在Vue.extend(）中必须是函数

### Vue.nextTick([callback,context])
在下次dom更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的dom.

### Vue.set(target,propertyName/index,value)
向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。

### Vue.directive(id,[definition])

```js
//注册
Vue.directive('my-directive',{
    bind:function(){},//只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    inserted:function(){},//被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）
    update:function(){},//所在组件的VNode更新时调用，但是可能发生在其子VNode更新之前。
    componentUpdated:function(){},//指令所在组件的VNode及其子VNode全部更新后调用。
    unbind:function(){}//只调用一次，指令与元素解绑时调用
})

//注册（指令函数）
Vue.directive('my-directive',function(){
    //这里将会被 bind 和 update 调用
})

//getter 返回已注册的指令
var myDirective = Vue.directive('my-directive')
```


### Vue.filter(id,[definition])
```js
// 注册
Vue.filter('my-filter',function(value){
    //
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')
```

### 脑图中不方便敲代码 先在这里敲 然后拷贝到脑图里
```js
//注册组件，传入一个扩展过的构造器
Vue.component('my-component',Vue.extend({/*...*/}))

//注册组件，传入一个选项对象（自动调用 Vue.extend）
Vue.component('my-component',{/*...*/})

//获取注册的组件（始终返回构造器）
var MyComponent = Vue.component('my-component')


```