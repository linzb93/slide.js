# 关于 jquery.slide.js

##简介
jquery.slide.js是一个基于jquery的轻量的轮播插件。和Swiper相比，jquery.slide.js体积较小，节省浏览器的解析时间，并且拥有Swiper的多数常用功能。

jquery.slide.js已于2016年x月x日升级为2.0版。

这个插件的参数列表和Swiper几乎是一样的，如果你使用过Swiper那再好不过了。如果你没有使用过Swiper，那我这里简单讲下参数列表的使用方法。

##使用方法

###引入三个文件：jquery1.3+、jquery.slide.css和jquery.slide.js
```html
<link rel="stylesheet" type="text/css" href="jquery.slide.css">
...
<script type="text/javascript" src="jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="jquery.slide.js"></script>
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

$('.slide-wrapper').slide({
	autoplay: 3000,
	speed: 500,
	prev: '.prev',
	next: '.next',
	pagination: '.page'
});

```
其中，autoplay表示自动播放的间隔时间，speed表示图片切换的速度，prev表示向前翻页的按钮，next表示向后翻页的按钮，pagination表示分页器。这样，在slide方法里面新建Slide这个对象的实例，我们就建立了一个轮播图。

##其他

其他参数列表会在[API.md](https://github.com/linzb93/slide/blob/master/doc/API.md)里面展现，这里不再重复。

想了解开发进度，请关注Trello：https://trello.com/b/2FhJxWw0/jquery-slide-js。

_注：从V1.1开始，新增Dev分支。Dev分支上的文件是还在开发当中的，请勿使用。请使用master分支的文件，都是正式版的。