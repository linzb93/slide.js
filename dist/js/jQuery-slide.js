function Slide(node, config){
	var defaultPara = {
		mode: 'horizontal',  //滚动方向（水平或竖直）
		speed: 500,  //滚动速度
		perGroup: 1,  //显示数量
		slidePerView: 1,  //每次滚动的数量
		autoPlay: 0,  //自动滚动的时间间隔，大于0时有效
		loop: true,  //是否循环滚动
		pagination: null,  //分页器
		pageClickable: true,  //分页器是否可点击
		fullPage: false,  //是否全屏滚动
		showPageNum: false  //显示分页器数字
	};
	$.extend(defaultPara, config);
	this.block = $(node),
	this.mode = defaultPara.mode,
	this.speed = defaultPara.speed,
	this.perGroup = defaultPara.perGroup,
	this.slidePerView = defaultPara.slidePerView,
	this.autoPlay = defaultPara.autoPlay,
	this.loop = defaultPara.loop,
	this.pagination = $(defaultPara.pagination),
	this.pageClickable = defaultPara.pageClickable,
	this.fullPage = defaultPara.fullPage,
	this.showPageNum = defaultPara.showPageNum;
	//考虑到animate()方法而不得不暴露的变量
	this.list = this.block.find('ul');
	var _li = this.list.find('li');
	this.liWidth = _li.width(),
	this.liHeight = _li.height();
	//与轮播直接相关的内部变量
	var	_length = _li.length,
	_slideLength = Math.ceil((_length - this.perGroup) / this.slidePerView) + 1,
	_timer = null,
	_slideIndex = 0,
	_pageDot = null,
	_canShowPagination = this.pagination && this.perGroup === 1 && this.slidePerView === 1, //是否展示分页器
	_that = this;
	//其他内部变量
	var _body = $("body"),
	_isLowIE = false;

	//初始化
	var _init = function(){
		//初始化轮播样式
		_setStyle();

		//添加分页器
		if(_canShowPagination){
			_createPagination();
		}
		//检测浏览器是否支持transform & transition
		_isLowIE = _browserVersion();
		//自动播放
		if(_that.autoPlay){
			_timer = setInterval(function(){
				_that.slideNext(true);
			}, _that.autoPlay);
		}
		//绑定鼠标滚轮事件
		if(_that.fullPage){
			$(document).on("mousewheel DOMMouseScroll", _bindMouseWheel);
		}
	};

	this.slidePrev = function(){
		clearInterval(_timer);
		if(_slideIndex > 0){
			_slideIndex --;
			_slideAnimation(this.slidePerView);
		}
		else{
			if(this.loop){
				this.slideTo(_slideLength - 1);
			}
		}
	};

	this.slideNext = function(notClear){
		if(!notClear){
			clearInterval(_timer);
		}
		if(_slideIndex < _slideLength - 1){
			_slideIndex ++;
			_slideAnimation(-this.slidePerView);
			if(_slideIndex === _slideLength - 1 && !this.loop){
				clearInterval(_timer);
			}
		}
		else{
			if(this.loop){
				this.slideTo(0, notClear);
			}
		}
	};

	this.slideTo = function(num, notClear){
		if(!notClear){
			clearInterval(_timer);
		}
		var _delta = num - _slideIndex;
		_slideIndex = num;
		_slideAnimation(-_delta * _that.slidePerView);
	}

	//初始化样式
	var _setStyle = function(){
		if (_that.fullPage) {
			_li.width(_body.width());
			_li.height(_body.height());
		}
		if(_that.mode === 'horizontal'){
			if(_that.fullPage){
				_that.liWidth = _li.width();
			}
			else{
				_that.block.width(_that.liWidth * _that.perGroup);
			}
			_that.list.width(_that.liWidth * _length);
			_that.list.addClass('slide-horizontal');
		}
		else if(_that.mode === 'vertical'){
			if(_that.fullPage){
				_that.liHeight = _li.height();
			}
			else{
				_that.block.height(_that.liHeight * _that.perGroup);
			}
			_that.list.height(_that.liHeight * _length);
			_that.list.addClass('slide-vertical');
		}
	};

	//初始化分页
	var _createPagination = function(){
		var pageHtml = '';
		if(_that.showPageNum){
			var j = 0;
			for(var i = 0; i < _length; i ++){
				j = i + 1;
				pageHtml += '<a href="javascript:;">' + j + '</a>';
			}
		}
		else{
			for(var i = 0; i < _length; i ++){
				pageHtml += '<a href="javascript:;"></a>';
			}
		}
		_that.pagination.append(pageHtml);
		_pageDot = _that.pagination.find('a');
		_pageDot.eq(0).addClass('on');
	//绑定分页器事件
	if(_that.pageClickable){
		_pageBind();
	}
}

	//分页器变换
	var _paginationChange = function(){
		_pageDot.eq(_slideIndex)._onlyClass('on');
	}

	//绑定分页器事件
	var _pageBind = function(){
		_pageDot.on('click', function(){
			var dotIndex = $(this).index();
			_that.slideTo(dotIndex);
		});
	}

	//绑定鼠标滚轮事件
	var _bindMouseWheel = function(e){
		e.preventDefault();
		var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		value > 0 ?
		_that.slidePrev() :
		_that.slideNext();
		return false;
	}

	var _browserVersion = function(){
		return document.documentmode < 10 ? true : false;
	}

	//执行滚动
	var _slideAnimation = function(num){
		if(_that.mode === 'horizontal'){
			_that.list.animate({left: '+=' + num * _that.liWidth + 'px'}, _that.speed);
		}
		else if(_that.mode === 'vertical'){
			_that.list.animate({top: '+=' + num * _that.liHeight + 'px'}, _that.speed);
		}

		if(_canShowPagination){
			_paginationChange();
		}
	}

	$.fn._onlyClass = function(obj){
		$(this).addClass(obj).siblings().removeClass(obj);
		return $(this);
	}

	_init();
}