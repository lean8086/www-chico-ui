var menu = $('#versions').accordion().select(1),

	map = {},

	custom = {

	select: {

		tpl: $("<a class=\"all\">toggle select</a>"),

		action: function(e) {
			var isChecked = $(this).parent().find("input:checked")[0];
			if (isChecked) {
				$(this).parent().find("input").removeAttr("checked");
			} else {
				$(this).parent().find("input").attr("checked","checked");
			}
		},
		
		add: function(w){
			custom.select.tpl
				.bind("click", custom.select.action)
				.prependTo(this);
		},
		
		rem: function(){
			$(this)
				.find(".all")
				.unbind("click", custom.select.action)
				.detach();
		}
	},
    
    populate: function() {
        
        for (var c in map) {
            
            var value = c.toString();
            var type = (value == "Object") ? "abstract" : map[c].type ;
            var appendTo = (function() {
                
                switch ( type ) {
                    case "class": 
                        return "#components";
                    case "abstract":
                        return "#abstracts";
                    case "util":
                        return "#utils";
                }
                                
            })(); 
                
            var className = type;

            // A disabled field wont be sending any information trough a post request.
            var disabled = (type == "abstract!!") ? "disabled=\"disabled\"" : "" ;
            
            map[c]["dom"] = $("<li class=\""+className+"\"><label><input type=\"checkbox\" value=\""+value+"\" name=\"" + type + "\" "+disabled+" checked=\"checked\"> <span>"+c+"</span></label>")
                .appendTo( appendTo );
        }    
    }
};

$.getJSON("/data/inheritanceMap.js", function(data){

    map = data;
    custom.populate();

    $(".toggle").hover(custom.select.add, custom.select.rem);
    
});