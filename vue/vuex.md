# vuex
是一个状态管理模式，集中式存储管理应用所有组件的状态。
好处：
1.遵循单向数据流理念，易于问题追踪以及提高代码可维护性
2.方便视图间传参和状态同步

## 和redux最大的区别
vuex和vue强耦合，借用vue本身的数据响应式机制

```js
class KStore {
    constructor(options) {
        this.state = options.state;
        this.mutations = options.mutations;
        this.actions = options.actions;
        // 借用vue本身的数据响应式机制
        this.vm = new Vue({
            data: {
                state: this.state
            }
        });
    }
    commit(type, payload) {
        const mutation = this.mutations[type];
        mutation(this.state, payload);
    }
    dispatch(type, payload) {
        const action = this.actions[type];
        const ctx = {
            commit: this.commit.bind(this),
            state: this.state,
            dispatch: this.dispatch.bind(this)
        };
        return action(ctx, payload);
    }
}

```

## actions
异步的actions里面通常返回一个promise，这样能用.then来进行异步函数完成后的操作
context:
```js
{
    commit:f,
    dispatch:f,
    getters:{},
    rootGetters:{},
    rootState:{__ob__:Observer},
    state:{__ob__:Observer}
}
```
actions里面可以做很复杂的逻辑
```js
actions:{
    requestLogin({commit},payload){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                commit('login)
                resolve(true)
            },1000)
        })
    }
}
```