# vue-router

## 路由传参数
/detail/:id
detail.vue中：
1.$route.params.id  $route.query.redirect
2.
```js
export default {
    props:['id']
}
```

## 重定向
$router：路由器 $route：路由
```js
this.$router.push(redirect)
```

## $router 与 $route 的区别
$router:router的实例对象，包含了许多关键的属性和方法
$route:路由对象，表示当前激活的路由的状态信息，包含了当前url解析得到的信息，还有url匹配到的路由记录


## 路由守卫
全局beforeEach(to,from,next) 
路由独享beforeEnter(to,from,next) 
组件beforeRouteEnter(to,from,next)

## 导航解析流程
1.导航被触发
2.调用全局的beforeEach守卫
3.在重用的组件里调用beforeRouteUpdate守卫
4.在路由配置里调用beforeEnter
5.在被激活的组件里调用beforeRouteEnter
6.调用全局的beforeResolve守卫
7.导航被确认
8.调用全局的afterEach钩子
9.触发dom更新

## router-link

\<router-link> 比起写死的 \<a href="..."> 会好一些，理由如下：

无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，或者在 IE9 降级使用 hash 模式，无须作任何变动。
在 HTML5 history 模式下，router-link 会守卫点击事件，让浏览器不再重新加载页面。
当你在 HTML5 history 模式下使用 base 选项之后，所有的 to 属性都不需要写 (基路径) 了。

## vue-router hash模式与history模式区别
https://blog.csdn.net/yexudengzhidao/article/details/87689960

1 hash 模式下，仅 hash 符号之前的内容会被包含在请求中

2 history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.abc.com/book/id 如果后端缺少对 /book/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

3 结合自身例子，对于一般的 Vue + Vue-Router + Webpack + XXX 形式的 Web 开发场景，用 history 模式即可，只需在后端（Apache 或 Nginx）进行简单的路由配置，同时搭配前端路由的 404 页面支持。

## 原理
和vuex一样，和vue强绑定，利用了vue的数据监听

hash模式是用window对象监听"hashChange"事件
history模式用window对象监听"popstate"事件

```js
class VueRouter {
    constructor(Vue, options) {
        this.$options = options;
        this.routeMap = {};
        this.app = new Vue({
            data: {
                current: "#/"
            }
        });
        this.init();
        this.createRouteMap(this.$options);
        this.initComponent(Vue);
    }

    // 初始化 hashchange
    init() {
        window.addEventListener("load", this.onHashChange.bind(this), false);
        window.addEventListener(
            "hashchange",
            this.onHashChange.bind(this),
            false
        );
    }
    createRouteMap(options) {
        options.routes.forEach(item => {
            this.routeMap[item.path] = item.component;
        });
    }
    // 注册组件
    initComponent(Vue) {
        Vue.component("router-link", {
            props: {
                to: String
            },
            render: function(h) {
                // h <==> createElement
                // <a :href="to"><slot></slot></a>
                return h();
            }
        });
        "a", { attrs: { href: this.to } }, this.$slots.default;
        const _this = this;
        Vue.component("router-view", {
            render(h) {
                var component = _this.routeMap[_this.app.current];
                return h(component);
            }
        });
    }
    // 获取当前 hash 串
    getHash() {
        return window.location.hash.slice(1) || "/";
    }
    // 设置当前路径
    onHashChange() {
        this.app.current = this.getHash();
    }
}

```