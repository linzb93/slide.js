#jquery.slide.js API

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

以下是API一览表

|       参数       |   类型    |     默认值      |                   可选值                    |           含义           |   备注   |
| :------------: | :-----: | :----------: | :--------------------------------------: | :--------------------: | :----: |
|      dir       | String  | ‘horizontal’ |                'vertical'                |          滚动方向          |        |
|     speed      | Number  |     500      |                   800                    |          滚动速度          |        |
|      prev      | String  |     null     |                 '.prev'                  |         前翻页按钮          |        |
|      next      | String  |     null     |                 '.next'                  |         后翻页按钮          |        |
|     effect     | String  |   'slide'    | 'carousel'(多页)、'fullPage'(全屏)、'fade'(焦点) |          轮播模式          |        |
|    perGroup    | Number  |      1       |                    3                     |          显示数量          |        |
|  perSlideView  | Number  |      1       |                    3                     |        每次滚动的数量         |        |
|    autoPlay    | Number  |      0       |                   3000                   |         轮播时间间隔         | 大于0时有效 |
|   pagination   | String  |     null     |              '.pagination'               |          分页器           |        |
| paginationType | String  |    'dot'     |         'num'(数字)、'outer'(外部分页器)         |         分页器类型          |        |
|     wheel      | Boolean |    false     |                   true                   |        使用鼠标滚轮滚动        |        |
|      loop      | Boolean |     true     |                  false                   |          循环播放          | v2.1添加 |
|  stopOnHover   | Boolean |     true     |                  false                   | 鼠标悬停在轮播上方时暂停播放，移出时继续播放 | v2.1添加 |





_注：（1）所有新增的和修改的变量都会在“备注”一列中注明更新的版本。_