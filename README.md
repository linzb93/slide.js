# 关于 jquery.slide.js

##简介
jquery.slide.js是一个Web端基于jquery的轻量轮播插件。



## 功能概述

可实现web端的单页滚动、多页滚动、焦点轮播和无缝滚动等效果。

查看在线Demo请点击[这里](https://linzb93.github.io/demo/jquery.slide/)。



## 最近更新

V2.3.1 (2016年12月3日)



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

__由于插件没有做向下兼容，因此使用新版插件时请认真阅读更新日志。__



## 贡献

如果你有打算为jquery.slide.js贡献代码。请采用fork + pull request 方式，并在发起pr前先将master上超前的代码rebase到自己的分支上。代码规范详见[CONTRIBUTION.md](https://github.com/linzb93/slide/blob/master/doc/CONTRIBUTION.md)



## License

MIT licensed

Copyright (C) 2016 linzb93



##其他

想了解开发进度，请关注Trello：https://trello.com/b/2FhJxWw0/jquery-slide-js。
