#jQuery.slide.js更新日志

V1.5
---
###2016年7月17日
- 添加多页滚动的分页器
- 添加轮播模式参数effect
- 添加分页器类型参数paginationType
- 移除参数pageClickable，改为默认可点击
- 优化代码，减少内存泄漏

V1.4
---
###2016年7月10日
- 优化单页滚动的体验
- 删除sass文件
- 删除jQuery文件，改用jQuery CDN
- 删除jQuery.slide.min.js
- 移除loop参数
- mode参数更名为dir，perSlideView参数名称不变

V1.3
---
###2016年4月26日
- 添加外部分页器的功能
- 添加检测jQuery文件是否存在的代码
- 规范文件命名格式，jQuery-slide.js更名为jQuery.slide.js，jQuery-slide.min.js更名为jQuery.slide.min.js，slide.css更名为jQuery.slide.css
- 优化代码，删除无用方法
- SlideTo()方法不再对外公开
- 修复文档描述错误
- 为规范参数名称，便于记忆，mode参数更名为dir，还望周知
- jQuery-slide.js 2.0版已在开发中。2.0版将采用jQuery插件最常用的挂在jQuery原型下的方式。如果2.0版开发成功，1.x版将不再维护

V1.2
---
###2016年4月24日
- 新增渐隐渐显式轮播
- 修复bug
- 提升性能

V1.1
---
###2016年4月21日
- 新增在代码内添加对应数字的功能
- 新增全屏滚动的功能
- 小部分修改，提升性能

V1.0.1
---
###2016年4月17日
- 新增可以关闭循环播放的功能
- 优化代码结构

V1.0
---
###2016年4月16日
- jQuery-slide.js V1.0正式发布，使用方法详见[API.md](https://github.com/linzb93/slide/blob/master/API.md)