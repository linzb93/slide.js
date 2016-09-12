/*
 * jQuery.slide.js V2.1
 *
 * https://github.com/linzb93/jquery.slide.js
 * API https://github.com/linzb93/jquery.slide.js/blob/master/doc/API.md
 * @license MIT licensed
 *
 * Copyright (C) 2016 linzb93
 *
 * Date: 2016-09-11
 */

;(function($) {
    //default option
    var d = {
        dir: 'horizontal',         //滚动方向（水平或竖直）
        speed: 500,                //滚动速度
        prev: '',                  //上翻页按钮
        next: '',                  //下翻页按钮
        effect: 'slide',           //效果
        loop: true,                //循环播放
        perGroup: 1,               //显示数量
        perSlideView: 1,           //每次滚动的数量
        autoPlay: 0,               //自动滚动的时间间隔
        pagination: '',            //分页器
        paginationType: 'dot',     //分页器类型
        paginationEvent: 'click',  //分页器切换事件
        wheel: false,              //鼠标滚轮滚动
        lazyload: false,           // 图片懒加载
        stopOnHover: true          //鼠标悬停在轮播上方时暂停自动播放
    };

    //class name
    var CUR_CLASS_NAME = 'slide-active';

    /*
     * @class Slide
     * @param {$(this)} [$this]
     * @param {Object} [option]
     */
    function Slide($this, option) {
        this.$this = $this;
        var o = $.extend({}, d, option);
        this.o = o;

        this.$pagination = $(this.o.pagination);
        this.$list = this.$this.children('ul');
        this.$li = this.$list.children('li');
        this.liW = this.$li.outerWidth(true);
        this.liH = this.$li.outerHeight(true);
        this.liSize = this.o.dir === 'horizontal' ? this.liW : this.liH;
        this.length = Math.ceil((this.$li.length - this.o.perGroup) / this.o.perSlideView) + 1;

        this.$pageChild = null; //pagination's childnode
        this.timer = null;
        this.curIndex = 0;
        this.nextIndex = 0;
        this.lock = false;      //避免用户操作过于频繁而使用上锁机制

        this.init();
    }

    $.extend(Slide.prototype, {
        init: function() {
            var that = this;
            if (this.o.effect === 'fade') {
                this.$this.width(this.liW).height(this.liH);
                this.$list.addClass('slide-fade');
                this.$li.first().show();
            } else {
                if (this.o.effect === 'fullPage') {
                    this.$li.width($("body").width()).height($("body").height());
                    this.liW = this.$li.width();
                    this.liH = this.$li.height();
                    this.liSize = this.o.dir === 'horizontal' ? this.liW : this.liH;
                }

                if (this.o.dir === 'horizontal') {
                    this.$this.width(that.liW * this.o.perGroup);
                    this.$list.width(that.liW * that.o.perSlideView * that.length);
                } else {
                    this.$this.height(that.liH * this.o.perGroup);
                    this.$list.height(that.liH * that.o.perSlideView * that.length);
                }

                this.$list.addClass('slide-' + that.o.dir);
                this.$li.first().addClass(CUR_CLASS_NAME);
            }

            if (this.o.pagination) {
                this.createPagination();
            }
            if (this.o.lazyload) {
                lazyloadHandler(1);
                lazyloadHandler(-1);
            }
            if (this.o.effect === 'slide' && this.o.loop) {
                this.duplicateList();
            }
            this.bindEvent();
            this.setAutoPlay();
        },

        //创建分页器
        createPagination: function() {
            var that = this;
            if (this.o.paginationType === 'outer') {
                this.$pageChild = this.$pagination.children().length === this.length ?
                    this.$pagination.children() : null;
            } else {
                var tempHtml = '';
                for (var i = 0, j; i < this.length; i++) {
                    j = this.o.paginationType === 'num' ? i : '';
                    tempHtml += '<a href="javascript:;">' + j + '</a>';
                }
                this.$pagination.append(tempHtml);
                this.$pageChild = this.$pagination.children();
            }
            this.$pageChild.first().addClass('on');
        },

        //fullPage模式下窗口调整时触发的方法
        fullPageReset: function() {
            var that = this;
            this.$li.width($('body').width()).height($('body').height());
            this.liW = this.$li.width();
            this.liH = this.$li.height();
            this.liSize = this.o.dir === 'horizontal' ? this.liW : this.liH;
            if (this.o.dir === 'horizontal') {
                this.$list.css({
                    width: that.liW * that.length,
                    left : -that.liW * that.curIndex
                });
                this.$this.width(that.liW);
            } else {
                this.$list.css({
                    height: that.liH * that.length,
                    top   : -that.liH * that.curIndex
                });
                this.$this.height(that.liH);
            }
        },

        //为轮播相关的操作绑定事件监听
        bindEvent: function() {
            var that = this,
                event = this.o.paginationEvent;
            if (this.$pageChild) {
                this.$pageChild.on(event, function() {
                    if (that.curIndex === $(this).index()) {
                        return;
                    }
                    that.slideTo($(this).index());
                });
            }

            if (this.o.prev || this.o.next) {
                $(this.o.prev).on(event, function() {
                    that.slidePrev();
                });
                $(this.o.next).on(event, function() {
                    that.slideNext();
                });
            }

            if (this.o.effect === 'fullPage') {
                //全屏模式下绑定鼠标滚轮事件
                $(document).on('mousewheel DOMMouseScroll', function(e) {
                    if (!that.o.wheel || that.lock) {
                        return;
                    }
                    that.lock = true;
                    e.preventDefault();
                    (e.originalEvent.wheelDelta || -e.originalEvent.detail) > 0 ?
                        that.slidePrev() :
                        that.slideNext();
                });

                //窗口缩放时重置轮播
                $(window).on('resize', function() {
                    that.fullPageReset();
                });
            }

            //鼠标悬停在轮播上方时暂停自动播放，移出时继续自动播放
            if (this.o.stopOnHover && this.o.autoPlay) {
                this.$this.on({
                    'mouseover': function() {
                        clearInterval(that.timer);
                        that.$list.stop(true, true);
                    },
                    'mouseout': function() {
                        that.setAutoPlay();
                    }
                });
            }
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

        //向前滚动。下面的slideNext、slideTo方法类似
        slidePrev: function() {
            this.totalHandler('prev');
        },

        slideNext: function() {
            this.totalHandler('next');
        },

        slideTo: function(num) {
            this.totalHandler('to', num);
        },

        //轮播处理的入口
        totalHandler: function(btnDir, num) {
            if (this.o.effect !== 'fullPage') {
                if (this.lock) {
                    return;
                }
                this.lock = true;
            }
            switch (this.o.effect) {
                case 'slide':
                    this.singlePageHandler(btnDir, num);
                    break;
                case 'carousel':
                    this.carouselHandler(btnDir, num);
                    break;
                case 'fullPage':
                    this.fullPageHandler(btnDir, num);
                    break;
                case 'fade':
                    this.fadeHandler(btnDir, num);
                    break;
            }
        },

        //默认处理轮播方式。singlePageHandler、carouselHandler、fullPageHandler、fadeHandler类似。
        defaultPageHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                if (this.curIndex === 0) {
                    if (this.o.loop) {
                        this.nextIndex = this.length - 1;
                    } else {
                        return;
                    }
                } else {
                    this.nextIndex = this.curIndex - 1;
                }
            } else if (btnDir === 'next') {
                if (this.curIndex === this.length - 1) {
                    if (this.o.loop) {
                        this.nextIndex = 0;
                    } else {
                        return;
                    }
                } else {
                    this.nextIndex = this.curIndex + 1;
                }
            } else {
                this.nextIndex = num;
            }
        },

        singlePageHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                if (!this.o.loop && this.curIndex === 0) {
                    this.lock = false;
                    return;
                } else {
                    this.nextIndex = this.curIndex - 1;
                }
            } else if (btnDir === 'next') {
                if( !this.o.loop && this.curIndex === this.length - 1) {
                    this.lock = false;
                    return;
                } else {
                    this.nextIndex = this.curIndex + 1;
                }
            } else {
                this.nextIndex = num;
            }
            this.slideSinglePage(this.nextIndex);
        },

        carouselHandler: function(btnDir, num) {
            this.defaultPageHandler(btnDir, num);
            this.slideCarousel(this.nextIndex);
        },

        fullPageHandler: function(btnDir, num) {
            this.defaultPageHandler(btnDir, num);
            this.slideFullPage(this.nextIndex);
        },

        fadeHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                if (this.curIndex > 0 || (this.curIndex === 0 && this.o.loop)) {
                    this.slideFade(this.curIndex - 1);
                } else {
                    this.lock = false;
                }
            } else if (btnDir === 'next') {
                if (this.curIndex < this.length - 1 || (this.curIndex === this.length - 1 && this.o.loop)) {
                    this.slideFade(this.curIndex + 1);
                } else {
                    this.lock = false;
                }
            } else if (btnDir === 'to') {
                this.slideFade(num);
            }
        },

        //单页循环模式下，复制轮播列表头尾两个元素
        duplicateList: function() {
            var that = this;
            this.$li.last().clone().prependTo(this.$list);
            this.$li.first().clone().appendTo(this.$list);
            this.o.dir === 'horizontal' ?
                this.$list.css({
                    left: -that.liW + 'px',
                    width: that.liW * (that.length + 2)
                }) :
                this.$list.css({
                    top: -that.liH + 'px',
                    height: that.liH * (that.length + 2)
                });
            this.$list.children('li').last().removeClass(CUR_CLASS_NAME);
        },

        lazyloadHandler: function(num) {
            var $img = this.$li.eq(num).find('img');
            if ($img.data('src')) {
                $img.attr('src', $img.data('src'));
                $img.removeData('src');
            }
        },

        //执行滚动后切换当前类的class
        currentClassChange: function() {
            this.$li.eq(this.curIndex).addClass(CUR_CLASS_NAME).siblings().removeClass(CUR_CLASS_NAME);
            if (this.o.pagination) {
                this.$pageChild.eq(this.curIndex).addClass('on').siblings().removeClass('on');
            }
        },

        //默认执行轮播动画。slideSinglePage、slideCarousel、slideFullPage、slideFade类似。
        defaultSinglePage: function(num) {
            var that = this,
                newNum = (this.o.effect === 'slide' && this.o.loop) ? num + 1 : num;
            this.o.dir === 'horizontal' ?
                this.$list.animate({
                    left: -newNum * that.liSize * that.o.perSlideView
                }, this.o.speed, function() {
                    that.slideCallBack(num);
                }) :
                this.$list.animate({
                    top: -newNum * that.liSize * that.o.perSlideView
                }, this.o.speed, function() {
                    that.slideCallBack(num);
                });
        },

        slideSinglePage: function(num) {
            this.defaultSinglePage(num);
        },

        slideCarousel: function(num) {
            this.defaultSinglePage(num);
        },

        slideFullPage: function(num) {
            this.defaultSinglePage(num);
        },

        slideFade: function(num) {
            var that = this;
            if (num === this.length) {
                num = 0;
            } else if (num === -1) {
                num = this.length - 1;
            }
            this.$li.eq(num).fadeIn(this.o.speed, function() {
                that.slideCallBack(num);
            }).siblings().fadeOut(this.o.speed);
        },

        //轮播执行后的回调函数
        slideCallBack: function(num) {
            this.curIndex = num;
            if (this.o.effect === 'slide') {
                var aniDir = this.o.dir === 'horizontal' ? 'left' : 'top';
                if (this.o.loop) {
                    if (this.curIndex < 0) {
                        this.curIndex = this.length - 1;
                        this.$list.css(aniDir, -this.liW * this.length);
                    } else if (this.curIndex === this.length) {
                        this.curIndex = 0;
                        this.$list.css(aniDir, -this.liW);
                    }
                }
            }
            this.currentClassChange();
            this.lock = false;
        }
    });

    //调用插件
    $.fn.slide = function(option) {
        new Slide($(this), option);
    };
}(jQuery));