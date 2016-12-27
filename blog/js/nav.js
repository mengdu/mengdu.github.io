$(function(){
	var nav = $('.navbar-mytheme');
	var clock = null;
	$(window).scroll(function(e){
		if($(window).scrollTop() == 0)
			nav.addClass('is-fixed');	
			
	});
	mousewheel(document.body,function(e){
		//console.log(e.detail,e.direction,e.wheelDelta);
		//console.log((document.body.scrollTop || document.documentElement.scrollTop));
		//console.log(e.scrollTop,document.body.scrollTop);
		if(e.direction == "up"){
			nav.addClass('is-visible');
		}else{
			clock = setTimeout(function(){

				nav.removeClass('is-fixed');
				nav.removeClass('is-visible');
			},300);
			
		}
	});
});