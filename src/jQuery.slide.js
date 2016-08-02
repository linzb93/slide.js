;(function($) {
    //default option
    var d = {
        dir: 'horizontal',      //滚动方向（水平或竖直）
        speed: 500,             //滚动速度
        prev: '',               //上翻页按钮
        next: '',               //下翻页按钮
        effect: 'slide',        //效果
        perGroup: 1,            //显示数量
        perSlideView: 1,        //每次滚动的数量
        autoPlay: 0,            //自动滚动的时间间隔
        pagination: '',         //分页器
        paginationType: 'dot',  //分页器类型
        wheel: false            //鼠标滚轮滚动
    };

    //class name
    var CUR_CLASS_NAME = 'slide-active',
        DUPLICATE_CLASS_NAME = 'slide-duplicate';

    function init(option) {
        var o = $.extend({}, d, option);
        this.o = o;

        this.btnPrev = $(this.o.prev);
        this.btnNext = $(this.o.next);
        this.pagination = $(this.o.pagination);
        this.list = this.$this.children('ul');
        this.li = this.list.children('li');
        this.liW = this.li.width();
        this.liH = this.li.height();
        this.liSize = this.o.dir === 'horizontal' ? this.liW : this.liH;
        this.length = Math.ceil((this.li.length - this.o.perGroup) / this.o.perSlideView) + 1;

        this.pageChild = null;  //pagination's childnode
        this.timer = null;
        this.counter = 0;
        this.nextCounter = 0;
        this.lock = false;      //避免用户操作过于频繁而使用上锁机制

        //错误检测
        errorDetection(this);

        //初始化轮播样式
        this.setStyle();

        //添加分页器
        if(this.pagination) {
            this.createPagination();
        }

        //单页状态下复制list头尾两个li元素
        if(this.o.effect === 'slide') {
            this.duplicateList();
        }

        //绑定事件
        bindEvent(this);

        //自动播放
        setAutoPlay(this);
    }

    function errorDetection(ele) {
        if(document.documentMode < 10) {
            alert('请勿使用低版本浏览器进行开发！');
        }
        var effectArr = ['slide', 'carousel', 'fullPage', 'fade'],
            paginationArr = ['dot', 'num', 'outer'],
            dirArr = ['horizontal', 'vertical'];
        var errorMsg = function(opt) {
            if(opt === '$this') {
                return '没有找到轮播组件';
            }
            var parentNode = ele.$this.parent(),
            idClass = '';
            if(!!parentNode.attr('id')) {
                idClass = ele.$this.parent().attr('id');
            } else {
                idClass = ele.$this.parent().attr('class');
            }
            return idClass + '的' + opt + '值有误，请重新填写';
        };
        var booleanArr = {
            $this: !ele.$this,
            dir: dirArr.indexOf(ele.o.dir) < 0,
            speed: typeof ele.o.speed !== 'number' || ele.o.speed <= 100,
            prev: !ele.btnPrev,
            next: !ele.btnNext,
            effect: (ele.o.perGroup > 1 && ele.o.effect !== 'carousel') ||
                    effectArr.indexOf(ele.o.effect) < 0,
            perGroup: typeof ele.o.perGroup !== 'number' || ele.o.perGroup < 1,
            perSlideView: typeof ele.o.perSlideView !== 'number' || ele.o.perSlideView < 1,
            autoPlay: typeof ele.o.autoPlay !== 'number' || ele.o.autoPlay < 0,
            pagination: !ele.pagination,
            paginationType: paginationArr.indexOf(ele.o.paginationType) < 0,
            wheel: typeof ele.o.wheel !== 'boolean'
        };
        for(var prop in booleanArr) {
            if(booleanArr[prop]) {
                console.error(errorMsg(prop));
            }
        }
    }

    function Slide($this, option) {
        this.$this = $this;
        init.call(this, option);
    }

    function bindEvent(ele) {
        ele.pageChild.on('click', function() {
            ele.slideTo($(this).index());
        });
        ele.btnPrev.on('click', function() {
            ele.slidePrev();
        });
        ele.btnNext.on('click', function() {
            ele.slideNext();
        });

        if(ele.o.effect === 'fullPage') {
            //全屏模式下绑定鼠标滚轮事件
            $(document).on('mousewheel DOMMouseScroll', function(e) {
                if(!ele.o.wheel) {
                    return;
                }
                if(ele.lock) {
                    return;
                }
                ele.lock = true;
                e.preventDefault();
                (e.originalEvent.wheelDelta || -e.originalEvent.detail) > 0 ?
                ele.slidePrev() :
                ele.slideNext();
            });
            //窗口缩放时重置轮播
            $(window).on('resize', function() {
                console.log('in');
                ele.reset();
            });
        }
    }

    function setAutoPlay(ele) {
        if(ele.o.autoPlay){
            ele.timer = setInterval(function() {
                ele.totalHandler('next');
            }, ele.o.autoPlay);
        }
    }

    function currentClassChange(ele) {
        ele.li.eq(ele.counter).addClass(CUR_CLASS_NAME).siblings().removeClass(CUR_CLASS_NAME);
        if(ele.o.pagination) {
            ele.pageChild.eq(ele.counter).addClass('on').siblings().removeClass('on');
        }
    }

    $.extend(Slide.prototype, {
        setStyle: function() {
            var that = this;
            if(this.o.effect === 'fade') {
                this.$this.width(this.liW).height(this.liH);
                this.list.addClass('slide-fade');
                this.li.first().show();
                return;
            }

            if (this.o.effect === 'fullPage') {
                this.li.width($("body").width()).height($("body").height());
                this.liW = this.li.width();
                this.liH = this.li.height();
                this.liSize = this.o.dir === 'horizontal' ? this.liW : this.liH;
            }

            if(this.o.dir === 'horizontal') {
                this.$this.width(that.liW * this.o.perGroup);
                this.list.width(that.liW * that.o.perSlideView * that.length);
            } else {
                this.$this.height(that.liH * this.o.perGroup);
                this.list.height(that.liH * that.o.perSlideView * that.length);
            }

            this.list.addClass('slide-' + that.o.dir);
            this.li.first().addClass(CUR_CLASS_NAME);
        },

        createPagination: function() {
            var that = this;
            if(this.o.paginationType === 'outer') {
                this.pageChild = this.pagination.children().length === this.length ?
                this.pagination.children() : null;
            } else {
                var pageHtml = '';
                for(var i = 0, j; i < this.length; i ++) {
                    j = this.o.paginationType === 'num' ? i : '';
                    pageHtml += '<a href="javascript:;">' + j + '</a>';
                }
                this.pagination.append(pageHtml);
                this.pageChild = this.pagination.children();
            }
            this.pageChild.first().addClass('on');
        },

        reset: function() {
            var that = this;
            this.li.width($('body').width()).height($('body').height());
            this.liW = this.li.width();
            this.liH = this.li.height();
            this.liSize = this.o.dir === 'horizontal' ? this.liW : this.liH;
            if(this.o.dir === 'horizontal') {
                this.list.css({
                    width: that.liW * that.length,
                    left : -that.liW * that.counter
                });
                this.$this.width(that.liW);
            } else {
                this.list.css({
                    height: that.liH * that.length,
                    top   : -that.liH * that.counter
                });
                this.$this.height(that.liH);
            }
        },

        slidePrev: function() {
            clearInterval(this.timer);
            this.totalHandler('prev');
        },

        slideNext: function() {
            clearInterval(this.timer);
            this.totalHandler('next');
        },

        slideTo: function(num) {
            clearInterval(this.timer);
            this.totalHandler('to', num);
        },

        //轮播处理的入口
        totalHandler: function(btnDir, num) {
            var that = this,
                effectHandler = {
                    slide: that.singlePageHandler,
                    carousel: that.carouselHandler,
                    fullPage: that.fullPageHandler,
                    fade: that.fadeHandler
                };
            effectHandler[this.o.effect].call(this, btnDir, num);
        },

        singlePageHandler: function(btnDir, num) {
            if(this.lock) {
                return;
            }
            this.lock = true;
            if(btnDir === 'prev') {
                this.nextCounter = this.counter - 1;
            } else if(btnDir === 'next') {
                this.nextCounter = this.counter + 1;
            } else {
                this.nextCounter = num;
            }
            this.slideSinglePage(this.nextCounter);
        },

        carouselHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                this.nextCounter = this.counter > 0 ? this.counter - 1 : this.length - 1;
            } else if(btnDir === 'next') {
                this.nextCounter = this.counter < this.length - 1 ? this.counter + 1 : 0;
            } else {
                this.nextCounter = num;
            }
            this.slideCarousel(this.nextCounter);
        },

        fullPageHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                if(this.counter > 0) {
                    this.nextCounter = this.counter - 1;
                }
            } else if(btnDir === 'next') {
                if(this.counter < this.length - 1) {
                    this.nextCounter = this.counter + 1;
                }
            } else {
                this.nextCounter = num;
            }
            this.slideFullPage(this.nextCounter);
        },

        fadeHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                this.counter >= 0 ?
                this.slideFade(this.counter - 1) :
                this.counter = this.length - 1;
            } else if(btnDir === 'next') {
                this.counter <= this.length - 1 ?
                this.slideFade(this.counter + 1) :
                this.counter = 0;
            } else {
                this.slideFade(num);
            }
        },

        duplicateList: function() {
            var that = this;
            this.li.last().clone().prependTo(this.list);
            this.li.first().clone().appendTo(this.list);
            this.o.dir === 'horizontal' ?
            this.list.css({
                left: -that.liW + 'px',
                width: that.liW * (that.length + 2)
            }) :
            this.list.css({
                top: -that.liH + 'px',
                height: that.liH * (that.length + 2)
            });
            this.list.children('li').first().addClass(DUPLICATE_CLASS_NAME).end()
            .last().addClass(DUPLICATE_CLASS_NAME).removeClass(CUR_CLASS_NAME);
        },

        //执行轮播。下同
        slideSinglePage: function(nextCo) {
            var that = this;
            this.o.dir === 'horizontal' ?
            this.list.animate({
                left: -(nextCo + 1) * that.liSize
            }, this.o.speed, function() {
                that.counter = nextCo;
                if(that.counter < 0) {
                    that.counter = that.length - 1;
                    that.list.css('left', -that.liW * that.length);
                } else if(that.counter === that.length) {
                    that.counter = 0;
                    that.list.css('left', -that.liW);
                }
                currentClassChange(that);
                that.lock = false;
            }) :
            this.list.animate({
                top: -(nextCo + 1) * that.liSize
            }, this.o.speed, function() {
                that.counter = nextCo;
                if(that.counter < 0) {
                    that.counter = that.length - 1;
                    that.list.css('top', -that.liH * that.length);
                } else if(that.counter === that.length) {
                    that.counter = 0;
                    that.list.css('top', -that.liH);
                }
                currentClassChange(that);
                that.lock = false;
            });
        },

        slideCarousel: function(nextCo, num) {
            var that = this;
            this.o.dir === 'horizontal' ?
            this.list.animate({
                left: -that.nextCounter * that.liSize * that.o.perSlideView
            }, this.o.speed, function() {
                that.counter = nextCo;
                currentClassChange(that);
            }) :
            this.list.animate({
                top: -that.nextCounter * that.liSize * that.o.perSlideView
            }, this.o.speed, function() {
                that.counter = nextCo;
                currentClassChange(that);
            });
        },

        slideFullPage: function(nextCo, num) {
            var that = this;
            this.o.dir === 'horizontal' ?
            this.list.animate({
                left: -nextCo * that.liSize
            }, this.o.speed, function() {
                that.counter = nextCo;
                currentClassChange(that);
                that.lock = false;
            }) :
            this.list.animate({
                top: -nextCo * that.liSize
            }, this.o.speed, function() {
                that.counter = nextCo;
                currentClassChange(that);
                that.lock = false;
            });
        },

        slideFade: function(num) {
            var that = this;
             this.li.eq(num).fadeIn(300, function() {
                that.counter = num;
                if(that.counter === -1) {
                    that.counter = that.length - 1;
                } else if(that.counter === that.length - 1) {
                    that.counter = -1;
                }
                currentClassChange(that);
            }).siblings().fadeOut(300);
        }
    });

    $.fn.slide = function(option){
        new Slide($(this), option);
    };
}(jQuery));