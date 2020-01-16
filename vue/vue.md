https://segmentfault.com/a/1190000016344599?utm_source=tag-newest

# vue

感觉文档上的每一句话都可能会考...这考的是对框架的熟悉度？？？对框架不够熟悉也的确会影响工作，编写组件的速度会慢，有时候会没有用到更优的方案，有时候会不知道该如何利用框架来解决某个问题。但是，平时学习重心还是要放到源码与算法上。框架文档方面，一边看一边去理解框架开发者的架构思想。

## vue核心 
vue核心是数据变化时会自动更新相应的视图

vue2是通过Object.defineProperty()来劫持各个属性的setter,getter。每个组件实例都对应一个watcher实例，它在组件渲染过程接触到数据属性，这时会触发数据属性的getter方法，getter方法会将这个watcher追加到数据属性的dep数组中。当数据属性的setter触发时，会执行dep数组中所有watcher的update方法，使组件重新渲染。

## mvvm
model-view-viewmodel
通过viewmodel来处理model与view之间的同步(也称数据与视图的双向绑定)

## 单向数据绑定 双向数据绑定
https://www.cnblogs.com/luoqian/p/6440146.html
单向：数据变化->更新页面
双向：数据变化->更新页面  页面变化->更新数据
双向绑定=单向绑定+ui事件监听



## vue内置组件
component yes 是有的
slot
transition
transition-group
keep-alive

## 常用指令
v-if v-for v-show v-html v-text v-if v-else v-else-if v-on v-bind v-model v-slot

## 生命周期 每个生命周期干了什么 先跟着文档手敲一遍

所有的生命周期钩子自动绑定this上下文到实例中，因此可以访问数据，对属性和方法进行运算。这意味着不能使用箭头函数来定义一个生命周期方法。

|钩子名称|具体发生了什么|服务端渲染是否调用 不调用要注明|
|-|-|-|
|beforeCreate|在实例初始化之后，数据观测(data observer)和 event/watcher 事件配置之前被调用|-|
|created|在实例创建完成后立即调用。在这一步，实例已经处理完了options,意味着完成了以下的配置：数据观测(data observer)，计算属性，方法，watch/event 事件回调。然而，挂载阶段还没开始，$el属性目前不可见|-|
|beforeMount|在挂载开始之前被调用:相关的render函数首次被调用|不被调用|
|mounted|el被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。mounted没有承诺所有的自组件也都一起被挂载。如果希望等到整个视图都渲染完毕，应该在生命周期方法内使用vm.$nextTick|不被调用|
|beforeUpdate|数据更新时调用，发生在虚拟DOM打布丁之前。这里适合在更新前访问现有的DOM,比如手动移除已添加的事件监听器。|不被调用，因为只有初次渲染会在服务端进行。|
|updated|由于数据更改导致的虚拟dom重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件DOM已经更新，可以执行依赖于DOM的操作。要避免在此期间更改状态，因为这可能会导致更新的无限循环。updated没有承诺所有的自组件也都一起被重绘。如果希望等到整个视图都重绘完毕，要在方法内使用vm.$nextTick。|不被调用|
|activated|keep-alive组件激活时调用|不被调用|
|deactivated|keep-alive组件停用时调用|不被调用|
|beforeDestroy|实例销毁之前调用。在这一步，实例仍然完全可用。|不被调用|
|destroyed|vue实例销毁后调用。调用后，vue实例的所有指令都会解除绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。|不被调用|

## $.nextTick(cb)
在下次DOM更新循环结束之后执行回调函数。

## 异步更新队列
vue在更新dom时是异步执行的。只要侦听到数据变化，vue将开启一个队列，并缓冲在同一个事件循环中发生的所有数据变更。如果同一个watcher被多次触发，只会被推入到队列中一次。在缓冲时去除重复数据对于避免不必要的计算和dom操作是非常重要的。然后，在下一个的事件循环tick中，vue刷新队列并执行已去重的工作。vue在内部对异步队列尝试使用原生的 Promise.then 、 MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn,0) 代替。  

## $set
```js
Vue.set(target,propertyName/index,vale)
```
用于向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。向响应式对象上添加新属性必须用set方法，因为Vue无法探测普通的新增属性。
注意对象不能是Vue实例，或者Vue实例的根数据对象。

## computed和watch的区别
https://segmentfault.com/a/1190000012948175
> computed特性
是计算值，
应用：就是简化tempalte里面{{}}计算
缓存性：基于它们的响应式依赖进行缓存。只在相关响应式依赖发生改变时才会重新求值，响应式依赖没有改变时，计算属性会立即返回之前的计算结果，而不必再次执行函数。

> watch特性
是观察的动作，
应用：在数据变化时执行异步或者开销较大的操作时使用
缓存性：无缓存性，页面重新渲染时值不变化也会执行

## watch deep
```js
watch:{
  data:{
    deep:true,
    handler(newVal,oldVal){

    }
  }
}
```

## key的作用
1.主要用在vue的虚拟dom算法，在新旧nodes对比时辨识vnodes。如果不使用key,vue会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用key，它会基于key的变化重新排列元素顺序，并且会移除key不存在的元素。
2.强制替换元素/组件，从而可以触发组件的生命周期钩子或者触发过渡。

## 不能在slot上绑定和触发事件
https://blog.csdn.net/wu_xianqiang/article/details/88950300
https://github.com/vuejs/vue/issues/4332

You cannot listen to events on \<slot>. It can end up rendering anything: text, plain element, multiple nodes... the behavior will be unpredictable.

It seems you are trying to make a slot container communicate with a slot child - in most cases this means the two components are coupled by-design, so you can do something like this.$parent.$emit(...) from the child, and listen to that event in the parent with this.$on(...).

I am still open to ideas on improving the ways slot parent and child can communicate, but events on \<slot> doesn't really sound like a right direction to me.

## v-if v-show区别
https://cn.vuejs.org/v2/guide/conditional.html#v-if-vs-v-show
https://blog.csdn.net/wxl1555/article/details/76594134

v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

## 组件通信
### 上下游关系组件通信：
1. 父->子 props

2. 子$emit事件

3. 父亲通过$refs直接调用儿子的 方法

4. \$parent $children 多层级传递

5. \$attrs \$listeners
**\$attrs批量向下传入属性**
\$attrs包含了父作用域中不作为prop被识别且获取的特性绑定（class和style除外）。当一个组件没有声明任何prop时，这里会包含所有父作用域的绑定（class和style除外），并且可以通过 v-bind="\$attrs"传入内部组件，在创建高级别的组件时非常有用。
**\$listeners批量向下传入方法**
\$listeners包含了父作用域中的（不含 .native 修饰器的）v-on 事件监听器。它可以通过 v-on="\$listeners" 传入内部组件，在创建更高层次的组件时非常有用

6. provide&inject选项
这对选项允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。

### 跨组件通信：
1. 小项目可以用事件总线 入口文件：
```javascript
Vue.prototype.$bus = new Vue()
```
2. 大项目用vuex

## $on
```js
vm.$on( event, callback )
```

监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数。

## $event
1.在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法：
```html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```
```js
// ...
methods: {
  warn: function (message, event) {
    // 现在我们可以访问原生事件对象
    if (event) event.preventDefault()
    alert(message)
  }
}
```

2.使用事件抛出一个值

有的时候用一个事件来抛出一个特定的值是非常有用的。例如我们可能想让 \<blog-post> 组件决定它的文本要放大多少。这时可以使用 $emit 的第二个参数来提供这个值：
```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```
然后当在父级组件监听这个事件的时候，我们可以通过 $event 访问到被抛出的这个值：
```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```
或者，如果这个事件处理函数是一个方法：
```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```
那么这个值将会作为第一个参数传入这个方法：
```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

## patch 的数组方法
![](./imgs/vue_array_patch.png)



## 渲染函数
template会多一层编译
```javascript
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

这里是 createElement 接受的参数：
```
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中属性对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```


## mixins与extends选项区别

mixins 选项接受一个混入对象的数组。这些混入实例对象可以像正常的实例对象一样包含选项，他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。

Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。

```js
var mixin = {
  created: function () { console.log(1) }
}
var vm = new Vue({
  created: function () { console.log(2) },
  mixins: [mixin]
})
// => 1
// => 2
```

extends允许声明扩展另一个组件(可以是一个简单的选项对象或构造函数)，而无需使用 Vue.extend。这主要是为了便于扩展单文件组件。

这和 mixins 类似。

示例：
```
var CompA = { ... }

// 在没有调用 `Vue.extend` 时候继承 CompA
var CompB = {
  extends: CompA,
  ...
}
```

## 虚拟dom diff算法
https://www.cnblogs.com/wind-lanyan/p/9061684.html

在采取diff算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较。




## Vue.set vm.$set
Vue.set( target, propertyName/index, value )
用法：
向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如 this.myObject.newProperty = 'hi')

注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。

## Vue组件间的参数传递
1.父组件与子组件传值
父组件传给子组件：子组件通过props方法接受数据;
子组件传给父组件：$emit方法传递参数
2.非父子组件间的数据传递，兄弟组件传值
eventBus，就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。项目比较小时，用这个比较合适。（虽然也有不少人推荐直接用VUEX，具体来说看需求咯。技术只是手段，目的达到才是王道。）

### EventBus
https://segmentfault.com/a/1190000013636153?utm_source=tag-newest

bus.js:
```js
import Vue from 'vue';  
export default new Vue(); 
```

## keep-alive

https://www.cnblogs.com/gaosirs/p/10601463.html

Vue 的缓存机制并不是直接存储 DOM 结构，而是将 DOM 节点抽象成了一个个 VNode节点。
因此，Vue 的 keep-alive 缓存也是基于 VNode节点 而不是直接存储 DOM 节点。

将需要缓存的VNode节点保存在this.cache中，在render时，如果VNode的name符合在缓存条件（可以用include以及exclude控制），则会从this.cache中取出之前缓存的VNode实例进行渲染。

\<keep-alive>包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和\<transition>相似，\<keep-alive>是一个抽象组件：它自身不会渲染一个dom元素，也不会出现在父组件链中。
当组件在\<keep-alive>内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

## vue 与 react的区别

> 优化

在 React 应用中，当某个组件的状态发生变化时，它会**以该组件为根，重新渲染整个组件子树**。
如要**避免不必要的子组件的重渲染**，你需要在所有可能的地方使用 PureComponent，或是手动实现 shouldComponentUpdate 方法。同时你可能会需要使用不可变的数据结构来使得你的组件更容易被优化。
然而，使用 PureComponent 和 shouldComponentUpdate 时，需要保证该组件的整个子树的渲染输出都是由该组件的 props 所决定的。如果不符合这个情况，那么此类优化就会导致难以察觉的渲染结果不一致。这使得 React 中的组件优化伴随着相当的心智负担。

**在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了shouldComponentUpdate，并且没有上述的子树问题限制。**
Vue 的这个特点使得开发者不再需要考虑此类优化，从而能够更好地专注于应用本身。

> HTML & CSS

在 React 中，一切都是 JavaScript。不仅仅是 HTML 可以用 JSX 来表达，现在的潮流也越来越多地将 CSS 也纳入到 JavaScript 中来处理。这类方案有其优点，但也存在一些不是每个开发者都能接受的取舍。
Vue 的整体思想是拥抱经典的 Web 技术，并在其上进行扩展。

> 规模
两者另一个重要差异是，**Vue 的路由库和状态管理库都是由官方维护支持且与核心库同步更新的。React 则是选择把这些问题交给社区维护，因此创建了一个更分散的生态系统。但相对的，React 的生态系统相比 Vue 更加繁荣**。

