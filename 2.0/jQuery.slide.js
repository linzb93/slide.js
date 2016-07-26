(function($){
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
        currentClass: false  //当前页面的class
    };
    var CUR_CLASS_NAME = 'slide-active',
        DUPLICATE_CLASS_NAME = 'slide-duplicate';
    function init(options){
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
        this.currentClass = this.o.currentClass;
        this.list = this.block.find('ul');
        this.li = this.list.find('li');
        this.liWidth = this.li.width();
        this.liHeight = this.li.height();
        this.length = this.li.length;
        this.slideLength =Math.ceil((this.length - this.perGroup) / this.perSlideView) + 1;
        this.pageChild = null;
        this.timer = null;
        this.counter = 0;
        this.lock = false;
        //初始化轮播样式
        this.setStyle();
        //添加分页器
        if(this.pagination){
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
    function bindEvent($ele){
        $ele.pageChild.on('click', function(){
            $ele.slideTo($(this).index());
        })
        $ele.btnPrev.on('click', function(){
            $ele.slidePrev();
        });
        $ele.btnNext.on('click', function(){
            $ele.slideNext();
        });
        //全屏模式下绑定鼠标滚轮事件
        if($ele.effect === 'fullPage') {
            $(document).on("mousewheel DOMMouseScroll", function(e) {
                e.preventDefault();
                var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                value > 0 ?
                $ele.slidePrev() :
                $ele.slideNext();
                value = null;
            });
        }
    }
    function setAutoPlay($ele){
        if($ele.autoPlay){
            setInterval(function(){
                $ele.slideNext(true);
            }, $ele.autoPlay);
        }
    }
    function Slide($this, options){
        this.$this = $this;
        init.call(this, options);
    }
    $.extend(Slide.prototype, {
        setStyle: function(){
            var that = this;
            if(this.effect === 'fade') {
                this.block.width(this.liWidth).height(this.liHeight);
                this.list.addClass('slide-fade');
                this.li.first().show();
                return;
            }
            if (this.effect === 'fullPage') {
                var $body = $("body");
                this.li.width($body.width());
                this.li.height($body.height());
                this.liWidth = this.li.width();
                this.liHeight = this.li.height();
                $body = null;
            }
            if(this.dir === 'horizontal') {
                this.block.width(that.liWidth * this.perGroup);
                this.list.width(that.liWidth * that.length);
            } else {
                this.block.height(that.liHeight * this.perGroup);
                this.list.height(that.liHeight * that.length);
            }
            this.list.addClass('slide-' + that.dir);
            if(this.currentClass){
                this.li.first().addClass(CUR_CLASS_NAME);
            }
        },
        createPagination: function(){
            var that = this;
            if(this.o.paginationType === 'outer'){
                this.pagination.children().length === this.slideLength ?
                this.pageChild = this.pagination.children() :
                this.pageChild = null;
            }
            else{
                var pageHtml = '';
                for(var i = 0, j; i < this.slideLength; i ++){
                    j = this.o.paginationType === 'num' ? i : '';
                    pageHtml += '<a href="javascript:;">' + j + '</a>';
                }
                this.pagination.append(pageHtml);
                this.pageChild = this.pagination.children();
            }
            this.pageChild.first().addClass('on');
        },
        slidePrev: function(){
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
                    console.error('effect参数值有误，请重新填写。');
                    break;
                }
            }
        },
        slideNext: function(notClear){
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
                    console.error('effect参数值有误，请重新填写。');
                    break;
                }
            }
        },
        slideTo: function(num){
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
                    console.error('effect参数值有误，请重新填写。');
                    break;
                }
            }
        },
        singlePageHandler: function(btnDir, num){
            if(btnDir === 'prev') {
                this.slideSinglePage(1);
            } else if(btnDir === 'next') {
                this.slideSinglePage(-1);
            } else {
                this.slideSinglePage(this.counter - num);
            }
        },
        carouselHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                if(this.counter >= 0) {
                    this.slideCarousel(1);
                } else {
                    this.slideCarousel(1 - this.slideLength);
                }
            } else if(btnDir === 'next') {
                if(this.counter < this.slideLength - 1) {
                    this.slideCarousel(-1);
                } else {
                    this.slideCarousel(this.slideLength - 1);
                }
            } else {
                this.slideCarousel(this.counter - num);
            }
        },
        fullPageHandler: function(btnDir, num) {
            if(btnDir === 'prev') {
                if(this.counter > 0){
                    this.slideFullPage(1);
                }
            } else if(btnDir === 'next') {
                if(this.counter < this.length - 1) {
                    console.log('in');
                    this.slideFullPage(-1);
                }
            } else {
                this.slideFullPage(this.counter - num);
            }
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
            if(this.currentClass){
                this.li.eq(this.counter).addClass(CUR_CLASS_NAME).siblings().removeClass(CUR_CLASS_NAME);
            }
            if(this.pagination){
                this.pageChild.eq(this.counter).addClass('on').siblings().removeClass('on');
            }
        },
        duplicateList: function() {
            var that = this;
            this.li.last().clone().prependTo(this.list);
            this.li.first().clone().appendTo(this.list);
            if(this.dir === 'horizontal') {
                this.list.css({
                    'left': -that.liWidth + 'px',
                    'width': that.liWidth * (that.length + 2)
                });
            } else {
                this.list.css({
                    'top': -that.liHeight + 'px',
                    'height': that.liHeight * (that.length + 2)
                });
            }
            this.list.find('li').first().addClass(DUPLICATE_CLASS_NAME).end()
            .last().addClass(DUPLICATE_CLASS_NAME);
        },
        slideSinglePage: function(num) {
            var that = this;
            this.dir === 'horizontal' ?
            this.list.animate({left: '+=' + num * this.liWidth+ 'px'}, this.speed, function() {
                that.counter -= num;
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
            this.list.animate({top: '+=' + num * this.liHeight + 'px'}, this.speed, function() {
                that.counter -= num;
                if(that.counter < 0) {
                    that.counter = that.length - 1;
                    this.list.css('top', -this.liHeight * that.length);
                }
                else if(that.counter === that.length) {
                    that.counter = 0;
                    that.list.css('top', -that.liHeight);
                }
                that.currentClassChange();
            });
        },
        slideCarousel: function(num) {
            var that = this;
            this.dir === 'horizontal' ?
            this.list.animate({left: '+=' + num * this.perSlideView * this.liWidth + 'px'}, this.speed, function() {
                that.counter -= num;
                that.currentClassChange();
            }) :
            this.list.animate({top: '+=' + num * this.perSlideView * this.liHeight + 'px'}, this.speed, function() {
                that.counter -= num;
                that.currentClassChange();
            }) ;
        },
        slideFullPage: function(num) {
            var that = this;
            this.dir === 'horizontal' ?
            this.list.animate({left: '+=' + num * this.liWidth}, this.speed, function() {
                that.counter -= num;
                that.currentClassChange();
            }) :
            this.list.animate({top: '+=' + num * this.liHeight}, this.speed, function() {
                that.counter -= num;
                that.currentClassChange();
            })
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