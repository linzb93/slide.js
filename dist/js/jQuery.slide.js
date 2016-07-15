function Slide(node, config){
	if (typeof $ === 'undefined') {
		throw new Error('需要引入jQuery文件');
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
  this.dir = d.dir,
  this.speed = d.speed,
  this.effect = d.effect,
  this.perGroup = d.perGroup,
  this.perSlideView = d.perSlideView,
  this.autoPlay = d.autoPlay,
  this.pagination = $(d.pagination),
  this.paginationType = d.paginationType;
	//考虑到animate()方法而暴露的变量
	this.list = this.block.find('ul');
	var _li = this.list.find('li');
	this.liWidth = _li.width(),
	this.liHeight = _li.height();
  this.liSize = this.dir === 'horizontal' ? this.liWidth : this.liHeight;
	//与轮播直接相关的内部变量
	var	_length = _li.length,
	_slideLength = Math.ceil((_length - this.perGroup) / this.perSlideView) + 1,
	_timer = null,
	_counter = 0,
  _curPos = 0, //滑动播放时当前位置
  _pageChild = null,
  _that = this;
	//其他内部变量
	var _body = $("body");

	//初始化
	var _init = function() {
		//初始化轮播样式
		_setStyle();
		//添加分页器
		if(_that.pagination) {
			_createPagination();
		}
    //单页状态下复制list头尾两个li元素
    if(_that.effect === 'slide') {
    	_duplicateList();
    }
		//默认自动播放
		_setAutoPlay();
		//全屏模式下绑定鼠标滚轮事件
		if(_that.effect === 'fullPage' && _that.dir === 'vertical') {
			$(document).on("mousewheel DOMMouseScroll", _bindMouseWheel);
		}
	};

	this.slidePrev = function() {
		clearInterval(_timer);
    switch(effect) {
      case 'slide': {
       _singlePageHandler('prev');
       break;
     }
     case 'carousel': {
      _carouselHandler('prev');
    }
    case 'fade': {
      _fadeHandler('prev');
      break;
    }
    case 'fullPage': {
      _singlePageHandler('prev');
    }
    default: {
      return;
    }
  }
};

this.slideNext = function(notClear) {
  if(!notClear) {
    clearInterval(_timer);
  }
  switch(effect) {
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
  }
  case 'fullPage': {
    _singlePageHandler('next');
  }
  default: {
    return;
  }
}
};

var _slideTo = function(num, notClear) {
  if(!notClear) {
    clearInterval(_timer);
  }
  if(_that.effect === 'fade'){
    _counter = num;
    _slideFade(_counter + 1);
  } else {
    var _nextPos = -(num + 2) * _that.liSize;
    _slideAnimation(_nextPos);
    _nextPos = null;
  }
};

  //处理单页滚动
  var _singlePageHandler = function(btnDir) {
    if(btnDir === 'prev') {
      if(_curPos) {
        var _nextPos = _curPos + _that.liSize;
        _slideAnimation(_nextPos);
      } else {
        _slideAnimation(0);
        _pageChild.eq(-1).onlyClass('on');
      }
    } else if(btnDir === 'next') {
      if(_curPos < (_length - 1) * _that.liWidth) {
        var _nextPos = _curPos - _that.liSize;
        _slideAnimation(_nextPos);
      } else {
        _slideAnimation(_that.liSize * _length);
      }
    }
    _nextPos = null;
  };

  //处理多页滚动
  var _carouselHandler = function(btnDir) {
    if(btnDir === 'prev') {
      if(_curPos === 0) {
        _curPos = -(_slideLength - 1) * _that.perGroup * _that.liSize;
        _slideCarousel(_curPos);
      } else {
        var _nextPos = _curPos + _that.liSize * _that.perSlideView;
        _curPos = _nextPos;
        _slideCarousel(_nextPos);
      }
    } else if(btnDir === 'next') {
      if(_curPos === -(_slideLength - 1) * _that.perGroup * _that.liSize) {
        _curPos = 0;
        _slideCarousel(0);
      } else {
        var _nextPos = _curPos - _that.liSize * _that.perSlideView;
        _curPos = _nextPos;
        _slideCarousel(_nextPos);
      }
    }
    _nextPos = null;
  };

  //处理渐隐渐显式轮播
  var _fadeHandler = function(btnDir) {
    if(btnDir === 'prev') {
      if(_counter >= 0) {
        _slideFade(_counter - 1);
      } else {
        _counter = _slideLength - 1;
        _pageChild.eq(-1).onlyClass('on');
      }
    } else if(btnDir === 'next') {
      _counter <= _slideLength - 1 ?
      _slideFade(_counter + 1):
      _counter = 0;
    }
  };

	//初始化样式
	var _setStyle = function() {
		if(_that.effect === 'fade') {
			_that.block.width(_that.liWidth).height(_that.liHeight);
			_that.list.addClass('slide-fade');
			_li.eq(0).addClass('on');
			return;
		}
		if (_that.effect === 'fullPage') {
			_li.width(_body.width());
			_li.height(_body.height());
      _that.liWidth = _li.width();
      _that.liHeight = _li.height();
      _that.liSize = _that.dir === 'horizontal' ? _that.liWidth : _that.liHeight;
    }
    if(_that.dir === 'horizontal') {
     _that.fullPage ?
     _that.liWidth = _li.width() :
     _that.block.width(_that.liWidth * _that.perGroup);
     _that.list.width(_that.liWidth * _length);
   } else {
    _that.fullPage ?
    _that.liHeight = _li.height() :
    _that.block.height(_that.liHeight * _that.perGroup);
    _that.list.height(_that.liHeight * _length);
  }
  _that.list.addClass('slide-' + _that.dir);
};

	//初始化分页
	var _createPagination = function() {
		if(_that.paginationType === 'outer') {
			_that.pagination.children().length === _length ?
			_pageChild = _that.pagination.children() :
			_pageChild = null;
		} else {
      var pageHtml = '';
      for(var i = 0, j; i < _length; i ++) {
        j = _that.paginationType === 'num' ? i + 1 : '';
        pageHtml += '<a href="javascript:;">' + j + '</a>';
      }
      _that.pagination.append(pageHtml);
      _pageChild = _that.pagination.children();
    }
    _pageChild.eq(0).addClass('on');
		//绑定分页器事件
    _pageBind();
 };

	//单页状态下复制list头尾两个li元素
	var _duplicateList = function() {
		var firstList = _li.eq(0),
		lastList = _li.eq(-1);
		lastList.clone().prependTo(_that.list);
		firstList.clone().appendTo(_that.list);
		if(_that.dir === 'horizontal'){
			_that.list.css({
				'left': -_that.liWidth + 'px',
				'width': _that.liWidth * (_length + 2)
			});
      _curPos = -_that.liWidth;
    } else {
      _that.list.css({
        'top': -_that.liHeight + 'px',
        'height': _that.liHeight * (_length + 2)
      });
      _curPos = -_that.liHeight;
    }
    _that.list.find('li').eq(0).addClass('slide-duplicate').end()
    .eq(-1).addClass('slide-duplicate');
  };

  var _setAutoPlay = function() {
    if(_that.autoPlay) {
      _timer = setInterval(function() {
        _that.slideNext(true);
      }, _that.autoPlay);
    }
  };

	//分页器变换
	var _paginationChange = function() {
		_pageChild.eq(_counter).onlyClass('on');
	};

	//绑定分页器事件
	var _pageBind = function() {
		_pageChild.on('click', function() {
			_slideTo($(this).index() - 1);
		});
	};

	//绑定鼠标滚轮事件
	var _bindMouseWheel = function(e) {
		e.preventDefault();
		var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		value > 0 ?
		_that.slidePrev() :
		_that.slideNext();
	};

	//执行滚动
	var _slideAnimation = function(nextPos) {
    if(_that.dir === 'horizontal') {
      _that.list.animate({left: nextPos + 'px'}, _that.speed, function() {
        _counter = -nextPos / _that.liWidth - 1;
        _curPos = nextPos;
        if(_canShowPagination) {
          _paginationChange();
        }
        if(_that.fullPage && (_counter === -1 || _counter === _length)) {
          return;
        }
        if(_counter === -1) {
          _that.list.css('left', -_that.liWidth * _length + 'px');
          _curPos = -_that.liWidth * _length;
        } else if(_counter === _length) {
          _counter = 0;
          _that.list.css('left', -_that.liWidth);
          _curPos = -_that.liWidth;
          if(_canShowPagination) {
            _paginationChange();
          }
        };
      });
    } else {
      _that.list.animate({top: nextPos + 'px'}, _that.speed, function() {
        _counter = -nextPos / _that.liHeight - 1;
        _curPos = nextPos;
        if(_that.fullPage) {
          if(_canShowPagination) {
            _paginationChange();
          }
          if(_counter === -1 || _counter === _length) {
            return;
          }
        }
        if(_counter === -1) {
          _that.list.css('top', -_that.liHeight * _length + 'px');
          _curPos = -_that.liHeight * _length;
        } else if(_counter === _length) {
        	_counter = 0;
          _that.list.css('top', -_that.liHeight);
          _curPos = -_that.liHeight;
          if(_canShowPagination){
            _paginationChange();
          }
        };
      });
    }
  };

  //执行渐隐渐显式播放
  var _slideFade = function(num) {
    _li.eq(num).fadeIn(300, function() {
      _counter = num;
      if(_counter === -1) {
        _counter = _length - 1;
      } else if (_counter === _length - 1) {
        _counter = -1;
      }
      if(_canShowPagination) {
        _paginationChange();
      }
    }).siblings().fadeOut(300);
  };

  //执行多页滚动
  var _slideCarousel = function(nextPos) {
    _that.dir === 'horizontal' ?
    _that.list.animate({left: nextPos + 'px'}, _that.speed) :
    _that.list.animate({top: nextPos + 'px'}, _that.speed) ;
  };

  $.fn.onlyClass = function(cls) {
    return $(this).addClass(cls).siblings().removeClass(cls);
  }

  _init();
}