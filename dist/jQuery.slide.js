/*
 * jQuery.slide.js V2.3.1
 *
 * https://github.com/linzb93/jquery.slide.js
 * @license MIT licensed
 *
 * Copyright (C) 2016 linzb93
 *
 * Date: 2016-12-2
 */

(function($) {
    //默认参数
    var d = {
        dir: 'h',
        speed: 500,
        prev: '',
        next: '',
        effect: 'slide',
        perGroup: 1,
        perSlideView: 1,
        autoPlay: 0,
        pagination: '',
        paginationType: 'dot',
        paginationEvent: 'click',
        paginationFollow: '',
        lazyload: false,
        showWidget: false,
        beforeSlideFunc: function() {},
        afterSlideFunc: function() {}
    };

    //特殊类名
    var SLIDE_ACTIVE = 'slide-active';

    function getInnerImg($ele) {
        /*
         * 解释下下面return里面的5和-2是什么：
         * 加入执行这段代码：$ele.css('background-image')
         * 返回值是形如 url(http://www.example.com/logo.png)；
         * 因此，从返回值里获得‘http://www.example.com/logo.png’
         * 就是获取原字符串里第5个字符到倒数第2个字符
         */
        return $ele.find('img').attr('src') || $ele.css('background-image').slice(5, -2);
    }

    /*
     * @class Slide
     * @param {$(this)} [$this]
     * @param {Object} [option]
     */
    function Slide($this, option) {
        this.$this = $this;
        this.o = $.extend({}, d, option);

        this.$btnPrev = $(this.o.prev);
        this.$btnNext = $(this.o.next);
        this.$pagination = $(this.o.pagination);
        this.$list = this.$this.children('ul');
        this.$li = this.$list.children('li');
        this.liSize = this.o.dir === 'h' ? this.$li.outerWidth(true) : this.$li.outerHeight(true);
        this.length = Math.ceil((this.$li.length - this.o.perGroup) / this.o.perSlideView) + 1;

        this.$pageChild = null; //pagination's childnode
        this.timer = null;
        this.curIndex = 0;
        this.imgLen = 0; //已经加载图片的轮播项数量
        this.canSlide = false;
        this.$widget = this.$btnPrev.add(this.$btnNext).add(this.$pagination);
        this.needDuplicateEdge = this.o.autoPlay || this.o.next;

        this.init();
    }

    Slide.prototype = {
        init: function() {
            var that = this;
            if (this.o.effect === 'fade') {
                this.$this.width(this.liSize).height(this.$li.height());
                this.$list.addClass('slide-pile');
                this.$li.hide().first().show();
            } else {
                var wrapperSize = this.liSize * this.o.perGroup,
                    listSize = this.liSize * this.$li.length;
                this.$this.addClass('slide-container');
                if (this.o.dir === 'h') {
                    this.$this.width(wrapperSize);
                    this.$list.width(listSize);
                } else {
                    this.$this.height(wrapperSize);
                    this.$list.height(listSize);
                }

                this.$list.addClass('slide-' + this.o.dir);
            }

            this.$li.first().addClass(SLIDE_ACTIVE);

            if (this.$pagination) {
                this.createPagination();
            }
            if (this.o.lazyload) {
                this.lazyloadHandler(0);
                if (this.o.effect === 'slide') {
                    this.lazyloadHandler(-1);
                }
            }
            if (this.o.effect === 'slide' && this.needDuplicateEdge) {
                this.duplicateEdge();
            }
            this.initEvent();
            this.setAutoPlay();
            if (this.o.effect === 'marquee') {
                this.marqueeHandler();
            }
        },

        //创建分页器
        createPagination: function() {
            var that = this;
            if (this.o.paginationType != 'outer') {
                var tempHtml = '';
                for (var i = 0, j; i < this.length; i++) {
                    switch (this.o.paginationType) {
                        case 'dot':
                            j = '';
                            break;
                        case 'num':
                            j = i;
                            break;
                        case 'image':
                            j = '<img src="' + getInnerImg(that.$li.eq(i)) + '">';
                            break;
                    }
                    tempHtml += '<a href="javascript:;">' + j + '</a>';
                }
                this.$pagination.append(tempHtml);
            }
            this.$pageChild = this.$pagination.children();
            this.$pageChild.first().addClass('on');
        },

        //为轮播相关的操作绑定事件监听
        initEvent: function() {
            var that = this,
                event = this.o.paginationEvent;
            if (this.$pageChild) {
                this.$pagination.on(event, 'a', function() {
                    var index = $(this).index();
                    if (that.curIndex === index) {
                        return;
                    }
                    that.totalHandler('to', index);
                });
            }

            if (this.o.prev || this.o.next) {
                this.$btnPrev.on(event, function() {
                    that.totalHandler('prev');
                });
                this.$btnNext.on(event, function() {
                    that.totalHandler('next');
                });
            }

            //鼠标悬停在轮播上方时暂停自动播放，移出时继续自动播放
            this.$this.parent().on({
                'mouseenter': function() {
                    if (that.o.autoPlay || that.o.effect === 'marquee') {
                        clearInterval(that.timer);
                        that.$list.clearQueue();
                    }
                    if (that.o.showWidget) {
                        that.$widget.stop(true, true).fadeIn();
                    }
                },
                'mouseleave': function() {
                    if (that.o.autoPlay) {
                        that.setAutoPlay();
                    }
                    if (that.o.effect === 'marquee') {
                        that.marqueeHandler();
                    }
                    if (that.o.showWidget) {
                        that.$widget.stop(true, true).fadeOut();
                    }
                }
            });
        },

        //自动播放
        setAutoPlay: function() {
            var that = this;
            if (this.o.autoPlay) {
                this.timer = setInterval(function() {
                    that.totalHandler('next');
                }, that.o.autoPlay);
            }
        },

        //轮播处理的入口
        totalHandler: function(btnDir, num) {
            switch (this.o.effect) {
                case 'slide':
                    this.singlePageHandler(btnDir, num);
                    break;
                case 'carousel':
                    this.carouselHandler(btnDir, num);
                    break;
                case 'fade':
                    this.fadeHandler(btnDir, num);
                    break;
            }
        },

        //处理单页滚动轮播
        singlePageHandler: function(btnDir, num) {
            if (this.canSlide) {
                return;
            }
            if (btnDir === 'prev') {
                if (!this.curIndex) {
                    this.canSlide = true;
                }
                this.curIndex -= 1;
            } else if (btnDir === 'next') {
                if (this.curIndex === this.length - 1) {
                    this.canSlide = true;
                }
                this.curIndex += 1;
            } else {
                this.curIndex = num;
            }
            this.slidePage(this.curIndex);
        },

        //处理多页滚动轮播
        carouselHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                this.curIndex = !this.curIndex ? this.length - 1 : this.curIndex - 1;
            } else if (btnDir === 'next') {
                this.curIndex = this.curIndex === this.length - 1 ? 0 : this.curIndex + 1;
            } else {
                this.curIndex = num;
            }
            this.slidePage(this.curIndex);
        },

        //处理焦点轮播
        fadeHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                this.curIndex = this.curIndex ? this.curIndex - 1 : this.length - 1;
            } else if (btnDir === 'next') {
                this.curIndex = this.curIndex < this.length - 1 ? this.curIndex + 1 : 0;
            } else {
                this.curIndex = num;
            }
            this.slideFade(this.curIndex);
        },

        //处理无缝滚动轮播
        marqueeHandler: function() {
            var that = this;
            this.timer = setInterval(function() {
                if (that.curIndex < that.$li.length - that.o.perGroup) {
                    that.slidePage(++that.curIndex);
                } else {
                    that.curIndex = -1;
                    setTimeout(function() {
                        if (that.o.dir === 'h') {
                            that.$list.css('left', 0);
                        } else {
                            that.$list.css('top', 0);
                        }
                    }, that.o.speed)
                }
            }, that.o.speed + 20);
        },

        //单页循环模式下，复制轮播列表头尾两个元素
        duplicateEdge: function() {
            var that = this,
                initPos = -this.liSize + 'px',
                listSize = this.liSize * (this.length + 2);
            this.$li.first().removeClass(SLIDE_ACTIVE).clone().appendTo(this.$list);
            this.$li.last().clone().prependTo(this.$list);
            this.$li.first().addClass(SLIDE_ACTIVE);
            this.o.dir === 'h' ?
                this.$list.css({
                    left: initPos,
                    width: listSize
                }) :
                this.$list.css({
                    top: initPos,
                    height: listSize
                });
        },

        //处理单页滚动和焦点轮播的懒加载
        lazyloadHandler: function(num) {
            var that = this;
            var $curLi = this.$li.eq(num);
            if ($curLi.attr('data-bg')) {
                $curLi.css('background-image', $curLi.data('bg'))
                .removeAttr('data-bg');
            } else {
                $curLi.find('img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                    $(this).removeAttr('data-src');
                });
            }
            this.imgLen++;
        },

        //执行轮播动画之前的函数
        doBeforeSlideFunc: function() {
            if (this.o.lazyload && this.imgLen <= this.$li.length) {
                this.lazyloadHandler(this.curIndex);
            }
            this.o.beforeSlideFunc(this.curIndex - 1, this.$li.eq(this.curIndex - 1));
        },

        //执行滚动动画
        slidePage: function(num) {
            this.doBeforeSlideFunc(num);
            var that = this;
            var newNum = (this.o.effect === 'slide' && this.needDuplicateEdge) ? num + 1 : num;
            var targetPos = -newNum * this.liSize * this.o.perSlideView;
            if (this.o.dir === 'h') {
               this.$list.stop(true).animate({left: targetPos}, this.o.speed, 'linear', function() {
                    that.slideCallBack(num);
                });
            } else {
                this.$list.stop(true).animate({top: targetPos}, this.o.speed, 'linear', function() {
                    that.slideCallBack(num);
                });
            }
        },

        //执行焦点轮播动画
        slideFade: function(num) {
            this.doBeforeSlideFunc();
            var that = this;
            this.$li.eq(num).fadeIn(this.o.speed, function() {
                that.slideCallBack(num);
            }).siblings().fadeOut(this.o.speed);
        },

        //切换分页器元素的class，和轮播当前页的class
        currentClassChange: function(num) {
            if (this.$pagination) {
                this.$pageChild.removeClass('on').eq(num).addClass('on');
            }
            this.$li.removeClass(SLIDE_ACTIVE).eq(num).addClass(SLIDE_ACTIVE);
        },

        //轮播执行后的回调函数
        slideCallBack: function(num) {
            if (this.o.effect === 'slide') {
                var aniDir = this.o.dir === 'h' ? 'left' : 'top';
                if (this.curIndex === -1) {
                    this.curIndex = this.length - 1;
                    this.$list.css(aniDir, -this.liSize * this.length);
                } else if (this.curIndex === this.length) {
                    this.curIndex = 0;
                    this.$list.css(aniDir, -this.liSize);
                }
                this.canSlide = false;
            } else if (this.o.effect === 'marquee') {
                this.curIndex = num;
            }
            this.currentClassChange(this.curIndex);
            this.o.afterSlideFunc(this.curIndex, this.$li.eq(this.curIndex));
        }
    };

    //调用插件
    $.fn.slide = function(option) {
        new Slide($(this), option);
    };
}(jQuery));