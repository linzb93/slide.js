import defaults from './defaults';
import { SLIDE_ACTIVE } from './constant';

function Slide($ctx, option) {
    this.opt = $.extend({}, defaults, option);

    this.$ctx = $ctx;
    this._$list = this.$ctx.children(this.opt.wrapper);
    this._$cell = this._$list.children();

    this._$prev = this.$ctx.find(this.opt.prev);
    this._$next = this.$ctx.find(this.opt.next);
    this._$pagination = this.$ctx.children(this.opt.pagination);

    //轮播控件，包含前后切换按钮和分页按钮
    this._$widget = this._$prev.add(this._$next).add(this._$pagination);

    this.length = this._$cell.length;

    //和上面的this.length不同，这个是计算没有循环的情况下，点击一个向后切换的按钮，从头到尾，需要点击多少次。在一次显示多个轮播项的时候用到。
    this._length = this.opt.slidesPerView === 1
        ? this.length
        : Math.ceil((this.length - this.opt.slidesPerView) / this.opt.slidesPerGroup) + 1;
    
    this.curIndex = 0;
    this._cellSize = this.opt.direction === 'h' 
        ? this._$cell.outerWidth(true)
        : this._$cell.outerHeight(true);
    
    //能否滚动的标志，避免一次滚动未结束时开始下一个滚动
    this._canSlide = true;

    this._init();
}

var proto = Slide.prototype;

//初始化
proto._init = function() {
    if (this.opt.effect === 'fade') {
        this._$list.width(this._cellSize).height(this._$cell.height()).addClass('slide-pile');
        this._$cell.hide().first().show();
    } else {
        var wrapperSize = this._cellSize * this.opt.slidesPerView;
        var listSize = this._cellSize * this._$cell.length;
        if (this.opt.direction === 'h') {
            this.$ctx.width(wrapperSize);
            this._$list.width(listSize);
        } else {
            this.$ctx.height(wrapperSize);
            this._$list.height(listSize);
        }
        this.$ctx.addClass('slide-container');
        this._$list.addClass('slide-' + this.opt.direction);
    }
    this._$cell.first().addClass(SLIDE_ACTIVE);

    if (this._$pagination) {
        this._createPagination();
    }
    if (this.opt.enableHideWidget) {
        this._$widget.hide();
    }
    if (this.opt.lazyload) {
        this._lazyload(0);
        if (this.opt.effect === 'slide') {
            this._lazyload(-1);
        }
    }
    if (this.opt.effect === 'slide') {
        this._duplicateEdge();
    }

    this._binding();
    this.play();
};

//创建分页器
proto._createPagination = function() {
    if (this._$pagination.html() === '') {
        var pHTML = '';
        for (var i = 0; i < this._length; i++) {
            pHTML += '<a href="javascript:;"></a>';
        }
        this._$pagination.html(pHTML);
    }
    this._$pagination.children().first().addClass('on');
};

//事件绑定
proto._binding = function() {
    var ctx = this;
    if (this._$pagination) {
        var pageChildType = this._$pagination.children()[0].nodeName.toLowerCase();
    }

    //轮播控件处理事件绑定
    if (this.opt.prev || this.opt.next) {
        this._$prev.on('click', function() {
            ctx.slidePrev();
        });
        this._$next.on('click', function() {
            ctx.slideNext();
        });
    }
    if (this._$pagination) {
        this._$pagination.on('click', pageChildType, function() {
            var index = $(this).index();
            if (index === ctx.curIndex) {
                return;
            }
            ctx.slideTo(index);
        });
    }

    //鼠标悬停在轮播上方时暂停自动播放，移出时继续自动播放
    this.$ctx.on({
        'mouseenter': function() {
            if (ctx.opt.interval) {
                ctx.stop();
                ctx._$list.clearQueue();
            }
            if (ctx.opt.enableHideWidget) {
                ctx._$widget.fadeIn();
            }
        },
        'mouseleave': function() {
            if (ctx.opt.interval) {
                ctx.play();
            }
            if (ctx.opt.enableHideWidget) {
                ctx._$widget.fadeOut();
            }
        }
    });
};

//暂停轮播
proto.stop = function() {
    clearInterval(this.timer);
};

//继续轮播
proto.play = function() {
    var ctx = this;
    if (this.opt.interval) {
        this.timer = setInterval(function() {
            ctx.slideNext();
        }, this.opt.interval);
    }
};

//轮播到上一页
proto.slidePrev = function() {
    this._totalSlideHandler('prev');
};

//轮播到下一页
proto.slideNext = function() {
    this._totalSlideHandler('next');
};

//轮播到指定位置
proto.slideTo = function(index) {
    this._totalSlideHandler('to', index);
};

//轮播处理的入口
proto._totalSlideHandler = function(btnDir, num) {
    var ctx = this;
    if (!this._canSlide) {
        return;
    }
    this._canSlide = false;
    this.opt.beforeSlide(this.curIndex, this._$cell.eq(this.curIndex));
    $.each(['fade', 'slide', 'carousel'], function(index, name) {
        if (ctx.opt.effect === name) {
            ctx['_' + name + 'Handler'].apply(ctx, [btnDir, num]);
        }
    });
};

//处理单页轮播
proto._slideHandler = function(btnDir, num) {
    if (btnDir === 'prev') {
        this.curIndex -= 1;
    } else if (btnDir === 'next') {
        this.curIndex += 1;
    } else {
        this.curIndex = num;
    }
    this._slidePage(this.curIndex);
}

//处理多页滚动轮播
proto._carouselHandler = function(btnDir, num) {
    if (btnDir === 'prev') {
        this.curIndex = !this.curIndex ? this._length - 1 : this.curIndex - 1;
    } else if (btnDir === 'next') {
        this.curIndex = this.curIndex === this._length - 1 ? 0 : this.curIndex + 1;
    } else {
        this.curIndex = num;
    }
    this._slidePage(this.curIndex);
};

//处理焦点轮播
proto._fadeHandler = function(btnDir, num) {
    if (btnDir === 'prev') {
        this.curIndex = this.curIndex ? this.curIndex - 1 : this.length - 1;
    } else if (btnDir === 'next') {
        this.curIndex = this.curIndex < this.length - 1 ? this.curIndex + 1 : 0;
    } else {
        this.curIndex = num;
    }
    this._slideFade(this.curIndex);
};

//复制轮播列表头尾两个元素
proto._duplicateEdge = function() {
    var initPos = -this._cellSize + 'px';
    var listSize = this._cellSize * (this.length + 2);
    this._$cell.first().removeClass(SLIDE_ACTIVE).clone().appendTo(this._$list);
    this._$cell.last().clone().prependTo(this._$list);
    this._$cell.first().addClass(SLIDE_ACTIVE);
    if (this.opt.direction === 'h') {
        this._$list.css('width', listSize);
        this._$list.css('left', initPos);
    } else {
        this._$list.css('height', listSize);
        this._$list.css('top', initPos);
    }
};

//处理单页滚动和焦点轮播的懒加载
proto._lazyload = function(num) {
    var $curCell = this._$cell.eq(num);
    if ($curCell.attr('data-bg')) {
        $curCell.css('background-image', $curCell.data('bg'))
        .removeAttr('data-bg');
    } else if ($curCell.find('img').attr('data-src')) {
        $curCell.find('img').each(function() {
            $(this).attr('src', $(this).data('src'));
            $(this).removeAttr('data-src');
        });
    }
};

//执行轮播动画之前的函数
proto._dobeforeSlide = function() {
    if (this.opt.lazyload) {
        this._lazyload(this.curIndex);
    }
};

//执行滚动动画
proto._slidePage = function(num) {
    this._dobeforeSlide(num);
    var ctx = this;
    var newNum = (this.opt.effect === 'slide') ? num + 1 : num;
    var targetPos = -newNum * this._cellSize * this.opt.slidesPerGroup;
    if (this.opt.direction === 'h') {
        this._$list.animate({'left': targetPos}, this.opt.speed, this.opt.easing, function() {
            ctx._slideCallBack(num);
        });
    } else {
        this._$list.animate({'top': targetPos}, this.opt.speed, this.opt.easing, function() {
            ctx._slideCallBack(num);
        });
    }
};

//执行焦点轮播动画
proto._slideFade = function(num) {
    this._dobeforeSlide();
    var ctx = this;
    this._$cell.eq(num).fadeIn(this.opt.speed, function() {
        ctx._slideCallBack(num);
    }).siblings().fadeOut(this.opt.speed);
};

//切换分页器元素的class，和轮播当前页的class
proto._currentClassChange = function(num) {
    if (this._$pagination) {
        this._$pagination.children().removeClass('on').eq(num).addClass('on');
    }
};

//轮播执行后的回调函数
proto._slideCallBack = function(num) {
    if (this.opt.effect === 'slide') {
        var animationDir = this.opt.direction === 'h' ? 'left' : 'top';
        if (this.curIndex === -1) {
            this.curIndex = this.length - 1;
            this._$list.css(animationDir, -this._cellSize * this.length);
        } else if (this.curIndex === this.length) {
            this.curIndex = 0;
            this._$list.css(animationDir, -this._cellSize);
        }
    }
    this._canSlide = true;
    this._currentClassChange(this.curIndex);
    this.opt.afterSlide(this.curIndex, this._$cell.eq(this.curIndex));
}

$.fn.slide = function(opt) {
    new Slide($(this), opt);
};