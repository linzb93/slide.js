var Slider = {
	block: null,
	prev: null,
	next: null,
	page: null,
	autoplay: false,
	autoplayTime: 2000,
	speed: 500,
	mode: 'horizontal',
	perGroup: 1,
	perSlideView: 1,

	init: function(node, config){
		this.block = $(node),
		this.list = this.block.find('ul'),
		this.prev = $(config.prev),
		this.next = $(config.next),
		this.page = $(config.page),
		this.autoplay = config.autoplay || this.autoplay,
		this.autoplayTime = config.autoplayTime || this.autoplayTime,
		this.speed = config.speed || this.speed,
		this.mode = config.mode || this.mode,
		this.perGroup = config.perGroup || this.perGroup,
		this.perSlideView = config.perSlideView || this.perSlideView,
		this.li = this.list.find('li'),
		this.length = this.li.length,
		this.slideLength = Math.ceil(this.li.length / this.perSlideView);
		this.liWidth = this.li.width(),
		this.liHeight = this.li.height(),
		this.index = 0,
		this.timer = null,
		that = this;
		if(this.mode === 'horizontal'){
			that.block.width(that.liWidth * that.perGroup);
			that.list.width(that.liWidth * that.length);
		}
		else if(this.mode === 'vertical'){
			that.block.height(that.liHeight * that.perGroup);
			that.list.height(that.liHeight * that.length);
		}
		this.bind();
		this.slide();
		return this;
	},
	bind: function(){
		this.prev.on('click', function(){
			if(that.index > 0){
				that.index --;
				that.slide(that.perSlideView);
			}
		});
		this.next.on('click', function(){
			if(that.index < that.slideLength - 1){
				that.index ++;
				that.slide(-that.perSlideView);
			}
		});
	},
	slide: function(num){
		this.mode === 'horizontal'?
		that.list.addClass('slide-horizontal'):
		that.list.addClass('slide-vertical');

		if(num){
			clearInterval(that.timer);
			if(this.mode === 'horizontal'){
				that.list.animate({left: '+=' + num * that.liWidth + 'px'}, that.speed);
			}
			else if(this.mode === 'vertical'){
				that.list.animate({top: '+=' + num * that.liHeight + 'px'}, that.speed);
			}
		}
		else{
			this.timer = setInterval(function(){
				if(that.mode === 'horizontal'){
					that.list.animate({left: '-=' + that.perSlideView * that.liWidth + 'px'}, that.speed);
				}
				else if(that.mode === 'vertical'){
					that.list.animate({top: '-=' + that.perSlideView * that.liHeight + 'px'}, that.speed);
				}
				that.pageAnimation();
			}, that.autoplayTime);
		}
		if(!dotLength && this.perGroup === 1){
			for(var i = 0; i< this.length; i++){
				this.page.append('<span></span');
				this.page.find('span').eq(0).addClass('on');
			}
		}
		else{
			this.page.find('span').eq(that.index).addClass('on').siblings().removeClass('on');
		}
	}
	pageAnimation: function(){
		if(this.page !== null){
			var dotLength = dotLength || this.page.find('span').length / this.perGroup;
		}
	}
}