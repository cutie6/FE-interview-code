# 项目细节思路



## 滚动元素内有大量dom，造成卡顿问题的优化方案

https://juejin.im/post/5a71c7dc5188253fca37f31b


外元素滚动时，在非可视区域的dom的子元素，都暂时转存到内存的文档碎片中

这个方案是去除了非可视区域的列表项的内层元素，外层容器还是在的，是为了防止抖动

## 根据pid将源数组转化成含有 children 字段的，且只包含根元素的数组

https://www.bilibili.com/video/av67082970/?spm_id_from=trigger_reload

用了两次 reduce

第一次： 新建一个以 id 为 key 的 hash 表

第二次：将子元素 push 到父元素的 children 数组，将根元素 push 到结果数组

![image-20200107203851345](/Users/lucy/Library/Application Support/typora-user-images/image-20200107203851345.png)





