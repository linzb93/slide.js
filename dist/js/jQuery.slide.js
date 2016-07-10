function Slide(node, config){
	if (typeof $ === 'undefined') {
		throw new Error('需要引入jQuery文件');
	}
	var defaultPara = {
		dir: 'horizontal',  //滚动方向（水平或竖直）
		speed: 500,  //滚动速度
		perGroup: 1,  //显示数量
		perSlideView: 1,  //每次滚动的数量
		autoPlay: 0,  //自动滚动的时间间隔，大于0时有效
		pagination: null,  //分页器
		outerPagination: false,  //是否是外部的分页器
		pageClickable: true,  //分页器是否可点击
		fullPage: false,  //是否全屏滚动
		showPageNum: false,  //是否显示分页器数字
		fadeInAndOut: false  //是否渐显与渐隐轮播
	};
	$.extend(defaultPara, config);
	this.block = $(node),
	this.dir = defaultPara.dir,
	this.speed = defaultPara.speed,
	this.perGroup = defaultPara.perGroup,
	this.perSlideView = defaultPara.perSlideView,
	this.autoPlay = defaultPara.autoPlay,
	this.pagination = $(defaultPara.pagination),
	this.outerPagination = defaultPara.outerPagination,
	this.pageClickable = defaultPara.pageClickable,
	this.fullPage = defaultPara.fullPage,
	this.showPageNum = defaultPara.showPageNum,
	this.fadeInAndOut = defaultPara.fadeInAndOut;
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
  _pageDot = null,
	_isSinglePage = this.perGroup === 1 && this.perSlideView === 1,  //是否是单页滚动
	_canShowPagination = this.pagination && _isSinglePage,  //是否展示分页器
  _canFade = this.fadeInAndOut && _isSinglePage,  //是否允许渐隐渐显式轮播
  _that = this;
	//其他内部变量
	var _body = $("body");

	//初始化
	var _init = function(){
		//初始化轮播样式
		_setStyle();
		//添加分页器
		if(_canShowPagination){
			_createPagination();
		}
    //单页状态下复制list头尾两个li元素
    if(_isSinglePage  && !_that.fadeInAndOut && !_that.fullPage){
    	_duplicateList();
    }
		//默认自动播放
		_setAutoPlay();
		//全屏模式下绑定鼠标滚轮事件
		if(_that.fullPage){
			$(document).on("mousewheel DOMMouseScroll", _bindMouseWheel);
		}
	};

	this.slidePrev = function(){
		clearInterval(_timer);
    if(!_isSinglePage){
     _carouselHandler('prev');
    }
    else if(_canFade){
      _fadeHandler('prev');
    }
    else{
      if(_that.fullPage && _counter === -1){
        return;
      }
      _singlePageHandler('prev');
    }
  };

  this.slideNext = function(notClear){
    if(!notClear){
      clearInterval(_timer);
    }
    if(!_isSinglePage){
      _carouselHandler('next');
    }
    else if(_canFade){
      _fadeHandler('next');
    }
    else{
      if(_that.fullPage && _counter === _length - 2){
        return;
      }
      _singlePageHandler('next');
    }
  };

  var _slideTo = function(num, notClear){
    if(!notClear){
      clearInterval(_timer);
    }
    if(_canFade){
      _counter = num;
      _slideFade(_counter + 1);
    }
    else{
      var _nextPos = -(num + 2) * (_that.dir === 'horizontal' ? _that.liWidth : _that.liHeight);
      _slideAnimation(_nextPos);
    }
  };

  //处理单页滚动
  var _singlePageHandler = function(btnDir){
    if(btnDir === 'prev'){
      if(_curPos){
        var _nextPos = _curPos + _that.liSize;
        _slideAnimation(_nextPos);
      }
      else{
        _slideAnimation(0);
        _pageDot.eq(-1).onlyClass('on');
      }
    }
    else if(btnDir === 'next'){
      if(_curPos < (_length - 1) * _that.liWidth){
        var _nextPos = _curPos - _that.liSize;
        _slideAnimation(_nextPos);
      }
      else{
        _slideAnimation(_that.liSize * _length);
      }
    }
  }

  //处理多页滚动
  var _carouselHandler = function(btnDir){
    if(btnDir === 'prev'){
      if(_curPos === 0){
        _curPos = -(_slideLength - 1) * _that.perGroup * _that.liSize;
        _slideCarousel(_curPos);
      }
      else{
        var _nextPos = _curPos + _that.liSize * _that.perSlideView;
        _curPos = _nextPos;
        _slideCarousel(_nextPos);
      }
    }
    else if(btnDir === 'next'){
      if(_curPos === -(_slideLength - 1) * _that.perGroup * _that.liSize){
        _curPos = 0;
        _slideCarousel(0);
      }
      else{
        var _nextPos = _curPos - _that.liSize * _that.perSlideView;
        _curPos = _nextPos;
        _slideCarousel(_nextPos);
      }
    }
  }

  //处理渐隐渐显式轮播
  var _fadeHandler = function(btnDir){
    if(btnDir === 'prev'){
      if(_counter >= 0){
        _slideFade(_counter - 1);
      }
      else{
        _counter = _slideLength - 1;
        _pageDot.eq(-1).onlyClass('on');
      }
    }
    else if(btnDir === 'next'){
      _counter <= _slideLength - 1 ?
      _slideFade(_counter + 1):
      _counter = 0;
    }
  }

	//初始化样式
	var _setStyle = function(){
		if(_canFade){
			_that.block.width(_that.liWidth).height(_that.liHeight);
			_that.list.addClass('slide-fade');
			_li.eq(0).addClass('on');
			return;
		}
		if (_that.fullPage) {
			_li.width(_body.width());
			_li.height(_body.height());
      _that.liWidth = _li.width();
      _that.liHeight = _li.height();
      _that.liSize = _that.dir === 'horizontal' ? _that.liWidth : _that.liHeight;
		}
		if(_that.dir === 'horizontal'){
			_that.fullPage ?
			_that.liWidth = _li.width() :
			_that.block.width(_that.liWidth * _that.perGroup);
			_that.list.width(_that.liWidth * _length);
		}
		else{
			_that.fullPage ?
			_that.liHeight = _li.height() :
			_that.block.height(_that.liHeight * _that.perGroup);
			_that.list.height(_that.liHeight * _length);
		}
		_that.list.addClass('slide-' + _that.dir);
	};

	//初始化分页
	var _createPagination = function(){
		if(_that.outerPagination){
			_that.pagination.children().length === _length ?
			_pageDot = _that.pagination.children() :
			_pageDot = null;
		}
		else{
			var pageHtml = '';
			for(var i = 0; i < _length; i ++){
				j = _that.showPageNum ? i + 1 : '';
				pageHtml += '<a href="javascript:;">' + j + '</a>';
			}
			_that.pagination.append(pageHtml);
			_pageDot = _that.pagination.children();
		}
		_pageDot.eq(0).addClass('on');
		//绑定分页器事件
		if(_that.pageClickable){
			_pageBind();
		}
	};

	//单页状态下复制list头尾两个li元素
	var _duplicateList = function(){
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
    }
    else{
      _that.list.css({
        'top': -_that.liHeight + 'px',
        'height': _that.liHeight * (_length + 2)
      });
      _curPos = -_that.liHeight;
    }
    _that.list.find('li').eq(0).addClass('slide-duplicate').end()
    .eq(-1).addClass('slide-duplicate');
  };

  var _setAutoPlay =function(){
    if(_that.autoPlay){
      _timer = setInterval(function(){
        _that.slideNext(true);
      }, _that.autoPlay);
    }
  };

	//分页器变换
	var _paginationChange = function(){
		_pageDot.eq(_counter).onlyClass('on');
	};

	//绑定分页器事件
	var _pageBind = function(){
		_pageDot.on('click', function(){
			_slideTo($(this).index() - 1);
		});
	};

	//绑定鼠标滚轮事件
	var _bindMouseWheel = function(e){
		e.preventDefault();
		var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		value > 0 ?
		_that.slidePrev() :
		_that.slideNext();
	};

	//执行滚动
	var _slideAnimation = function(nextPos){
    if(_that.dir === 'horizontal'){
      _that.list.animate({left: nextPos + 'px'}, _that.speed, function(){
        _counter = -nextPos / _that.liWidth - 1;
        _curPos = nextPos;
        if(_canShowPagination){
          _paginationChange();
        }
        if(_that.fullPage && (_counter === -1 || _counter === _length)){
          return;
        }
        if(_counter === -1){
          _that.list.css('left', -_that.liWidth * _length + 'px');
          _curPos = -_that.liWidth * _length;
        }
        else if(_counter === _length){
          _counter = 0;
          _that.list.css('left', -_that.liWidth);
          _curPos = -_that.liWidth;
          if(_canShowPagination){
          _paginationChange();
        }
        };
      });
    }
    else{
      _that.list.animate({top: nextPos + 'px'}, _that.speed, function(){
        _counter = -nextPos / _that.liHeight - 1;
        _curPos = nextPos;
        if(_that.fullPage){
          if(_canShowPagination){
            _paginationChange();
          }
          if(_counter === -1 || _counter === _length){
            return;
          }
        }
        if(_counter === -1){
          _that.list.css('top', -_that.liHeight * _length + 'px');
          _curPos = -_that.liHeight * _length;
        }
        else if(_counter === _length){
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
  var _slideFade = function(num){
    _li.eq(num).fadeIn(300, function(){
      _counter = num;
      if(_counter === -1){
        _counter = _length - 1;
      }
      else if(_counter === _length - 1){
        _counter = -1;
      }
      if(_canShowPagination){
        _paginationChange();
      }
    }).siblings().fadeOut(300);
  };

  //执行多页滚动
  var _slideCarousel = function(nextPos){
    _that.dir === 'horizontal' ?
    _that.list.animate({left: nextPos + 'px'}, _that.speed) :
    _that.list.animate({top: nextPos + 'px'}, _that.speed) ;
  };

  $.fn.onlyClass = function(cls){
    return $(this).addClass(cls).siblings().removeClass(cls);
  }

  _init();
}