var menu = $('#versions').accordion().select(1);



var map = {}

$.getJSON("/data/inheritanceMap.js", function(data){

    map = data;
    custom.populate();

    $("#components").each(function(i,e){
    	$(e).parent()
	    	.hover(custom.select.add, custom.select.rem);
    });
    
});

var custom = {

	select: {

		tpl: $("<a class=\"all\">toggle select</a>"),

		action: function(e) {
			var isChecked = $(this).parent().find("input:checked")[0];
			if (isChecked) {
				$(this).parent().find("input").removeAttr("checked");
			} else {
				$(this).parent().find("input").attr("checked","checked");
			}
			console.log(isChecked);
		},
		
		add: function(w){
			custom.select.tpl
				.bind("click", custom.select.action)
				.prependTo(this);
		},
		
		rem: function(){
			console.log(cutom.select.tpl)
			custom.select.tpl
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
        