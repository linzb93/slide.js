# 关于 jQuery-slide.js
我写这个插件，有两个目的，一是想熟悉下Javascript的面向对象，为了将来可以自己写插件和读懂jQuery源码；二是厌倦了Swiper莫名其妙的bug，而且实际用到的功能也就一点点，还不如自己写一个轻量的jQuery插件。

这个插件的API和Swiper是一样的，如果你使用过Swiper那再好不过了。如果你没有使用过Swiper，那我这里简单讲下API的使用方法。

首先引入两个文件：slide.css和jquery-slide.js（默认已经引入jquery），其中slide.css可以引入你的css文件中并修改，修改方式在slide.css中已经有注释了。

以下内容，使用过Swiper的用户可以跳过。

---
```javascript

var mySlide = new Slide('.slide-wrapper', {
autoplay: 3000,
speed: 500});

```
其中，autoplay表示自动播放的间隔时间，speed表示图片切换的速度。这样，通过新建Slide这个对象的实例，我们就建立了一个轮播图。

使用按钮切换轮播图：
```javascript
$leftBtn.on('click', function(){
mySlide.slidePrev();
});
$rightBtn.on('click', function(){
mySlide.slideNext();
});
```
---
其他API会在[API.md](https://github.com/linzb93/slide/blob/master/API.md)和demo里面展现，这里不再重复。

我还提供了jQuery-slide.js的压缩版jQuery-slide-min.js，压缩版是稳定的，未压缩的可能是还在开发中的。