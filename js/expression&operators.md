# 表达式和运算符

## 运算符优先级
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
运算符的优先级决定了表达式中运算执行的先后顺序，优先级高的运算符先被执行。

### 关联性
关联性决定了拥有相同优先级的运算符的执行顺序。考虑下面表达式：
```
a OP b OP c
```
左关联：(a OP b) OP c
右关联：a OP (b OP c)

**赋值运算符是右关联的**
```js
a=b=5
```
结果： a 和 b 的值都是5
过程：b 被赋值为5，a 被赋值为 b=5 的返回值，也就是5