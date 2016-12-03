# jquery.slide.js API

```javascript
$('.slide-wrapper').slide({
	speed: 500,
	prev: '.prev',
	next: '.next',
  	autoplay: 3000,
	pagination: '.page'
});
```

这是jquery.slide.js一般的使用方式。最外层的是`class="slide-wrapper"`的元素（可以用其他类名或ID名称表示，但在jquery.slide.css里".slide-wrapper"的属性也要拷过去），里面是ul，再里面是li，也就是每一个slide的基本单位。__ul、li是固定的__，所以不需要另外给它们添加类或ID。

在分页器里，所有的分页按钮都是a标签，没有class。

以下是API一览表:

|       参数        |    类型    |     默认值      |                   可选值                    |          含义           |                    备注                    |
| :-------------: | :------: | :----------: | :--------------------------------------: | :-------------------: | :--------------------------------------: |
|       dir       |  String  |     ‘h’      |                   'v'                    |         滚动方向          |           'h'表示水平方向，'v'表示竖直方向。           |
|      speed      |  Number  |     500      |                   800                    |         滚动速度          |                  单位ms。                   |
|      prev       |  String  |     null     |                 '.prev'                  |         前翻页按钮         |             希望收到一个selector。              |
|      next       |  String  |     null     |                 '.next'                  |         后翻页按钮         |                   同上。                    |
|     effect      |  String  |   'slide'    | 'carousel'(多页)、'fade'(焦点)、‘marquee’(无缝)  |         轮播模式          |             该参数可选值会陆续增加，请留意。             |
|    perGroup     |  Number  |      1       |                    3                     |         显示数量          |                                          |
|  perSlideView   |  Number  |      1       |                    3                     |        每次滚动的数量        |                                          |
|    autoPlay     |  Number  |      0       |                   3000                   |        轮播时间间隔         |            大于0时有效，建议大于speed值。            |
|   pagination    |  String  |     null     |              '.pagination'               |          分页器          |             希望收到一个selector。              |
| paginationType  |  String  |  'dot'(无内容)  |   'num'(数字)、'outer'(外部分页器)、‘image’(图片)   |         分页器类型         |                                          |
| paginationEvent |  String  |   'click'    | 'mouseenter'、 'mousemove'、 'mouseover'、‘hover’，以上均为鼠标悬停状态 |       分页器切换事件类型       |                                          |
|    lazyload     | Boolean  |    false     |                   true                   |         图片懒加载         | 如果图片地址在img标签里，请用data-src存放地址；如果是作为background,请用data-bg存放地址。 |
|   showWidget    | Boolean  |    false     |                   true                   | 鼠标悬停在轮播上方显示控件，移出时隐藏控件 |                                          |
| beforeSlideFunc | Function | function(){} |                                          |      执行轮播前触发的函数       | 支持传入参数，第一个参数表示当前轮播页的index，第二个参数表示当前轮播页。  |
| afterSlideFunc  | Function | function(){} |                                          |      执行轮播后触发的函数       |                   同上。                    |