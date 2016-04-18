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
		fullPage: false  //是否全屏滚动
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
	this.fullPage = defaultPara.fullPage;

	this.list = this.block.find('ul');
	var _li = this.list.find('li');
	this.liWidth = _li.width(),
	this.liHeight = _li.height();

	var	_length = _li.length,
	_slideLength = Math.ceil((_length - this.perGroup) / this.slidePerView) + 1,
	_timer = null,
	_slideIndex = 0,
	_canShowPagination = this.pagination && this.perGroup === 1 && this.slidePerView === 1, //是否展示分页器
	_that = this;

//初始化
var _init = function(){
		//设定轮播样式
		if(_that.mode === 'horizontal'){
			_that.block.width(_that.liWidth * _that.perGroup);
			_that.list.width(_that.liWidth * _length);
			_that.list.addClass('slide-horizontal');
		}
		else if(_that.mode === 'vertical'){
			_that.block.height(_that.liHeight * _that.perGroup);
			_that.list.height(_that.liHeight * _length);
			_that.list.addClass('slide-vertical');
		}
		//添加分页器
		if(_canShowPagination){
			for(var i = 0; i< _length; i++){
				_that.pagination.append('<a href="javascript:;"></a>');
			}
			_that.pagination.find('a').eq(0).addClass('on');
		}
		//自动播放
		if(_that.autoPlay){
			_timer = setInterval(function(){
				_that.slideNext(true);
			}, _that.autoPlay);
		}
		//绑定分页器事件
		if(_that.pageClickable){
			_pageBind();
		}
		//绑定鼠标滚轮事件
		if(_that.fullPage){
			_bindMouseWheel();
		}
	}

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

//分页器变换
var _paginationChange = function(){
	_that.pagination.find('a').eq(_slideIndex)._onlyClass('on');
}

//绑定分页器事件
var _pageBind = function(){
	_that.pagination.find('a').on('click', function(){
		var dotIndex = $(this).index();
		_that.slideTo(dotIndex);
	});
}

//绑定鼠标滚轮事件
var _bindMouseWheel = function(){
	$(document).on({
		'mousewheel': function(e){
			e.originalEvent.wheelDelta > 0 ?
			_that.slidePrev():
			_that.slideNext();
			return false;
		},
		'DOMMouseScroll': function(e){
			e.originalEvent.detail < 0 ?
			_that.slidePrev():
			_that.slideNext();
			return false;
		}
	});
}

$.fn._onlyClass = function(obj){
	$(this).addClass(obj).siblings().removeClass(obj);
	return $(this);
}

_init();
}