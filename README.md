# 关于 jquery.slide.js

#jquery.slide.js目前暂时不可用

##简介
jquery.slide.js是一个Web端基于jquery的轻量轮播插件。

jquery.slide.js已于2016年8月2日升级为2.0版。和1.x版相比，拥有错误提示，开发更友好。压缩版仅有5.3kb。



## 功能概述

可实现web端的单页滚动、多页滚动、全屏滚动和焦点轮播的效果。可自定义参数。

查看在线Demo请点击[这里](https://linzb93.github.io/demo/jquery.slide/)。



## 兼容性

兼容IE7及以上的浏览器。



##使用方法

###引入文件

- jQuery.js(1.8.0+)
- jquery.slide.css
- jquery.slide.js

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
	speed: 500,
	prev: '.prev',
	next: '.next',
  	autoplay: 3000,
	pagination: '.page'
});
```


## 文档

### API

[API.md](https://github.com/linzb93/slide/blob/master/doc/API.md)

### 更新日志

[CHANGELOG.md](https://github.com/linzb93/slide/blob/master/doc/CHANGELOG.md)



## 贡献

如果你有打算为jquery.slide.js贡献代码。请采用fork + pull request 方式，并在发起pr前先将master上超前的代码rebase到自己的分支上。代码规范详见[CONTRIBUTION.md](https://github.com/linzb93/slide/blob/master/doc/CONTRIBUTION.md)



##其他

想了解开发进度，请关注Trello：https://trello.com/b/2FhJxWw0/jquery-slide-js。
