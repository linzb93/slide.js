# slide.js

## 简介
slide.js 是一个Web 端基于 jQuery 的轻量轮播插件，可实现 web 端的单页滚动、多页滚动、焦点轮播等效果。



## 最近更新

V4.0 (2017年10月08日)



## 兼容性

兼容 IE9 及以上的浏览器。IE8及以下浏览器使用请添加 es5-shim 和 es5-sham。



## 使用方法

### 引入文件

- jQuery.js(1.8.0+)
- slide.css
- slide.js

```html
<link rel="stylesheet" href="slide.css">
...
<script src="jquery-1.8.0.min.js"></script>
<script src="slide.js"></script>
```

### HTML结构
```html
<div class="slide">
	<ul class="slide-wrapper">
        <li>Slide 1</li>
        <li>Slide 2</li>
        <li>Slide 3</li>
        <li>Slide 4</li>
        <li>Slide 5</li>
        <li>Slide 6</li>
        <li>Slide 7</li>
    </ul>
	<a href="javascript:;" title="" class="prev"><</a>
	<a href="javascript:;" title="" class="next">></a>
	<div class="page"></div>
</div>
```

### JavaScript
```javascript
//配置参数
var mySlide = $('.slide').slide({
	speed: 500,
	prev: '.prev',
	next: '.next',
  	interval: 3000,
	pagination: '.page'
});

//使用轮播的方法
$('.btn').on('click', function() {
  mySlide.stop();
});
```



## API

### 配置参数

| 参数               | 类型       | 默认值              | 含义                    | 备注                                       |
| ---------------- | -------- | ---------------- | --------------------- | ---------------------------------------- |
| wrapper          | String   | '.slide-wrapper' | 轮播列表                  | selector                                 |
| direction        | String   | 'h'              | 滚动方向                  | ‘h’: 水平方向；'v':竖直方向                       |
| speed            | Number   | 500              | 滚动速度                  | 单位ms                                     |
| prev             | String   | ''               | 前翻页按钮                 | selector                                 |
| next             | String   | ''               | 后翻页按钮                 | selector                                 |
| effect           | String   | 'fade'           | 轮播模式                  | 'fade': 焦点；'slide': 单页；'carousel':多页。    |
| slidesPerGroup   | Number   | 1                | 每次滚动的数量               |                                          |
| slidesPerView    | Number   | 1                | 一个轮播能看到的列表            |                                          |
| interval         | Number   | 0                | 轮播时间间隔                | 单位ms，大于0时有效，建议大于speed值。                  |
| pagination       | String   | ''               | 分页器                   | 分页器selector，如果分页按钮为空，会自动创建。              |
| lazyload         | Boolean  | false            | 图片懒加载                 | 值为true时表示需要使用懒加载。如果图片地址在img标签里，请用data-src存放图片地址；如果是作为background,请用data-bg存放地址。 |
| enableHideWidget | Boolean  | false            | 鼠标悬停在轮播上方显示控件，移出时隐藏控件 |                                          |
| easing           | String   | 'swing'          | 轮播速度曲线                | 如果需要改动这个参数建议引入jquery.easing.js。          |
| beforeSlide      | function | function(){}     | 执行轮播前触发的函数            | 同上。                                      |
| afterSlide       | function | function(){}     | 执行轮播后触发的函数            | 同上。                                      |

### 方法

| 名称              | 功能      |
| --------------- | ------- |
| stop            | 暂停轮播    |
| play            | 继续轮播    |
| slidePrev       | 向前滚动    |
| slideNext       | 向后滚动    |
| slideTo(number) | 滚动到指定位置 |



## 更新日志

[CHANGELOG.md](https://github.com/linzb93/slide/blob/master/CHANGELOG.md)



## License

MIT licensed

Copyright (C) 2017 linzb93
