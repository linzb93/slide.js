function Slider(d,c){var k={mode:"horizontal",speed:500,perGroup:1,slidePerView:1,autoPlay:0,loop:true,pagination:null,pageClickable:true};$.extend(k,c);this.block=$(d),this.mode=k.mode,this.speed=k.speed,this.perGroup=k.perGroup,this.slidePerView=k.slidePerView,this.autoPlay=k.autoPlay,this.loop=k.loop,this.pagination=$(k.pagination),this.pageClickable=k.pageClickable;this.list=this.block.find("ul"),this.li=this.list.find("li"),this.liWidth=this.li.width(),this.liHeight=this.li.height();var i=this.li.length,a=Math.ceil((i-this.perGroup)/this.slidePerView)+1,f=null,m=0,l=this.pagination&&this.perGroup===1&&this.slidePerView===1,e=this;var j=function(){if(e.mode==="horizontal"){e.block.width(e.liWidth*e.perGroup);e.list.width(e.liWidth*i);e.list.addClass("slide-horizontal")}else{if(e.mode==="vertical"){e.block.height(e.liHeight*e.perGroup);e.list.height(e.liHeight*i);e.list.addClass("slide-vertical")}}if(l){for(var n=0;n<i;n++){e.pagination.append('<a href="javascript:;"></a>')}e.pagination.find("a").eq(0).addClass("on")}if(e.autoPlay){f=setInterval(function(){e.slideNext(true)},e.autoPlay)}if(e.pageClickable){h()}};this.slidePrev=function(){clearInterval(f);if(m>0){m--;g(this.slidePerView)}else{if(this.loop){this.slideTo(a-1)}}};this.slideNext=function(n){if(!n){clearInterval(f)}if(m<a-1){m++;g(-this.slidePerView);if(m===a-1&&!this.loop){clearInterval(f)}}else{if(this.loop){this.slideTo(0,n)}}};this.slideTo=function(n,p){if(!p){clearInterval(f)}var o=n-m;m=n;g(-o*e.slidePerView)};var g=function(n){if(e.mode==="horizontal"){e.list.animate({left:"+="+n*e.liWidth+"px"},e.speed)}else{if(e.mode==="vertical"){e.list.animate({top:"+="+n*e.liHeight+"px"},e.speed)}}if(l){b()}};var b=function(){e.pagination.find("a").eq(m).addClass("on").siblings().removeClass("on")};var h=function(){e.pagination.find("a").on("click",function(){var n=$(this).index();e.slideTo(n)})};j()};