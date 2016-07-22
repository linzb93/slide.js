function Slide(node, config){
	if (typeof $ === 'undefined') {
		console.error('需要引入jQuery文件');
	}
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
    $.extend(d, config);
    this.block = $(node),
    this.pagination = $(d.pagination),
	//考虑到animate()方法而暴露的变量
	this.list = this.block.find('ul');
	var _li = this.list.find('li');
	this.liWidth = _li.width(),
	this.liHeight = _li.height();
	//与轮播直接相关的内部变量
	var	_length = _li.length,
	_slideLength = Math.ceil((_length - d.perGroup) / d.perSlideView) + 1,
	_timer = null,
	_counter = 0,
    _pageChild = null,
    _that = this;

	//初始化
	var _init = function() {
		//初始化轮播样式
		_setStyle();
		//添加分页器
		if(d.pagination) {
			_createPagination();
		}
        //单页状态下复制list头尾两个li元素
        if(d.effect === 'slide') {
        	_duplicateList();
        }
		//默认自动播放
		if(d.autoPlay) {
            _timer = setInterval(function() {
            _that.slideNext(true);
            }, d.autoPlay);
        }
		//全屏模式下绑定鼠标滚轮事件
		if(_that.effect === 'fullPage') {
			$(document).on("mousewheel DOMMouseScroll", function(e) {
                e.preventDefault();
                var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                value > 0 ?
                _that.slidePrev() :
                _that.slideNext();
                value = null;
            });
		}
	};

	this.slidePrev = function() {
		clearInterval(_timer);
        switch(d.effect) {
            case 'slide': {
                _singlePageHandler('prev');
                break;
            }
            case 'carousel': {
                _carouselHandler('prev');
                break;
            }
            case 'fade': {
                _fadeHandler('prev');
                break;
            }
            case 'fullPage': {
                _fullPageHandler('prev');
                break;
            }
            default: {
                console.error('effect参数值有误，请重新填写。');
                break;
            }
        }
    };

    this.slideNext = function(notClear) {
        if(!notClear) {
            clearInterval(_timer);
        }
        switch(d.effect) {
            case 'slide': {
                _singlePageHandler('next');
                break;
            }
            case 'fade': {
                _fadeHandler('next');
                break;
            }
            case 'carousel': {
                _carouselHandler('next');
                break;
            }
            case 'fullPage': {
                _fullPageHandler('next');
                break;
            }
            default: {
                console.error('effect参数值有误，请重新填写。');
                break;
            }
        }
    };

    var _slideTo = function(num) {
        clearInterval(_timer);
        switch(d.effect) {
            case 'slide': {
                _singlePageHandler('to', num);
                break;
            }
            case 'fade': {
                _fadeHandler('to', num);
                break;
            }
            case 'carousel': {
                _carouselHandler('to', num);
                break;
            }
            case 'fullPage': {
                _fullPageHandler('to', num);
                break;
            }
            default: {
                console.error('effect参数值有误，请重新填写。');
                break;
            }
        }
    };

    //处理单页滚动
    var _singlePageHandler = function(btnDir, num) {
        if(btnDir === 'prev') {
            _slideSinglePage(1);
        } else if(btnDir === 'next') {
            _slideSinglePage(-1);
        } else {
            _slideSinglePage(_counter - num);
        }
    };

    //处理多页滚动
    var _carouselHandler = function(btnDir, num) {
        if(btnDir === 'prev') {
            if(_counter >= 0) {
                _slideCarousel(1);
            } else {
                _slideCarousel(1 - _slideLength);
            }
        } else if(btnDir === 'next') {
            if(_counter < _slideLength - 1) {
                _slideCarousel(-1);
            } else {
                _slideCarousel(_slideLength - 1);
            }
        } else {
            _slideCarousel(_counter - num);
        }
    };

    //处理全屏滚动
    var _fullPageHandler = function(btnDir, num) {
        if(btnDir === 'prev') {
            if(_counter > 0){
                _slideFullPage(1);
            }
        } else if(btnDir === 'next') {
            if(_counter < _length - 1) {
                _slideFullPage(-1);
            }
        } else {
            _slideFullPage(_counter - num);
        }
    }

    //处理渐隐渐显式轮播
    var _fadeHandler = function(btnDir, num) {
        if(btnDir === 'prev') {
            _counter >= 0 ?
            _slideFade(_counter - 1) :
            _counter = _length - 1;
        } else if(btnDir === 'next') {
            _counter <= _length - 1 ?
            _slideFade(_counter + 1):
            _counter = 0;
        } else {
            _slideFade(num);
        }
    };

	//初始化样式
	var _setStyle = function() {
		if(d.effect === 'fade') {
			_that.block.width(_that.liWidth).height(_that.liHeight);
			_that.list.addClass('slide-fade');
			_li.eq(0).show();
			return;
		}
		if (d.effect === 'fullPage') {
            var $body = $("body");
			_li.width($body.width());
			_li.height($body.height());
            _that.liWidth = _li.width();
            _that.liHeight = _li.height();
            $body = null;
        }
        if(d.dir === 'horizontal') {
            _that.block.width(_that.liWidth * d.perGroup);
            _that.list.width(_that.liWidth * _length);
        } else {
            _that.block.height(_that.liHeight * d.perGroup);
            _that.list.height(_that.liHeight * _length);
        }
        _that.list.addClass('slide-' + d.dir);
    };

	//初始化分页
	var _createPagination = function() {
		if(d.paginationType === 'outer') {
			_that.pagination.children().length === _length ?
			_pageChild = _that.pagination.children() :
            console.error('分页数量不匹配！');
		} else {
            var pageHtml = '';
            for(var i = 0, j; i < _slideLength; i ++) {
                j = d.paginationType === 'num' ? i + 1 : '';
                pageHtml += '<a href="javascript:;">' + j + '</a>';
            }
            _that.pagination.append(pageHtml);
            _pageChild = _that.pagination.children();
            pageHtml = null;
        }
        _pageChild.eq(0).addClass('on');
		//绑定分页器事件
        _pageChild.on('click', function() {
            _slideTo($(this).index());
        });
    };

	//单页状态下复制list头尾两个li元素
	var _duplicateList = function() {
		var firstList = _li.eq(0),
		lastList = _li.eq(-1);
		lastList.clone().prependTo(_that.list);
		firstList.clone().appendTo(_that.list);
		if(d.dir === 'horizontal') {
			_that.list.css({
				'left': -_that.liWidth + 'px',
				'width': _that.liWidth * (_length + 2)
			});
        } else {
            _that.list.css({
                'top': -_that.liHeight + 'px',
                'height': _that.liHeight * (_length + 2)
            });
        }
        _that.list.find('li').eq(0).addClass('slide-duplicate').end()
        .eq(-1).addClass('slide-duplicate');
        firstList = null,
        lastList = null;
    };

	//分页器变换
	var _paginationChange = function() {
		_pageChild.eq(_counter).onlyClass('on');
	};

	//执行滚动
	var _slideSinglePage = function(num) {
        d.dir === 'horizontal' ?
        _that.list.animate({left: '+=' + num * _that.liWidth+ 'px'}, d.speed, function() {
            _counter -= num;
            if(_counter < 0) {
                _counter = _length - 1;
                _that.list.css('left', -_that.liWidth * _length);
            }
            else if(_counter === _length) {
                _counter = 0;
                _that.list.css('left', -_that.liWidth);
            }
            if(_that.pagination) {
                _paginationChange();
            }
        }) :
        _that.list.animate({top: '+=' + num * _that.liHeight + 'px'}, d.speed, function() {
            _counter -= num;
            if(_counter < 0) {
                _counter = _length - 1;
                _that.list.css('top', -_that.liHeight * _length);
            }
            else if(_counter === _length) {
                _counter = 0;
                _that.list.css('top', -_that.liHeight);
            }
            if(_that.pagination) {
                _paginationChange();
            }
        });
    };

    //执行多页滚动
    var _slideCarousel = function(num) {
        d.dir === 'horizontal' ?
        _that.list.animate({left: '+=' + num * d.perSlideView * _that.liWidth + 'px'}, d.speed, function() {
            _counter -= num;
            if(_that.pagination) {
                _paginationChange();
            }
        }) :
        _that.list.animate({top: '+=' + num * d.perSlideView *_that.liHeight + 'px'}, d.speed, function() {
            _counter -= num;
            if(_that.pagination) {
                _paginationChange();
            }
        }) ;
    };

    //执行全屏滚动
    var _slideFullPage = function(num) {
        d.dir === 'horizontal' ?
        _that.list.animate({left: '+=' + num * _that.liWidth}, d.speed, function() {
                _counter -= num;
            if(_that.pagination) {
                _paginationChange();
            }
        }) :
        _that.list.animate({top: '+=' + num * _that.liHeight}, d.speed, function() {
                _counter -= num;
            if(_that.pagination) {
                _paginationChange();
            }
        })
    }

    //执行渐隐渐显式播放
    var _slideFade = function(num) {
        _li.eq(num).fadeIn(300, function() {
            _counter = num;
            if(_counter === -1) {
                _counter = _length - 1;
            } else if (_counter === _length - 1) {
                _counter = -1;
            }
            if(_that.pagination) {
                _paginationChange();
            }
        }).siblings().fadeOut(300);
    };

    $.fn.onlyClass = function(cls) {
        $(this).addClass(cls).siblings().removeClass(cls);
    };

    _init();
}