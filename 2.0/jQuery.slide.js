(function($){
    var d = {
        speed: 500,
        pagination: null,
        autoPlay: 0,
        paginationType: 'dot'
    };
    var pageChild,slideLength;
    function init(options){
        var o = $.extend(d, options);
        var that = this;
        that.o = o;
        that.block = that.$this;
        that.speed = that.o.speed;
        that.pagination = $(that.o.pagination);
        that.autoPlay = that.o.autoPlay;
        that.pageClickable = that.o.pageClickable;
        that.outerPagination = that.o.outerPagination;
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
            if(this.paginationType === 'outer'){
                this.pagination.children().length === slideLength ?
                pageChild = this.pagination.children() :
                pageChild = null;
            }
            else{
                var pageHtml = '',
                j;
                for(var i = 0; i < slideLength; i ++){
                    j = this.paginationType === 'num' ? i : '';
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
            if(this.autoPlay){
                setInterval(function(){
                    that.slideNext();
                }, this.autoPlay);
            }
        },
        slideNext: function(){
            this.SlideAnimation(-1);
        },
        slideTo: function(){},
        SlideAnimation: function(num){
            this.list.animate({
                left: '+=' + num * this.liWidth + 'px'
            }, this.speed);
        }
    });
    $.fn.slide = function(options){
        new Slide($(this), options);
    };
}(jQuery));
