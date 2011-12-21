$(function () {
	// Twitter
	$.getScript("http://platform.twitter.com/widgets.js");
	
	// +1
	$.getScript("https://apis.google.com/js/plusone.js");
	
    // Facebook
    $("<iframe class=\"fb-frame\" src=\"http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.chico-ui.com.ar&amp;layout=button_count&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=21\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:21px;\" allowTransparency=\"true\"></iframe>").appendTo("footer aside");
    
	// Google Analytics
	var _gaq = _gaq || [];
	_gaq.push(["_setAccount", "UA-22230214-1"]);
	_gaq.push(["_setDomainName", ".chico-ui.com.ar"]);
	_gaq.push(["_trackPageview"]);

	(function () {
		var ga = document.createElement("script");
		ga.type = "text/javascript";
		ga.async = true;
		ga.src = "http://www.google-analytics.com/ga.js";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(ga, s);
	}());

});