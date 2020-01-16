# 算法

**一个算法在看过一两遍理解之后，必须要闭卷手敲运行一次，甚至两三次。面试要求闭卷手写，准备时如果光看不闭卷手敲是过不了面试的！**

## js中数组sort 方法的时间复杂度
https://segmentfault.com/q/1010000007133473?_ea=1247880

Mozilla/Firefox : 归并排序 O(nlog2n)
V8 ：数组长度小于等于 22 的用插入排序??，其它的用快速排序O(nlog2n)

## leetcode第一题
空间换取时间，用一个中间变量对象

## 二叉树

### 二叉树求所有路径总和
```js
class Node{
    value:Number,
    left:Node实例,
    right:Node实例,
}
```
为了节省时间先写思路，以后再仔细手写检查
思路：
从root开始往下遍历（前序遍历，或者用队列的方式按层遍历都行），每一个节点都增加一个新的属性 sumValue,是上层父亲节点的sumValue与本节点的value总和，当判断当前node为最底层的节点（没有左右子节点）时，将其值累加到最外层的result变量上。
遍历结束返回result


### 二叉树是否有某条路径和为某个特定值
https://blog.csdn.net/yccccc_c/article/details/102569631
这里用了动态规划和递归
为了节省时间先复制粘贴，以后再闭卷手写
```js
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
//结点值可为负数
class Solution {
    public boolean hasPathSum(TreeNode root, int sum) {
       boolean lans,rans;
        if(root==null){
            return false;
        }else if(root.val==sum && root.left==null && root.right==null){//在递归里，直接得到最终目标或者永远不能得到最终目标的先做判断（即，寻找退出条件）
            return true;
        }else{
            lans = (root.left!=null)?hasPathSum(root.left , sum-root.val):false;
            rans = (root.right!=null)?hasPathSum(root.right , sum-root.val):false;
            //不能return (root.left!=null)?hasPathSum(root.left , sum-root.val):false||(root.right!=null)?hasPathSum(root.right , sum-root.val):false;
            return lans||rans;
           //左右两条路径有至少一条走通即可，两边要同时判断(放在一句里，同时执行)
        }
    }
}


```

## 快速排序

```js
//大爷的 新建两个数组来保存左边的小数组与右边的大数组思路要简单很多 移动指针难想
function quicksort(arr) {
    let flag = arr[0],
        len = arr.length,
        i = 1,
        j = len - 1;
    if (len === 1) {
        return arr;
    }

    //如果数组是两个元素，i==j 直接给两个元素排序？？？
    if(len===2){
        if(arr[0]<=arr[1]) return arr
        else return [arr[1],arr[0]]
    }

    //我傻逼了 不用<=
    while (i < j) {
        debugger
        // while (i < j) {
            //这样可能会无限循环 跳不出去
        //     debugger 
        //     if (arr[i] <= flag) {
        //         i++;
        //     }
        //     if (arr[j] > flag) {
        //         j--;
        //     }
        // }

        while (arr[i]<=flag&&i<j) {
            i++
        }

         while (arr[j] > flag && i < j) {
            j--;
         }

        //交换
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    let left=arr.slice(1,i),right=arr.slice(i+1)
    return [...quicksort(left),flag,...quicksort(right)]
}

console.log(quicksort([2, 1,5,0,9,3]));


//开课吧pdf 数组中是两个元素时应该也有问题啊 [1,2]排序有问题 [2,1]倒是正确 
function quick_sort1(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let pivot = arr[0];
    let i = 1;
    let j = arr.length - 1;
    while (i < j) {
        let pivot = arr[0];
        while (arr[j] >= pivot && i < j) {
            j--;
        }
        while (arr[i] <= pivot && i < j) {
            i++;
        }
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let left = arr.slice(1, i + 1);
    let right = arr.slice(j + 1);
    debugger;
    return [...quick_sort1(left), pivot, ...quick_sort1(right)];
}
// console.log(quick_sort1([1,2]));

```


## 归并排序
归并算法，指的是将两个顺序序列合并成一个顺序序列的方法。

使用递归的代码如下。优点是描述算法过程思路清晰，缺点是使用递归，mergeSort()函数频繁地自我调用。长度为n的数组最终会调用mergeSort()函数 2n-1次，这意味着一个长度超过1500的数组会在Firefox上发生栈溢出错误。可以考虑使用迭代来实现同样的功能。
```js
//合并两个排序数组 
function merge(left, right) {
    var result = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            /*shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。*/
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    //到这里只会剩下一个数组里面有数值
    return result.concat(left).concat(right);
}

function mergeSort(items) {
    if (items.length == 1) {
        return items;
    }
    var middle = Math.floor(items.length / 2),
        left = items.slice(0, middle),
        right = items.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
```

我自己写的 2020-01-03

**不推荐写成一行。写成一行时括号特别容易写错，写错了就会有奇怪的问题。并且可读性低。**

```js
function merge(arr1, arr2) {
    let i = (j = 0);
    let result = [];
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            result.push(arr1[i]);
            i++;
        } else {
            result.push(arr2[j]);
            j++;
        }
    }
    return result.concat(arr1.slice(i), arr2.slice(j));
}

function mergeSort(arr) {
    if (arr.length === 1) return arr;
    const mid = Math.floor(arr.length / 2);

    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));
    return merge(left, right);

    // 不推荐写成一行
    // 这样写成一行时括号特别容易写错，写错了就会有奇怪的问题
    // 并且可读性低
    // 写成一行的时候，是先给第二个参数求值
    // return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

console.log(mergeSort([5, 1]));
// console.log(mergeSort([5, 1,9,7,2]));
```

### 双指针法在处理两个数组的问题时很管用，不少时候可以避免暴力的O（n^2）的方法

> 合并两个有序数组
```js
function mergeTwoSortedArr(arr1, arr2) {
    let len1 = arr1.length,
        len2 = arr2.length;
    let i = 0,
        j = 0;
    let result = [];
    while (i < len1 && j < len2) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i]);
            i++;
        } else {
            result.push(arr2[j]);
            j++;
        }
    }

    if (i < len1) {
        result = result.concat(arr1.slice(i));
    }
    if (j < len2) {
        result = result.concat(arr2.slice(j));
    }
    console.log('=====>'+result);
    return result;
}
```

> 寻找两个有序数组中重复的数字
https://studygolang.com/articles/22508

使用双指针法 将比较结果较小的，将指针后移。相等的时候，指针同时后移

## 插入排序
插入排序的基本思想是：每步将一个待排序的记录，按其关键码值的大小插入前面已经排序的文件中适当位置上，直到全部插入完为止。
```js
//测试数组
var arr = new Array(1, 3, 2, 8, 9, 1, 5);
//插入排序
function InsertionSort(arr) {
    if (arr == null || arr.length < 2) {
        return arr;
    }
    for (let i = 1; i < arr.length; i++) {
        for (let j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
    }
    return arr;
}
//控制台输出
console.log(arr);
InsertionSort(arr);
console.log(arr);
```

## 斐波那契算法 最好的是从底向上
从上分解到底：
```js 
function fib(n){
    let memo = []
    return helper(memo, n)
}
function helper(memo, n){
    if(n==1 || n==2){
// 前两个
return 1 }
// 如果有缓存，直接返回
if (memo[n]) return memo[n];
// 没缓存
memo[n] = helper(memo, n - 1) + helper(memo, n - 2) return memo[n]
}
```
从底向上：
```js
 // 斐波那契 
 function fib(n){
    let dp = []
    dp[1] = dp[2] = 1
    for (let i = 3; i <=n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n]
}
 
```

##  pid数组转树结构
https://blog.csdn.net/qq_33594380/article/details/82462701

不少算法里都需要先对项目进行排序，有序之后才好进行下一步的流程

```js
var nodes = [
    { id: 10, title: "dw10", parentId: 4 },
    { id: 2, title: "dw2", parentId: 0 },
    { id: 7, title: "dw7", parentId: 30 },
    { id: 4, title: "dw4", parentId: 2 },
    { id: 12, title: "dw12", parentId: 2 },
    { id: 8, title: "dw8", parentId: 4 }
];

// sort 这里需要排序，不然运行到第四项时，把map里key为4的项目删除了，运行到最后一项又得添加一个key为4的项目
// 排序可以将pid一样的元素排在一起，这是排序对这个算法起作用的部分，这样能将pid的子元素全都给push到其children数组中，之后遇到了其父亲元素后，能将其直接从childMap对象中删除，也不会再有其他的子元素导致需要再往childMap中再次添加这个key.
function cmp(a, b) {
    return a.parentId - b.parentId;
}
nodes.sort(cmp);
//sort之后数组按照pId是 0 2 2 4 4 30

var childMap = {};
// 从后向前遍历 从前往后应该也是可以的
for (var i = nodes.length - 1; i >= 0; i--) {
    var nowPid = nodes[i].parentId;
    var nowId = nodes[i].id;
    // 建立当前节点的父节点的children 数组
    if (childMap[nowPid]) {
        childMap[nowPid].push(nodes[i]);
    } else {
        childMap[nowPid] = [];
        childMap[nowPid].push(nodes[i]);
    }
    // 将children数组的引用赋值给数组项的children属性，并删除childMap中对children数组的引用
    if (childMap[nowId]) {
        nodes[i].children = childMap[nowId];
        delete childMap[nowId];
    }
}

console.log(childMap);
```

## 语意化版本比较大小
格式：
major.minor.patch-{alpha|beta|rc}.{number}
其中：
major>minor>patch
rc>beta>alpha
例子：
1.2.3<1.2.4<1.3.4<2.0.0.alpha.1<2.0.0.alpha.2<2.0.0.beta.1<2.0.0.rc.1<2.0.0

鉴于时间，先写思路，以后再细写
思路：将rc等变换成不同权重的负数，将没有后两项的版本号补两个0，然后从前循环比较每一项的大小

设置一个map:{
    rc:-1,
    beta:-2,
    alpha:-3
}
将字符串变成数组,将rc等替换成数字
if(arr[3] && (arr[3] in map)){
    arr[3]=map(arr[3])
}
循环比较，如果哪个数组缺少 arr[3] arr[4],先将这两项设置成0再比较

## 全排序 便利蜂面试

1. 下面的方式是我 2019.12.18 闭卷手写的，用了尾递归的方案
注意递归调用时不能改变原 result 与 source
**注意在很多递归算法里调用递归函数时不要改变原来的值（状态），用concat,slice等不改变原数组的方法返回新数组当参数**

```js
// 全排序 2019.12.18 闭卷手写成功哎 开心
// [1,2,3]=>
// [1,2,3] [1,3,2]
// [2,1,3] [2,3,1]
// [3,1,2] [3,2,1]
function allSequence(arr) {
    // 思路是result是用来保存排列结果的数组
    // 这个函数每次都会循环source中的项目，将项目从source中移走一项，push到result数组的后面
    const arrangeOneFromSource = function(result, source) {
        if (source.length === 0) {
            // 递归出口 一个排列完成了
            // process 排列结果 这里就打印好了
            console.log(result);
            return result;
        }
        for (let i = 0; i < source.length; i++) {
            const ele = source[i];

            // 递归调用时不能改变原 result 与 source，不然一次排列完成后，原result已经是第一种排列的结果，source也成了空数组，source.length===0，这个循环体也不会再执行了
            // 要生成新的数组当递归函数的入参
            // concat 与 slice 都不会改变原数组
            // 这个函数算尾递归
            arrangeOneFromSource(
                result.concat([ele]),
                source.slice(0, i).concat(source.slice(i + 1))
            );
        }
    };
    arrangeOneFromSource([], arr);
}
allSequence([1, 2]);
```

2. 网上：
https://www.jb51.net/article/39291.htm

```js
// 这个就是我上面用到的方法 这种方法符合我自己思考全排列的逻辑
var count=0;  
function show(arr) {  
    document.write("P<sub>"+ ++count+"</sub>: "+arr+"<br />");  
}  
function perm(arr) {  
    (function fn(source, result) {  
        if (source.length == 0)  
            show(result);  
        else 
            for (var i = 0; i < source.length; i++)  
                fn(source.slice(0, i).concat(source.slice(i + 1)), result.concat(source[i]));  
    })(arr, []);  
}  
perm(["e1", "e2", "e3", "e4"]); 

//这个算法是从第一个位置开始，为每个位置放置不同元素，用的是和当前序号以及当前序号后的元素交换位置的方式
/*  
全排列（递归交换）算法  
1、将第一个位置分别放置各个不同的元素；  
2、对剩余的位置进行全排列（递归）；  
3、递归出口为只对一个元素进行全排列。  
*/ 
function swap(arr,i,j) {  
    if(i!=j) {  
        var temp=arr[i];  
        arr[i]=arr[j];  
        arr[j]=temp;  
    }  
}  
var count=0;  
function show(arr) {  
    document.write("P<sub>"+ ++count+"</sub>: "+arr+"<br />");  
}  
function perm(arr) {  
    (function fn(n) { //为第n个位置选择元素  
        for(let i=n;i<arr.length;i++) {  
            swap(arr,i,n);  
            if(n+1<arr.length-1) //判断数组中剩余的待全排列的元素是否大于1个  
                fn(n+1); //从第n+1个下标进行全排列  
            else 
                show(arr); //显示一组结果  
            swap(arr,i,n);  
        }  
    })(0);  
}  
perm(["e1","e2","e3","e4"]); 
```

## 八皇后
百度百科的方案比较简洁，我的方案比较啰嗦
**还是和上面的全排列算法一样，在递归调用函数时一定要注意，不要改变原来的值，用concat方法返回新的数组当参数传入函数中**

1. 百度百科方案 
这个思路有点类似全排列，从第一行开始，循环选择所有的列位置，然后为下一行选列位置
```js
// 为位置数组的某一项选值，也就是为棋盘的某一行选列的值
let count=0
queen([1,1,1,1,1,1,1,1],0)
function queen(arr, cur_index) {
    if (cur_index === arr.length) {
        console.log(++count)
        console.log(arr);
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        arr[cur_index] = i;
        let flag = true;
        //检查新插入的皇后位置是否符合要求
        for (let j = 0; j < cur_index; j++) {
            let ab = i - arr[j];
            ab = ab > 0 ? ab : -ab;
            if (arr[j] === i || ab === cur_index - j) {
                flag = false;
                break;
            }
        }
        if (flag) {
            queen(arr, cur_index + 1);
        }
    }
}
```

2. 我的实现，比较啰嗦，注意调用递归函数时不要改变原来的值（状态），用concat,slice等不改变原数组的方法返回新数组当参数

```js
// 八皇后 12.20日闭卷手写
// 输出所有解决方案
// 8*8棋盘的里面的位置描述：
// 或者就用二维数组吧，按行来 [[0,1,2...,7],[0,1,...,7],...[0,1,...,7]]
// 一个解决方案的格式 x:哪一行，y:哪一列  [[x1,y1],[x2,y2]]
eightQueen();
function eightQueen() {
    //这里的count一定要放在调用processLine方法的前面
    //这里是涉及到了暂时性死区
    //暂时性死区的本质就是，进入当前作用域，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
    let count = 0;
    processLine(0, []);
    function processLine(n, result) {
        // 奇怪，这里n还能变小
        if (n === 8) {
            //出口 处理结果
            console.log(result);
            console.log(++count); 
            return result;
        }
        //每一列
        for (let j = 0; j < 8; j++) {
            let curPos = [n, j];
            // 判断是否和之前的项目不冲突
            if (!isConflict(result, curPos)) {
                //不冲突，推入到结果数组
                // result.push(curPos);
                // 这里不能改原result数组，不然在同一行遍历下一个位置的时候，result数组已经被塞过上一轮的数值了
                //进入下一行
                processLine(n + 1, result.concat([curPos]));
            }
        }
    }
    function isConflict(arr, item) {
        for (let i = 0; i < arr.length; i++) {
            const ele = arr[i];
            if (isConflictWithItem(ele, item)) {
                return true;
            }
        }
        return false;
    }

    function isConflictWithItem(item1, item2) {
        //这个题目中对比的item，都不在同一行，
        //只需要比较是否在同一列，或者在同一斜线上
        if (item1[0] === item2[0]) return true;
        if (item1[1] === item2[1]) return true;
        if (
            item1[0] - item2[0] === item1[1] - item2[1] ||
            item1[0] - item2[0] === item2[1] - item1[1]
        )
            return true;
        return false;
    }
}
```


