/*
 * jQuery.slide.js V2.3
 *
 * https://github.com/linzb93/jquery.slide.js
 * @license MIT licensed
 *
 * Copyright (C) 2016 linzb93
 *
 * Date: 2016-11-13
 */

;(function($) {
    //default option
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
        paginationFollow: 'h',
        lazyload: false,
        showWidget: false,
        beforeSlideFunc: function() {},
        afterSlideFunc: function() {}
    };

    var PAGINATIONWRAPPER = 'slide-pagination-wrapper';

    function getInnerImg($ele) {
        return $ele.find('img').attr('src') || $ele.find('img').attr('data-src') || $ele.css('background-image').slice(5, -2);
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
        this.lock = false;      //避免用户操作过于频繁而使用上锁机制
        this.$widget = this.$btnPrev.add(this.$btnNext).add(this.$pagination);
        this.duplicateEdge = !this.o.autoPlay && !this.o.next;

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

            if (this.$pagination) {
                this.createPagination();
            }
            if (this.o.lazyload) {
                this.lazyloadHandler(0);
                if (this.o.effect === 'slide') {
                    this.lazyloadHandler(-1);
                }
            }
            if (this.o.effect === 'slide' && this.duplicateEdge) {
                this.duplicateList();
            }
            this.initEvent();
            this.setAutoPlay();
            if (this.o.effect === 'marquee') {
                this.totalHandler();
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
            if (this.o.paginationType === 'image') {
                this.$pageChild.wrapAll('<div class="' + PAGINATIONWRAPPER + '" />');
                if (this.o.paginationFollow === 'h') {
                    this.$pagination.find('.' + PAGINATIONWRAPPER).width(this.$pageChild.outerWidth(true) * this.$li.length);
                } else {
                    this.$pagination.find('.' + PAGINATIONWRAPPER).height(this.$pageChild.outerHeight(true) * this.$li.length);
                }
            }
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
                        that.marqueeHandler()
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
                case 'marquee':
                    this.marqueeHandler();
                    break;
            }
        },

        singlePageHandler: function(btnDir, num) {
            if (this.lock) {
                return;
            }
            if (btnDir === 'prev') {
                if (!this.curIndex) {
                    this.lock = true;
                }
                this.curIndex -= 1;
            } else if (btnDir === 'next') {
                if (this.curIndex === this.length - 1) {
                    this.lock = true;
                }
                this.curIndex += 1;
            } else {
                this.curIndex = num;
            }
            this.slidePage(this.curIndex);
        },

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
        duplicateList: function() {
            var that = this,
                initPos = -this.liSize + 'px',
                listSize = this.liSize * (this.length + 2);
            this.$li.first().clone().appendTo(this.$list);
            this.$li.last().clone().prependTo(this.$list);
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

        lazyloadHandler: function(num) {
            var that = this;
            for (var i = 0; i < this.o.perGroup; i++) {
               this.$li.eq(num * this.o.perSlideView + i).find('img').each(function() {
                    if ($(this).attr('data-src')) {
                        $(this).attr('src', $(this).data('src'));
                        $(this).removeAttr('data-src');
                        that.imgLen++;
                    }
                });
            }
        },

        doBeforeSlideFunc: function() {
            if (this.o.lazyload && this.imgLen <= this.$li.length) {
                this.lazyloadHandler(this.curIndex);
            }
            this.o.beforeSlideFunc();
        },

        slidePage: function(num) {
            this.doBeforeSlideFunc();
            var that = this;
            var newnum = (this.o.effect === 'slide' && this.duplicateEdge) ? num + 1 : num;
            var targetPos = -newnum * this.liSize * this.o.perSlideView;
            this.o.dir === 'h' ?
            this.$list.stop(true).animate({
                left: targetPos
            }, this.o.speed, 'linear', function() {
                that.slideCallBack(num);
            }) :
            this.$list.stop(true).animate({
                top: targetPos
            }, this.o.speed, 'linear', function() {
                that.slideCallBack(num);
            });
        },

        slideFade: function(num) {
            this.doBeforeSlideFunc();
            var that = this;
            this.$li.eq(num).fadeIn(this.o.speed, function() {
                that.slideCallBack();
            }).siblings().fadeOut(this.o.speed);
        },

        currentClassChange: function() {
            var that = this;
            if (this.$pagination) {
                this.$pageChild.removeClass('on').eq(this.curIndex).addClass('on');
            }
            if (this.o.paginationType === 'image' && this.o.paginationFollow) {
                if (this.o.paginationFollow === 'h') {
                    if (this.$pageChild.eq(this.curIndex).offset().left - this.$pagination.offset().left > this.$pagination.width()) {
                        this.$pagination.find('.' + PAGINATIONWRAPPER).animate({
                            left: '-=' + that.$pagination.width()
                        }, this.o.speed);
                    }
                } else {
                    if (this.$pageChild.eq(this.curIndex).offset().top - this.$pagination.offset().top > this.$pagination.height()) {
                        this.$pagination.find('.' + PAGINATIONWRAPPER).animate({
                            top: '-=' + that.$pagination.height()
                        }, this.o.speed);
                    }
                }
            }
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
                this.lock = false;
            } else if (this.o.effect === 'marquee') {
                this.curIndex = num;
            }
            this.currentClassChange();
            this.o.afterSlideFunc();
        }
    };

    //调用插件
    $.fn.slide = function(option) {
        return this.each(function() {
            new Slide($(this), option);
        });
    };
}(jQuery));