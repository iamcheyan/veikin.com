(function($){
	$.fn.extend({
		"LazyLoad":function(value){
			var $winH = $(window).height(); //获取窗口高度
			var $img = this;
			var $imgH = parseInt($img.height() / 2); //图片到一半的时候显示
			var $srcDef = "";
			$runing(); //页面刚载入时判断要显示的图片
			$(window).scroll(function() {
				$runing(); //滚动刷新
			});

			function $runing() {
				$img.each(function(i) { //遍历img
					var $src = $img.eq(i).attr("img-data"); //获取当前img URL地址
					var $scroTop = $img.eq(i).offset(); //获取图片位置
					if ($scroTop.top + $imgH >= $(window).scrollTop() && $(window).scrollTop() + $winH >= $scroTop.top + $imgH) { //判断窗口至上往下的位置
						if ($img.eq(i).attr("src") == $srcDef) {
							$img.eq(i).hide();
						};
						$img.eq(i).attr("src", function() {
							return $src
						}).fadeIn(300); //元素属性交换
					};;
				})
			};
		}
	});
})(jQuery);

$(function(){
	$(".book img,.member img").LazyLoad();
	$("a.at").click(function(){
		$href = $(this).attr("href");
		$top = $($href).offset().top - 55;
		$("html,body").animate({
			scrollTop: $top
		},1000);
		return false;
	});

	$(".go-top").click(function(){
		$("html,body").animate({
			scrollTop: 0
		},1000);
	});

	$veikinNav = $("header nav");
	$(window).load(function(){
		$t = $veikinNav.offset().top;
	});

	window.onscroll = function(){
		var $s = $(document).scrollTop();
		if ($s > $t){
			$veikinNav.addClass("fixed");
			$(".go-top").show();
		} else {
			$veikinNav.removeClass("fixed");
			$(".go-top").hide();
		};
	};
});
