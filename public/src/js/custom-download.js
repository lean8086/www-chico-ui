var cd = {};

cd.menu = $("#versions").accordion().select(1);

cd.map = {},

cd.custom = {

	"select": {

		"tpl": $("<a class=\"all\">toggle select</a>"),

		"action": function (e) {
			var isChecked = $(this).parent().find("input:checked")[0];
			if (isChecked) {
				//custom.action = custom.unCheckIt;
				$(this).parent().find("input").removeAttr("checked");
			} else {
				//custom.action = custom.checkIt;
				$(this).parent().find("input").attr("checked", "checked");
			}

			/*$.each(map, function (i, e) {
				if (e.requires) {
					for(var i=0; i <= e.requires.length; i+=1) {
						custom.action(e.name);
					}
				}
			});*/
		},

		"add": function (w) {
			cd.custom.select.tpl
				.bind("click", cd.custom.select.action)
				.prependTo(this);
		},

		"rem": function () {
			$(this)
				.find(".all")
				.unbind("click", cd.custom.select.action)
				.detach();
		}
	},

	"populate": function () {

		for (var c in cd.map) {

			var value = c.toString(),

				type = (value == "Object") ? "abstract" : cd.map[c].type,

				list = (function () {

					var r;

					switch (type) {
						case "class": 
							r = "#components";
						break;
						case "abstract":
							r = "#abstracts";
						break;
						case "util":
							r = "#utils";
						break;
					}

					return r;

				})(),

				className = type,

			// A disabled field wont be sending any information trough a post request.
				disabled = (type == "abstract!!") ? "disabled=\"disabled\"" : "" ;

			cd.map[c]["dom"] = $("<li class=\"" + className + "\"><label><input id=\"" + c + "\"type=\"checkbox\" value=\"" +value+ "\" name=\"" + type + "\" " + disabled + " checked=\"checked\"> <span>" + c + "</span></label>").appendTo(list);
		}
	},

	"checkIt": function (c) {
		$("input[value=" + c + "]").attr("checked", "checked");
	},

	"unCheckIt": function (c) {
		if (cd.custom.isShared(c) || cd.map[c].standalone) { return;  }
		$("input[value=" + c + "]").removeAttr("checked");
	},

	"isShared": function (c) {

		var r = false;

		$("input:checked").each(function (event) {
			var t = cd.map[this.id];

			if (!t) return;
			if (t.augments && c == t.augments) { r = true; }
			if (t.requires && c == t.requires) { r = true; }
		});

		return r;	
	},

	"checkMap": function (c) {

		if (!c) { return; }

		if (c.requires) {
			$(c.requires).each(function (i, e) {
				cd.custom.action(e);
				setTimeout(function () { cd.custom.checkMap(cd.map[e]); }, 0);
			});
		}

		if (c.augments) {
			cd.custom.action(c.augments);
			setTimeout(function () { cd.custom.checkMap(cd.map[c.augments]); }, 0);
		}
	}
};

$.getJSON("/data/inheritanceMap.js", function (data) {

	cd.map = data;
	cd.custom.populate();

	$(".toggle").hover(cd.custom.select.add, cd.custom.select.rem);

	$("#abstracts input").bind("click change", function (event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$("#components input, #utils input").bind("change", function () {

		var c = cd.map[this.id],

			checked = this.checked;

		if (c.interface && !checked) { return; }

		cd.custom.action = (!checked) ? cd.custom.unCheckIt : cd.custom.checkIt;

		// Check the map
		if (c.requires) {
			$(c.requires).each(function (i, e) {
				cd.custom.action(e);
				cd.custom.checkMap(cd.map[e]);
			});
		}

		$.each(cd.map, function (i, e) {
			if (e == c) { return };

			if (e.requires) {
				for(var i=0; i <= e.requires.length; i+=1) {
					if (e.requires[i] == c.name && $("input[value=" +e.name+ "]").is(":checked")) {
						cd.custom.action(e.name);
						cd.custom.checkMap(e);
					}
				}
			}
		});

		if (c.augments) {
			cd.custom.action(c.augments);
			cd.custom.checkMap(cd.map[c.augments]);
		}
	});
});