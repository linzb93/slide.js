(function($){
  $.fn.slide = function(option){
    var d = {
      speed: 300,
      prev: null,
      next: null,
      pagination: null,
      pagPrev: null,
      pagNext: null,
      pagView: 1,
      pagScroll: 1
    };
    var o = $.extend(d, option);
    var speed = o.speed,
    btnPrev = $(o.prev),
    btnNext = $(o.next),
    pagPrev = $(o.pagPrev),
    pagNext = $(o.pagNext);
    var counter = 0,
    $curIndex = 0;
    var list = $(this).find('ul'),
    li = list.find('li'),
    liHeight = li.height() + li.css('margin-top'),
    length = li.length;
    pagScrollCount = (length - pagView) / pagScroll + 1;
    pagCounter = 0;
    btnNext.on('click', function(){
      if(counter < length){
        slideFade(counter + 1);
        counter ++;
      }
    });
    btnPrev.on('click', function(){
      if(counter >= 0){
        slideFade(counter - 1);
        counter --;
      }
    });
    pagination.find('li').on('hover', function(){
      $curIndex = $(this).index();
      slideFade($curIndex);
      counter = $curIndex;
    });
    pagPrev.on('click', function(){
      if(pagCounter >= 0){
        slideAnimation(pagScroll);
        pagCounter --;
      }
    });
    pagNext.on('click', function(){
      if(pagCounter < pagScrollCount){
        slideAnimation(-pagScroll);
        pagCounter ++;
      }
    });
    var slideFade = function(num){
      li.eq(num).fadeIn().siblings().fadeOut();
    }
    var slideAnimation = function(num){
      list.animate({
        top: liHeight * num + 'px'
      }, speed);
    };
  };
})(jQuery)