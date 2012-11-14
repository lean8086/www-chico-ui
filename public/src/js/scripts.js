$(window).on("load", function () {
	// +1
	$.getScript("https://apis.google.com/js/plusone.js");

	// Twitter
	$.getScript("http://platform.twitter.com/widgets.js");

	$.getScript("https://assets.pinterest.com/js/pinit.js");

    // Facebook
    $("<iframe class=\"fb-frame\" src=\"http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.chico-ui.com.ar&amp;layout=button_count&amp;show_faces=false&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=21\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:21px;\" allowTransparency=\"true\"></iframe>").appendTo("footer aside");
});