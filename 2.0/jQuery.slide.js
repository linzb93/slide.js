(function($){
    var d = {
        dir: 'horizontal',  //滚动方向（水平或竖直）
        speed: 500,  //滚动速度
        effect: 'slide',  //效果
        perGroup: 1,  //显示数量
        perSlideView: 1,  //每次滚动的数量
        autoPlay: 0,  //自动滚动的时间间隔，大于0时有效
        pagination: null,  //分页器
        paginationType: 'dot'  //分页器类型
    };
    var pageChild,slideLength;
    var version = 2.0;
    function init(options){
        var o = $.extend(d, options);
        var that = this;
        that.o = o;
        that.block = that.$this,
        that.pagination = $(that.o.pagination),
        that.list = that.block.find('ul');
        that.li = that.list.find('li');
        slideLength = that.li.length;
        that.liWidth = that.li.width();
        that.block.width(that.liWidth);
        that.list.width(that.liWidth * slideLength);
        that.createPagination();
        that.pageClick();
        that.setAutoPlay();
    }
    function Slide($this, options){
        this.$this = $this;
        init.call(this, options);
    }
    $.extend(Slide.prototype, {
        createPagination: function(){
            if(o.paginationType === 'outer'){
                this.pagination.children().length === slideLength ?
                pageChild = this.pagination.children() :
                pageChild = null;
            }
            else{
                var pageHtml = '',
                j;
                for(var i = 0; i < slideLength; i ++){
                    j = o.paginationType === 'num' ? i : '';
                    pageHtml += '<a href="javascript:;">' + j + '</a>';
                }
                this.pagination.append(pageHtml);
                pageChild = this.pagination.children();
            }
        },
        pageClick: function(){
            pageChild.on('click', function(){
                slideTo($(this).index());
            });
        },
        setAutoPlay: function(){
            var that = this;
            if(o.autoPlay){
                setInterval(function(){
                    that.slideNext();
                }, o.autoPlay);
            }
        },
        slideNext: function(){
            this.SlideAnimation(-1);
        },
        slideTo: function(){},
        SlideAnimation: function(num){
            this.list.animate({
                left: '+=' + num * this.liWidth + 'px'
            }, o.speed);
        }
    });
    $.fn.slide = function(options){
        new Slide($(this), options);
        return version;
    };
}(jQuery));
