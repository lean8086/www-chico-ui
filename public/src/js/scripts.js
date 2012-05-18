$(ch.utils.window).on("load", function () {
	// +1
	$.getScript("https://apis.google.com/js/plusone.js");
	
	// Twitter
	$.getScript("http://platform.twitter.com/widgets.js");
	
    // Facebook
    $("<iframe class=\"fb-frame\" src=\"http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.chico-ui.com.ar&amp;layout=button_count&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=21\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:21px;\" allowTransparency=\"true\"></iframe>").appendTo("footer aside");
});

$(function(){
	// Pinterest, must be on the onready because the image doesn't load 
	(function(){function a(){var a=document.createElement("script");a.type="text/javascript";a.async=true;if(window.location.protocol=="https:")a.src="https://assets.pinterest.com/js/pinit.js";else a.src="http://assets.pinterest.com/js/pinit.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}window.PinIt=window.PinIt||{loaded:false};if(window.PinIt.loaded)return;window.PinIt.loaded=true;if(window.attachEvent)window.attachEvent("onload",a);else window.addEventListener("load",a,false)})()
});