(function($) {
    var d = {
        dir: 'horizontal',  //滚动方向（水平或竖直）
        speed: 500,  //滚动速度
        prev: '.prev', //翻页按钮，下同
        next: '.next',
        effect: 'slide',  //效果
        perGroup: 1,  //显示数量
        perSlideView: 1,  //每次滚动的数量
        autoPlay: 0,  //自动滚动的时间间隔，大于0时有效
        pagination: null,  //分页器
        paginationType: 'dot',  //分页器类型
        mousewheel: false  //全屏模式下使用鼠标滚轮滚动
    };
    var CUR_CLASS_NAME = 'slide-active',
        DUPLICATE_CLASS_NAME = 'slide-duplicate';
    var errorMsg = {
        effect: "effect参数值有误，请重新填写。"
    };
    function init(options) {
        var o = $.extend({}, d, options);
        this.o = o;
        this.block = this.$this;
        this.speed = this.o.speed;
        this.dir = this.o.dir;
        this.btnPrev = $(this.o.prev);
        this.btnNext = $(this.o.next);
        this.pagination = $(this.o.pagination);
        this.autoPlay = this.o.autoPlay;
        this.effect = this.o.effect;
        this.perGroup = this.o.perGroup;
        this.perSlideView = this.o.perSlideView;
        this.paginationType = this.o.paginationType;
        this.mousewheel = this.o.mousewheel;
        this.list = this.block.find('ul');
        this.li = this.list.find('li');
        this.liWidth = this.li.width();
        this.liHeight = this.li.height();
        this.liSize = this.dir === 'horizontal' ? this.liWidth : this.liHeight;
        this.length = this.li.length;
        this.slideLength = Math.ceil((this.length - this.perGroup) / this.perSlideView) + 1;
        this.pageChild = null;
        this.timer = null;
        this.counter = 0;
        this.nextCounter = 0;
        this.lock = false;  //避免用户操作过于频繁而使用上锁机制
        if(this.perGroup > 1 && this.effect !== 'carousel') {
            console.error(errorMsg.effect);
        }
        if(this.mousewheel && this.effect !== 'fullPage') {
            console.error(errorMsg.effect);
        }
        //初始化轮播样式
        this.setStyle();
        //添加分页器
        if(this.pagination) {
            this.createPagination();
        }
        //单页状态下复制list头尾两个li元素
        if(this.effect === 'slide') {
            this.duplicateList();
        }
        //绑定事件
        bindEvent(this);
        //自动播放
        setAutoPlay(this);
    }
    function bindEvent($ele) {
        $ele.pageChild.on('click', function() {
            $ele.slideTo($(this).index());
        })
        $ele.btnPrev.on('click', function() {
            $ele.slidePrev();
        });
        $ele.btnNext.on('click', function() {
            $ele.slideNext();
        });
        if($ele.effect === 'fullPage' && $ele.mousewheel) {
            //全屏模式下绑定鼠标滚轮事件
            $(document).on("mousewheel DOMMouseScroll", function(e) {
                if($ele.lock) {
                    return;
                }
                $ele.lock = true;
                e.preventDefault();
                var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                value > 0 ? $ele.slidePrev() : $ele.slideNext();
                value = null;
            });
            //窗口缩放时重置轮播
            $(window).on('resize', function() {
                $ele.reset();
            });
        }
    }
    function setAutoPlay($ele) {
        if($ele.autoPlay){
            setInterval(function() {
                $ele.slideNext(true);
            }, $ele.autoPlay);
        }
    }
    function Slide($this, options) {
        this.$this = $this;
        init.call(this, options);
    }
    $.extend(Slide.prototype, {
        setStyle: function() {
            var that = this;
            if(this.effect === 'fade') {
                this.block.width(this.liWidth).height(this.liHeight);
                this.list.addClass('slide-fade');
                this.li.first().show();
                return;
            }
            if (this.effect === 'fullPage') {
                this.li.width($("body").width()).height($("body").height());
                this.liWidth = this.li.width();
                this.liHeight = this.li.height();
                this.liSize = this.dir === 'horizontal' ? this.liWidth : this.liHeight;
            }
            if(this.dir === 'horizontal') {
                this.block.width(that.liWidth * this.perGroup);
                this.list.width(that.liWidth * that.length);
            } else {
                this.block.height(that.liHeight * this.perGroup);
                this.list.height(that.liHeight * that.length);
            }
            this.list.addClass('slide-' + that.dir);
            this.li.first().addClass(CUR_CLASS_NAME);
        },
        createPagination: function() {
            var that = this;
            if(this.o.paginationType === 'outer') {
                this.pageChild = this.pagination.children().length === this.slideLength ? this.pagination.children() : null;
            }
            else{
                var pageHtml = '';
                for(var i = 0, j; i < this.slideLength; i ++) {
                    j = this.o.paginationType === 'num' ? i : '';
                    pageHtml += '<a href="javascript:;">' + j + '</a>';
                }
                this.pagination.append(pageHtml);
                this.pageChild = this.pagination.children();
            }
            this.pageChild.first().addClass('on');
        },
        reset: function() {
            var $body = $("body"),
            that = this;
            this.li.width($("body").width()).height($("body").height());
            this.liWidth = this.li.width();
            this.liHeight = this.li.height();
            if(this.dir === 'horizontal') {
                this.list.width(that.liWidth * that.length).css('left', -that.liWidth * that.counter + 'px');
                this.block.width(that.liWidth);
            }else{
                this.list.height(that.liHeight * that.length).css('top', -that.liHeight * that.counter + 'px');
                this.block.height(that.liHeight);
            }
        },
        slidePrev: function() {
            clearInterval(this.timer);
            switch(this.effect) {
                case 'slide': {
                    this.singlePageHandler('prev');
                    break;
                }
                case 'carousel': {
                    this.carouselHandler('prev');
                    break;
                }
                case 'fade': {
                    this.fadeHandler('prev');
                    break;
                }
                case 'fullPage': {
                    this.fullPageHandler('prev');
                    break;
                }
                default: {
                    console.error(errorMsg.effect);
                    break;
                }
            }
        },
        slideNext: function(notClear) {
            if(!notClear) {
                clearInterval(this.timer);
            }
            switch(this.effect) {
                case 'slide': {
                    this.singlePageHandler('next');
                    break;
                }
                case 'fade': {
                    this.fadeHandler('next');
                    break;
                }
                case 'carousel': {
                    this.carouselHandler('next');
                    break;
                }
                case 'fullPage': {
                    this.fullPageHandler('next');
                    break;
                }
                default: {
                    console.error(errorMsg.effect);
                    break;
                }
            }
        },
        slideTo: function(num) {
            clearInterval(this.timer);
            switch(this.effect) {
                case 'slide': {
                    this.singlePageHandler('to', num);
                    break;
                }
                case 'fade': {
                    this.fadeHandler('to', num);
                    break;
                }
                case 'carousel': {
                    this.carouselHandler('to', num);
                    break;
                }
                case 'fullPage': {
                    this.fullPageHandler('to', num);
                    break;
                }
                default: {
                    console.error(errorMsg.effect);
                    break;
                }
            }
        },
        singlePageHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                this.nextCounter = this.counter - 1;
            } else if(btnDir === 'next') {
                this.nextCounter = this.counter + 1;
            } else {
                this.nextCounter = num;
            }
            this.slideSinglePage((this.nextCounter + 1) * this.liSize, this.nextCounter);
        },
        carouselHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                if(this.counter > 0) {
                    this.nextCounter = this.counter - 1;
                } else {
                    this.nextCounter = this.slideLength - 1;
                }
            } else if(btnDir === 'next') {
                if(this.counter < this.slideLength - 1) {
                    this.nextCounter = this.counter + 1;
                } else {
                    this.nextCounter = 0;
                }
            } else {
                this.nextCounter = num;
            }
            this.slideCarousel(this.nextCounter * this.liSize * this.perSlideView, this.nextCounter);
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
            this.slideFullPage(this.nextCounter * this.liSize, this.nextCounter);
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
        currentClassChange: function() {
            this.li.eq(this.counter).addClass(CUR_CLASS_NAME).siblings().removeClass(CUR_CLASS_NAME);
            if(this.pagination) {
                this.pageChild.eq(this.counter).addClass('on').siblings().removeClass('on');
            }
        },
        duplicateList: function() {
            var that = this;
            this.li.last().clone().prependTo(this.list);
            this.li.first().clone().appendTo(this.list);
            this.dir === 'horizontal' ?
            this.list.css({
                'left': -that.liWidth + 'px',
                'width': that.liWidth * (that.length + 2)
            }) :
            this.list.css({
                'top': -that.liHeight + 'px',
                'height': that.liHeight * (that.length + 2)
            });
            this.list.find('li').first().addClass(DUPLICATE_CLASS_NAME).end()
            .last().addClass(DUPLICATE_CLASS_NAME);
        },
        slideSinglePage: function(nextPos, num) {
            var that = this;
            this.dir === 'horizontal' ?
            this.list.animate({left: -nextPos + 'px'}, this.speed, function() {
                that.counter = num;
                if(that.counter < 0) {
                    that.counter = that.length - 1;
                    that.list.css('left', -that.liWidth * that.length);
                }
                else if(that.counter === that.length) {
                    that.counter = 0;
                    that.list.css('left', -that.liWidth);
                }
                that.currentClassChange();
            }) :
            this.list.animate({top: -nextPos + 'px'}, this.speed, function() {
                that.counter = num;
                if(that.counter < 0) {
                    that.counter = that.length - 1;
                    that.list.css('top', -that.liHeight * that.length);
                }
                else if(that.counter === that.length) {
                    that.counter = 0;
                    that.list.css('top', -that.liHeight);
                }
                that.currentClassChange();
            });
        },
        slideCarousel: function(nextPos, num) {
            var that = this;
            this.dir === 'horizontal' ?
            this.list.animate({left: -nextPos + 'px'}, this.speed, function() {
                that.counter = num;
                that.currentClassChange();
            }) :
            this.list.animate({top: -nextPos + 'px'}, this.speed, function() {
                that.counter = num;
                that.currentClassChange();
            }) ;
        },
        slideFullPage: function(nextPos, num) {
            var that = this;
            this.dir === 'horizontal' ?
            this.list.animate({left: -nextPos + 'px'}, this.speed, function() {
                that.counter = num;
                that.currentClassChange();
                that.lock = false;
            }) :
            this.list.animate({top: -nextPos + 'px'}, this.speed, function() {
                that.counter = num;
                that.currentClassChange();
                that.lock = false;
            });
        },
        slideFade: function(num) {
            var that = this;
             this.li.eq(num).fadeIn(300, function() {
                that.counter = num;
                if(that.counter === -1) {
                    that.counter = that.length - 1;
                } else if (that.counter === that.length - 1) {
                    that.counter = -1;
                }
                that.currentClassChange();
            }).siblings().fadeOut(300);
        }
    });
    $.fn.slide = function(options){
        new Slide($(this), options);
    };
}(jQuery));