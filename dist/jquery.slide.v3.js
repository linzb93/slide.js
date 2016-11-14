(function($) {
    var d = {
        prev: '',
        next: '',
        pagination: ''
    };

    function Slide($this, option) {
        this.$this = $this;
        this.o = $.extend({}, d, option);

        this.init();
    }

    Slide.prototype = (function() {
        var $btnPrev, $btnNext, $pagination, $pageChild, $list, $li;
        var curIndex = 0;
        var _init = function() {
            $btnPrev = $(this.o.prev);
            $btnNext = $(this.o.next);
            $pagination = $(this.o.pagination);
            $list = this.$this.children('ul');
            $li = $list.children('li');
            liSize = $li.width();

            $list.width(liSize * $li.length).addClass('slide-h');

            this.$this.addClass('slide-container');

            createPagination();
            initEvent();
        };

        function createPagination() {
            var tempHtml = '';
            for (var i = 0, j; i < $li.length; i++) {
                tempHtml += '<a href="javascript:;"></a>';
            }
            $pagination.append(tempHtml);
            $pageChild = $pagination.children();
            $pageChild.first().addClass('on');
        }

        function initEvent() {
            $pageChild.on('click', function() {
                handler('to', $(this).index());
            });

            $btnPrev.on('click', function() {
                handler('prev');
            });

            $btnNext.on('click', function() {
                handler('next');
            });
        }

        function handler(dir, num) {
            if (dir === 'prev') {
                curIndex -= 1;
            } else if (dir === 'next') {
                curIndex += 1;
            } else {
                curIndex = num;
            }
            slidePage(curIndex);
        }

        function slidePage(num) {
            $list.animate({
                left: -liSize * num
            }, 500, function() {
                $pageChild.eq(curIndex).addClass('on').siblings().removeClass('on');
            });
        }

        return {
            init: _init
        }
    })();

    $.fn.slide = function(option) {
        new Slide($(this), option);
        return this;
    }
})(jQuery);