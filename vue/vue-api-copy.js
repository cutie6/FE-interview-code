//脑图中不方便敲代码 先在这里敲 然后拷贝到脑图里 脑图里不方便看 y也到这里来看吧
var res = Vue.compile("<div><span>{{msg}}</span></div>");

new Vue({
    data: {
        msg: "hello"
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
});

// render function
Vue.component('anchored-heading',{
    render:function(createElement){
        return createElement(
            'h'+this.level,//标签名称
            this.$slots.default//子节点数组
        )
    },
    props:{
        level:{
            type:Number,
            required:true
        }
    }
})

// createElement参数
// returns {VNode}
createElement(
    //{String | Object | Function}
    //一个HTML标签名、组件选项对象，
    //或者resolve了上述任何一种的一个async函数。必填
    'div',

    //{Object}
    //一个与模版中属性对应的数据选项。可选。
    {},

    //{String | Array}
    //子级虚拟节点(VNodes)，由 createElement() 构建而成，
    //也可以使用字符串来生成“文本虚拟节点”。可选。
    [
        '文字',
        createElement('h1','一则头条'),
        createElement(MyComponent,{
            props:{
                someProp :'foobar'
            }
        })
    ]
)

//renderError
new Vue({
    render(h){
        throw new Error('opps')

    },
    renderError(h,err){
        return h('pre',{style:{color:'red'}},err.stack)
    }
}).$mount('#app')


//mixin option
var mixin={
    created:function(){
        console.log(1)
    }
}
var vm=new Vue({
    created:function(){
        console.log(2)
    },
    mixins:[mixin]
})
// => 1
// => 2

// extends option
var CompA={/*...*/}

//在没有调用 Vue.extend 的时候继承 ComA
var CompB = {
    extends: CompA
    /*...*/
};

// functional component
Vue.component('my-component',{
    functional :true,
    //props是可选的
    props:{
        //...
    },
    //为了弥补缺少的实例
    //提供第二个参数作为上下文
    render: function(createElement,context){
        //...
    }
})

//get custom options
new Vue({
    customOption: 'foo',
    created: function(){
        console.log(this.$options.customOption) // => 'foo'
    }
})

//vm.$watch
// 键路径
WeakMap.$watch('a.b.c',function(newVal,oldVal){
    // do sth
})

// 函数
vm.$watch(
    function(){
        //表达式 this.a + this.b 每次得出一个不同的结果时
        //处理函数都会被调用。
        //这就像监听一个未被定义的计算属性
        return this.a + this.b

    },
    function(newVal,oldVal){
        //do sth
    }
)

//vm.$watch 返回一个取消观察函数，用来停止触发回调：
var unwatch = vm.$watch('a',cb)
//之后取消观察
unwatch()

