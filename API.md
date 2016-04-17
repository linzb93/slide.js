#jQuery-slide.js API

```javascript
var mySlide = new Slide('.slide-wrapper', {
autoplay: 3000,
speed: 500});
```

这是jQuery-slide.js最简单的使用方式。slide最外层的是`class="slide-wrapper"`的元素（可以用其他类名或ID名称表示，但在slide.css里".slide-wrapper"的属性也要拷过去），里面是ul，再里面是li，也就是每一个slide的基本单位。ul、li是固定的，所以不需要另外给它们添加类或ID。

在分页器里，所有的分页按钮都是a标签，没有class，那个特殊的、对应当前页面的那个分页按钮加了`class="on"`。

以下是API一览表

| 参数 | 类型 | 默认值 | 可选值 | 含义 | 备注
| :----: | :----: | :----: | :----: | ----- | ----- |
| mode | HTML Element | 'horizontal' | 'vertical' | 滚动方向（水平或竖直）| |
| speed | number | 500 | 800 | 滚动速度 | |
| perGroup | number | 1 | 3 | 显示数量 | |
| slidePerView | number | 1 | 3 | 每次滚动的数量 | |
| autoPlay | number | 0 | 3000 |自动播放的时间间隔，大于0时有效 | |
| pagination | HTML Element | null | .page | 分页器 | |
| pageClickable | bool | true | false | 分页器是否可点击 | |
| loop | bool | true | false | 是否循环播放 | 于V1.0.1添加 |

_注：所有新增的和修改的变量都会在“备注”一列中注明更新的版本。_