# 关于 jQuery.slide.js

##简介
jQuery.slide.js是一个基于jQuery的轻量的轮播插件。和Swiper相比，jQuery.slide.js体积较小，节省浏览器的解析时间，并且拥有Swiper的多数常用功能。

这个插件的参数列表和Swiper几乎是一样的，如果你使用过Swiper那再好不过了。如果你没有使用过Swiper，那我这里简单讲下参数列表的使用方法。

##使用方法

###引入三个文件：jQuery1.3+、jQuery.slide.css和jQuery.slide.js
```html
<link rel="stylesheet" type="text/css" href="jQuery.slide.css">
...
<script type="text/javascript" src="jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="jQuery.slide.js"></script>
```

###HTML结构
```html
<div class="slide">
	<div class="slide-wrapper">
		<ul>
			<li>Slide 1</li>
			<li>Slide 2</li>
			<li>Slide 3</li>
			<li>Slide 4</li>
			<li>Slide 5</li>
			<li>Slide 6</li>
			<li>Slide 7</li>
		</ul>
	</div>
	<a href="javascript:;" title="" class="prev"><</a>
	<a href="javascript:;" title="" class="next">></a>
	<div class="page"></div>
</div>
```

###配置参数调用方法
```javascript

var mySlide = new Slide('.slide-wrapper', {
autoplay: 3000,
speed: 500
});

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
##其他
其他参数列表会在[API.md](https://github.com/linzb93/slide/blob/master/doc/API.md)里面展现，这里不再重复。

_注：从V1.1开始，新增Dev分支。Dev分支上的文件是还在开发当中的，请勿使用。请使用master分支的文件，都是正式版的。