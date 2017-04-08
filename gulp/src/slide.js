(function($) {
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
        interval: 0,
        perGroup: 1,
        slidePerView: 1,
        easing: 'swing',
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
        this.opt = $.extend(true, {}, defaults, option);

        // jQuery对象
        this.$this = $this;
        this._$wrapper = this.$this.children(this.opt.wrapper);
        this._$list = this._$wrapper.children();
        this._$cell = this._$list.children();

        // 轮播控件
        this._$btNprev = this.$this.children(this.opt.prev);
        this._$btNnext = this.$this.children(this.opt.next);
        if ($.type(this.opt.pagination) === 'string') {
            var sel = this.opt.pagination
            this.opt.pagination = {
                selector: sel,
                type: 'dot',
                event: 'click'
            }
        }
        if (this.opt.pagination.selector) {
            this._$pagination = this.$this.children(this.opt.pagination.selector) || $(this.opt.pagination.selector);
        }
        this._$widget = this._$btNprev.add(this._$btNnext).add(this._$pagination);

        // 暴露属性
        this.length = this._$cell.length;
        this.curIndex = 0;

        // 内部使用
        this._cellSize = this.opt.dir === 'h' ? this._$cell.outerWidth(true) : this._$cell.outerHeight(true);
        this._length = this.opt.perGroup === 1 ?
            this.length :
            Math.ceil((this.length - this.opt.perGroup) / this.opt.slidePerView) + 1;

        //是否允许执行轮播，在轮播项滚动至边缘时要用到
        this._canSlide = false;

        //已经加载图片的轮播项数量，执行懒加载时要用到
        this._loadImgLen = 0;

        // 是否复制头尾两个轮播项，仅在单页轮播和无缝轮播时使用
        this._needDuplicateEdge = this.opt.interval || this.opt.next;

        this._init();
    }

    Slide.prototype = {
        constructor: Slide,

        _init: function() {
            this.opt.beforeCreate();
            if (this.opt.effect === 'fade') {
                this._$wrapper.width(this._cellSize).height(this._$cell.height());
                this._$list.addClass('slide-pile');
                this._$cell.hide().first().show();
            } else {
                var wrapperSize = this._cellSize * this.opt.perGroup;
                var listSize = this._cellSize * this._$cell.length;
                this._$wrapper.addClass('slide-container');
                if (this.opt.dir === 'h') {
                    this._$wrapper.width(wrapperSize);
                    this._$list.width(listSize);
                } else {
                    this._$wrapper.height(wrapperSize);
                    this._$list.height(listSize);
                }

                this._$list.addClass('slide-' + this.opt.dir);
            }
            this._$cell.first().addClass(SLIDE_ACTIVE);

            if (this._$pagination) {
                this._createPagination();
            }
            if (this.opt.lazyload) {
                this._lazyload(0);
                if (this.opt.effect === 'slide') {
                    this._lazyload(-1);
                }
            }
            if (this.opt.effect === 'slide' && this._needDuplicateEdge) {
                this._duplicateEdge();
            }

            this._initEvent();
            this.opt.afterCreate();
            this.play();
            if (this.opt.effect === 'marquee') {
                this._marqueeHandler();
            }
        },

        //创建分页器
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
                            j = i + 1;
                            break;
                        case 'image':
                            var $curCell = this._$cell.eq(i);

                            /*
                             * 解释下下面这行代码里面的5和-2是什么：
                             * 假如执行这段代码：$ele.css('background-image')
                             * 返回值是形如 url(http://www.example.com/logo.png)的；
                             * 因此，从返回值里获得图片地址‘http://www.example.com/logo.png’
                             * 就是获取原字符串里第5个字符到倒数第2个字符
                             */
                            j = '<img src="' + ($curCell.find('img').attr('src') || $curCell.css('background-image').slice(5, -2)) + '">';
                            break;
                        default:
                            break;
                    }
                    html += '<a href="javascript:;" >' + j + '</a>';
                }
                this._$pagination.html(html);
            }
            this._$pageChild = this._$pagination.children();
            this._$pageChild.first().addClass('on');
        },

        _initEvent: function() {
            var self = this;
            if (this.opt.pagination.selector) {
                var pageChildType = this._$pageChild[0].nodeName.toLowerCase();
            }


            //轮播控件处理事件绑定
            if (this.opt.prev || this.opt.next) {
                this._$btNprev.on('click', function() {
                    self.slidePrev();
                });
                this._$btNnext.on('click', function() {
                    self.slideNext();
                });
            }
            if (this._$pageChild) {
                this._$pagination.on(this.opt.pagination.event, pageChildType, function() {
                    var index = $(this).index();
                    if (index === self.curIndex) {
                        return;
                    }
                    self.slideTo(index);
                });
            }

            //鼠标悬停在轮播上方时暂停自动播放，移出时继续自动播放
            this.$this.on({
                'mouseenter': function() {
                    if (self.opt.interval || self.opt.effect === 'marquee') {
                        self.stop();
                        self._$list.clearQueue();
                    }
                    if (self.opt.enableHideWidget) {
                        self._$widget.fadeIn();
                    }
                },
                'mouseleave': function() {
                    if (self.opt.interval) {
                        self.play();
                    }
                    if (self.opt.effect === 'marquee') {
                        self._marqueeHandler();
                    }
                    if (self.opt.enableHideWidget) {
                        self._$widget.fadeOut();
                    }
                }
            });
        },

        // 暂停轮播
        stop: function() {
            clearInterval(this.timer);
        },

        // 继续轮播
        play: function() {
            var self =  this;
            if (this.opt.interval) {
                this.timer = setInterval(function() {
                    self.slideNext();
                }, this.opt.interval);
            }
        },

        slidePrev: function() {
            this._totalSlideHandler('prev');
        },

        slideNext: function() {
            this._totalSlideHandler('next');
        },

        slideTo: function(index) {
            this._totalSlideHandler('to', index);
        },

        //轮播处理的入口
        _totalSlideHandler: function(btnDir, num) {
            var self = this;
            $.each(['fade', 'slide', 'carousel', 'return'], function(index, name) {
                if (self.opt.effect === name) {
                    self['_' + name + 'Handler'].apply(self, [btnDir, num]);
                }
            });
        },

        //处理单页滚动轮播
        _slideHandler: function(btnDir, num) {
            if (this._canSlide) {
                return;
            }
            if (btnDir === 'prev') {
                if (!this.curIndex) {
                    this._canSlide = true;
                }
                this.curIndex -= 1;
            } else if (btnDir === 'next') {
                if (this.curIndex === this.length - 1) {
                    this._canSlide = true;
                }
                this.curIndex += 1;
            } else {
                this.curIndex = num;
            }
            this._slidePage(this.curIndex);
        },

        //处理多页滚动轮播
        _carouselHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                this.curIndex = !this.curIndex ? this._length - 1 : this.curIndex - 1;
            } else if (btnDir === 'next') {
                this.curIndex = this.curIndex === this._length - 1 ? 0 : this.curIndex + 1;
            } else {
                this.curIndex = num;
            }
            this._slidePage(this.curIndex);
        },

        //处理焦点轮播
        _fadeHandler: function(btnDir, num) {
            if (btnDir === 'prev') {
                this.curIndex = this.curIndex ? this.curIndex - 1 : this.length - 1;
            } else if (btnDir === 'next') {
                this.curIndex = this.curIndex < this.length - 1 ? this.curIndex + 1 : 0;
            } else {
                this.curIndex = num;
            }
            this._slideFade(this.curIndex);
        },

        //处理无缝滚动轮播
        _marqueeHandler: function() {
            var self = this;
            this.opt.easing = 'linear';
            this.timer = setInterval(function() {
                if (self.curIndex < self._$cell.length - self.opt.perGroup) {
                    self._slidePage(++self.curIndex);
                } else {
                    self.curIndex = -1;
                    setTimeout(function() {
                        if (self.opt.dir === 'h') {
                            self._$list.css('left', 0);
                        } else {
                            self._$list.css('top', 0);
                        }
                    }, self.opt.speed);
                }
            }, self.opt.speed + 20);
        },

        //复制轮播列表头尾两个元素
        _duplicateEdge: function() {
            var initPos = -this._cellSize + 'px';
            var listSize = this._cellSize * (this.length + 2);
            this._$cell.first().removeClass(SLIDE_ACTIVE).clone().appendTo(this._$list);
            this._$cell.last().clone().prependTo(this._$list);
            this._$cell.first().addClass(SLIDE_ACTIVE);
            if (this.opt.dir === 'h') {
                this._$list.css('width', listSize);
                this._$list.css('left', initPos);
            } else {
                this._$list.css('height', listSize);
                this._$list.css('top', initPos);
            }
        },

        //处理单页滚动和焦点轮播的懒加载
        _lazyload: function(num) {
            var $curCell = this._$cell.eq(num);
            if ($curCell.attr('data-bg')) {
                $curCell.css('background-image', $curCell.data('bg'))
                .removeAttr('data-bg');
                this._loadImgLen++;
            } else if ($curCell.find('img').attr('data-src')) {
                $curCell.find('img').each(function() {
                    $(this).attr('src', $(this).data('src'));
                    $(this).removeAttr('data-src');
                });
                this._loadImgLen++;
            }
        },

        //执行轮播动画之前的函数
        _dobeforeSlide: function() {
            if (this.opt.lazyload && this._loadImgLen <= this._$cell.length) {
                this._lazyload(this.curIndex);
            }
            this.opt.beforeSlide(this.curIndex - 1, this._$cell.eq(this.curIndex - 1));
        },

        //执行滚动动画
        _slidePage: function(num) {
            this._dobeforeSlide(num);
            var self = this;
            var newNum = (this.opt.effect === 'slide' && this._needDuplicateEdge) ? num + 1 : num;
            var targetPos = -newNum * this._cellSize * this.opt.slidePerView;
            if (this.opt.dir === 'h') {
                this._$list.stop(true).animate({'left': targetPos}, this.opt.speed, this.opt.easing, function() {
                    self._slideCallBack(num);
                });
            } else {
                this._$list.stop(true).animate({'top': targetPos}, this.opt.speed, this.opt.easing, function() {
                    self._slideCallBack(num);
                });
            }
        },

        //执行焦点轮播动画
        _slideFade: function(num) {
            this._dobeforeSlide();
            var self = this;
            this._$cell.eq(num).fadeIn(this.opt.speed, function() {
                self._slideCallBack(num);
            }).siblings().fadeOut(this.opt.speed);
        },

        //切换分页器元素的class，和轮播当前页的class
        _currentClassChange: function(num) {
            if (this._$pagination) {
                this._$pageChild.removeClass('on').eq(num).addClass('on');
            }
            if (this.opt.effect !== 'marquee') {
                this._$cell.removeClass(SLIDE_ACTIVE).eq(num).addClass(SLIDE_ACTIVE);
            }
        },

        //轮播执行后的回调函数
        _slideCallBack: function(num) {
            if (this.opt.effect === 'slide') {
                var animationDir = this.opt.dir === 'h' ? 'left' : 'top';
                if (this.curIndex === -1) {
                    this.curIndex = this.length - 1;
                    this._$list.css(animationDir, -this._cellSize * this.length);
                } else if (this.curIndex === this.length) {
                    this.curIndex = 0;
                    this._$list.css(animationDir, -this._cellSize);
                }
                this._canSlide = false;
            } else if (this.opt.effect === 'marquee') {
                this.curIndex = num;
            }
            this._currentClassChange(this.curIndex);
            this.opt.afterSlide(this.curIndex, this._$cell.eq(this.curIndex));
        }
    };

    $.fn.slide = function(option) {
        return new Slide($(this), option);
    };
})(jQuery);