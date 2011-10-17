var menu = $('#versions').accordion().select(1),

	map = {},

	custom = {

		select: {
	
			tpl: $("<a class=\"all\">toggle select</a>"),
	
			action: function(e) {
				var isChecked = $(this).parent().find("input:checked")[0];
				if (isChecked) {
					//custom.action = custom.unCheckIt;
					$(this).parent().find("input").removeAttr("checked");
				} else {
					//custom.action = custom.checkIt;
					$(this).parent().find("input").attr("checked","checked");
				}
				
				/*$.each(map, function(i,e){
					if (e.requires) {
						for(var i=0; i <= e.requires.length; i+=1) {
							custom.action(e.name);
						}
					}
				});*/
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
	            
            map[c]["dom"] = $("<li class=\"" + className + "\"><label><input id=\"" + c + "\"type=\"checkbox\" value=\""+value+"\" name=\"" + type + "\" " + disabled + " checked=\"checked\"> <span>" + c + "</span></label>")
                .appendTo( appendTo );
	        }
	    },

		checkIt: function(c) {
	        $("input[value="+c+"]").attr("checked","checked");
	    },
	    
	    unCheckIt: function(c) {

	        if (custom.isShared(c) || map[c].standalone) {
	            return; 
	        }

	        $("input[value="+c+"]").removeAttr("checked");
	    },
	    
	    isShared: function(c) {
	        
	        var r = false;
	        
	        $("input:checked").each(function(event){

	            var t = map[this.id];
	            
	            if (!t) return;

	            if (t.augments && c == t.augments) {

	                r = true;
	            }
	            
	            if (t.requires && c == t.requires) {

	                r = true;
	            }
	    
	        });
	        
	        return r;    
	    },

	    checkMap: function(c) {

	        if (!c) { return; }

			if (c.requires) {
				$(c.requires).each(function(i,e) {
					custom.action(e);
					setTimeout(function(){
						custom.checkMap(map[e]);
					}, 0);
				});
			}

			if (c.augments) {
				custom.action(c.augments);
				setTimeout(function(){
					custom.checkMap(map[c.augments]);
				}, 0);
			}
			
	    }

	};

$.getJSON("/data/inheritanceMap.js", function (data) {

    map = data;
    custom.populate();

	$(".toggle").hover(custom.select.add, custom.select.rem);

	$("#abstracts input").bind("click change", function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

    $("#components input, #utils input").bind("change", function () {
		
		var c = map[this.id],
			checked = this.checked;
		
		if (c.interface && !checked) { return; }

		custom.action = (!checked) ? custom.unCheckIt : custom.checkIt;
		
		// Check the map

		if (c.requires) {
			$(c.requires).each(function(i,e) {
				custom.action(e);
				custom.checkMap(map[e]);
			});
		}

        $.each(map, function(i,e){
			if (e == c){ return };

			if (e.requires) {
				for(var i=0; i <= e.requires.length; i+=1) {
					if (e.requires[i] == c.name && $("input[value="+e.name+"]").is(":checked")) {
						custom.action(e.name);
						custom.checkMap(e);
					}
				}
			}

		});

		if (c.augments) {
			custom.action(c.augments);
			custom.checkMap(map[c.augments]);
		}

    });
});