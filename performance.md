# 性能优化
网络方面：
减小文件体积
减少http请求：合并文件、CSS精灵、inline Image、合理设置缓存
减少dns查询：将资源分布到恰当数量的主机名，平衡并行下载和dns查询
避免重定向
非必须组件延迟加载
未来所需组件预加载

dom方面：
减少dom元素数量
减少重绘重排
防抖节流

## cdn

可以认为是分布式web缓存

> 优势
1.省钱
2.提升网站用户体验
3.可以阻挡大部分流量攻击


## 用CSS3动画替代JS模拟动画的好处：
https://www.jianshu.com/p/d1e16a2e88c1

不占用JS主线程；

可以利用硬件加速；

浏览器可对动画做优化（元素不可见时不动画减少对FPS影响）


## yahoo性能最佳实践
https://developer.yahoo.com/performance/rules.html

## 延迟加载图像
https://developers.google.cn/web/fundamentals/performance/lazy-loading-guidance/images-and-video#延迟加载图像
可以使用 Intersection Observer

```js
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to a more compatible method here
  }
});
```


