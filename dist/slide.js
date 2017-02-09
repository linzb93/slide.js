(function($, window, undefined) {
    'use strict';

    var defaults = {
        wrapper: '.slide-wrapper',
        dir: 'h',
        speed: 500,
        prev: '',
        next: '',
        effect: 'fade',
        pagination: {
            selector: '',
            type: 'dot',
            event: 'click'
        },
        autoPlay: 0,
        perGroup: 1,
        slidePerView: 1,
        easing: 'swing',
        css3: false,
        lazyload: false,
        enableHideWidget: false,
        beforeCreate: $.noop,
        afterCreate: $.noop,
        beforeSlide: $.noop,
        afterSlide: $.noop
    };

    //特殊类名
    var SLIDE_ACTIVE = 'slide-active';

    /*
     * @class Slide。
     * 所有属性和方法都可被外部访问，仅供内部使用的属性和方法在名称前面添加'_'号。
     * @param {Object} [$this] jQuery对象
     * @param {Object} [option] 配置参数
     */
    function Slide($this, option) {
        this.$this = $this;
        this.opt = $.extend(true, {}, defaults, option);

        this.$wrapper = this.$this.children(this.opt.wrapper);
        this.$list = this.$wrapper.children();
        this.$cell = this.$list.children();
        this.$cellSize = this.opt.dir === 'h' ? this.$cell.outerWidth(true) : this.$cell.outerHeight(true);
        this.$btnPrev = this.$this.children(this.opt.prev);
        this.$btnNext = this.$this.children(this.opt.next);
        if ($.type(this.opt.pagination) === 'string') {
            this.$pagination = this.$this.find(this.opt.pagination)
        } else if ($.isPlainObject(this.opt.pagination)) {
            this.$pagination = this.$this.find(this.opt.pagination.selector);
        }
        this.length = this.$cell.length;
        this._length = this.opt.perGroup === 1 ?
        this.length :
        Math.ceil((this.length - this.opt.perGroup) / this.opt.perSlideView) + 1;
        this.curIndex = 0;
        this.$widget = this.$btnPrev.add(this.$btnNext).add(this.$pagination);
        this.canSlide = false;
    }

    Slide.prototype = {
        constructor: Slide,
        _init: function() {},
        _createPagination: function() {
            if (this.opt.pagination.type !== 'outer') {
                var html = '';
                for (var i = 0; i < this._length; i++) {
                    var j;
                    switch (this.opt.pagination.type) {
                        case 'dot':
                            j = '';
                            break;
                        case 'num':
                            j = i;
                            break;
                        case 'image':
                            var $curCell = j = this.$cell.eq(i);

                            /*
                             * 解释下下面这行代码里面的5和-2是什么：
                             * 假如执行这段代码：$ele.css('background-image')
                             * 返回值是形如 url(http://www.example.com/logo.png)的；
                             * 因此，从返回值里获得图片地址‘http://www.example.com/logo.png’
                             * 就是获取原字符串里第5个字符到倒数第2个字符
                             */
                            j = $curCell.find('img').attr('src') || $curCell.css('background-image').slice(5, -2);
                            break;
                        default:
                            break;
                    }
                    html += '<a href="javascript:;">' + j + '</a>';
                }
                this.$pagination.html(html);
            }
            this.$pageChild = this.$pagination.children();
        },
        _initEvent: function() {
            var self = this;
            var pageChildType = this.$pageChild[0].nodeName.toLowerCase();

            //轮播控件处理事件绑定
            if (this.opt.prev || this.opt.next) {
                this.$btnPrev.on('click', function() {
                    self._totalSlideHandler('prev');
                });
                this.$btnNext.on('click', function() {
                    self._totalSlideHandler('next');
                });
            }
            if (this.$pageChild) {
                this.$pagination.on(this.opt.pagination.event, pageChildType, function() {
                    var index = $(this).index();
                    if (index === self.curIndex) {
                        return;
                    }
                    self._totalSlideHandler('to', index);
                })
            }

            //鼠标悬停在轮播上方时暂停自动播放，移出时继续自动播放
            this.$this.on({
                'mouseenter': function() {
                    if (self.opt.autoPlay || self.opt.effect === 'marquee') {
                        self.stop();
                        self.$list.clearQueue();
                    }
                    if (self.opt.enableHideWidget) {
                        self.$widget.stop(true, true).fadeIn();
                    }
                },
                'mouseleave': function() {
                    if (self.opt.autoPlay) {
                        self.play();
                    }
                    if (self.opt.effect === 'marquee') {
                        self._marqueeHandler();
                    }
                    if (self.opt.showWidget) {
                        self.$widget.stop(true, true).fadeOut();
                    }
                }
            });
        },
        set: function(option) {
            $.extend(this.opt, option);
        },
        stop: function() {
            clearInterval(this.timer);
        },
        play: function() {
            if (this.opt.autoPlay) {
                this.timer = setInterval(function() {
                    this._totalSlideHandler('next');
                }, this.opt.autoPlay);
            }
        },
        slidePrev: function() {
            this._totalSlideHandler('prev');
        },
        slideNext: function() {
            this._totalSlideHandler('next');
        },
        _totalSlideHandler: function(btnDir, num) {
            var self = this;
            $.each(['fade', 'slide', 'carousel', 'marquee', 'return'], function(index, name) {
                if (self.opt.effect === name) {
                    Slide['_' + name + 'Handler'].apply(self, [btnDir, num]);
                }
            });
        },
        _slideHandler: function() {
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
            this._slidePage(this.curIndex);
        },
        _lazyload: function() {},
        destroy: function() {
            this.$btnPrev.add(this.$btnNext).off('click');
            this.$pagination.off(this.opt.pagination.event);
            clearInterval(this.timer);
            this.$this.html('');
        }
    };

    $.fn.slide = function(option) {
        return new Slide($(this), option);
    };
})(jQuery, window, undefined);