#jQuery.slide.js API

```javascript
var mySlide = new Slide('.slide-wrapper', {
  autoplay: 3000,
  speed: 500
});
```

这是jQuery.slide.js最简单的使用方式。slide最外层的是`class="slide-wrapper"`的元素（可以用其他类名或ID名称表示，但在jQuery.slide.css里".slide-wrapper"的属性也要拷过去），里面是ul，再里面是li，也就是每一个slide的基本单位。ul、li是固定的，所以不需要另外给它们添加类或ID。

在分页器里，所有的分页按钮都是a标签，没有class，那个特殊的、对应当前页面的那个分页按钮加了`class="on"`。

以下是API一览表

| 参数 | 类型 | 默认值 | 可选值 | 含义 | 备注
| :----: | :----: | :----: | :----: | ----- | ----- |
| dir | string | 'horizontal' | 'vertical' | 滚动方向（水平或竖直）| 原名'mode'，于V1.4更名|
| speed | number | 500 | 800 | 滚动速度 | |
| perGroup | number | 1 | 3 | 显示数量 | |
| perSlideView | number | 1 | 3 | 每次滚动的数量 | 原名'slidePerView'，于V1.4更名 |
| autoPlay | number | 0 | 3000 |自动滚动的时间间隔 | 大于0时有效 |
| pagination | HTML Element | null | '.page' | 分页器 |  |
| effect | string | 'slide' | 'carousel' | 轮播效果 | 其他可选值有：fullPage,fade。于V1.5添加 |
| paginationType | string | 'dot' | 'num' | 分页器类型 | 其他可选值有：'outer'(外部分页器)。于V1.5添加 |

已经移除的API一览表

| 参数 | 类型 | 默认值 | 可选值 | 含义 | 备注
| :----: | :----: | :----: | :----: | ----- | ----- |
| loop | bool | true | false | 是否循环滚动 | 于V1.4移除 |
| pageClickable | bool | true | false | 分页器是否可点击 | 于V1.5移除，默认可点击
| fullPage | bool | false | true | 是否全屏滚动 | 于V1.1添加。于V1.5移除 |
| showPageNum | bool | false | true | 是否在分页按钮中显示数字 | 于V1.1添加。于V1.5移除 |
| fadeInAndOut | bool | false | true | 是否使用渐隐渐显式轮播。单页滚动时有效 | 于V1.2添加。于V1.5移除 |
| outerPagination | bool | false | true | 是否是外部的分页器 | 于V1.3添加。于V1.5移除 |

_注：（1）所有新增的和修改的变量都会在“备注”一列中注明更新的版本。_