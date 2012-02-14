/*
* Chico UI 0.10.2 MIT Licence
* @autor <chico@mercadolibre.com>
* @link http://www.chico-ui.com.ar
* @team Hernan Mammana, Leandro Linares, Guillermo Paz, Natalia Devalle
*/
;(function($){/**
* Chico-UI namespace
* @namespace ch
* @name ch
*/

var ch = window.ch = {

	/**
	* Current version
	* @name version
	* @type number
	* @memberOf ch
	*/
	version: "0.10.2",
	/**
	* Here you will find a map of all component's instances created by Chico-UI.
	* @name instances
	* @type object
	* @memberOf ch
	*/
	instances: {},
	/**
	* Available device's features.
	* @name features
	* @type object
	* @see ch.Support
	* @memberOf ch
	*/
	features: {},
	/**
	* Core constructor function.
	* @name init
	* @function
	* @memberOf ch
	*/
	init: function() { 
		// unmark the no-js flag on html tag
		$("html").removeClass("no-js");
		// check for browser support
		ch.features = ch.support();
		// TODO: This should be on keyboard controller.
		ch.utils.document.bind("keydown", function(event){ ch.keyboard(event); });
	},
	/**
	* References and commons functions.
	* @name utils
	* @type object
	* @memberOf ch
	*/
	utils: {
		body: $("body"),
		html: $("html"),
		window: $(window),
		document: $(document),
		zIndex: 1000,
		index: 0, // global instantiation index
		isTag: function(string){
			return (/<([\w:]+)/).test(string);
		},
		isSelector: function (selector) {
			if (typeof selector !== "string") return false;
			for (var regex in $.expr.match){
				if ($.expr.match[ regex ].test(selector) && !ch.utils.isTag(selector)) {
					return true;
				};
			};
			return false;
		},
		inDom: function (selector, context) {
			if (typeof selector !== "string") return false;
			// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
			var selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
				return "\\\\" + $1;
			});
			return $(selector, context).length > 0;
		},
		isArray: function (o) {
			return Object.prototype.toString.apply(o) === "[object Array]";
		},
		isUrl: function (url) {
			return ((/^((http(s)?|ftp|file):\/{2}(www)?|www.|((\/|\.{1,2})([\w]|\.{1,2})*\/)+|(\.\/|\/|\:\d))([\w\-]*)?(((\.|\/)[\w\-]+)+)?([\/?]\S*)?/).test(url));
		},
		avoidTextSelection: function () {
			$.each(arguments, function(i, e){
				if ( $.browser.msie ) {
					$(e).attr('unselectable', 'on');
				} else if ($.browser.opera) {
					$(e).bind("mousedown", function(){ return false; });
				} else { 
					$(e).addClass("ch-user-no-select");
				};
			});
			return;
		},
		hasOwn: function(o, property) {
			return Object.prototype.hasOwnProperty.call(o, property);
		},
		// Based on: http://www.quirksmode.org/dom/getstyles.html
		getStyles: function (element, style) {
			// Main browsers
			if (window.getComputedStyle) {

				return getComputedStyle(element, "").getPropertyValue(style);

			// IE
			} else {

				// Turn style name into camel notation
				style = style.replace(/\-(\w)/g, function (str, $1) { return $1.toUpperCase(); });

				return element.currentStyle[style];

			}
		}
	},

	/**
	* Chico-UI global events reference.
	* @abstract
	* @name Events
	* @class Events
	* @type object
	* @standalone
	* @memberOf ch 
	* @see ch.Events.KEY
	* @see ch.Events.LAYOUT
	* @see ch.Events.VIEWPORT
	*/	
	events: {
		/**
		* Layout event collection.
		* @name LAYOUT
		* @namespace LAYOUT
		* @memberOf ch.Events
		*/
		LAYOUT: {
			/**
			* Every time Chico-UI needs to inform al visual components that layout has been changed, he triggers this event.
			* @name CHANGE
			* @memberOf ch.Events.LAYOUT
			* @constant
			* @see ch.Form
			* @see ch.Layer
			* @see ch.Tooltip
			* @see ch.Helper 
			*/
			CHANGE: "change"
		},
		/**
		* Viewport event collection.
		* @name VIEWPORT
		* @namespace VIEWPORT
		* @memberOf ch.Events
		*/
		VIEWPORT: {
			/**
			* Every time Chico-UI needs to inform all visual components that window has been scrolled or resized, he triggers this event.
			* @name CHANGE
			* @constant
			* @memberOf ch.Events.VIEWPORT
			* @see ch.Positioner
			*/
			CHANGE: "change"
		},
		/**
		* Keryboard event collection.
		* @name KEY
		* @constant
		* @namespace KEY
		* @memberOf ch.Events
		*/
		KEY: {
			/**
			* Enter key event.
			* @name ENTER
			* @constant
			* @memberOf ch.Events.KEY
			*/
			ENTER: "enter",
			/**
			* Esc key event.
			* @name ESC
			* @constant
			* @memberOf ch.Events.KEY
			*/
			ESC: "esc",
			/**
			* Left arrow key event.
			* @name LEFT_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			LEFT_ARROW: "left_arrow",
			/**
			* Up arrow key event.
			* @name UP_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			UP_ARROW: "up_arrow",
			/**
			* Rigth arrow key event.
			* @name RIGHT_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			RIGHT_ARROW: "right_arrow",
			/**
			* Down arrow key event.
			* @name DOWN_ARROW
			* @constant
			* @memberOf ch.Events.KEY
			*/
			DOWN_ARROW: "down_arrow",
			/**
			* Backspace key event.
			* @name BACKSPACE
			* @constant
			* @memberOf ch.Events.KEY
			*/
			BACKSPACE: "backspace"
		}
	}
};

/** 
* Utility to clone objects
* @function
* @name clon
* @param o Object to clone
* @returns object
* @memberOf ch
*/
ch.clon = function(o) {

	obj = {};

	for (x in o) {
		obj[x] = o[x]; 
	};
	
	return obj;
};


/** 
* Class to create UI Components
* @abstract
* @name Factory
* @class Factory
* @param o Configuration Object
* @example
*	o {
*		component: "chat",
*		callback: function(){},
*		[script]: "http://..",
*		[style]: "http://..",
*		[callback]: function(){}	
*	}
* @returns collection
* @memberOf ch
*/
// TODO: Always it should receive a conf object as parameter (see Multiple component)
// TODO: Try to deprecate .and() method on Validator
ch.factory = function(o) {

	var x = o.component || o;
	
	var create = function(x) { 

		// Send configuration to a component trough options object
		$.fn[x] = function( options ) {

			var results = [];
			var that = this;

			// Could be more than one argument
			var _arguments = arguments;
			
			that.each( function(i, e) {
				
				var conf = options || {};

				var context = {};
					context.type = x;
					context.element = e;
					context.$element = $(e);
					context.uid = ch.utils.index += 1; // Global instantiation index
			
				switch(typeof conf) {
					// If argument is a number, join with the conf
					case "number":
						var num = conf;
						conf = {};
						conf.value = num;
						
						// Could come a messages as a second argument
						if (_arguments[1]) {
							conf.msg = _arguments[1];
						};
					break;
					
					// This could be a message
					case "string":
						var msg = conf;
						conf = {};
						conf.msg = msg;
					break;
					
					// This is a condition for custom validation
					case "function":
						var func = conf;
						conf = {};
						conf.lambda = func;
						
						// Could come a messages as a second argument
						if (_arguments[1]) {
							conf.msg = _arguments[1];
						};
					break;
				};

				// Create a component from his constructor
				var created = ch[x].call( context, conf );

				/*
					MAPPING INSTANCES
					Internal interface for avoid mapping objects
					{
						exists:true,
						object: {}
					}
				*/

				created = ( ch.utils.hasOwn(created, "public") ) ? created["public"] : created;

				if (created.type) {
					var type = created.type;
					// If component don't exists in the instances map create an empty array
					if (!ch.instances[type]) { ch.instances[type] = []; }
						ch.instances[type].push( created );
				}

				// Avoid mapping objects that already exists
				if (created.exists) {
					// Return the inner object
					created = created.object;
				}

				results.push( created );

			});

			// return the created components collection or single component
			return ( results.length > 1 ) ? results : results[0];
		};

		// if a callback is defined 
		if ( o.callback ) { o.callback(); }

	} // end create function

	if ( ch[x] ) {
		// script already here, just create it
		create(x);

	} else {
		// get resurces and call create later
		ch.get({
			"method":"component",
			"component": x,
			"script": (o.script)? o.script : "src/js/"+x+".js",
			"styles": (o.style)? o.style : "src/css/"+x+".css",
			"callback":create
		});
	}
}

/**
* Load components or content
* @abstract
* @name Get
* @class Get
* @param {object} o Configuration object 
* @example
*	o {
*		component: "chat",
*		[script]: "http://..",
*		[style]: "http://..",
*		[callback]: function(){}
*	}
* @memberOf ch
*/
ch.get = function(o) {
	
	// ch.get: "Should I get a style?"
	if ( o.style ) {
		var style = document.createElement('link');
			style.href = o.style;
			style.rel = 'stylesheet';
			style.type = 'text/css';
	}
	// ch.get: "Should I get a script?"		
	if ( o.script ) {
		var script = document.createElement("script");
			script.src = o.script;
	}

	var head = document.getElementsByTagName("head")[0] || document.documentElement;
	// Handle Script loading
	var done = false;

	// Attach handlers for all browsers
	script.onload = script.onreadystatechange = function() {

		if ( !done && (!this.readyState || 
			this.readyState === "loaded" || this.readyState === "complete") ) {
			done = true;
			// if callback is defined call it
			if ( o.callback ) { o.callback( o.component ); }
			// Handle memory leak in IE
			script.onload = script.onreadystatechange = null;
			if ( head && script.parentNode ) { head.removeChild( script ); }
		}
	};

	// Use insertBefore instead of appendChild to circumvent an IE6 bug.
	// This arises when a base node is used.
	if ( o.script ) { head.insertBefore( script, head.firstChild ); }
	if ( o.style ) { head.appendChild( style ); }

}


/**
* Returns a data object with features supported by the device
* @abstract
* @name Support
* @class Support
* @returns object
* @memberOf ch 
*/
ch.support = function() {
	
	/**
	* Private reference to the <body> element
	* @private
	* @name thisBody
	* @type HTMLBodyElement
	* @memberOf ch.Support
	*/
	var thisBody = document.body || document.documentElement;
	
	/**
	* Based on: http://gist.github.com/373874
	* Verify that CSS3 transition is supported (or any of its browser-specific implementations)
	*
	* @private
	* @returns boolean
	* @memberOf ch.Support
	*/
	var transition = (function(){
		var thisStyle = thisBody.style;
		return thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
	})();

	/**
	* Based on: http://kangax.github.com/cft/#IS_POSITION_FIXED_SUPPORTED
	* Verify that position fixed is supported
	* 
	* @private
	* @returns boolean
	* @memberOf ch.Support
	*/	
	var fixed = (function(){
		var isSupported = false;
		var e = document.createElement("div");
			e.style.position = "fixed";
			e.style.top = "10px";
			
		thisBody.appendChild(e);
		if (e.offsetTop === 10) { isSupported = true; };
		thisBody.removeChild(e);
		
		return isSupported;
		
	})();

	return {
		/**
		* Boolean property that indicates if CSS3 Transitions are supported by the device.
		* @public
		* @name transition
		* @type boolean
		* @memberOf ch.Support
		*/
		transition: transition,
		/**
		* Boolean property that indicates if Fixed positioning are supported by the device.
		* @public
		* @name fixed
		* @type boolean
		* @memberOf ch.Support
		*/
		fixed: fixed
	};

};


/**
* Extend is a utility that resolve creating interfaces problem for all UI-Objects.
* @abstract
* @name Extend
* @class Extend
* @memberOf ch
* @param {string} name Interface's name.
* @param {function} klass Class to inherit from.
* @param {function} [process] Optional function to pre-process configuration, recieves a 'conf' param and must return the configration object.
* @returns class
* @example
* // Create an URL interface type based on String component.
* ch.extend("string").as("url");
* @example
* // Create an Accordion interface type based on Menu component.
* ch.extend("menu").as("accordion"); 
* @example
* // And the coolest one...
* // Create an Transition interface type based on his Modal component, with some conf manipulations:
* ch.extend("modal").as("transition", function(conf) {
*	conf.closeButton = false;
*	conf.msg = conf.msg || conf.content || "Please wait...";
*	conf.content = $("&lt;div&gt;").addClass("loading").after( $("&lt;p&gt;").html(conf.msg) );
*	return conf;
* });
*/

ch.extend = function (klass) {

	"use strict";

	return {
		as: function (name, process) {
			// Create the component in Chico-UI namespace
			ch[name] = function (conf) {
				// Some interfaces need a data value,
				// others simply need to be 'true'.
				conf[name] = conf.value || true;
	
				// Invoke pre-proccess if is defined,
				// or grab the raw conf argument,
				// or just create an empty object.
				conf = (process) ? process(conf) : conf || {};
	
				// Here we recieve messages,
				// or create an empty object.
				conf.messages = conf.messages || {};
	
				// If the interface recieve a 'msg' argument,
				// store it in the message map.
				if (ch.utils.hasOwn(conf, "msg")) {
					conf.messages[name] = conf.msg;
					conf.msg = null;
					delete conf.msg;
				}
				// Here is where the magic happen,
				// invoke the class with the new conf,
				// and return the instance to the namespace.
				return ch[klass].call(this, conf);
			};
			// Almost done, now we need expose the new component,
			// let's ask the factory to do it for us.
			ch.factory(name);
		} // end as method
	} // end return
};

/**
* Abstract class
* @abstract
* @name Controllers
* @class Controllers 
* @augments ch.Uiobject
* @memberOf ch
* @returns itself
* @see ch.Accordion
* @see ch.Carousel
* @see ch.Form
*/

ch.controllers = function(){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @name ch.Controllers#that
	* @type object
	*/ 
	var that = this;
		
	/**
	*  Inheritance
	*/
	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);
	
 
	/**
	* Collection of children elements.
	* @name ch.Controllers#children
	* @type collection
	*/ 
	that.children = [];
			
	/**
	*  Public Members
	*/	
		
	return that;
};
/**
* Abstract class that brings the functionality of all form controls.
* @abstract
* @name Controls
* @class Controls 
* @augments ch.Uiobject
* @requires ch.Floats
* @memberOf ch
* @returns itself
* @see ch.Countdown
* @see ch.Validation
* @see ch.AutoComplete
* @see ch.DatePicker
*/

ch.controls = function () {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @name ch.Controls#that
	* @type Object
	*/
	var that = this,

		conf = that.conf;

/**
*  Inheritance
*/
	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
*  Protected Members
*/

	/**
	* Creates a reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.Controls#createFloat
	*/
	that.createFloat = function (c) {
		c.position = {
			"context": conf.context || c.context || c.$element || that.$element,
			"offset": c.offset,
			"points": c.points
		};

		var float = ch.floats.call({
			"element": (ch.utils.hasOwn(c, "$element")) ? c.$element[0] : that.element,
			"$element": c.$element || that.$element,
			"uid": (ch.utils.index += 1),
			"type": c.type || that.type,
			"conf": c
		});

		return float;
	};

/**
*  Public Members
*/

	return that;
};/**
* Abstract class of all floats UI-Objects.
* @abstract
* @name ch.Floats
* @class Floats
* @augments ch.Uiobject
* @requires ch.Positioner
* @returns itself
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Modal
*/

ch.floats = function () {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Floats#that
	* @type object
	*/
	var that = this,
		conf = that.conf;
/**
* Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
* Private Members
*/

	/**
	* Creates a 'cone', is a visual asset for floats.
	* @private
	* @function
	* @deprecated
	* @name ch.Floats#createCone
	*/

	/**
	* Creates close button.
	* @private
	* @function
	* @deprecated
	* @name ch.Floats#createClose
	*/

/**
* Protected Members
*/
	/**
	* Flag that indicates if the float is active and rendered on the DOM tree.
	* @protected
	* @name ch.Floats#active
	* @type boolean
	*/
	that.active = false;

	/**
	* Content configuration property.
	* @protected
	* @name ch.Floats#source
	* @type string
	*/
	that.source = conf.content || conf.msg || conf.ajax || that.element.href || that.$element.parents("form").attr("action");

	/**
	* Inner function that resolves the component's layout and returns a static reference.
	* @protected
	* @name ch.Floats#$container
	* @type jQuery
	*/
	that.$container = (function () { // Create Layout
		
		// Final jQuery Object
		var $container,
		
		// Component with close button and keyboard binding for close
			closable = ch.utils.hasOwn(conf, "closeButton") && conf.closeButton,
		
		// HTML Div Element with role for WAI-ARIA
			container = ["<div role=\"" + conf.aria.role + "\""];
			
		// ID for WAI-ARIA
		if (ch.utils.hasOwn(conf.aria, "identifier")) {
			
			// Generated ID using component name and its instance order
			var id = "ch-" + that.type + "-" + (ch.utils.hasOwn(ch.instances, that.type) ? ch.instances[that.type].length + 1 : "1");
			
			// Add ID to container element
			container.push(" id=\"" + id + "\"");
			
			// Add aria attribute to trigger element
			that.$element.attr(conf.aria.identifier, id);
		}
		
		// Classname with component type and extra classes from conf.classes
		container.push(" class=\"ch-" + that.type + (ch.utils.hasOwn(conf, "classes") ? " " + conf.classes : "") + "\"");
		
		// Z-index
		container.push(" style=\"z-index:" + (ch.utils.zIndex += 1) + ";");
		
		// Width
		if (ch.utils.hasOwn(conf, "width")) {
			container.push("width:" + conf.width + ((typeof conf.width === "number") ? "px;" : ";"));
		}
		
		// Height
		if (ch.utils.hasOwn(conf, "height")) {
			container.push("height:" + conf.height + ((typeof conf.height === "number") ? "px;" : ";"));
		}
		
		// Style and tag close
		container.push("\">");
		
		// Create cone
		if (ch.utils.hasOwn(conf, "cone")) { container.push("<div class=\"ch-cone\"></div>"); }
		
		// Create close button
		if (closable) { container.push("<div class=\"btn close\" style=\"z-index:" + (ch.utils.zIndex += 1) + "\"></div>"); }
		
		// Tag close
		container.push("</div>");
		
		// jQuery Object generated from string
		$container = $(container.join(""));
		
		// Close behavior bindings
		if (closable) {
			// Close button event delegation
			$container.bind("click", function (event) {
				if ($(event.target || event.srcElement).hasClass("close")) { that.innerHide(event); }
			});
			
			// ESC key support
			ch.utils.document.bind(ch.events.KEY.ESC, function (event) { that.innerHide(event); });
		}
		
		// Efects configuration
		conf.fx = ch.utils.hasOwn(conf, "fx") ? conf.fx : true;

		// Position component configuration
		conf.position = conf.position || {};
		conf.position.element = $container;
		conf.position.reposition = ch.utils.hasOwn(conf, "reposition") ? conf.reposition : true;

		// Initialize positioner component
		that.position = ch.positioner(conf.position);

		// Return the entire Layout
		return $container;
	})();

	/**
	* Inner reference to content container. Here is where the content will be added.
	* @protected
	* @name ch.Floats#$content
	* @type jQuery
	* @see ch.Object#content
	*/
	that.$content = $("<div class=\"ch-" + that.type + "-content\">").appendTo(that.$container);

	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @protected
	* @function
	* @name ch.Floats#contentCallback
	* @returns itself
	*/
	that["public"].on("contentLoad", function (event, context) {
		that.$content.html(that.staticContent);

		if (ch.utils.hasOwn(conf, "onContentLoad")) {
			conf.onContentLoad.call(context, that.staticContent);
		}

		that.position("refresh");
	});

	/**
	* This callback is triggered when async request fails.
	* @protected
	* @name ch.Floats#contentError
	* @function
	* @returns {this}
	*/
	that["public"].on("contentError", function (event, data) {

		that.$content.html(that.staticContent);

		// Get the original that.source
		var originalSource = that.source;

		if (ch.utils.hasOwn(conf, "onContentError")) {
			conf.onContentError.call(data.context, data.jqXHR, data.textStatus, data.errorThrown);
		}

		// Reset content configuration
		that.source = originalSource;
		that.staticContent = undefined;

		if (ch.utils.hasOwn(conf, "position")) {
		   ch.positioner(conf.position);
		}

	});

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @function
	* @name ch.Floats#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {
		if (event) {
			that.prevent(event);
		}

		// Avoid showing things that are already shown
		if (that.active) return;

		// Add layout to DOM tree
		// Increment zIndex
		that.$container
			.appendTo("body")
			.css("z-index", ch.utils.zIndex++);

		// This make a reflow, but we need that the static content appends to DOM
		// Get content
		that.content();

		/**
		* Triggers when component is visible.
		* @name ch.Floats#show
		* @event
		* @public
		*/
		// Show component with effects
		if (conf.fx) {
			that.$container.fadeIn("fast", function () {
				// new callbacks
				that.trigger("show");
				// Old callback system
				that.callbacks('onShow');
			});
		} else {
		// Show component without effects
			that.$container.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// Old callback system
			that.callbacks('onShow');
		}

		that.position("refresh");
		
		that.active = true;

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @function
	* @name ch.Floats#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {
		
		if (event) {
			event.stopPropagation();
		}

		if (!that.active) {
			return;
		}

		var afterHide = function () {

			that.active = false;

		/**
		* Triggers when component is not longer visible.
		* @name ch.Floats#hide
		* @event
		* @public
		*/
			// new callbacks
			that.trigger("hide");
			// Old callback system
			that.callbacks('onHide');

			that.$container.detach();

		};

		// Show component with effects
		if (conf.fx) {
			that.$container.fadeOut("fast", afterHide);

		// Show component without effects
		} else {
			that.$container.addClass("ch-hide");
			afterHide();
		}

		return that;

	};

	/**
	* Getter and setter for size attributes on any float component.
	* @protected
	* @function
	* @name ch.Floats#size
	* @param {String} prop Property that will be setted or getted, like "width" or "height".
	* @param {String} [data] Only for setter. It's the new value of defined property.
	* @returns itself
	*/
	that.size = function (prop, data) {
		// Getter
		if (!data) { return that.conf[prop]; }

		// Setter
		that.conf[prop] = data;

		// Container size
		that.$container[prop](data);

		// Refresh position
		that.position("refresh");

		return that["public"];
	};


/**
* Public Members
*/

	/**
	* Triggers the innerShow method, returns the public scope to keep method chaining and sets new content if receive a parameter.
	* @public
	* @function
	* @name ch.Floats#show
	* @returns itself
	* @see ch.Floats#content
	*/
	that["public"].show = function (content) {
		if (content !== undefined) { that["public"].content(content); }
		that.innerShow();
		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Floats#hide
	* @returns itself
	*/
	that["public"].hide = function () {
		that.innerHide();
		return that["public"];
	};
	
	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Uiobject#position
	* @example
	* // Change component's position.
	* me.position({ 
	*	  offset: "0 10",
	*	  points: "lt lb"
	* });
	* @see ch.Uiobject#position
	*/
	// Create a custom Positioner object to update conf.position data of Float family
	that["public"].position = function (o) {

		var r = that["public"];

		switch (typeof o) {
		// Custom Setter: It updates conf.position data
		case "object":
			// New points
			if (ch.utils.hasOwn(o, "points")) { conf.position.points = o.points; }

			// New reposition
			if (ch.utils.hasOwn(o, "reposition")) { conf.position.reposition = o.reposition; }

			// New offset (splitted)
			if (ch.utils.hasOwn(o, "offset")) { conf.position.offset = o.offset; }

			// New context
			if (ch.utils.hasOwn(o, "context")) { conf.position.context = o.context; }

			// Original Positioner
			that.position(conf.position);

			break;

		// Refresh
		case "string":
			that.position("refresh");
			
			break;

		// Getter
		case "undefined":
		default:
			r = that.position();
			
			break;
		}

		return r;
	};

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @function
	* @name ch.Floats#width
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/
	that["public"].width = function (data) {
		return that.size("width", data) || that["public"];
	};

	/**
	* Sets or gets the height of the Float element.
	* @public
	* @function
	* @name ch.Floats#height
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the height
	* me.height(300);
	* @example
	* // to get the height
	* me.height // 300
	*/
	that["public"].height = function (data) {
		return that.size("height", data) || that["public"];
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @function
	* @name ch.Floats#isActive
	* @returns boolean
	*/
	that["public"].isActive = function () {
		return that.active;
	};
	
	/**
	* Triggers when the component is ready to use.
	* @name ch.Floats#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;

};
/**
* Abstract representation of navs components.
* @abstract
* @name Navs
* @class Navs
* @standalone
* @augments ch.Uiobject
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @see ch.Dropdown
* @see ch.Expando
*/

ch.navs = function () {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Navs#that
	* @type object
	*/ 
	var that = this,
		conf = that.conf;
	
	conf.icon = ch.utils.hasOwn(conf, "icon") ? conf.icon : true;
	conf.open = conf.open || false;
	conf.fx = conf.fx || false;

/**
*	Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);
	
/**
*	Protected Members
*/
	/**
	* Status of component
	* @protected
	* @name ch.Navs#active
	* @returns boolean
	*/
	that.active = false;

	/**
	* Shows component's content.
	* @protected
	* @name ch.Navs#show
	* @returns itself
	*/
	that.show = function (event) {
		that.prevent(event);

		if (that.active) {
			return that.hide(event);
		}
		
		that.active = true;

		that.$trigger.addClass("ch-" + that.type + "-trigger-on");
		/**
		* onShow callback function
		* @name ch.Navs#onShow
		* @event
		*/
		// Animation
		if (conf.fx) {
			that.$content.slideDown("fast", function () {
				//that.$content.removeClass("ch-hide");
			
				// new callbacks
				that.trigger("show");
				// old callback system
				that.callbacks("onShow");
			});
		} else {
			that.$content.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// old callback system
			that.callbacks("onShow");
		}
		
		return that;
	};
	/**
	* Hides component's content.
	* @protected
	* @name ch.Navs#hide
	* @returns itself
	*/
	that.hide = function (event) {
		that.prevent(event);
		
		if (!that.active) { return; }
		
		that.active = false;
		
		that.$trigger.removeClass("ch-" + that.type + "-trigger-on");
		/**
		* onHide callback function
		* @name ch.Navs#onHide
		* @event
		*/
		// Animation
		if (conf.fx) {
			that.$content.slideUp("fast", function () {
				//that.$content.addClass("ch-hide");
				that.callbacks("onHide");
			});
		} else {
			that.$content.addClass("ch-hide");
			// new callbacks
			that.trigger("hide");
			// old callback system
			that.callbacks("onHide");
		}
		
		return that;
	};

	/**
	* Create component's layout
	* @protected
	* @name ch.Navs#createLayout
	*/
	that.configBehavior = function () {
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("click", function (event) { that.show(event); });

		that.$content.addClass("ch-" + that.type + "-content ch-hide");

		// Visual configuration
		if (conf.icon) { $("<span class=\"ico\">Drop</span>").appendTo(that.$trigger); }
		if (conf.open) { that.show(); }

	};
	
/**
*	Default event delegation
*/
	that.$element.addClass("ch-" + that.type);

	/**
	* Triggers when component is visible.
	* @name ch.Navs#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Navs#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	return that;
}
/**
* Object represent the abstract class of all Objects.
* @abstract
* @name Object
* @class Object
* @memberOf ch
* @see ch.Controllers
* @see ch.Floats
* @see ch.Navs
* @see ch.Watcher
*/

ch.object = function(){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Object#that
	* @type object
	*/
	var that = this;

	var conf = that.conf;

/**
*	Public Members
*/

	/**
	* This method will be deprecated soon. Triggers a specific callback inside component's context.
	* @name ch.Object#callbacks
	* @function
	* @protected
	*/
	// TODO: Add examples!!!
	that.callbacks = function (when, data) {
		if( ch.utils.hasOwn(conf, when) ) {
			var context = ( that.controller ) ? that.controller["public"] : that["public"];
			return conf[when].call( context, data );
		};
	};


	// Triggers a specific event within the component public context.
	that.trigger = function (event, data) {
		$(that["public"]).trigger("ch-"+event, data);
	};
	
	// Add a callback function from specific event.
	that.on = function (event, handler) {
		if (event && handler) {
			$(that["public"]).bind("ch-"+event, handler);
		}
		return that["public"];
	};

	// Add a callback function from specific event that it will execute once.
	that.once = function (event, handler) {

		if (event && handler) {
			$(that["public"]).one("ch-"+event, handler);
		}

		return that["public"];
	};

	
	// Removes a callback function from specific event.
	that.off = function (event, handler) {
		if (event && handler) {
			$(that["public"]).unbind("ch-"+event, handler);
		} else if (event) {
			$(that["public"]).unbind("ch-"+event);
		}
		return that["public"];
	};

	/**
	* Component's public scope. In this scope you will find all public members.
	*/
	that["public"] = {};

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Object#uid
	* @type number
	* @ignore
	*/
	that["public"].uid = that.uid;

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Object#element
	* @type HTMLElement
	* @ignore
	*/
	that["public"].element = that.element;

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Object#type
	* @type string
	* @ignore
	*/
	that["public"].type = that.type;
	
	/**
	* Triggers a specific event within the component public context.
	* @name ch.Object#trigger
	* @function
	* @protected
	* @param {string} event The event name you want to trigger.
	* @since version 0.7.1
	*/
	that["public"].trigger = that.trigger;

	/**
	* Add a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#on
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.7.1
	* @example
	* // Will add a event handler to the "ready" event
	* me.on("ready", startDoingStuff);
	*/

	that["public"].on = that.on;
	/**
	* Add a callback function from specific event that it will execute once.
	* @public
	* @function
	* @name ch.Object#once
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.8.0
	* @example
	* // Will add a event handler to the "contentLoad" event once
	* me.once("contentLoad", startDoingStuff);
	*/
	that["public"].once = that.once;

	/**
	* Removes a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#off
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.7.1
	* @example
	* // Will remove event handler to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* me.off("ready", startDoingStuff);
	*/
	that["public"].off = that.off;

	return that;
};/**
* Object represent the abstract class of all UI Objects.
* @abstract
* @name Uiobject
* @class Uiobject
* @augments ch.Object
* @memberOf ch
* @see ch.Controllers
* @see ch.Floats
* @see ch.Navs
* @see ch.Watcher
*/

ch.uiobject = function(){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Uiobject#that
	* @type object
	*/
	var that = this;

	var conf = that.conf;
	

/**
*	Inheritance
*/

	that = ch.object.call(that);
	that.parent = ch.clon(that);



/**
*	Public Members
*/

	/**
	* Component static content.
	* @public
	* @name ch.Uiobject#staticContent
	* @type string
	*/
	that.staticContent;

	/**
	* DOM Parent of content, this is useful to attach DOM Content when float is hidding.
	* @public
	* @name ch.Uiobject#DOMParent
	* @type HTMLElement
	*/
	that.DOMParent;

	/**
	* Component original content.
	* @public
	* @name ch.Uiobject#originalContent
	* @type HTMLElement
	*/
	that.originalContent;

	/**
	* Set and get the content of a component. With no arguments will behave as a getter function. Send any kind of content and will be a setter function. Use a valid URL for AJAX content, use a CSS selector for a DOM content or just send a static content like HTML or Text.
	* @name ch.Uiobject#content
	* @protected
	* @function
	* @param {string} [content] Could be a simple text, html or a url to get the content with ajax.
	* @returns {string} content
	* @requires ch.Cache
	* @example
	* // Simple static content
	* $(element).layer().content("Some static content");
	* @example
	* // Get DOM content
	* $(element).layer().content("#hiddenContent");
	* @example
	* // Get AJAX content
	* $(element).layer().content("http://chico.com/content/layer.html");
	*/
	that.content = function(content) {

		var _get = (content) ? false : true,

			// Local argument
			content = content,
			// Local isURL
			sourceIsUrl = ch.utils.isUrl(that.source),
			// Local isSelector
			sourceIsSelector = ch.utils.isSelector(that.source),
			// Local inDom
			sourceInDom = (!sourceIsUrl) ? ch.utils.inDom(that.source) : false,
			// Get context, could be a single component or a controller
			context = ( ch.utils.hasOwn(that, "controller") ) ? that.controller : that["public"],
			// undefined, for comparison.
			undefined,
			// Save cache configuration
			cache = ( ch.utils.hasOwn(conf, "cache") ) ? conf.cache : true;

		/**
		* Get content
		*/

		// return defined content
		if (_get) {

			// no source, no content
			if (that.source === undefined) {
				that.staticContent = "<p>No content defined for this component</p>";
				that.trigger("contentLoad");

				return;
			}

			// First time we need to get the content.
			// Is cache is off, go and get content again.
			// Yeap, recursive.
			if (!cache || that.staticContent === undefined) {
				that.content(that.source);
				return;
			}

			// Get data from cache if the staticContent was defined
			if (cache && that.staticContent) {
				var fromCache = ch.cache.get(that.source);

				// Load content from cache
				if (fromCache && that.staticContent != fromCache) {
					that.staticContent = fromCache;

					that.trigger("contentLoad");

					// Return and load content from cache
					return;
				}

				// Return and show the latest content that was loaded
				return;
			}
		}

		/**
		* Set content
		*/

		// Reset cache to overwrite content
		conf.cache = false;

		// Local isURL
		var isUrl = ch.utils.isUrl(content),
			// Local isSelector
			isSelector = ch.utils.isSelector(content),
			// Local inDom
			inDom = (!isUrl) ? ch.utils.inDom(content) : false;

		/* Evaluate static content*/

		// Set 'that.staticContent' and overwrite 'that.source'
		// just in case you want to update DOM or AJAX Content.

		that.staticContent = that.source = content;

		/* Evaluate AJAX content*/

		if (isUrl) {

			// First check Cache
			// Check if this source is in our cache
			if (cache) {
				var fromCache = ch.cache.get(that.source);
				if (fromCache) {
					conf.cache = cache;
					that.staticContent = fromCache;
					that.trigger("contentLoad", context);
					return;
				}
			}

			var _method, _serialized, _params = "x=x";

			// If the trigger is a form button, serialize its parent to send data to the server.
			if (that.$element.attr('type') == 'submit') {
				_method = that.$element.parents('form').attr('method') || 'GET';
				_serialized = that.$element.parents('form').serialize();
				_params = _params + ((_serialized != '') ? '&' + _serialized : '');
			};

			// Set ajax config
			// On IE (6-7) "that" reference losts for second time
			// Why?? I don't know... but with a setTimeOut() works fine!
			setTimeout(function(){

				$.ajax({
					url: that.source,
					type: _method || 'GET',
					data: _params,
					// each component could have a different cache configuration
					cache: cache,
					async: true,
					beforeSend: function(jqXHR){
						// Ajax default HTTP headers
						jqXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					},
					success: function(data, textStatus, jqXHR){
						// Save data as staticContent
						that.staticContent = data;

						// Use the contentLoad callback.
						that.trigger("contentLoad", context);

						// Save new staticContent to the cache
						if (cache) {
							ch.cache.set(that.source, that.staticContent);
						}

					},
					error: function(jqXHR, textStatus, errorThrown){
						that.staticContent = "<p>Error on ajax call.</p>";

						var data = {
							"context": context,
							"jqXHR": jqXHR,
							"textStatus": textStatus,
							"errorThrown": errorThrown
						};

						// Use the contentError callback.
						that.trigger("contentError", data);
					}
				});

			}, 0);

			// Return Spinner and wait for async callback
			that.$content.html("<div class=\"loading\"></div>");
			that.staticContent = undefined;

		} else {

			/* Evaluate DOM content*/

			if (isSelector && inDom) {

				// Save original DOMFragment.
				that.originalContent = $(content);

				// Save DOMParent, so we know where to re-insert the content.
				that.DOMParent = that.originalContent.parent();

				// Save a clone to original DOM content
				that.staticContent = that.originalContent.clone().removeClass("ch-hide");

			}

			// Save new data to the cache
			if (cache) {
				ch.cache.set(that.source, that.staticContent);
			}

			// First time we need to set the callbacks that append and remove the original content.
			if (that.originalContent && that.originalContent.selector == that.source) {

				// Remove DOM content from DOM to avoid ID duplications
				that["public"].on("show", function() {
					that.originalContent.detach();
				});

				// Returns DOMelement to DOM
				that["public"].on("hide", function(){
					that.originalContent.appendTo(that.DOMParent||"body");
				});
			}
		}

		/* Set previous cache configuration*/
		conf.cache = cache;

		// trigger contentLoad callback for DOM and Static content.
		if (that.staticContent !== undefined) {
			that.trigger("contentLoad", context);
		}

	};

	/**
	* Prevent propagation and default actions.
	* @name ch.Uiobject#prevent
	* @function
	* @protected
	* @param {event} event Recieves a event object
	*/
	that.prevent = function(event) {

		if (event && typeof event == "object") {
			event.preventDefault();
			event.stopPropagation();
		};

		return that;
	};

/**
*	Public Members
*/
	
	/**
	* Component's public scope. In this scope you will find all public members.
	*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Uiobject#uid
	* @type number
	* @ignore
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Uiobject#element
	* @type HTMLElement
	* @ignore
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Uiobject#type
	* @type string
	* @ignore
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Uiobject#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	*/
	that["public"].content = function(content){
		if (content) { // sets
			// Reset content data
			that.source = content;
			that.staticContent = undefined;

			if (that.active) {
				that.content(content);
			}

			return that["public"];

		} else { // gets
			return that.staticContent;
		}
	};
	
	/**
	* Triggers a specific event within the component public context.
	* @name ch.Object#trigger
	* @function
	* @public
	* @param {string} event The event name you want to trigger.
	* @since version 0.7.1
	*/
	
	/**
	* Add a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#on
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.7.1
	* @example
	* // Will add a event handler to the "ready" event
	* me.on("ready", startDoingStuff);
	*/

	/**
	* Add a callback function from specific event once.
	* @public
	* @function
	* @name ch.Object#once
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.8.0
	* @example
	* // Will add a event handler to the "contentLoad" event once
	* me.once("contentLoad", startDoingStuff);
	*/

	/**
	* Removes a callback function from specific event.
	* @public
	* @function
	* @name ch.Object#off
	* @param {string} event Event name.
	* @param {function} handler Handler function.
	* @returns itself
	* @since version 0.7.1
	* @example
	* // Will remove event handler to the "ready" event
	* me.off("ready", startDoingStuff);
	*/

	return that;
};/**
* Validator is a validation engine for html forms elements.
* @abstract
* @name Validator
* @class Validator
* @augments ch.Object
* @requires ch.Condition
* @memberOf ch
* @param {Object} conf Object with configuration properties.
* @param {Object} conf.conditions Object with conditions.
* @returns itself
* @see ch.Condition
*/

ch.validator = function(conf) {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Validator#that
	* @type Object
	*/
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;	

/**
* Inheritance
*/

	that = ch.object.call(that);
	that.parent = ch.clon(that);

/**
* Private Members
*/
	var conditions = (function(){
		var c = {}; // temp collection
		var condition = ch.condition.call(that["public"], conf.condition);

		c[condition.name] = condition;

		// return all the configured conditions
		return c;
	})(); // Love this ;)

	/**
	* Search for instances of Validators with the same trigger, and then merge it's properties with it.
	* @private
	* @name ch.Validator#checkInstance
	* @function
	* @returns Object
	*/
	var checkInstance;
	if (checkInstance = function() {

		var instance, instances = ch.instances.validator;
		if ( instances && instances.length > 0 ) {
			for (var i = 0, j = instances.length; i < j; i+=1) {
				instance = instances[i];

				if (instance.element !== that.element) {

					continue;
				}

				// Extend instance's conditions
				instance.extend(conditions);

				// To let know the ch.Factory that already exists,
				// this way we avoid to have duplicated references.
				return {
					exists: true,
					object: instance
				}
			}
		}
	}()){
		return checkInstance;
	};

	var validate = function(value) {

		if (!that.enabled) { return true; }

		var condition, tested, empty, val, message, required = conditions["required"];

		// Avoid fields that aren't required when they are empty or de-activated
		if (!required && value === "" && that.active === false) { return {"status": true}; }

		if (that.enabled && (!that.active || value !== "" || required)) {
			/**
			* Triggers before start validation process.
			* @name ch.Validator#beforeValidate
			* @event
			* @public
			* @example
			* me.on("beforeValidate",function(){
			*	submitButton.disable();
			* });
			*/
			// old callback system
			that.callbacks('beforeValidate');
			// new callback
			that.trigger("beforeValidate");

			// for each condition
			for (condition in conditions){

				val = ((condition === "required") ? that.element : value.toLowerCase());
				tested = test(condition, val);

				// return false if any test fails,
				if (!tested) {

					/**
					* Triggers when an error occurs on the validation process.
					* @name ch.Validator#error
					* @event
					* @public
					* @example
					* me.on("error",function(event, condition){
					*	errorModal.show();
					* });
					*/
					// old callback system
					that.callbacks('onError', condition);
					// new callback
					that.trigger("error", condition);

					that.active = true;

					// stops the proccess
					//return false;
					return {
						"status": false,
						"condition": condition,
						"msg": conditions[condition].message
					}
				};
			}
		}

		// Status OK (with previous error)
		if (that.active || !that.enabled) {
			// Public status OK
			that.active = false;
		}

		/**
		* Triggers when the validation process ends.
		* @name ch.Validator#afterValidate
		* @event
		* @public
		* @example
		* me.on("afterValidate",function(){
		*	submitButton.disable();
		* });
		*/
		// old callback system
		that.callbacks('afterValidate');
		// new callback
		that.trigger("afterValidate");

		// It's all good ;)
		//return true;
		return {
			"status": true
		}
	}

	/**
	* Test a condition looking for error.
	* @private
	* @name ch.Validator#test
	* @see ch.Condition
	*/
	var test = function(condition, value){
		
		if (value === "" && condition !== "required") { return true };
		
		var isOk = false,
			condition = conditions[condition];

		isOk = condition.test(value);

		return isOk;
		
	};

/**
* Protected Members
*/

	/**
	* Flag that let you know if there's a validation going on.
	* @protected
	* @name ch.Validator#active
	* @type boolean
	*/
	that.active = false;

	/**
	* Flag that let you know if the all conditions are enabled or not.
	* @protected
	* @name ch.Validator#enabled
	* @type boolean
	*/
	that.enabled = true;

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Validator#uid
	* @type Number
	*/
	
	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Validator#type
	* @type String
	*/
	that["public"].type = "validator";

	/**
	* This public Map saves all the validation configurations from this instance.
	* @public
	* @name ch.Validator#conditions
	* @type object
	*/
	that["public"].conditions = conditions;

	/**
	* Active is a boolean property that let you know if there's a validation going on.
	* @public
	* @name ch.Validator#isActive
	* @function
	* @returns itself
	*/
	that["public"].isActive = function() {
		return that.active;
	};

	/**
	* Let you keep chaining methods.
	* @public
	* @name ch.Validator#and
	* @function
	* @returns itself
	*/
	that["public"].and = function(){
		return that.$element;
	};

	/**
	* Merge its conditions with a new conditions of another instance with the same trigger.
	* @public
	* @name ch.Validator#extend
	* @function
	* @returns itself
	*/
	that["public"].extend = function(input){
		$.extend(conditions, input);

		return that["public"];
	};

	/**
	* Clear all active validations.
	* @public
	* @name ch.Validator#clear
	* @function
	* @returns itself
	*/
	that["public"].clear = function() {
		that.active = false;

		return that["public"];
	};

	/**
	* Runs all configured conditions and returns an object with a status value, condition name and a message.
	* @public
	* @function
	* @name ch.Validator#validate
	* @returns Status Object
	*/
	that["public"].validate = function(value){
		return validate(value);
	}

	/**
	* Turn on Validator engine or an specific condition.
	* @public
	* @name ch.Validator#enable
	* @function
	* @returns itself
	*/
	that["public"].enable = function(condition){
		if (condition && conditions[condition]){
			// Enable specific condition
			conditions[condition].enable();
		} else {
			// enable all
			that.enabled = true;
			for (condition in conditions){
				conditions[condition].enable();
			}
		}
		return that["public"];
	}

	/**
	* Turn on Validator engine or an specific condition.
	* @public
	* @name ch.Validator#disable
	* @function
	* @returns itself
	*/
	that["public"].disable = function(condition){
		if (condition && conditions[condition]){
			// disable specific condition
			conditions[condition].disable();
		} else {
			// disable all
			that.enabled = false;
			for (condition in conditions){
				conditions[condition].disable();
			}
		}
		return that["public"];
	}

/**
*	Default event delegation
*/
	/**
	* Triggers when the component is ready to use.
	* @name ch.Validator#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;
};
ch.factory("validator");
/**
* Cache control utility.
* @abstract
* @name Cache
* @class Cache
* @memberOf ch
*/

ch.cache = {

	/**
	* Map of cached resources
	* @public
	* @name ch.Cache#map 
	* @type object
	*/
	map: {},
	
	/**
	* Set a resource to the cache control
	* @public
	* @function 
	* @name ch.Cache#set
	* @param {string} url Resource location
	* @param {string} data Resource information
	*/
	set: function(url, data) {
		ch.cache.map[url] = data;
	},
	
	/**
	* Get a resource from the cache
	* @public
	* @function
	* @name ch.Cache#get
	* @param {string} url Resource location
	* @returns data Resource information
	*/
	get: function(url) {
		return ch.cache.map[url];
	},
	
	/**
	* Remove a resource from the cache
	* @public
	* @function
	* @name ch.Cache#rem
	* @param {string} url Resource location
	*/
	rem: function(url) {
		ch.cache.map[url] = null;
		delete ch.cache.map[url];
	},
	
	/**
	* Clears the cache map
	* @public
	* @function
	* @name ch.Cache#flush
	*/
	flush: function() {
		delete ch.cache.map;
		ch.cache.map = {};
	}
};/**
* Description
* @abstract
* @name Condition
* @class Condition
* @standalone
* @memberOf ch
* @param {Object} condition Object with configuration properties.
* @param {String} condition.name
* @param {Object} [condition.patt]
* @param {Function} [condition.expr]
* @param {Function} [condition.func]
* @param {Number || String} [condition.value]
* @param {String} condition.message Validation message
* @returns itself
* @example
* // Create a new condition object with patt.
* var me = ch.condition({
*     "name": "string",
*     "patt": /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
*     "message": "Some message here!"
* });
* @example
* // Create a new condition object with expr.
* var me = ch.condition({
*     "name": "maxLength",
*     "patt": function(a,b) { return a.length <= b },
*     "message": "Some message here!",
*     "value": 4
* });
* @example
* // Create a new condition object with func.
* var me = ch.condition({
*     "name": "custom",
*     "patt": function (value) { 
*         if (value === "ChicoUI") {
*
*             // Some code here!
*
*             return true;
*         };
*
*         return false;
*     },
*     "message": "Your message here!"
* });
*/

ch.condition = function(condition) {

/**
* Reference to a internal component instance, saves all the information and configuration properties.
* @protected
* @name ch.Condition#that
* @type itself
*/
	var that = this;

/**
* Private Members
*/

	/**
	* Flag that let you know if the condition is enabled or not.
	* @private
	* @name ch.Condition#enabled
	* @type boolean
	*/
	var	enabled = true,

		test = function (value) {

			if (!enabled) {
				return true;
			}
	
			if (condition.patt){
				return condition.patt.test(value);
			}
	
			if (condition.expr){
				return condition.expr(value, condition.value);
			}
	
			if (condition.func){
				// Call validation function with 'this' as scope.
				return condition.func.call(that, value);
			}
	
		},

		enable = function() {
			enabled = true;
			
			return condition;
		},
	
		disable = function() {
			enabled = false;
			
			return condition;
		};

/**
* Protected Members
*/

/**
* Public Members
*/

	/**
	* Flag that let you know if the all conditions are enabled or not.
	* @public
	* @name ch.Condition#name
	* @type string
	*/

	/**
	* Message defined for this condition
	* @public
	* @name ch.Condition#message
	* @type string
	*/

	/**
	* Run configured condition
	* @public
	* @name ch.Condition#test
	* @function
	* @returns boolean
	*/

	/**
	* Turn on condition.
	* @public
	* @function
	* @name ch.Condition#enable
	* @returns itself
	*/

	/**
	* Turn off condition.
	* @public
	* @function
	* @name ch.Condition#disable
	* @returns itself
	*/

	condition = $.extend(condition, {
		test: test,
		enable: enable,
		disable: disable
	});

	return condition;

};
/**
* Eraser is an utility to erase component's instances and free unused memory. A Numer will erase only that particular instance, a component's name will erase all components of that type, a "meltdown" will erase all component's instances from any kind.
* @abstract
* @name Eraser
* @class Eraser
* @memberOf ch
* @param {string} [data] 
*/
	
ch.eraser = function(data) {
	
	if(typeof data == "number"){
		
		// By UID
		for(var x in ch.instances){
			
			var component = ch.instances[x];
			
			for(var i = 0, j = component.length; i < j; i += 1){
				if(component[i].uid == data){
					// TODO: component.delete()
					delete component[i];
					component.splice(i, 1);
					
					return;
				};
			};
		};
	
	} else {
		
		// All
		if(data === "meltdown"){
			// TODO: component.delete()
			/*for(var x in ch.instances){
				var component = ch.instances[x];
				for(var i = 0, j = component.length; i < j; i += 1){
					component.delete();
				};
			};*/
			
			delete ch.instances;
			ch.instances = {};
			
		// By component name	
		} else {
			
			for(var x in ch.instances){
			
				if(x == data){
					
					var component = ch.instances[x];
					
					// TODO: component.delete()
					/*for(var i = 0; i < component.length; i += 1){
						component.delete()
					};*/
					
					delete ch.instances[x];
				};
			};
			
		};
		
	};
	
};

/**
* Keyboard event controller utility to know wich keys are begin
* @abstract
* @name Keyboard
* @class Keyboard
* @memberOF ch
* @param event
*/ 

ch.keyboard = function(event) {

	/**
	* Map with references to key codes.
	* @private
	* @name ch.Keyboard#keyCodes
	* @type object
	*/ 
	var keyCodes = {
		"13": "ENTER",
		"27": "ESC",
		"37": "LEFT_ARROW",
		"38": "UP_ARROW",
		"39": "RIGHT_ARROW",
		"40": "DOWN_ARROW",
		 "8": "BACKSPACE"
	};

	if( !ch.utils.hasOwn(keyCodes, event.keyCode) ) return;

	ch.utils.document.trigger(ch.events.KEY[ keyCodes[event.keyCode] ], event);

};
/**
* Manage collections with abstract lists. Create a list of objects, add, get and remove.
* @abstract
* @name List
* @class List
* @standalone
* @memberOf ch
* @param {array} [collection] Constructs a List with an optional initial collection
*/

ch.list = function( collection ) {

	var that = this;

	/**
	* @public
	* @name ch.List#children
	* @type collection
	*/
	var _children = ( collection && ch.utils.isArray( collection ) ) ? collection : [] ;

	/**
	* Seek members inside the collection by index, query string or object comparison.
	* @private
	* @function
	* @name ch.List#_find
	* @param {number} [q]
	* @param {string} [q]
	* @param {object} [q]
	* @param {function} [a]
	* @return object
	*/
	var _find = function(q, a) {
		// null search return the entire collection
		if ( !q ) {
			return _children;
		}

		var c = typeof q;
		// number? return a specific position
		if ( c === "number" ) {
			q--; // _children is a Zero-index based collection
			return ( a ) ? a.call( that , q ) : _children[q] ;
		}
		
		// string? ok, let's find it
		var t = size(), _prop, child;
		if ( c === "string" || c === "object" ) {
			while ( t-- ) {
				child = _children[t];
				// object or string strict equal
				if ( child === q ) {
					return ( a ) ? a.call( that , t ) : child ;
				}
				// if isn't finded yet
				// search inside an object for a string
				for ( _prop in child ) {
					if ( _prop === q || child[_prop] === q ) {
						return ( a ) ? a.call( that , t ) : child ;
					}
				} // end for
			} // end while
		}
	};

	/**
	* Adds a new child (or more) to the collection.
	* @public
	* @function
	* @name ch.List#add
	* @param {string} [child]
	* @param {object} [child]
	* @param {array} [child]
	* @returns number The index of the added child.
	* @returns collection Returns the entire collecction if the input is an array.
	*/
	var add = function( child ) {
		
		if ( ch.utils.isArray( child ) ) {
			var i = 0, t = child.length;
			for ( i; i < t; i++ ) {
				_children.push( child[i] );
			}			
			return _children;
		}
		return _children.push( child );
	};
	
	/**
	* Removes a child from the collection by index, query string or object comparison.
	* @public
	* @function
	* @name ch.List#rem
	* @param {number} [q]
	* @param {string} [q]
	* @param {object} [q]
	* @return {object} Returns the removed element
	*/
	var rem = function( q ) {
		// null search return
		if ( !q ) {
			return that;
		}
		
		var remove = function( t ) {
			return _children.splice( t , 1 )[0];
		}

		return _find( q , remove );

	};

	/**
	* Get a child from the collection by index, query string or object comparison.
	* @public
	* @function
	* @name ch.List#get
	* @param {number} [q] Get a child from the collection by index number.
	* @param {string} [q] Get a child from the collection by a query string.
	* @param {object} [q] Get a child from the collection by comparing objects.
	* @return object
	*/
	var get = function( q ) {

		return _find( q );

	};

	/**
	* Get the amount of children from the collection.
	* @public
	* @function
	* @name ch.List#size
	* @return number
	*/

	var size = function() {
		return _children.length;
	};

	/**
	* @public
	*/
	var that = {
		children: _children,
		add: add,
		rem: rem,
		get: get,
		size: size
	};
	
	return that;
	
};/**
* Execute callback when images of a query selection loads
* @abstract
* @name onImagesLoads
* @class onImagesLoads
* @memberOf ch
* @param array
* @returns jQuery
* @example
* $("img").onImagesLoads(function () { ... });
*/

ch.onImagesLoads = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.onImagesLoads#that
	* @type object
	*/
	var that = this;
	conf = ch.clon(conf);
	that.conf = conf;
	
	that.$element
		// On load event
		.one("load", function () {
			setTimeout(function () {
				if (--that.$element.length <= 0) {
					that.conf.lambda.call(that.$element, this);
				}
			}, 200);
		})
		// For each image
		.each(function () {
			// Cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined) {
				var src = this.src;
				
				// Data uri fix bug in web-kit browsers
				this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
				this.src = src;
			}
		});
	
	return that;
};

ch.factory("onImagesLoads");
/**
* Pre-load is an utility to preload images on browser's memory. An array of sources will iterate and preload each one, a single source will do the same thing.
* @abstract
* @name Preload
* @class Preload
* @standalone
* @memberOf ch
* @param {array} [arr] Collection of image sources
* @param {string} [str] A single image source
* @example
* ch.preload(["img1.jpg","img2.jpg","img3.png"]);
* @example
* ch.preload("logo.jpg");
*/
ch.preload = function(arr) {

	if (typeof arr === "string") {
		arr = (arr.indexOf(",") > 0) ? arr.split(",") : [arr] ;
	}

	for (var i=0;i<arr.length;i++) {

		var o = document.createElement("object");
			o.data = arr[i]; // URL

		var h = document.getElementsByTagName("head")[0];
			h.appendChild(o);
			h.removeChild(o); 
	}
};/**
* Viewport is a reference to position and size of the visible area of browser.
* @abstract
* @name Viewport
* @class Viewport
* @standalone
* @memberOf ch
*/
ch.viewport = {

	/**
	* Width of the visible area.
	* @public
	* @name ch.Viewport#width
	* @type Number
	*/
	"width": ch.utils.window.width(),

	/**
	* Height of the visible area.
	* @public
	* @name ch.Viewport#height
	* @type Number
	*/
	"height": ch.utils.window.height(),

	/**
	* Left offset of the visible area.
	* @public
	* @name ch.Viewport#left
	* @type Number
	*/
	"left": ch.utils.window.scrollLeft(),

	/**
	* Top offset of the visible area.
	* @public
	* @name ch.Viewport#top
	* @type Number
	*/
	"top": ch.utils.window.scrollTop(),

	/**
	* Right offset of the visible area.
	* @public
	* @name ch.Viewport#right
	* @type Number
	*/
	"right": ch.utils.window.scrollLeft() + ch.utils.window.width(),

	/**
	* Bottom offset of the visible area.
	* @public
	* @name ch.Viewport#bottom
	* @type Number
	*/
	"bottom": ch.utils.window.scrollTop() + ch.utils.window.height(),

	/**
	* Element representing the visible area.
	* @public
	* @name ch.Viewport#element
	* @type Object
	*/
	"element": ch.utils.window,

	/**
	* Updates width and height of the visible area and updates ch.viewport.width and ch.viewport.height
	* @public
	* @function
	* @name ch.Viewport#getSize
	* @returns Object
	*/
	"getSize": function () {

		return {
			"width": this.width = ch.utils.window.width(),
			"height": this.height = ch.utils.window.height()
		};

	},

	/**
	* Updates left, top, right and bottom coordinates of the visible area, relative to the window.
	* @public
	* @function
	* @name ch.Viewport#getPosition
	* @returns Object
	*/
	"getPosition": function () {

		var size = this.getSize();

		return {
			"left": 0,
			"top": 0,
			"right": size.width,
			"bottom": size.height,
			// Size is for use as context on Positioner
			// (see getCoordinates method on Positioner)
			"width": size.width,
			"height": size.height
		};
		
	},
	
	/**
	* Updates left, top, right and bottom coordinates of the visible area, relative to the document.
	* @public
	* @function
	* @name ch.Viewport#getOffset
	* @returns Object
	*/
	"getOffset": function () {

		var position = this.getPosition(),
			scrollLeft = ch.utils.window.scrollLeft(),
			scrollTop = ch.utils.window.scrollTop();

		return {
			"left": this.left = scrollLeft,
			"top": this.top = scrollTop,
			"right": this.right = scrollLeft + position.right,
			"bottom": this.bottom = scrollTop + position.bottom
		};
		
	}
};/**
* AutoComplete is a UI-Component.
* @name AutoComplete
* @class AutoComplete
* @augments ch.Controls
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.url] The url pointing to the suggestions's service.
* @param {String} [conf.message] It represent the text when no options are shown.
* @param {Array} [conf.suggestions] The list of suggestions. Use it when you don't have server side suggestions service. Don't use conf.url with this option.
* @returns itself
* @example
* // Create a new autoComplete with configuration.
* var me = $(".example").autoComplete({
*     "url": "http://site.com/mySuggestions?q=",
*     "message": "Write..."
* });
*/
 
ch.autoComplete = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.AutoComplete#that
	* @type object
	*/
	var that = this;
		
	conf = ch.clon(conf);
	conf.icon = false;
	conf.type = "autoComplete";
	conf.message = conf.message || "Please write to be suggested";
	conf.suggestions = conf.suggestions;
	conf.jsonpCallback = conf.jsonpCallback || "autoComplete";
	
	that.conf = conf;
		
/**
*	Inheritance
*/
	
	that = ch.controls.call(that);
	that.parent = ch.clon(that);
	
/**
*  Private Members
*/

	/**
	* Select an item.
	* @private
	* @type Function
	* @name ch.AutoComplete#selectItem
	*/
	var selectItem = function (arrow, event) {
		that.prevent(event);

		if (that.selected === (arrow === "bottom" ? that.items.length - 1 : 0)) { return; }
		$(that.items[that.selected]).removeClass("ch-autoComplete-selected");
		
		if (arrow === "bottom") { that.selected += 1; } else { that.selected -= 1; }
		$(that.items[that.selected]).addClass("ch-autoComplete-selected");
	};

/**
*  Protected Members
*/

	/**
	* The number of the selected item.
	* @protected
	* @type Number
	* @name ch.AutoComplete#selected
	*/
	that.selected = -1;

	/**
	* List of the shown suggestions.
	* @protected
	* @type Array
	* @name ch.AutoComplete#suggestions
	*/
	that.suggestions = that.conf.suggestions;

	/**
	* The input where the AutoComplete works.
	* @protected
	* @type jQuery
	* @name ch.AutoComplete#$trigger
	*/
	//that.$trigger = that.$element.addClass("ch-" + that.type + "-trigger");

	/**
	* Inner reference to content container. Here is where the content will be added.
	* @protected
	* @type jQuery
	* @name ch.AutoComplete#$content
	*/
	that.$content = $("<ul class=\"ch-autoComplete-list\"></ul>");

	/**
	* It has the items loaded.
	* @protected
	* @type Boolean
	* @name ch.AutoComplete#populateContent
	*/
	that.behaviorActived = false;

	/**
	* It has the items loaded.
	* @protected
	* @type Array
	* @name ch.AutoComplete#populateContent
	*/
	that.items = [];
	
	/**
	* Reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.AutoComplete#float
	*/
	that["float"] = that.createFloat({
		"content": that.$content,
		"points": conf.points,
		"closeButton": false,
		"points": "lt lb",
		"cache": false,
		"closeHandler": "button",
		"aria": {
			"role": "tooltip",
			"identifier": "aria-describedby"
		},
		"width": that.$element.outerWidth() + "px"
	});

	/**
	* It fills the content inside the element represented by the float.
	* @protected
	* @type Function
	* @name ch.AutoComplete#populateContent
	*/
	that.populateContent = function (event,result) {
		// No results doesn't anything
		if(result.length===0){return that;}
		// Only one result and the same as the input hide float and doesn't anything
		if(result.length===1 && result[0]===that.element.value){that.float.innerHide();return that;}

		var list = "";
		$.each(result, function (i, e) {
			list+="<li data-index=\""+i+"\">"+e+"</li>";
		})

		that.$content.html(list);
		that.selected = -1;
		that["float"].content(that.$content);
		that.items = that.$content.children();
		// Adds only once the behavior
		if(!that.behaviorActived){
			that.suggestionsBehavior(event);
			that.behaviorActived = true;
		}
		return that;
	}

	/**
	* It does the query to the server if configured an URL, or it does the query inside the array given.
	* @protected
	* @type Function
	* @name ch.AutoComplete#doQuery
	*/
	that.doQuery = function(event){
		var q = that.$element.val().toLowerCase();
		// When URL is configured it will execute an ajax request.
		if(that.element.value !== "" && event.keyCode !== 38 && event.keyCode !== 40  && event.keyCode !== 13  && event.keyCode !== 27) {
			if (that.conf.url !== undefined) {
				var result = $.ajax({
					url: that.conf.url + q,
					dataType:"jsonp",
					jsonpCallback:that.conf.jsonpCallback,
					crossDomain:true,
					success: function(data){}
				});
			// When not URL configured and suggestions array were configured it search inside the suggestions array.
			} else if (that.conf.url === undefined) {
				var result = [];
				for(var a=(that.suggestions.length-1);(a+1);a--){
					var word = that.suggestions[a].toLowerCase();
					var exist = word.search(q);
					if(!exist){
						result.push(that.suggestions[a]);
					}
				};
				that.populateContent(result);
			}
		}
		return that;
	}

	/**
	* Binds the behavior related to the list.
	* @protected
	* @type Function
	* @name ch.AutoComplete#suggestionsBehavior
	*/
	that.suggestionsBehavior = function(event){
		// BACKSPACE key bheavior. When backspace go to the start show the message
		ch.utils.document.on(ch.events.KEY.BACKSPACE, function (x, event) { 
			// When isn't any letter it hides the float
			if(that.element.value.length===1){
				that.float.innerHide();
			}
			// When the user make backspace with empty input autocomplete is shutting off
			if(that.element.value.length===0){
				that.prevent(event);
				that.$element.trigger("blur");
			} 
		})
		// ESC key behavior, it closes the suggestions's list 
		.on(ch.events.KEY.ESC, function (x, event) { that.$element.trigger("blur"); })
		// ENTER key behavior, it selects the item who is selected
		.on(ch.events.KEY.ENTER, function (x, event) { that.$element.val($(that.items[that.selected]).text()); that.$element.trigger("blur"); })
		// UP ARROW key behavior, it selects the previous item
		.on(ch.events.KEY.UP_ARROW, function (x, event) { selectItem("up", event); })
		// DOWN ARROW key behavior, it selects the next item
		.on(ch.events.KEY.DOWN_ARROW, function (x, event) { selectItem("bottom", event); });
		// MouseOver & MouseDown Behavior
		that.float.$content.on("mouseover mousedown",function(evt){
			var event = evt || window.event;
			var target = event.target || event.srcElement;
			var type = event.type;
			if(target.tagName === "LI"){
				// mouse over behavior
				if(type === "mouseover"){
					// removes the class if one is selected
					$(that.items[that.selected]).removeClass("ch-autoComplete-selected");
					// selects the correct item
					that.selected = parseInt(target.getAttribute("data-index"));
					// adds the class to highlight the item
					$(that.items[that.selected]).addClass("ch-autoComplete-selected");	
				} 
				// mouse down behavior
				if(type === "mousedown") {
					that.prevent(event);
					that.$element.val($(that.items[that.selected]).text());
					that.$element.trigger("blur");
				}		
			}
		});
	}

	/**
	* Internal show method. It adds the behavior.
	* @protected
	* @type Function
	* @name ch.AutoComplete#show
	*/
	that.show = function(event){
		var query = that.element.value;
		that.doQuery(event);
		// Global keyup behavior
		ch.utils.document.on("keyup", function (event) {that.doQuery(event); that.float.innerShow(); });
		that.$content.html("");
		if(query!==""){that.float.innerShow();}
		return that;
	}

	/**
	* Internal hide method. It removes the behavior.
	* @protected
	* @type Function
	* @name ch.AutoComplete#hide
	*/
	that.hide = function(event){
		that.behaviorActived = false;
		that.$content.off("mouseover mousedown");
		ch.utils.document.off("keyup " + ch.events.KEY.ENTER + " " + ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW + " " + ch.events.KEY.BACKSPACE);
		that["float"].innerHide();
		return that;
	}

	/**
	* It gives the main behavior(focus, blur and turn off autocomplete attribute) to the $trigger.
	* @protected
	* @type Function
	* @name ch.AutoComplete#configBehavior
	*/
	that.configBehavior = function () {
		that.$element
			.bind("focus", function (event) { 				
				that.show(event);
			})
			.bind("blur", function (event) { 
				that.hide(event);
			})
			.attr("autocomplete","off")
			.addClass("ch-" + that.type + "-trigger");
		return that;
	};

/**
*  Public Members
*/
 
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.AutoComplete#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.AutoComplete#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.AutoComplete#type
	* @type string
	*/
	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.AutoComplete#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.show();
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.AutoComplete#hide
	* @returns itself
	*/	
	that["public"].hide = function(){
		that.hide(ch.events.KEY.ESC);
		return that["public"];
	};

	/**
	* Add suggestions to be shown.
	* @public
	* @function
	* @name ch.AutoComplete#suggest
	* @returns itself
	*/	
	that["public"].suggest = function(data){
		that.suggestions = data;
		that.populateContent(window.event,that.suggestions);
		return that["public"];
	};

	
	//Fills the Float with the message.
	//that.populateContent([that.conf.message]);

/**
*  Default event delegation
*/	
	that.configBehavior();
	
	/*that.float.on("ready", function () {
		that.float["public"].width((that.$element.outerWidth()));
	});*/
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.AutoComplete#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as autoComplete's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("autoComplete");/** 
* Blink is a UI feedback utility. It creates a visual highlight changing background color from yellow to white.
* @function
* @name Blink
* @class Blink
* @memberOf ch
* @param {Object} conf Configuration object
* @param {number} [conf.time] Amount of time to blink in milliseconds
* @returns jQuery
*/
ch.blink = function (conf) {

	var that = this,
		// Hex start level toString(16).
		level = 1, 
		// Time, 200 miliseconds by default.
		t = conf.time || 200,
		// Inner highlighter.
		highlight = function (e) {
			// Let know everyone we are active.
			that.$element.addClass("ch-active").attr("role","alert").attr("aria-live","polite");
			// Color iteration.
			function step () {
				// New hex level.
				var h = level.toString(16);
				// Change background-color, redraw().
				e.style.backgroundColor = '#FFFF' + h + h;
				// Itearate for all hex levels.
				if (level < 15) {
					// Increment hex level.
					level += 1;
					// Inner recursion.
					setTimeout(step, t);
				} else {
					// Stop right there...
					that.$element.removeClass("ch-active").attr("aria-live","off").removeAttr("role");
				}
			};
		// Begin steps.
		setTimeout(step, t);
	}
	// Start a blink if the element isn't active.
	if (!that.$element.hasClass("ch-active")) {
		highlight(that.element);
	}
	// Return the element so keep chaining things.
	return that.$element;
}
ch.factory("blink");/**
* Is a UI Widget for show dates.
* @name Calendar
* @class Calendar
* @augments ch.Uiobject
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.format] Sets the date format. By default is "DD/MM/YYYY".
* @param {String} [conf.selected] Sets a date that should be selected by default. By default is the date of today.
* @param {String} [conf.from] Set a maximum selectable date.
* @param {String} [conf.to] Set a minimum selectable date.
* @param {String} [conf.points] Points to be positioned. See Positioner component. By default is "ct cb".
* @param {Array} [conf.monthsNames] By default is ["Enero", ... , "Diciembre"].
* @param {Array} [conf.weekdays] By default is ["Dom", ... , "Sab"].
* @returns itself
* @example
* // Create a new Calendar with configuration.
* var me = $(".example").calendar({
*	 "format": "MM/DD/YYYY",
*	 "selected": "2011/12/25",
*	 "from": "2010/12/25",
*	 "to": "2012/12/25",
*	 "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
*	 "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
* });
* @example
* // Create a new Calendar with a class name 'example'.
* var me = $(".example").calendar();
*/

ch.calendar = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Calendar#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	
	// Format by default
	conf.format = conf.format || "DD/MM/YYYY";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Collection of months names.
	* @private
	* @name ch.Calendar#MONTHS_NAMES
	* @type Array
	*/
	//TODO: Default language should be English and then sniff browser language or something
	var MONTHS_NAMES = conf.monthsNames || ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

	/**
	* Collection of weekdays (short names).
	* @private
	* @name ch.Calendar#DAYS_SHORTNAMES
	* @type Array
	*/
	//TODO: Default language should be English and then sniff browser language
		DAYS_SHORTNAMES = conf.weekdays || ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],

	/**
	* Creates a JSON Object with reference to day, month and year, from a determinated date.
	* @private
	* @name ch.Calendar#createDateObject
	* @function
	* @param date
	* @returns Object
	*/
		createDateObject = function (date) {

			// Uses date parameter or create a date from today
			date = (date) ? new Date(date) : new Date();

			return {
				/**
				* Number of day.
				* @private
				* @name day
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"day": date.getDate(),

				/**
				* Order of day in a week.
				* @private
				* @name order
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"order": date.getDay(),

				/**
				* Number of month.
				* @private
				* @name month
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"month": date.getMonth() + 1,

				/**
				* Number of full year.
				* @private
				* @name year
				* @type Number
				* @memberOf ch.Calendar#createDateObject
				*/
				"year": date.getFullYear()
			};

		},

	// Today's date object
		today = createDateObject(),

	// Minimum selectable date
		from = (function () {

			// Only works when there are a "from" parameter on configuration
			if (!ch.utils.hasOwn(conf, "from") || !conf.from) { return; }

			// Return date object
			return (conf.from === "today") ? today : createDateObject(conf.from);

		}()),

	// Maximum selectable date
		to = (function () {

			// Only works when there are a "to" parameter on configuration
			if (!ch.utils.hasOwn(conf, "to") || !conf.to) { return; }

			// Return date object
			return (conf.from === "today") ? today : createDateObject(conf.to);

		}()),

	/**
	* Parse string to YYYY/MM/DD or DD/MM/YYYY format date.
	* @private
	* @function
	* @name ch.Calendar#parseDate
	* @param value {String} The date to be parsed.
	*/
		parseDate = function (value) {

			// Splitted string
			value = value.split("/");

			// Date to be returned
			var result = [];

			// Parse date
			switch (conf.format) {
				case "DD/MM/YYYY":
					result.push(value[2], value[1], value[0]);
					break;
				case "MM/DD/YYYY":
					result.push(value[2], value[0], value[1]);
					break;
			}

			return result.join("/");
		},
	
	/**
	* The current date that should be shown on Calendar.
	* @private
	* @name ch.Calendar#currentDate
	* @type Object
	*/
		currentDate = today,
	
	/**
	* Sets the date object of selected day.
	* @private
	* @name ch.Calendar#selected
	* @type Object
	*/
		setSelected = function () {
			
			// Get date from configuration or input value
			var sel = conf.selected || conf.msg;
			
			// Do it only if there are a "selected" parameter
			if (!sel) { return; }
			
			// Simple date selection
			if (!ch.utils.isArray(sel)) {

				// Return date object and update currentDate
				return (sel !== "today") ? currentDate = createDateObject(sel) : today;
				
			// Multiple date selection
			} else {
				$.each(sel, function (i, e) {
					// Simple date
					if (!ch.utils.isArray(e)) {
						sel[i] = (sel[i] !== "today") ? createDateObject(e) : today;
					// Range
					} else {
						sel[i][0] = (sel[i][0] !== "today") ? createDateObject(e[0]) : today;
						sel[i][1] = (sel[i][1] !== "today") ? createDateObject(e[1]) : today;
					}
				});
				
				return sel;
			}
		},
		
	/**
	* Date of selected day.
	* @private
	* @name ch.Calendar#selected
	* @type Object
	*/
		selected = setSelected(),

	/**
	* Indicates if an specific date is selected or not (including date ranges and simple dates).
	* @private
	* @name ch.Calendar#isSelectable
	* @function
	* @param year
	* @param month
	* @param day
	* @return Boolean
	*/
		isSelectable = function (year, month, day) {
			
			if (!selected) { return; }
			
			var yepnope = false;
			
			// Simple selection
			if (!ch.utils.isArray(selected)) {
				if (year === selected.year && month === selected.month && day === selected.day) {
					return yepnope = true;
				}
			// Multiple selection (ranges)
			} else {
				$.each(selected, function (i, e) {
					// Simple date
					if (!ch.utils.isArray(e)) {
						if (year === e.year && month === e.month && day === e.day) {
							return yepnope = true;
						}
					// Range
					} else {
						if (
							(year >= e[0].year && month >= e[0].month && day >= e[0].day) &&
							(year <= e[1].year && month <= e[1].month && day <= e[1].day)
						) {
							return yepnope = true;
						}
					}
				});
			}
			
			return yepnope;
		},

	/**
	* Thead tag, including ARIA and cells with each weekday name.
	* @private
	* @name ch.Calendar#thead
	* @type String
	*/
		thead = (function () {

			// Create thead structure
			var t = ["<thead><tr role=\"row\">"];

			// Add week names
			for (var i = 0; i < 7; i += 1) {
				t.push("<th role=\"columnheader\">" + DAYS_SHORTNAMES[i] + "</th>");
			};

			// Close thead structure
			t.push("</tr></thead>");

			// Join structure and return
			return t.join("");

		}()),

	/**
	* Creates a complete month in a table.
	* @private
	* @function
	* @name ch.Calendar#createTable
	* @param date {Object} Date from will be created the entire month.
	* @return jQuery Object
	*/
		createTable = function (date) {

			// Total amount of days into month
			var cells = (function () {

				// Amount of days of current month
				var currentMonth = new Date(date.year, date.month, 0).getDate(),

				// Amount of days of previous month
					prevMonth = new Date([date.year, date.month, "01"].join("/")).getDay(),

				// Merge amount of previous and current month
					subtotal = prevMonth + currentMonth,

				// Amount of days into last week of month
					latest = subtotal % 7,

				// Amount of days of next month
					nextMonth = (latest > 0) ? 7 - latest : 0;

				return {
					"previous": prevMonth,
					"subtotal": subtotal,
					"total": subtotal + nextMonth
				};

			}()),

			// Final array with month table structure
				r = [
					"<table class=\"ch-calendar-month ch-datagrid\" role=\"grid\" id=\"ch-calendar-grid-" + that.uid + "\">",
					"<caption>" + MONTHS_NAMES[date.month - 1] + " - " + date.year + "</caption>",
					thead,
					"<tbody>",
					"<tr class=\"week\" role=\"row\">"
				];

			// Iteration of weekdays
			for (var i = 0; i < cells.total; i += 1) {

				// Push an empty cell on previous and next month
				if (i < cells.previous || i > cells.subtotal - 1) {
					r.push("<td role=\"gridcell\" class=\"ch-calendar-other\">X</td>");
					continue;
				}

				// Positive number of iteration
				var positive = i + 1,

				// Day number
					day = positive - cells.previous,

				// Define if it's the day selected
					isSelected = isSelectable(date.year, date.month, day);

				// Create cell
				r.push(
					// Open cell structure including WAI-ARIA and classnames space opening
					"<td role=\"gridcell\"" + (isSelected ? " aria-selected=\"true\"" : "") + " class=\"ch-calendar-day",

					// Add Today classname if it's necesary
					(date.year === today.year && date.month === today.month && day === today.day) ? " ch-calendar-today" : null,

					// Add Selected classname if it's necesary
					(isSelected ? " ch-calendar-selected" : null),

					// From/to range. Disabling cells
					(
						// Disable cell if it's out of FROM range
						(from && day < from.day && date.month === from.month && date.year === from.year) ||

						// Disable cell if it's out of TO range
						(to && day > to.day && date.month === to.month && date.year === to.year)

					) ? " ch-disabled" : null,

					// Close classnames attribute and print content closing cell structure
					"\">" + day + "</td>"
				);

				// Cut week if there are seven days
				if (positive % 7 === 0) {
					r.push("</tr><tr class=\"ch-calendar-week\" role=\"row\">");
				}

			};

			// Return table object
			return r.join("");

		},

	/**
	* Handles behavior of arrows to move around months.
	* @private
	* @name ch.Calendar#arrows
	* @type Object
	*/
		arrows = {

			/**
			* Handles behavior of previous arrow to move back in months.
			* @private
			* @name $prev
			* @memberOf ch.Calendar#arrows
			* @type Object
			*/
			"$prev": $("<p class=\"ch-calendar-prev\" aria-controls=\"ch-calendar-grid-" + that.uid + "\" aria-hidden=\"false\"><span>Previous month</span></p>").bind("click", function (event) { that.prevent(event); prevMonth(); }),

			/**
			* Handles behavior of next arrow to move forward in months.
			* @private
			* @name $next
			* @memberOf ch.Calendar#arrows
			* @type Object
			*/
			"$next": $("<p class=\"ch-calendar-next\" aria-controls=\"ch-calendar-grid-" + that.uid + "\" aria-hidden=\"false\"><span>Next month</span></p>").bind("click", function (event) { that.prevent(event); nextMonth(); }),

			/**
			* Refresh arrows visibility depending on "from" and "to" limits.
			* @private
			* @name update
			* @memberOf ch.Calendar#arrows
			* @function
			*/
			"update": function () {

				// "From" limit
				if (from) {
					// Hide previous arrow when it's out of limit
					if (from.month >= currentDate.month && from.year >= currentDate.year) {
						arrows.$prev.addClass("ch-hide").attr("aria-hidden", "true");
					// Show previous arrow when it's out of limit
					} else {
						arrows.$prev.removeClass("ch-hide").attr("aria-hidden", "false");
					}
				}

				// "To" limit
				if (to) {
					// Hide next arrow when it's out of limit
					if (to.month <= currentDate.month && to.year <= currentDate.year) {
						arrows.$next.addClass("ch-hide").attr("aria-hidden", "true");
					// Show next arrow when it's out of limit
					} else {
						arrows.$next.removeClass("ch-hide").attr("aria-hidden", "false");
					}
				}
			}
		},

	/**
	* Completes with zero the numbers less than 10.
	* @private
	* @name ch.Calendar#addZero
	* @function
	* @param num Number
	* @returns String
	*/
		addZero = function (num) {
			return (parseInt(num, 10) < 10) ? "0" + num : num;
		},

	/**
	* Map of date formats.
	* @private
	* @name ch.Calendar#FORMAT_DATE
	* @type Object
	*/
		FORMAT_DATE = {

			"YYYY/MM/DD": function (date) {
				return [date.year, addZero(date.month), addZero(date.day)].join("/");
			},

			"DD/MM/YYYY": function (date) {
				return [addZero(date.day), addZero(date.month), date.year].join("/");
			},

			"MM/DD/YYYY": function (date) {
				return [addZero(date.month), addZero(date.day), date.year].join("/");
			}

		},

	/**
	* Refresh the structure of Calendar's table with a new date.
	* @private
	* @function
	* @name ch.Calendar#updateTable
	* @param date {String} Date to be selected.
	*/
		updateTable = function (date) {

			// Update "currentDate" object
			currentDate = (typeof date === "string") ? createDateObject(date) : date;

			// Delete old table
			that.$element.children("table").remove();

			// Append new table to content
			that.$element.append(createTable(currentDate));

			// Refresh arrows
			arrows.update();

		},

	/**
	* Selects an specific date to show.
	* @private
	* @function
	* @name ch.Calendar#select
	* @param date {Date} Date to be selected.
	* @return itself
	*/
	// TODO: Check "from" and "to" range
		select = function (date) {

			// Update selected date
			selected = date;

			// Create a new table of selected month
			updateTable(selected);

			/**
			* Callback function
			* @public
			* @name ch.Calendar#select
			* @event
			*/
			// Old callback system
			that.callbacks("onSelect");
			// New callback
			that.trigger("select");

			return that;
		},

	/**
	* Move to next month of Calendar.
	* @private
	* @function
	* @name ch.Calendar#nextMonth
	* @return itself
	*/
		nextMonth = function () {

			// Next year
			if (currentDate.month === 12) {
				currentDate.month = 0;
				currentDate.year += 1;
			}

			// Create a new table of selected month
			updateTable([currentDate.year, currentDate.month + 1, "01"].join("/"));

			/**
			* Callback function
			* @public
			* @name ch.Calendar#nextMonth
			* @event
			*/
			// Callback
			that.callbacks("onNextMonth");
			// New callback
			that.trigger("nextMonth");

			return that;
		},

	/**
	* Move to previous month of Calendar.
	* @private
	* @function
	* @name ch.Calendar#prevMonth
	* @return itself
	*/
		prevMonth = function () {

			// Previous year
			if (currentDate.month === 1) {
				currentDate.month = 13;
				currentDate.year -= 1;
			}

			// Create a new table of selected month
			updateTable([currentDate.year, currentDate.month - 1, "01"].join("/"));

			/**
			* Callback function
			* @public
			* @name ch.Calendar#prevMonth
			* @event
			*/
			// Callback
			that.callbacks("onPrevMonth");
			// New callback
			that.trigger("prevMonth");

			return that;
		},

	/**
	* Move to next year of Calendar.
	* @private
	* @function
	* @name ch.Calendar#nextYear
	* @return itself
	*/
		nextYear = function () {

			// Create a new table of selected month
			updateTable([currentDate.year + 1, currentDate.month, "01"].join("/"));

			/**
			* Callback function
			* @public
			* @name ch.Calendar#nextYear
			* @event
			*/
			// Callback
			that.callbacks("onNextYear");
			// New callback
			that.trigger("nextYear");

			return that;
		},

	/**
	* Move to previous year of Calendar.
	* @private
	* @function
	* @name ch.Calendar#prevYear
	* @return itself
	*/
		prevYear = function () {

			// Create a new table of selected month
			updateTable([currentDate.year - 1, currentDate.month, "01"].join("/"));

			/**
			* Callback function
			* @public
			* @name ch.Calendar#prevYear
			* @event
			*/
			// Callback
			that.callbacks("onPrevYear");
			// New callback
			that.trigger("prevYear");

			return that;
		};


/**
*  Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Calendar#uid
	* @type Number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Calendar#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Calendar#type
	* @type String
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Calendar#show
	* @returns itself
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/
	that["public"].show = function () {
		that["float"].show();

		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Calendar#hide
	* @returns itself
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	that["public"].hide = function () {
		that["float"].hide();

		return that["public"];
	};

	/**
	* Select a specific date or returns the selected date.
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#select
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].select = function (date) {

		// Getter
		if (!date) { return FORMAT_DATE[conf.format](selected); }

		// Setter
		select((date === "today") ? today : createDateObject(parseDate(date)));

		return that["public"];

	};
	
	/**
	* Select a specific day into current month and year.
	* @public
	* @since 0.10.1
	* @function
	* @name ch.Calendar#selectDay
	* @param {string || number}
	* @return {string} New selected date.
	*/
	that["public"].selectDay = function (day) {

		var date = createDateObject([currentDate.year, currentDate.month, day].join("/"));
		
		select(date);

		return FORMAT_DATE[conf.format](date);

	};

	/**
	* Returns date of today
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#today
	* @return date
	*/
	that["public"].today = function () {
		return FORMAT_DATE[conf.format](today);
	};

	/**
	* Move to the next month or year. If it isn't specified, it will be moved to next month.
	* @public
	* @name ch.Calendar#next
	* @function
	* @param {String} time A string that allows specify if it should move to next month or year.
	* @return {itself}
	* @default Next month
	*/
	that["public"].next = function (time) {

		switch (time) {
			case "month":
			case undefined:
			default:
				nextMonth();
				break;
			case "year":
				nextYear();
				break;
		}

		return that["public"];
	};

	/**
	* Move to the previous month or year. If it isn't specified, it will be moved to previous month.
	* @public
	* @function
	* @param {String} time A string that allows specify if it should move to previous month or year.
	* @return {itself}
	* @default Previous month
	*/
	that["public"].prev = function (time) {

		switch (time) {
			case "month":
			case undefined:
			default:
				prevMonth();
				break;
			case "year":
				prevYear();
				break;
		}

		return that["public"];
	};

	/**
	* Reset the Calendar to date of today
	* @public
	* @function
	* @name ch.Calendar#reset
	* @return itself
	*/
	that["public"].reset = function () {
		reset();

		return that["public"];
	};

	/**
	* Set a minimum selectable date.
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#from
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].from = function (date) {
		from = createDateObject(date);
		return that["public"];
	};

	/**
	* Set a maximum selectable date.
	* @public
	* @since 0.9
	* @function
	* @name ch.Calendar#to
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].to = function (date) {
		to = createDateObject(date);
		return that["public"];
	};

/**
*	Default event delegation
*/

	// Show or hide arrows depending on "from" and "to" limits
	arrows.update();
	
	// General creation: classname + arrows + table of month
	that.$element
		.addClass("ch-calendar")
		.prepend(arrows.$prev)
		.prepend(arrows.$next)
		.append(createTable(currentDate));
	
	// Avoid selection on the component
	ch.utils.avoidTextSelection(that.$element);

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Calendar#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as Calendar's instance controller:
	* me.on("ready", function () {
	* 	this.show();
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("calendar");/**
* Carousel is a large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
* @name Carousel
* @class Carousel
* @augments ch.Uiobject
* @requires ch.List
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is elastic.
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the value is the <li> element height.
* @param {Boolean} [conf.pagination] Shows a pagination. By default, the value is false.
* @param {Boolean} [conf.arrows] Shows arrows icons to move over the pages. By default, the value is true.
* @param {Array} [conf.asyncData] Defines the content of each item that will be load asnchronously as array.
* @param {Function} [conf.asyncRender] The function that receives asyncData content and must return a string with result of manipulate that content.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @returns itself
* @example
* // Create a new expando with some configuration.
* var me = $(".example").carousel({
*     "width": 500,
*     "height": "200px",
*     "pagination": true,
*     "arrows": false,
*     "asyncData": [
*         {src: 'a.png', alt: 'A'},
*         {src: 'b.png', alt: 'B'},
*         {src: 'c.png', alt: 'C'}
*     ],
*     "asyncRender": function (data) {
*         return '<img src="' + data.src + '" alt="' + data.alt + '"/>';
*     },
*     "fx": false
* });
* @example
* // Create a new expando without configuration.
* var me = $(".example").carousel();
*/

ch.carousel = function (conf) {
	
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Carousel#that
	* @type Object
	*/
	var that = this;
	
	conf = ch.clon(conf);
	
	// Configurable pagination
	// TODO: Add support to goTo function on asynchronous item load.
	conf.pagination = (!ch.utils.hasOwn(conf, "asyncData") ? conf.pagination : false) || false;
	
	// Configuration for continue Carousel
	// TODO: Rolling is forced to be false. Use this: conf.rolling = (ch.utils.hasOwn(conf, "rolling")) ? conf.rolling : true;
	conf.rolling = false;
	
	// Configurable arrows
	conf.arrows = ch.utils.hasOwn(conf, "arrows") ? conf.arrows : true;
	
	// Configurable efects
	conf.fx = ch.utils.hasOwn(conf, "fx") ? conf.fx : true;
	
	that.conf = conf;
	
/**
*  Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/
	
	/**
	* Does what is necessary to make ready the component structure.
	* @private
	* @name ch.Carousel#createLayout
	* @function
	*/
	var createLayout = function () {
		
		// Add class to component to support old HTML snippet
		that.$element.addClass("ch-carousel");
		
		// Calculate extra width for content
		extraWidth = (ch.utils.html.hasClass("ie6")) ? that.itemsWidth : 0;
		
		// Set width to Carousel if exists a width in configuration
		if (ch.utils.hasOwn(conf, "width")) { that.$element.css("width", conf.width); }
		
		// Set height to Carousel if exists a height in configuration
		if (ch.utils.hasOwn(conf, "height")) { that.$element.css("height", conf.height); }
		
		// Disable CSS transition if it's specified
		if (!conf.fx && ch.features.transition) { that.$content.addClass("ch-carousel-nofx"); }
		
		// Set container size based on items size
		that.$mask.css("height", that.$items.outerHeight());
		
		// WAI-ARIA for items
		$.each(that.$items, function (i, e) {
			
			// Page where this item is in
			var page = ~~(i / that.itemsPerPage) + 1;
			
			$(e).attr({
				"aria-hidden": page !== that.currentPage,
				"aria-setsize": that.itemsTotal,
				"aria-posinset": i + 1,
				"aria-label": "page" + page
			});
		});
		
		// Total amount of items (Widthout include queue items)
		var itemsAmount = that.$items.length;
		
		// At the begin, add items from queue if page is incomplete
		if (ch.utils.hasOwn(conf, "asyncData") && itemsAmount < that.itemsPerPage) {
			that.addItems(that.itemsPerPage - itemsAmount);
		}
	},
	
	/**
	* Creates Previous and Next arrows.
	* @private
	* @function
	* @name ch.Carousel#createArrows
	*/
		createArrows = function () {
			
			// Previous arrow
			var $prev = $("<p class=\"ch-prev-arrow" + (conf.rolling ? "" : " ch-hide") + "\" role=\"button\" aria-hidden=\"" + (!conf.rolling) + "\"><span>Previous</span></p>")
				.bind("click", that.prev)
				.prependTo(that.$element),
			
			// Next arrow
				$next = $("<p class=\"ch-next-arrow\" role=\"button\" aria-hidden=\"false\"><span>Next</span></p>")
				.bind("click", that.next)
				.appendTo(that.$element);
			
			// Positions arrows vertically in middle of Carousel
			$prev[0].style.top = $next[0].style.top = (that.$element.outerHeight() - $prev.outerHeight()) / 2 + "px";
			
			/**
			* Manages arrows turning it on and off when non-continue Carousel is moving.
			* @protected
			* @function
			* @name ch.Carousel#manageArrows
			* @param {Number} page Page to be moved.
			*/
			that.manageArrows = function (page) {
				// Case 1: Both arrows shown on Carousel's middle
				if (page > 1 && page < that.pages) {
					$prev.attr("aria-hidden", "false").removeClass("ch-hide");
					$next.attr("aria-hidden", "false").removeClass("ch-hide");
				} else {
				// Case 2: Previous arrow hidden on first page
					if (page === 1) {
						$prev.addClass("ch-hide").attr("aria-hidden", "true");
						$next.attr("aria-hidden", "false").removeClass("ch-hide");
				// Case 3: Next arrow hidden on last page
					} else if (page === that.pages) {
						$prev.attr("aria-hidden", "false").removeClass("ch-hide");
						$next.addClass("ch-hide").attr("aria-hidden", "true");
					}
				}
			};
		},
	
	/**
	* Creates Carousel pagination.
	* @private
	* @function
	* @name ch.Carousel#createPagination
	*/
	// TODO: Re-create pagination only if amount of pages change. Else, re-position it.
		createPagination = function () {
			
			// Create a element List for new pagination
			var $pagination = $("<ul class=\"ch-carousel-pages ch-hide\" role=\"tablist\">"),
			
			// Each page into list element
				$thumbnails;
	
			// Create each mini thumbnail an append to list
			for (var i = 1; i <= that.pages; i += 1) {
				
				// Mark as active if thumbnail is the same that current page
				var status = (i === that.currentPage) ? " class=\"ch-carousel-pages-on\" aria-selected=\"true\"" : " aria-selected=\"false\"",
				
				// Thumbnail with closure
					$thumb = $("<li" + status + " role=\"tab\" aria-controls=\"page" + i + "\">" + i + "</li>")
						.bind("click", function (i) {
							return function () {
								that.goTo(i);
							};
						}(i));
				
				$pagination.append($thumb);
			};
			
			// Append list to Carousel
			that.$element.append($pagination);
			
			// Positions list
			$pagination.css("left", (that.$element.outerWidth() - $pagination.outerWidth()) / 2).removeClass("ch-hide");
			
			// Set pagination children as thumbnails
			$thumbnails = $pagination.children();
			
			/**
			* Removes the active status classname of last selected page and adds it to the selected page.
			* @protected
			* @function
			* @name ch.Carousel#managePagination
			* @param {Number} page Page to be moved.
			*/
			that.managePagination = function (page) {
				$thumbnails.eq(that.currentPage - 1).removeClass("ch-carousel-pages-on").attr("aria-selected", "false");
				$thumbnails.eq(page - 1).addClass("ch-carousel-pages-on").attr("aria-selected", "true");
			};
		},
	
	/**
	* Calculates items amount on each page.
	* @protected
	* @function
	*/
		getItemsPerPage = function () {
			// Space to be distributed among all items
			var widthDiff = that.$mask.outerWidth() - that.itemsWidth;
			
			// If there are space to be distributed, calculate pages
			return that.itemsPerPage = (widthDiff > that.itemsWidth) ? ~~(widthDiff / that.itemsWidth) : 1;
		},
	
	/**
	* Calculates total amount of pages.
	* @private
	* @function
	* @name ch.Carousel#getPages
	* @returns {Number} Total amount of pages
	*/
		getPages = function () {
			// (Total amount of items) / (items amount on each page)
			// TODO: $coll.children =? that.$items.length
			return that.pages = Math.ceil(that.itemsTotal / that.itemsPerPage);
		},

	/**
	* Calculates all necesary data to draw Carousel correctly.
	* @private
	* @function
	* @name ch.Carousel#draw
	*/
		draw = function () {
			
			// Reset size of carousel mask
			maskWidth = that.$mask.outerWidth();
			
			// Recalculate items amount on each page
			getItemsPerPage();
			
			// Recalculate total amount of pages
			getPages();
			
			// Calculate variable margin between each item
			that.itemsMargin = Math.ceil(((maskWidth - (that.itemsWidth * that.itemsPerPage)) / that.itemsPerPage) / 2);
			
			// Modify sizes only if new items margin are positive numbers
			if (that.itemsMargin < 0) { return; }
			
			// Detach content from DOM for make a few changes
			that.$content.detach();
			
			// Move Carousel to first page for reset initial position
			that.goTo(1);
			
			// Save rendered items amount
			var i = that.$items.length;
			
			// Set new margin to all items
			while (i) {
				that.$items[i -= 1].style.marginLeft = that.$items[i].style.marginRight = that.itemsMargin + "px";
			}
			
			// Change content size and append it to DOM again
			// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
			that.$content
				.css("width", (that.itemsWidth + that.itemsMargin * 2) * that.$items.length + extraWidth)
				.appendTo(that.$mask);
			
			// Manage Previous and Next arrows
			if (conf.arrows) {
				// Deletes pagination if already exists
				that.$element.find(".ch-prev-arrow, .ch-next-arrow").remove();
				
				// Creates updated pagination
				if (that.pages > 1) { createArrows(); }
			}
			
			// Manage pagination
			if (conf.pagination) {
				// Deletes pagination if already exists
				that.$element.find(".ch-carousel-pages").remove();
				
				// Creates updated pagination
				if (that.pages > 1) { createPagination(); }
			}
		},
	
	/**
	* Size of Carousel mask.
	* @private
	* @name ch.Carousel#maskWidth
	* @type Number
	*/
		maskWidth,
		
	/**
	* Extra size calculated on content. Fix issues of collection size in IE6.
	* @private
	* @name ch.Carousel#extraWidth
	* @type Number
	*/
		extraWidth,
	
	/**
	* Resize status of Window.
	* @private
	* @name ch.Carousel#resizing
	* @type Boolean
	*/
		resizing = false;

/**
*  Protected Members
*/

	/**
	* Element that will move for both directions.
	* @protected
	* @name ch.Carousel#$content
	* @type jQuery Object
	*/
	that.$content = $("<div class=\"ch-carousel-content\">");
	
	/**
	* HTMLLiElement with a list of items.
	* @protected
	* @name ch.Carousel#$collection
	* @type jQuery Object
	*/
	that.$collection = that.$element.children().addClass("ch-carousel-list").attr("role", "list").appendTo(that.$content);
	
	/**
	* Each item into collection.
	* @protected
	* @name ch.Carousel#$items
	* @type jQuery Object
	*/
	that.$items = that.$collection.children().addClass("ch-carousel-item").attr("role", "listitem");
	
	/**
	* Mask that hides the overflow of content.
	* @protected
	* @name ch.Carousel#$mask
	* @type jQuery Object
	*/
	that.$mask = $("<div class=\"ch-carousel-mask\" role=\"tabpanel\"" + (conf.arrows ? " style=\"margin:0 50px;\"" : "") + ">").append(that.$content).appendTo(that.$element);
	
	/**
	* List of items that should be loaded asynchronously on page movement.
	* @protected
	* @name ch.Carousel#queue
	* @type Array
	*/
	that.queue = conf.asyncData || [];
	
	/**
	* Amount of items into collection and items on queue.
	* @protected
	* @name ch.Carousel#itemsTotal
	* @type Number
	*/
	that.itemsTotal = that.$items.length + that.queue.length;
	
	/**
	* Reference to items width.
	* @protected
	* @name ch.Carousel#itemsWidth
	* @type Number
	*/
	that.itemsWidth = that.$items.outerWidth();
	
	/**
	* CSS margin between each item.
	* @protected
	* @name ch.Carousel#itemsMargin
	* @type Number
	*/
	that.itemsMargin = 0;
	
	/**
	* Amount of items on each page.
	* @protected
	* @type Number
	*/
	// TODO: This is calculates on draw() method. Maybe it isn't necessary to execute here.
	that.itemsPerPage = getItemsPerPage();
	
	/**
	* Total amount of pages.
	* @protected
	* @name ch.Carousel#pages
	* @type Number
	*/
	// TODO: This is calculates on draw() method. Maybe it isn't necessary to execute here.
	that.pages = getPages();
	
	/**
	* The page that is selected.
	* @protected
	* @name ch.Carousel#currentPage
	* @type Number
	*/
	that.currentPage = 1;
	
	/**
	* Move items from queue to collection.
	* @protected
	* @name ch.Carousel#addItems
	* @function
	* @param {Number} amount Amount of items that will be added.
	*/
	that.addItems = function (amount) {
		
		// Take the sample from queue
		var sample = that.queue.splice(0, amount),
		
		// Condition if exists a render function on component configuration object
			hasRender = ch.utils.hasOwn(conf, "asyncRender"),
		
		// Position where new items will be added
			itemIndex = that.$items.length;
		
		// Append asynchronous items to collection
		// HTML Li Element with classname and styles and content from conf.async with or without render function
		for (var i = 0; i < amount; i += 1) {
			
			// Page where this item is in
			var page = ~~(itemIndex / that.itemsPerPage) + 1;
			
			sample[i] = "<li class=\"ch-carousel-item\" role=\"listitem\" aria-hidden=\"" + (page !== that.currentPage) + "\" aria-setsize=\"" + that.itemsTotal + "\" aria-posinset=\"" + (itemIndex += 1) + "\" aria-label=\"page" + page + "\" style=\"margin-right: " + that.itemsMargin + "px; margin-left: " + that.itemsMargin + "px;\">" + (hasRender ? conf.asyncRender(sample[i]) : sample[i]) + "</li>";
		};
		
		// Expand content width for include new items (item width and margin) * (total amount of items) + extra width
		// TODO: Use "width:-moz-max-content;" once instead .css("width"). Maybe add support to ch.features
		that.$content.css("width", (that.itemsWidth + that.itemsMargin * 2) * that.itemsTotal + extraWidth);
		
		// Append collection again
		that.$collection.append(sample.join(""));
		
		// Update items collection
		that.$items = that.$collection.children();
		
		that.callbacks("onItemsAdded");
		that.trigger("itemsAdded");
		
	};
	
	
	/**
	* Analizes if next page needs to load items from queue and execute addItems() method.
	* @protected
	* @name ch.Carousel#asyncItemsLoad
	* @function
	*/
	that.asyncItemsLoad = function () {
		
		// Load only when there are items in queue
		if (that.queue.length === 0) { return; }
		
		// Amount of items from the beginning to current page
		var itemsHere = that.currentPage * that.itemsPerPage,
		
		// Items rendered
			itemsRendered = that.$items.length;
		
		// Load only when there are more visible items than items rendered
		if (itemsHere < itemsRendered) { return; }
		
		// How many items needs to add for complete next page
		var amount = itemsHere % itemsRendered;
		
		// If isn't needed items to complete a page, then add an entire page
		amount = (amount === 0) ? that.itemsPerPage : amount;
		
		// If next page needs less items than it support, then add that amount
		amount = (that.queue.length < amount) ? that.queue.length : amount;
		
		// Add these
		that.addItems(amount);
		
	};
	
	// Moves to a defined page
	that.goTo = function (page) {
		
		// Validation of page parameter
		if (page === that.currentPage || page > that.pages || page < 1 || isNaN(page)) { return that; }
		
		// Manage arrows
		if (!conf.rolling && conf.arrows) { that.manageArrows(page); }
		
		// Select thumbnail on pagination
		if (conf.pagination) { that.managePagination(page); }
		
		// Coordinates of next movement
		var movement = -(maskWidth * (page - 1));

		// TODO: review this conditional
		// Case 1: Movement with CSS transition
		if (conf.fx && ch.features.transition) {
			that.$content.css("left", movement);
		// Case 2: Movement with jQuery animate
		} else if (conf.fx) {
			that.$content.animate({ left: movement });
		// Case 3: Movement without transition or jQuery
		} else {
			that.$content.css("left", movement);
		}
		
		// Refresh selected page
		that.currentPage = page;
		
		// WAI-ARIA to set items as "hide"
		$.each(that.$items, function (i, e) {
			$(e).attr("aria-hidden", ~~(i / that.itemsPerPage) + 1 !== page);
		});
		
		that.callbacks("onSelect");
		that.trigger("select");
		
		return that;
	};

	// Move to the previous page.
	that.prev = function () {
		
		that.goTo(that.currentPage - 1);

		that.callbacks("onPrev");
		that.trigger("prev");
		
		return that;
	};
	
	// Move to the next page.
	that.next = function () {
		
		that.goTo(that.currentPage + 1);
		
		// Asynchronous item load feature
		if (ch.utils.hasOwn(conf, "asyncData")) { that.asyncItemsLoad(); }
		
		that.callbacks("onNext");
		that.trigger("next");
		
		return that;
	};

/**
*  Public Members
*/
	
	/**
	* Triggers when component moves to next page.
	* @name ch.Carousel#next
	* @event
	* @public
	* @example
	* example.on("next", function () {
	*	alert("Next!");
	* });
	*/
	
	/**
	* Triggers when component moves to previous page.
	* @name ch.Carousel#prev
	* @event
	* @public
	* @example
	* example.on("prev", function () {
	*	alert("Previous!");
	* });
	*/
	
	/**
	* Deprecated: Triggers when component moves to next or previous page.
	* @name ch.Carousel#move
	* @event
	* @public
	* @deprecated
	* @example
	* example.on("move", function () {
	*	alert("I moved!");
	* });
	*/
	
	/**
	* Since 0.7.9: Triggers when component moves to next or previous page.
	* @name ch.Carousel#select
	* @event
	* @public
	* @since 0.7.9
	* @example
	* example.on("select", function () {
	*	alert("An item was selected!");
	* });
	*/
	
	/**
	* Triggers when component adds items asynchronously from queue.
	* @name ch.Carousel#itemsAdded
	* @event
	* @public
	* @example
	* example.on("itemsAdded", function () {
	*	alert("Some asynchronous items was added.");
	* });
	*/
	
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Carousel#uid
	* @type Number
	*/
	
	/**
	* Public reference to element that was used to init the component.
	* @public
	* @name ch.Carousel#element
	* @type HTMLDivElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Carousel#type
	* @type String
	*/

	/**
	* Deprecated - Get the items amount of each page.
	* @public
	* @deprecated
	* @name ch.Carousel#getItemsPerPage
	* @returns Number
	*/
	
	/**
	* Get the items amount of each page (Since 0.7.4).
	* @public
	* @since 0.7.4
	* @name ch.Carousel#itemsPerPage
	* @returns Number
	*/
	that["public"].itemsPerPage = function () { return that.itemsPerPage; };
	
	/**
	* Deprecated - Gets the current page.
	* @public
	* @deprecated
	* @function
	* @name ch.Carousel#getPage
	* @returns Number
	*/
	
	/**
	* Deprecated - Moves to a defined page. Only works when Carousel hasn't asynchronous item load.
	* @public
	* @function
	* @name ch.Carousel#goTo
	* @returns Chico UI Object
	* @param {Number} page Page to be moved.
	* @deprecated
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.goTo(2);
	*/
	
	/**
	* Moves to a defined page (Since 0.7.5).
	* @public
	* @function
	* @name ch.Carousel#select
	* @returns Chico UI Object
	* @param {Number} page Page to be moved.
	* @since 0.7.5
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.select(2);
	*/
	that["public"].select = function (data) {
		// TODO: Add support to goTo function on asynchronous item load.
		if (ch.utils.hasOwn(conf, "asyncData")) { return that["public"]; }
		
		that.goTo(data);

		return that["public"];
	};
	
	/**
	* Gets the current page or moves to a defined page (Since 0.7.4).
	* @public
	* @function
	* @name ch.Carousel#page
	* @returns Chico UI Object
	* @param {Number} page Page to be moved.
	* @since 0.7.4
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to second page
	* foo.page(2);
	* @example
	* // Get the current page
	* foo.page();
	*/
	that["public"].page = function (data) {
		// Getter
		if (!data) { return that.currentPage; }
		
		// Setter
		return that["public"].select(data);
	};
	
	/**
	* Moves to the previous page.
	* @public
	* @function
	* @name ch.Carousel#prev
	* @returns Chico UI Object
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to previous page
	* foo.prev();
	*/
	that["public"].prev = function () {
		that.prev();

		return that["public"];
	};
	
	/**
	* Moves to the next page.
	* @public
	* @function
	* @name ch.Carousel#next
	* @returns Chico UI Object
	* @example
	* // Create a carousel
	* var foo = $("bar").carousel();
	* 
	* // Go to next page
	* foo.next();
	*/
	that["public"].next = function () {
		that.next();

		return that["public"];
	};

	/**
	* Re-calculate positioning, sizing, paging, and re-draw.
	* @public
	* @function
	* @name ch.Carousel#redraw
	* @returns Chico UI Object
	* @example
	* // Create a Carousel
	* var foo = $("bar").carousel();
	* 
	* // Re-draw Carousel
	* foo.redraw();
	*/
	that["public"].redraw = function () {
		draw();
		
		return that["public"];
	};


/**
*  Default event delegation
*/
	
	// Does what is necessary to make ready the component structure
	createLayout();
	
	// Calculates all necesary data to draw Carousel correctly
	draw();
	
	// Default behavior	
	if (!ch.utils.hasOwn(conf, "width")) {
		
		// Elastic behavior
		// Change resize status on Window resize event
		ch.utils.window.bind("resize", function () { resizing = true; });
		
		// Limit resize execution
		setInterval(function () {
			
			if (!resizing) { return; }
			
			resizing = false;
			
			draw();
			
		}, 350);
	}
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Carousel#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as carousel's instance controller:
	* me.on("ready",function () {
	*	this.itemsPerPage();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("carousel");
/**
* Counts the amount of characters that user can enter in a form control and limit the length of value of input.
* @name Countdown
* @class Countdown
* @augments ch.Controls
* @standalone
* @memberOf ch
* @param {Object} conf Object with configuration properties.
* @param {Number} conf.max Number of the maximum amount of characters user can input in form control.
* @param {String} [conf.plural] Message of remaining amount of characters, when it's different to 1. The variable that represents the number to be replaced, should be a hash. By default this parameter is "# characters left.".
* @param {String} [conf.singular] Message of remaining amount of characters, when it's only 1. The variable that represents the number to be replaced, should be a hash. By default this parameter is "# character left.".
* @returns itself
* @example
* // Create a new Countdown with configuration.
* var me = $(".some-form-control").countdown({
*     "max": 500,
*     "plural": "Restan # caracteres.",
*     "singular": "Resta # caracter."
* });
* @example
* // Create a simple Countdown
* var me = $(".some-form-control").countdown(500);
* // Now 'me' is a reference to the Countdown instance controller.
*/

ch.countdown = function (conf) {

	/**
	* Reference to an internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Countdown#that
	* @type Object
	*/
	var that = this;
	
	conf = ch.clon(conf);

	// Configuration by default
	// Max length of content
	conf.max = parseInt(conf.max) || conf.value || parseInt(conf.msg) || 500;
	
	// Messages
	conf.plural = conf.plural || "# characters left.";
	conf.singular = conf.singular || "# character left.";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controls.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	/**
	* Length of value of form control.
	* @private
	* @name ch.Countdown#contentLength
	* @type Number
	*/
	var contentLength = that.element.value.length,
	
	/**
	* Amount of free characters until full the field.
	* @private
	* @name ch.Countdown#remaining
	* @type Number
	*/
		remaining = conf.max - contentLength,
	
	/**
	* Change the visible message of remaining characters.
	* @private
	* @name ch.Countdown#updateRemaining
	* @function
	* @param num {Number} Remaining characters.
	*/
		updateRemaining = (function () {
			
			// Singular or Plural message depending on amount of remaining characters
			var message = (remaining === 1) ? conf.singular : conf.plural,
			
			// Append to container to allow icon aside inputs
				$container = that.$element.parent();

			// Create the DOM Element when message will be shown
				$display = $("<p class=\"ch-form-hint\">" + message.replace("#", remaining) + "</p>").appendTo($container);
			
			// Real function
			return function (num) {
				
				// Singular or Plural message depending on amount of remaining characters
				var message = (num !== 1 ? conf.plural : conf.singular).replace(/\#/g, num);
				
				// Update DOM text
				$display.text(message);
				
				// Update amount of remaining characters
				remaining = num;
				
			};
		
		}());

/**
*	Protected Members
*/

	/**
	* Process input of data on form control and updates remaining amount of characters or limits the content length
	* @protected
	* @name ch.Countdown#process
	* @function
	*/
	that.process = function () {

		var len = that.element.value.length;
		
		// Countdown or Countup
		if ((len > contentLength && len <= conf.max) || (len < contentLength && len >= 0)) {
			
			// Change visible message of remaining characters
			updateRemaining(remaining - (len - contentLength));
			
			// Update length of value of form control.
			contentLength = len;
		
		// Limit Count
		} else if (len > contentLength && len > conf.max) {
			
			// Cut the string value of form control
			that.element.value = that.element.value.substr(0, conf.max);
			
		};
		
	};


/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Countdown#uid
	* @type Number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Countdown#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Countdown#type
	* @type String
	*/

/**
*	Default event delegation
*/

	// Bind process function to element
	that.$element.on("keyup keypress paste", function () { setTimeout(that.process, 0); });
	
	/**
	* Triggers when component is ready to use.
	* @name ch.Countdown#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as Countdown's instance controller:
	* me.on("ready",function () {
	*	this.element;
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("countdown");
/**
* Create custom validation interfaces for Validator validation engine.
* @name Custom
* @class Custom
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Function} function Custom function to evaluete a value.
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Number
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* // Validate a even number
* $("input").custom(function (value) {
* 	return (value%2==0) ? true : false;
* }, "Enter a even number");
*/
ch.extend("validation").as("custom", function(conf) {
	
	if (!conf.lambda) {
		alert("Custom Validation fatal error: Need a function to evaluate, try $().custom(function(){},\"Message\");");
	}

	// Define the conditions of this interface
	conf.condition = {
		// I don't have pre-conditions, comes within conf.lambda argument
		name: "custom",
		func: conf.lambda,
		message: conf.msg || conf.message || "Error"
	};

	return conf;
});/**
* Is a UI Widget for picking dates.
* @name DatePicker
* @class DatePicker
* @augments ch.Controls
* @requires ch.Calendar
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.format] Sets the date format. By default is "DD/MM/YYYY".
* @param {String} [conf.selected] Sets a date that should be selected by default. By default is the date of today.
* @param {String} [conf.from] Set a maximum selectable date.
* @param {String} [conf.to] Set a minimum selectable date.
* @param {String} [conf.points] Points to be positioned. See Positioner component. By default is "ct cb".
* @param {Array} [conf.monthsNames] By default is ["Enero", ... , "Diciembre"].
* @param {Array} [conf.weekdays] By default is ["Dom", ... , "Sab"].
* @param {Boolean} [conf.closable] Defines if floated component will be closed when a date is selected or not. By default it's "true".
* @returns itself
* @example
* // Create a new Date Picker with configuration.
* var me = $(".example").datePicker({
*	 "format": "MM/DD/YYYY",
*	 "selected": "2011/12/25",
*	 "from": "2010/12/25",
*	 "to": "2012/12/25",
*	 "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
*	 "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
* });
* @example
* // Create a new datePicker with a class name 'example'.
* var me = $(".example").datePicker();
*/

ch.datePicker = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.DatePicker#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);

	// Configuration by default
	conf.format = conf.format || "DD/MM/YYYY";
	conf.points = conf.points || "ct cb";
	conf.closable = ch.utils.hasOwn(conf, "closable") ? conf.closable : true;

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controls.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	
/**
*	Protected Members
*/

	/**
	* Pick a date in the Calendar and updates the input data.
	* @protected
	* @function
	* @name ch.DatePicker#process
	*/
	that.process = function (event) {

		// Day selection
		if (event.target.nodeName !== "TD" || event.target.className.indexOf("ch-disabled") !== -1 || event.target.className.indexOf("ch-calendar-other") !== -1) { return; }

		// Select the day and update input value with selected date
		that.element.value = that.calendar.selectDay(event.target.innerHTML);

		// Hide float
		if (conf.closable) { that["float"].innerHide(); }

	};

	
	/**
	* Reference to the Calendar component instance.
	* @protected
	* @type Object
	* @name ch.DatePicker#calendar
	*/
	that.calendar = $("<div>")
		// Add functionality for date selection
		.bind("click", function (event) { that.process(event); })
		// Instance Calendar component
		.calendar({
			"format": conf.format,
			"from": conf.from,
			"to": conf.to,
			"selected": conf.selected,
			"monthsNames": conf.monthsNames,
			"weekdays": conf.weekdays
		});
	
	/**
	* Reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.DatePicker#float
	*/
	that["float"] = that.createFloat({
		"$element": $("<p class=\"ch-datePicker-trigger\">Date Picker</p>").insertAfter(that.element),
		"content": that.calendar.element,
		"points": conf.points,
		"offset": "0 10",
		"aria": {
			"role": "tooltip",
			"identifier": "aria-describedby"
		},
		"closeButton": false,
		"cone": true
	});

/**
*  Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.DatePicker#uid
	* @type Number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.DatePicker#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.DatePicker#type
	* @type String
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.DatePicker#show
	* @returns itself
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/
	that["public"].show = function () {
		that["float"].innerShow();

		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.DatePicker#hide
	* @returns itself
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	that["public"].hide = function () {
		that["float"].innerHide();

		return that["public"];
	};

	/**
	* Select a specific date or returns the selected date.
	* @public
	* @since 0.9
	* @function
	* @name ch.DatePicker#select
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].select = function (date) {
		// Select the day and update input value with selected date
		that.element.value = that.calendar.select(date);

		return that["public"];
	};

	/**
	* Returns date of today
	* @public
	* @since 0.9
	* @function
	* @name ch.DatePicker#today
	* @return date
	*/
	that["public"].today = function () {
		return that.calendar.today();
	};

	/**
	* Move to the next month or year. If it isn't specified, it will be moved to next month.
	* @public
	* @name ch.DatePicker#next
	* @function
	* @param {String} time A string that allows specify if it should move to next month or year.
	* @return {itself}
	* @default Next month
	*/
	that["public"].next = function (time) {
		that.calendar.next(time);		

		return that["public"];
	};

	/**
	* Move to the previous month or year. If it isn't specified, it will be moved to previous month.
	* @public
	* @function
	* @param {String} time A string that allows specify if it should move to previous month or year.
	* @return {itself}
	* @default Previous month
	*/
	that["public"].prev = function (time) {
		that.calendar.prev(time);

		return that["public"];
	};

	/**
	* Reset the Date Picker to date of today
	* @public
	* @function
	* @name ch.DatePicker#reset
	* @return itself
	*/
	that["public"].reset = function () {
		
		// Delete input value
		that.element.value = "";
		
		that.calendar.reset();

		return that["public"];
	};

	/**
	* Set a minimum selectable date.
	* @public
	* @function
	* @name ch.DatePicker#from
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].from = function (date) {
		that.calendar.from(date);
		
		return that["public"];
	};

	/**
	* Set a maximum selectable date.
	* @public
	* @function
	* @name ch.DatePicker#to
	* @param {string} "YYYY/MM/DD".
	* @return itself
	*/
	that["public"].to = function (date) {
		that.calendar.to(date);
		
		return that["public"];
	};

	
/**
*	Default event delegation
*/
	
	// Change type of input to "text"
	that.element.type = "text";

	// Change value of input if there are a selected date
	that.element.value = (conf.selected) ? that.calendar.select() : that.element.value;
	
	// Add show behaivor to float's trigger.
	that["float"].$element
		.css("cursor", "pointer")
		.bind("click", function (event) { that["float"].innerShow(event); });

	// Add hide behaivor
	that["float"].on("show", function () {
		ch.utils.document.one("click", that["float"].innerHide);
	});

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.DatePicker#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as Date Picker's instance controller:
	* me.on("ready", function () {
	* 	this.show();
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("datePicker");/**
* A navegable list of items, UI-Object.
* @name Dropdown
* @class Dropdown
* @augments ch.Navs
* @standalone
* @requires ch.Positioner
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the dropdown open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.icon] Shows an arrow as icon. By default, the value is true.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @example
* // Create a new dropdown with configuration.
* var me = $(".example").dropdown({
*     "open": true,
*     "icon": false,
*     "points": "lt lt",
*     "fx": true
* });
* @example
* // Create a new dropdown without configuration.
* var me = $(".example").dropdown();
*/

ch.dropdown = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Dropdown#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	
	conf.reposition = ch.utils.hasOwn(conf, "reposition") ? conf.reposition : true;
	
	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
*  Private Members
*/
	/**
	* Adds keyboard events.
	* @private
	* @function
	* @name ch.Dropdown#shortcuts
	*/
	var shortcuts = function (items) {

		// Keyboard support
		var selected = 0;

		// Item selected by mouseover
		// TODO: It's over keyboard selection and it is generating double selection.
		$.each(items, function (i, e) {
			$(e).bind("mouseenter", function () {
				selected = i;
				items.eq(selected).focus();
			});
		});

		var selectItem = function (arrow, event) {
			that.prevent(event);

			if (selected === (arrow === "bottom" ? items.length - 1 : 0)) { return; }

			items.eq(selected).blur();

			if (arrow === "bottom") { selected += 1; } else { selected -= 1; }
			
			items.eq(selected).focus();
		};
		
		// Arrows
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function (x, event) { selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function (x, event) { selectItem("bottom", event); });
	};


/**
*  Protected Members
*/
	/**
	* The component's trigger.
	* @private
	* @name ch.Dropdown#$trigger
	* @type jQuery
	*/
	that.$trigger = (function () {
		
		var $el = that.$element.children().eq(0);
		
		if (!that.$element.hasClass("secondary")) { $el.addClass("btn skin"); }
		
		return $el;
		
	}());

	/**
	* The component's content.
	* @private
	* @name ch.Dropdown#$content
	* @type jQuery
	*/
	that.$content = (function () {
		
		// jQuery Object
		var $content = that.$trigger.next()
		// Visible
			.removeClass("ch-hide")
		// Prevent click on content (except links)
			.bind("click", function(event) {
				if ((event.target || event.srcElement).tagName === "A") {
					that.hide();
				}
				event.stopPropagation();
			})
		// WAI-ARIA properties
			.attr({ "role": "menu", "aria-hidden": "true" });
		
		// WAI-ARIA for items into content
		$content.children("a").attr("role", "menuitem");

		// Position
		that.position = ch.positioner({
			"element": $content,
			"context": that.$trigger,
			"points": (conf.points || "lt lb"),
			"offset": "0 -1",
			"reposition": conf.reposition
		});
		
		return $content;
	}());


	that.show = function (event) {
		
		// Stop propagation
		that.prevent(event);
		
		// Z-index of content
		that.$content.css("z-index", ch.utils.zIndex += 1).attr("aria-hidden", "false");
		
		// Z-index of trigger over content (secondary dropdown)
		if (that.$element.hasClass("secondary")) { that.$trigger.css("z-index", ch.utils.zIndex += 1); }
		
		// Inheritance show
		that.parent.show(event);
		
		// Refresh position
		that.position("refresh");

		// Reset all dropdowns except itself
		$.each(ch.instances.dropdown, function (i, e) { 
			if (e.uid !== that.uid) { e.hide(); }
		});

		// Close events
		ch.utils.document.one("click " + ch.events.KEY.ESC, function () { that.hide(); });

		// Keyboard support
		var items = that.$content.find("a");
		// Select first anchor child by default
			items.eq(0).focus();

		if (items.length > 1) { shortcuts(items); };

		return that;
	};

	that.hide = function (event) {

		that.parent.hide(event);
		
		that.$content.attr("aria-hidden", "true");

		// Unbind events
		ch.utils.document.unbind(ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW);

		return that;
	};
	
/**
*  Public Members
*/
 
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Dropdown#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Dropdown#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Dropdown#type
	* @type string
	*/	
	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Dropdown#show
	* @returns itself
	*/
	that["public"].show = function () {
		that.show();
		
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Dropdown#hide
	* @returns itself
	*/ 
	that["public"].hide = function () {
		that.hide();
		
		return that["public"];
	};
	
	/**
	* Positioning configuration.
	* @public
	* @function
	* @name ch.Dropdown#position
	*/
	that["public"].position = that.position;

/** 
*  Default event delegation
*/			

	that.configBehavior();

	ch.utils.avoidTextSelection(that.$trigger);
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Dropdown#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as dropdown's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("dropdown");
/**
* Expando is a UI-Component.
* @name Expando
* @class Expando
* @augments ch.Navs
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the expando open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @example
* // Create a new expando with configuration.
* var me = $(".example").expando({
*     "open": true,
*     "fx": true
* });
* @example
* // Create a new expando without configuration.
* var me = $(".example").expando();
*/
 
ch.expando = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Expando#that
	* @type object
	*/
	var that = this;
		
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
*  Protected Members
*/ 
	
	var $nav = that.$element.children(),
		triggerAttr = {
			"aria-expanded":conf.open,
			"aria-controls":"ch-expando-"+that.uid
		},
		contentAttr = {
			id:triggerAttr["aria-controls"],
			"aria-hidden":!triggerAttr["aria-expanded"]
		};
		
	that.$trigger = $nav.eq(0).attr("role","presentation").wrapInner("<span>").children().attr(triggerAttr);
	that.$content = $nav.eq(1).attr(contentAttr);
	
	that.show = function(event){
		that.$trigger.attr("aria-expanded","true");
		that.$content.attr("aria-hidden","false");
		that.parent.show();
		return that;
	}
	// 
	that.hide = function(event){
		that.$trigger.attr("aria-expanded","false");
		that.$content.attr("aria-hidden","true");
		that.parent.hide();
		return that;
	}
	
	
/**
*  Public Members
*/
 
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Expando#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Expando#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Expando#type
	* @type string
	*/
	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Expando#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.show();
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Expando#hide
	* @returns itself
	*/	
	that["public"].hide = function(){
		that.hide();
		return that["public"];
	};
	

/**
*  Default event delegation
*/		
	
	that.configBehavior();
	that.$trigger.children().attr("role","presentation");
	ch.utils.avoidTextSelection(that.$trigger);
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Expando#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as expando's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("expando");
/**
* Forms is a Controller of DOM's HTMLFormElement.
* @name Form
* @class Form
* @augments ch.Controllers
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Object} [conf.messages]
* @see ch.Watchers
* @returns itself
* @example
* // Create a new form with configuration.
* var me = $(".example").form({
* 	"messages": {
* 		"required": "Error message for all required fields.",
* 		"email": "Show this message on email format error."
* 	}
* });
* @example
* // Create a new form without configuration.
* var me = $(".example").form();
*/

ch.form = function(conf) {

/**
* Validation
*/
	// Are there action and submit type?
	if ( this.$element.find(":submit").length == 0 || this.$element.attr("action") == "" ){
		alert("Form fatal error: The <input type=submit> is missing, or need to define a action attribute on the form tag.");
		return;
	};

	// Is there form in map instances?
	if ( ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0 ){
		for(var i = 0, j = ch.instances.form.length; i < j; i+=1){
			if(ch.instances.form[i].element === this.element){
				return {
					exists: true,
					object: ch.instances.form[i]
				};
			}
		};
	}

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Form#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	// Disable HTML5 browser-native validations
	that.$element.attr("novalidate", "novalidate");
	// Grab submit button
	that.$submit = that.$element.find("input:submit");

	that.conf = conf;

/**
*  Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);
	
/**
*  Private Members
*/

	/**
	* A Boolean property that indicates is exists errors in the form.
	* @private
	* @name ch.Form#status
	* @type boolean
	*/
	var status = true;

	/**
	* Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
	*/
	var validate = function(event){

		/**
		* Callback function
		* @name ch.Form#beforeValidate
		* @event
		* @public
		*/
		that.callbacks("beforeValidate");
		// new callback
		that.trigger("beforeValidate");

		// Status OK (with previous error)
		if ( !status ) {
			status = true;
		};

		var i = 0, j = that.children.length, toFocus, childrenError = [];

		// Shoot validations
		for (i; i < j; i+=1) {
			var child = that.children[i];

			// Validate
			// Save children with errors
			if ( child.hasError() ) {
				childrenError.push(child);
			}
		};

		// Is there's an error
		if (childrenError.length > 0) {
			status = false;
			// Issue UI-332: On validation must focus the first field with errors.
			// Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
			if (childrenError[0].element.tagName === "DIV") {
				$(childrenError[0].element).find("input:first").focus();
			} else if (childrenError[0].element.type !== "hidden") {
				childrenError[0].element.focus();
			}
		} else {
			status = true;
		}

		/**
		* Callback function
		* @name ch.Form#validate
		* @event
		* @public
		*/
		/**
		* Callback function
		* @name ch.Form#error
		* @event
		* @public
		*/
		if (status) {
			that.callbacks("onValidate");
			// new callback
			that.trigger("validate");
		} else {
			that.callbacks("onError");
			// new callback
			that.trigger("error");
		}

		/**
		* Callback function
		* @name ch.Form#afterValidate
		* @event
		* @public
		*/
		that.callbacks("afterValidate");
		// new callback
		that.trigger("afterValidate");

		return that;
	};

	/**
	* This methods triggers the 'beforSubmit' callback, then will execute validate() method,
	* and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
	*/
	var submit = function(event) {

		/**
		* Callback function
		* @name ch.Form#beforeSubmit
		* @event
		* @public
		*/
		that.callbacks("beforeSubmit");
		// new callback
		that.trigger("beforeSubmit");

		// Execute all validations
		validate(event);

		// If an error occurs prevent default actions
		if (!status) {
			that.prevent(event);
	        if (event) {
	            event.stopImmediatePropagation();
	        }
		}

		// OLD CALLBACK SYSTEM!
		// Is there's no error but there's a onSubmit callback
		if ( status && ch.utils.hasOwn(conf, "onSubmit")) {
			// Avoid default actions
			that.prevent(event);
			// To execute defined onSubmit callback
			that.callbacks("onSubmit");
		}

		/**
		* Callback function
		* @name ch.Form#submit
		* @event
		* @public
		*/
		// * New callback system *
		// Check inside $.data if there's a handler for ch-submit event
		// if something found there, avoid submit.

		var formEvents = $(that["public"]).data("events");
		var isSubmitEventDefined = (formEvents && ch.utils.hasOwn(formEvents, "ch-submit"));

		if (status && isSubmitEventDefined){
			// Avoid default actions
			that.prevent(event);
			// new callback
			that.trigger("submit");
		};

		/**
		* Callback function
		* @name ch.Form#afterSubmit
		* @event
		* @public
		*/
		that.callbacks("afterSubmit");
		// new callback
		that.trigger("afterSubmit");

		// Return that to chain methods
		return that;
	};

	/**
	* Use this method to clear al validations.
	*/
	var clear = function(){

		var i = 0, j = that.children.length;
		for(i; i < j; i += 1) {
			that.children[i].clear();
		}

		status = true;

		/**
		* Callback function
		* @name ch.Form#onClear
		* @event
		* @public
		*/
		that.callbacks("onClear");
		// new callback
		that.trigger("clear");

		return that;
	};

	/**
	* Use this method to reset the form's input elements.
	*/
	var reset = function(event){
		clear();
		that.element.reset(); // Reset html form native

		/**
		* Callback function
		* @name ch.Form#onReset
		* @event
		* @public
		*/
		that.callbacks("onReset");
		// new callback
		that.trigger("reset");

		return that;
	};


/**
*  Public Members
*/
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Form#uid
	* @type number
	*/

	/**
	* The element reference.
	* @public
	* @name ch.Form#element
	* @type HTMLElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.Form#type
	* @type string
	*/

	/**
	* Watcher instances associated to this controller.
	* @public
	* @name ch.Form#children
	* @type collection
	*/
	that["public"].children = that.children;

	/**
	* Collection of messages defined.
	* @public
	* @name ch.Form#messages
	* @type string
	*/
	that["public"].messages = conf.messages || {};

	/**
	* Executes all children's validations, if finds a error will trigger 'onError' callback, if no error is found will trigger 'onValidate' callback, and allways trigger 'afterValidate' callback.
	* @public
	* @function
	* @name ch.Form#validate
	* @returns itself
	*/
	that["public"].validate = function() {
		validate();

		return that["public"];
	};

	/**
	* This methods triggers the 'beforSubmit' callback, then will execute validate() method, and if is defined triggers 'onSubmit' callback, at the end will trigger the 'afterSubmit' callback.
	* @public
	* @function
	* @name ch.Form#submit
	* @returns itself
	*/
	that["public"].submit = function() {
		submit();

		return that["public"];
	};

	/**
	* Return the status value.
	* @public
	* @function
	* @name ch.Form#getStatus
	* @returns itself
	*/
	that["public"].getStatus = function(){
		return status;
	};

	/**
	* Use this method to clear al validations.
	* @public
	* @function
	* @name ch.Form#clear
	* @returns itself
	*/
	that["public"].clear = function() {
		clear();

		return that["public"];
	};

	/**
	* Use this method to clear al validations.
	* @public
	* @function
	* @name ch.Form#reset
	* @returns itself
	*/
	that["public"].reset = function() {
		reset();

		return that["public"];
	};

/**
*  Default event delegation
*/

	// patch exists because the components need a trigger
	if (ch.utils.hasOwn(conf, "onSubmit")) {
		that.$element.bind('submit', function(event){ that.prevent(event); });
		// Delete all click handlers asociated to submit button >NATAN: Why?
			//Because if you want to do something on submit, you need that the trigger (submit button)
			//don't have events associates. You can add funcionality on onSubmit callback
		that.$element.find(":submit").unbind('click');
	};

	// Bind the submit
	that.$element.bind("submit", function(event) { submit(event) });

	// Bind the reset
	that.$element.find(":reset, .resetForm").bind("click", function(event){ reset(event); });

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Form#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as form's instance controller:
	* me.on("ready",function () {
	*	this.reset();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("form");/**
* Is a contextual floated UI-Object.
* @name Layer
* @class Layer
* @augments ch.Floats
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is empty.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {String} [conf.event] Sets the event ("click" or "hover") that trigger show method. By default, the event is "hover".
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {Number} [conf.showTime] Sets a delay time to show component's contents. By default, the value is 400ms.
* @param {Number} [conf.hideTime] Sets a delay time to hide component's contents. By default, the value is 400ms.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @param {String} [conf.closeHandler] Sets the way ("any" or "button") the Layer close when conf.event is set as "click". By default, the layer close "any".
* @returns itself
* @see ch.Tooltip
* @see ch.Modal
* @see ch.Zoom
* @example
* // Create a new contextual layer with configuration.
* var me = $(".some-element").layer({
*     "content": "Some content here!",
*     "width": "200px",
*     "height": 50,
*     "event": "click",
*     "showTime": 600,
*     "hideTime": 200,
*     "offset": "10 -10",
*     "cache": false,
*     "points": "lt rt"
* });
* @example
* // Create a simple contextual layer
* var me = $(".some-element").layer("<tag>Some content.</tag>");
* @example
* // Now 'me' is a reference to the layer instance controller.
* // You can set a new content by using 'me' like this: 
* me.content("http://content.com/new/content");
*/

ch.layer = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Layer#that
	* @type object
	*/
	var that = this;
	conf = ch.clon(conf);
	
	conf.cone = true;
	conf.closeButton = ch.utils.hasOwn(conf, "closeButton") ? conf.closeButton : (conf.event === "click");
	conf.classes = conf.classes || "box";
	conf.closeHandler = conf.closeHandler || "any";
	
	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";
	
	conf.position = {};
	conf.position.context = that.$element;
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;


/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Delay time to show component's contents.
	* @private
	* @name ch.Layer#showTime
	* @type number
	* @default 400
	*/
	var showTime = conf.showTime || 400,

	/**
	* Delay time to hide component's contents.
	* @private
	* @name ch.Layer#hideTime
	* @type number
	* @default 400
	*/
		hideTime = conf.hideTime || 400,

	/**
	* Show timer instance.
	* @private
	* @name ch.Layer#st
	* @type timer
	*/
		st,

	/**
	* Hide timer instance.
	* @private
	* @name ch.Layer#ht
	* @type timer
	*/
		ht,

	/**
	* Starts show timer.
	* @private
	* @function
	* @name ch.Layer#showTimer
	*/
		showTimer = function () { st = setTimeout(that.innerShow, showTime); },

	/**
	* Starts hide timer.
	* @private
	* @function
	* @name ch.Layer#hideTimer
	*/
		hideTimer = function (event) {
			if (conf.event !== "click") {
				var target = event.srcElement || event.target;
				
				var relatedTarget = event.relatedTarget || event.toElement;
				
				if (target === relatedTarget || relatedTarget === undefined || relatedTarget.parentNode === null || target.nodeName === "SELECT") { return; }
			}

			ht = setTimeout(that.innerHide, hideTime);
		},

	/**
	* Clear all timers.
	* @private
	* @function
	* @name ch.Layer#clearTimers
	*/
		clearTimers = function () { clearTimeout(st); clearTimeout(ht); },

	/**
	* Stop event bubble propagation to avoid hiding the layer by click on his own layout.
	* @private
	* @function
	* @name ch.Layer#stopBubble
	*/
		stopBubble = function (event) { event.stopPropagation(); };

	/**
	* Stop event bubble propagation to avoid hiding the layer by click on his own layout.
	* @private
	* @name ch.Layer#stopBubble
	* @function
	*/
/*	stopBubble = function (event) {
		var target = event.srcElement || event.target;
		var relatedTarget = event.relatedTarget || event.toElement;
		if (target === relatedTarget || relatedTarget === undefined || relatedTarget.parentNode === null || target.nodeName === "SELECT") { return; };
		hideTimer();
	};*/

/**
*	Protected Members
*/

	/**
	* It sets the hablity of auto close the component or indicate who closes the component.
	* @protected
	* @function
	* @name ch.Layer#closeHandler
	* @returns itself
	*/
	that.closeHandler = conf.closeHandler;

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @function
	* @name ch.Layer#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {
		// Reset all layers, except me and not auto closable layers
		$.each(ch.instances.layer, function (i, e) {
			if (e !== that["public"] && e.closable()==="any") {
				e.hide();
			}
		});
		
		// conf.position.context = that.$element;
		that.parent.innerShow(event);

		// Click in the button
		if (conf.event === "click" && conf.closeHandler === "button") {
			// Document events
			that.$container.find(".close").one("click", that.innerHide);
		// Click anywhere
		} else if (conf.event === "click") {
			// Document events
			ch.utils.document.one("click", that.innerHide);
			that.$container.bind("click", stopBubble);
		// Hover
		} else { 		
			clearTimers();
			that.$container.one("mouseenter", clearTimers).bind("mouseleave", hideTimer);
		}

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @function
	* @name ch.Layer#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {
		that.$container.unbind("click", stopBubble).unbind("mouseleave", hideTimer);
		
		that.parent.innerHide(event);
	}

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Layer#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Layer#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Layer#type
	* @type string
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Layer#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	
	/**
	* Returns any if the component closes automatic. 
	* @public
	* @name ch.Layer#closable
	* @function
	* @returns boolean
	*/
	that["public"].closable = function (content) {

		if (content !== undefined) { 
			that.closeHandler = content; 
		} else { 
			return that.closeHandler; 
		}

		return that["public"];
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Layer#isActive
	* @function
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#show
	* @function
	* @returns itself
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Layer#hide
	* @function
	* @returns itself
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Layer#width
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Layer#height
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the height
	* me.height(300);
	* @example
	* // to get the height
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Layer#position
	* @function
	* @example
	* // Change component's position.
	* me.position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/

	// Click
	if (conf.event === "click") {
		that.$element
			.css("cursor", "pointer")
			.bind("click", that.innerShow);

	// Hover
	} else {
		that.$element
			.css("cursor", "default")
			.bind("mouseenter", that.innerShow)
			.bind("mouseleave", hideTimer);
	}

	/**
	* Triggers when component is visible.
	* @name ch.Layer#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Layer#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Layer#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as layer's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;

};

ch.factory("layer");/**
* Menu is a UI-Component.
* @name Menu
* @class Menu
* @augments ch.Controllers
* @requires ch.Expando
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @example
* // Create a new menu with configuration.
* var me = $(".example").menu({
*     "selected": 2,
*     "fx": true
* });
* @example
* // Create a new menu without configuration.
* var me = $(".example").menu();
*/

ch.menu = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Menu#that
	* @type object
	*/
	var that = this;
	
	conf = ch.clon(conf);
	
	that.conf = conf;
	
/**
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Indicates witch child is opened
	* @private
	* @name ch.Menu#selected
	* @type number
	*/
	var selected = conf.selected - 1;

	/**
	* Inits an Expando component on each list inside main HTML code snippet
	* @private
	* @name ch.Menu#createLayout
	* @function
	*/
	var createLayout = function(){

		// No slide efects for IE6 and IE7
		var efects = (ch.utils.html.hasClass("ie6") || ch.utils.html.hasClass("ie7")) ? false : true;

		// List elements
		that.$element.children().each(function(i, e){
			// List element
			var $li = $(e);
									  
			// Children of list elements
			var $child = $li.children();

			// Anchor inside list
			if($child.eq(0).prop("tagName") == "A") {

				// Add attr role to match wai-aria
				$li.attr("role","presentation");

				// Add class to list and anchor
				$li.addClass("ch-bellows").children().addClass("ch-bellows-trigger");

				// Add anchor to that.children
				that.children.push( $child[0] );

				return;
			};

			// List inside list, inits an Expando
			var expando = $li.expando({
				// Show/hide on IE6/7 instead slideUp/slideDown
				fx: efects,
				onShow: function(){
					// Updates selected tab when it's opened
					selected = i;

					/**
					* Callback function
					* @name onSelect
					* @type {Function}
					* @memberOf ch.Menu
					*/
					that.callbacks.call(that, "onSelect");
					// new callback
					that.trigger("select");
				}
			});
			
			var childs = $li.children(),
				$triggerCont = $(childs[0]),
				$menu = $(childs[1]);
				if (!conf.accordion) {
					$menu.attr("role","menu");
					$menu.children().children().attr("role", "menuitem");
					$menu.children().attr("role", "presentation");
				} 
				$triggerCont.attr("role","presentation");

			// Add expando to that.children
			that.children.push( expando );

		});
	};
	
	/**
	* Opens specific Expando child and optionally grandson
	* @private
	* @function
	* @name ch.Menu#select
	*/
	var select = function(item){

		var child, grandson;

		// Split item parameter, if it's a string with hash
		if (typeof item === "string") {
			var sliced = item.split("#");
			child = sliced[0] - 1;
			grandson = sliced[1];

		// Set child when item is a Number
		} else {
			child = item - 1;
		}

		// Specific item of that.children list
		var itemObject = that.children[ child ];

		// Item as object
		if (ch.utils.hasOwn(itemObject, "uid")) {

			// Show this list
			itemObject.show();

			// Select grandson if splited parameter got a specific grandson
			if (grandson) $(itemObject.element).find("a").eq(grandson - 1).addClass("ch-menu-on");

			// Accordion behavior
			if (conf.accordion) {
				// Hides every that.children list that don't be this specific list item
				$.each(that.children, function(i, e){
					if(
						// If it isn't an anchor...
						(e.tagName != "A") &&
						// If there are an unique id...
						(ch.utils.hasOwn(e, "uid")) &&
						// If unique id is different to unique id on that.children list...
						(that.children[ child ].uid != that.children[i].uid)
					){
						// ...hide it
						e.hide();
					};
				});
				
			};

		// Item as anchor
		} else{
			// Just selects it
			that.children[ child ].addClass("ch-menu-on");
		};

		return that;
	};

	/**
	* Binds controller's own click to expando triggers
	* @private
	* @name ch.Menu#configureAccordion
	* @function
	*/
	var configureAccordion = function(){

		$.each(that.children, function(i, e){
			$(e.element).find(".ch-expando-trigger").unbind("click").bind("click", function(){
				select(i + 1);
			});
		});

		return;
	};

/**
*	Protected Members
*/

/**
*	Public Members
*/
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Menu#uid
	* @type number
	*/	
	
	/**
	* The element reference.
	* @public
	* @name ch.Menu#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Menu#type
	* @type string
	*/
	
	/**
	* Select a specific children.
	* @public
	* @name ch.Menu#select
	* @function
	*/
	that["public"].select = function(item){
		select(item);

		return that["public"];
	};

/**
*	Default event delegation
*/

	// Sets component main class name

	// Inits an Expando component on each list inside main HTML code snippet
	createLayout();

	// Accordion behavior
	if (conf.accordion) {
		// Sets the interface main class name for avoid
		configureAccordion();
		that.$element.addClass('ch-accordion')
	} else {
		that.$element.addClass('ch-menu');
		// Set the wai-aria for Menu
		that.$element.attr("role","navigation");
	}

	// Select specific item if there are a "selected" parameter on component configuration object
	if (ch.utils.hasOwn(conf, "selected")) select(conf.selected);
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Menu#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as menu's instance controller:
	* me.on("ready",function () {
	*	this.select();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;

};

ch.factory("menu");

/**
* Accordion is a UI-Component.
* @name Accordion
* @class Accordion
* @interface
* @augments ch.Controllers
* @requires ch.Menu
* @requires ch.Expando
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @example
* // Create a new menu with configuration.
* var me = $(".example").accordion({
*     "selected": 2,
*     "fx": true
* });
* @example
* // Create a new menu without configuration.
* var me = $(".example").accordion();
*/

ch.extend("menu").as("accordion");

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.Accordion#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.Accordion#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.Accordion#type
	* @type string
	*/
	
	/**
	* Select a specific children.
	* @public
	* @name ch.Accordion#select
	* @function
	*/

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Accordion#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as accordion's instance controller:
	* me.on("ready",function () {
	*	this.select();
	* });
	*/
/**
* Is a centered floated window with a dark gray dimmer background. This component let you handle its size, positioning and content.
* @name Modal
* @class Modal
* @augments ch.Floats
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @returns itself
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Zoom
* @example
* // Create a new modal window with configuration.
* var me = $("a.example").modal({
*     "content": "Some content here!",
*     "width": "500px",
*     "height": 350,
*     "cache": false,
*     "fx": false
* });
* @example
* // Create a new modal window triggered by an anchor with a class name 'example'.
* var me = $("a.example").modal();
* @example
* // Now 'me' is a reference to the modal instance controller.
* // You can set a new content by using 'me' like this:
* me.content("http://content.com/new/content");
*/

ch.modal = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Modal#that
	* @type object
	*/
	var that = this;
	conf = ch.clon(conf);
	
	conf.classes = conf.classes || "box";
	conf.closeButton = ch.utils.hasOwn(conf, "closeButton") ? conf.closeButton : (that.type === "modal");
	
	conf.reposition = false;
	
	conf.aria = {};
	
	if (conf.closeButton) {
		conf.aria.role = "dialog";
		conf.aria.identifier = "aria-label";
	} else {
		conf.aria.role = "alert";
	}
	
	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Reference to the dimmer object, the gray background element.
	* @private
	* @name ch.Modal#$dimmer
	* @type jQuery
	*/
	var $dimmer = $("<div class=\"ch-dimmer\">");

	// Set dimmer height for IE6
	if (ch.utils.html.hasClass("ie6")) { $dimmer.height(parseInt(document.documentElement.clientHeight, 10) * 3); }

	/**
	* Reference to dimmer control, turn on/off the dimmer object.
	* @private
	* @name ch.Modal#dimmer
	* @type object
	*/
	var dimmer = {
		on: function () {

			if (that.active) { return; }

			$dimmer
				.css("z-index", ch.utils.zIndex += 1)
				.appendTo(ch.utils.body)
				.fadeIn();

			if (that.type === "modal") {
				$dimmer.one("click", function (event) { that.innerHide(event) });
			}
			
			// TODO: position dimmer with Positioner
			if (!ch.features.fixed) {
			 	ch.positioner({ element: $dimmer });
			}

			if (ch.utils.html.hasClass("ie6")) {
				$("select, object").css("visibility", "hidden");
			}
		},
		off: function () {
			$dimmer.fadeOut("normal", function () {
				$dimmer.detach();
				if (ch.utils.html.hasClass("ie6")) {
					$("select, object").css("visibility", "visible");
				}
			});
		}
	};

/**
*	Protected Members
*/

	/**
	* Inner show method. Attach the component's layout to the DOM tree and load defined content.
	* @protected
	* @name ch.Modal#innerShow
	* @function
	* @returns itself
	*/
	that.innerShow = function (event) {
		dimmer.on();
		that.parent.innerShow(event);		
		that.$element.blur();
		return that;
	};

	/**
	* Inner hide method. Hides the component's layout and detach it from DOM tree.
	* @protected
	* @name ch.Modal#innerHide
	* @function
	* @returns itself
	*/
	that.innerHide = function (event) {
		dimmer.off();
		that.parent.innerHide(event);
		return that;
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Modal#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Modal#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Modal#type
	* @type string
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Modal#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Modal#isActive
	* @function
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Modal#show
	* @function
	* @returns itself
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Modal#hide
	* @function
	* @returns itself
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Modal#width
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Modal#height
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Modal#position
	* @function
	* @example
	* // Change component's position.
	* me.position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/

	if (that.element.tagName === "INPUT" && that.element.type === "submit") {
		that.$element.parents("form").bind("submit", function (event) { that.innerShow(event); });
	} else {
		that.$element.bind("click", function (event) { that.innerShow(event); });
	}

	/**
	* Triggers when component is visible.
	* @name ch.Modal#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Modal#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use.
	* @name ch.Modal#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("modal");


/**
* Transition
* @name Transition
* @class Transition
* @interface
* @augments ch.Floats
* @requires ch.Modal
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @param {Number || String} [conf.width] Sets width property of the component's layout. By default, the width is "500px".
* @param {Number || String} [conf.height] Sets height property of the component's layout. By default, the height is elastic.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {Boolean} [conf.cache] Enable or disable the content cache. By default, the cache is enable.
* @returns itself
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Zoom
* @example
* // Create a new modal window with configuration.
* var me = $("a.example").transition({
*     "content": "Some content here!",
*     "width": "500px",
*     "height": 350,
*     "cache": false,
*     "fx": false
* });
*/

ch.extend("modal").as("transition", function (conf) {
	
	conf.closeButton = false;
	
	conf.msg = conf.msg || conf.content || "Please wait...";
	
	conf.content = $("<div class=\"loading\"></div><p>" + conf.msg + "</p>");
	
	return conf;
});
/**
* Validate numbers.
* @name Number
* @class Number
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a number validation
* $("input").number("This field must be a number.");
*/
ch.extend("validation").as("number", function(conf) {
	
	// Define the conditions of this interface
	conf.condition = {
		name: "number",
		patt: /^(-?[0-9\s]+)$/,
		message: conf.msg || conf.message
	};

	return conf;

});

/**
* Validate a number with a minimun value.
* @name Min
* @class Min
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* $("input").min(10, "Write a number bigger than 10");
*/
ch.extend("validation").as("min", function (conf) {

	conf.condition = {
		name: "min",
		expr: function(a,b) { return a >= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});


/**
* Validate a number with a maximun value.
* @name Max
* @class Max
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* $("input").max(10, "Write a number smaller than 10");
*/
ch.extend("validation").as("max", function (conf) {

	conf.condition = {
		name: "max",
		expr: function(a,b) { return a <= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});

/**
* Validate a number with a price format.
* @name Price
* @class Price
* @interface
* @augments ch.Controls* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* $("input").price("Write valid price.");
*/
ch.extend("validation").as("price", function (conf) {

	conf.condition = {
		name: "price",
		patt: /^(\d+)[.,]?(\d?\d?)$/,
		message: conf.msg || conf.message
	};

	return conf;

});/**
* Positioner is an utility that centralizes and manages changes related to positioned elements, and returns an utility that resolves positioning for all UI-Objects.
* @name Positioner
* @class Positioner
* @requires Viewport
* @memberOf ch
* @param {Object} conf Configuration object with positioning properties.
* @param {String} conf.element Reference to the DOM Element to be positioned.
* @param {String} [conf.context] It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
* @param {String} [conf.points] Points where element will be positioned, specified by configuration or centered by default.
* @param {String} [conf.offset] Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
* @param {Boolean} [conf.reposition] Parameter that enables or disables reposition intelligence. It's disabled by default.
* @requires ch.Viewport
* @returns Object
* @example
* // An Element centered into the Viewport (default behavior)
* ch.positioner({
*     element: "#element1",
* });
* @example
* // An Element positioned relative to a Context through defined points
* // The Element left-top point will be the same as Context right-bottom point
* ch.positioner({
*     element: "#element2",
*     context: "#context2",
*     points: "lt rt"
* });
* @example
* // An Element displaced horizontally by 10px of defined position
* ch.positioner({
*     element: "#element3",
*     context: "#context3",
*     points: "lt rt",
*     offset: "10 0"
* });
* @example
* // Repositionable Element if it can't be shown into viewport area
* ch.positioner({
*     element: "#element4",
*     context: "#context4",
*     points: "lt rt",
*     reposition: true
* });
*/

ch.positioner = (function () {

	/**
	* Map that references the input points to an output friendly classname.
	* @private
	* @constant
	* @name ch.Positioner#CLASS_MAP
	* @type Object
	*/
	// TODO: include more specifications like ch-in ch-out
	// TODO: analize if reduct classnames amount. example:ch-out-left-bottom
	// TODO: complete classnames with all supported positions
	var CLASS_MAP = {
		"lt lb": "ch-left ch-bottom",
		"lb lt": "ch-left ch-top",
		"lt rt": "ch-right",
		"rt rb": "ch-right ch-bottom",
		"rb rt": "ch-right ch-top",
		"cm cm": "ch-center"
	},

	/**
	* Reference that allows to know when window is being scrolled or resized.
	* @private
	* @name ch.Positioner#changing
	* @type Boolean
	*/
		changing = false,

	/**
	* Checks if window is being scrolled or resized, updates viewport position and triggers internal Change event.
	* @private
	* @name ch.Positioner#triggerScroll
	* @function
	*/
		triggerChange = function () {
			// No changing, no execution
			if (!changing) { return; }

			// Updates viewport position
			ch.viewport.getOffset();

			/**
			* Triggers when window is being scrolled or resized.
			* @private
			* @name ch.Positioner#change
			* @event
			*/
			ch.utils.window.trigger(ch.events.VIEWPORT.CHANGE);

			// Change scrolling status
			changing = false;
		};

	// Resize and Scroll events binding. These updates respectives boolean variables
	ch.utils.window.bind("resize scroll", function () { changing = true; });

	// Interval that checks for resizing status and triggers specific events
	setInterval(triggerChange, 350);

	// Returns Positioner Abstract Component
	return function (conf) {

		// Validation for required "element" parameter
		if (!ch.utils.hasOwn(conf, "element")) {
			alert("Chico UI error: Expected to find \"element\" as required configuration parameter of ch.Positioner");

			return;
		}

		/**
		* Configuration parameter that enables or disables reposition intelligence. It's disabled by default.
		* @private
		* @name ch.Positioner#reposition
		* @type Boolean
		* @default false
		* @example
		* // Repositionable Element if it can't be shown into viewport area
		* ch.positioner({
		*     element: "#element1",
		*     reposition: true
		* });
		*/
		conf.reposition = conf.reposition || false;

		/**
		* Reference that saves all members to be published.
		* @private
		* @name ch.Positioner#that
		* @type Object
		*/
		var that = {},

		/**
		* Reference to the DOM Element to be positioned.
		* @private
		* @name ch.Positioner#$element
		* @type jQuery Object
		*/
			$element = $(conf.element),

		/**
		* Points where element will be positioned, specified by configuration or centered by default.
		* @private
		* @name ch.Positioner#points
		* @type String
		* @default "cm cm"
		* @example
		* // Element left-top point = Context right-bottom point
		* ch.positioner({
		*     element: "#element1",
		*     points: "lt rt"
		* });
		* @example
		* // Element center-middle point = Context center-middle point
		* ch.positioner({
		*     element: "#element2",
		*     points: "cm cm"
		* });
		*/
			points = conf.points || "cm cm",

		/**
		* Offset in pixels that element will be displaced from original position determined by points. It's specified by configuration or zero by default.
		* @private
		* @name ch.Positioner#offset
		* @type {Array} X and Y references determined by "offset" configuration parameter.
		* @default "0 0"
		* @example
		* // Moves 5px to right and 5px to bottom
		* ch.positioner({
		*     element: "#element1",
		*     offset: "5 5"
		* });
		* // It will be worth:
		* offset[0] = 5;
		* offset[1] = 5;
		* @example
		* // Moves 10px to right and 5px to top
		* ch.positioner({
		*     element: "#element1",
		*     offset: "10 -5"
		* });
		* // It will be worth:
		* offset[0] = 10;
		* offset[1] = -5;
		*/
			offset = (conf.offset || "0 0").split(" "),

		/**
		* Defines context element, its size, position, and methods to recalculate all.
		* @function
		* @name ch.Positioner#getContext
		* @returns Context Object
		*/
			getContext = function () {

				// Parse as Integer offset values
				offset[0] = parseInt(offset[0], 10);
				offset[1] = parseInt(offset[1], 10);

				// Context by default is viewport
				if (!ch.utils.hasOwn(conf, "context") || !conf.context || conf.context === "viewport") {
					contextIsNotViewport = false;
					return ch.viewport;
				}

				// Context from configuration
				// Object to be returned.
				var self = {};

				/**
				* Width of context.
				* @private
				* @name width
				* @type Number
				* @memberOf ch.Positioner#context
				*/
				self.width =

				/**
				* Height of context.
				* @private
				* @name height
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.height =

				/**
				* Left offset of context.
				* @private
				* @name left
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.left =

				/**
				* Top offset of context.
				* @private
				* @name top
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.top =

				/**
				* Right offset of context.
				* @private
				* @name right
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.right =

				/**
				* Bottom offset of context.
				* @private
				* @name bottom
				* @type Number
				* @memberOf ch.Positioner#context
				*/
					self.bottom = 0;

				/**
				* Context HTML Element.
				* @private
				* @name element
				* @type HTMLElement
				* @memberOf ch.Positioner#context
				*/
				self.element = $(conf.context);

				/**
				* Recalculates width and height of context and updates size on context object.
				* @private
				* @function
				* @name getSize
				* @returns Object
				* @memberOf ch.Positioner#context
				*/
				self.getSize = function () {

					return {
						"width": context.width = self.element.outerWidth(),
						"height": context.height = self.element.outerHeight()
					};

				};
				
				/**
				* Recalculates left and top of context and updates offset on context object.
				* @private
				* @function
				* @name getOffset
				* @returns Object
				* @memberOf ch.Positioner#context
				*/
				self.getOffset = function () {

					// Gets offset of context element
					var contextOffset = self.element.offset(),
						size = self.getSize(),
						scrollLeft = contextOffset.left, // + offset[0], // - relativeParent.left,
						scrollTop = contextOffset.top; // + offset[1]; // - relativeParent.top;

					if (!parentIsBody) {
						scrollLeft -= relativeParent.left,
						scrollTop -= relativeParent.top;
					}
					
					// Calculated including offset and relative parent positions
					return {
						"left": context.left = scrollLeft,
						"top": context.top = scrollTop,
						"right": context.right = scrollLeft + size.width,
						"bottom": context.bottom = scrollTop + size.height
					};
				};

				contextIsNotViewport = true;

				return self;
			},

		/**
		* Reference that allows to know if context is different to viewport.
		* @private
		* @name ch.Positioner#contextIsNotViewport
		* @type Boolean
		*/
			contextIsNotViewport,

		/**
		* It's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the viewport.
		* @private
		* @name ch.Positioner#context
		* @type Object
		* @default ch.Viewport
		*/
			context = getContext(),
		
		/**
		* Reference to know if direct parent is the body HTML element.
		* @private
		* @name ch.Positioner#parentIsBody
		* @type Boolean
		*/
			parentIsBody,

		/**
		* It's the first of context's parents that is styled positioned. If it isn't defined through configuration, it will be the HTML Body Element.
		* @private
		* @name ch.Positioner#relativeParent
		* @type Object
		* @default HTMLBodyElement
		*/
			relativeParent = (function () {

				// Context's parent that's positioned.
				var element = (contextIsNotViewport) ? context.element.offsetParent()[0] : ch.utils.body[0],

				// Object to be returned.
					self = {};

				/**
				* Left offset of relative parent.
				* @private
				* @name left
				* @type Number
				* @memberOf ch.Positioner#relativeParent
				*/
				self.left =

				/**
				* Top offset of relative parent.
				* @private
				* @name top
				* @type Number
				* @memberOf ch.Positioner#relativeParent
				*/
					self.top = 0;

				/**
				* Recalculates left and top of relative parent of context and updates offset on relativeParent object.
				* @private
				* @name getOffset
				* @function
				* @memberOf ch.Positioner#relativeParent
				* @returns Offset Object
				*/
				// TODO: on ie6 the relativeParent border push too (also on old positioner)
				self.getOffset = function () {
					// If first parent relative is Body, don't recalculate position
					if (element.tagName === "BODY") { return; }

					// Offset of first parent relative
					var parentOffset = $(element).offset(),

					// Left border width of context's parent.
						borderLeft = parseInt(ch.utils.getStyles(element, "border-left-width"), 10),

					// Top border width of context's parent.
						borderTop = parseInt(ch.utils.getStyles(element, "border-top-width"), 10);

					// Returns left and top position of relative parent and updates offset on relativeParent object.
					return {
						"left": relativeParent.left = parentOffset.left + borderLeft,
						"top": relativeParent.top = parentOffset.top + borderTop
					};
				};
				
				return self;
			}()),

		/**
		* Calculates left and top position from specific points.
		* @private
		* @name ch.Positioner#getCoordinates
		* @function
		* @param {String} points String with points to be calculated.
		* @returns Offset measures
		* @example
		* var foo = getCoordinates("lt rt");
		* 
		* foo = {
		*     left: Number,
		*     top: Number
		* };
		*/
			getCoordinates = function (pts) {

				// Calculates left or top position from points related to specific axis (X or Y).
				// TODO: Complete cases: X -> lc, cl, rc, cr. Y -> tm, mt, bm, mb.
				var calculate = function (reference) {

					// Use Position or Offset of Viewport if position is fixed or absolute respectively
					var ctx = (!contextIsNotViewport && ch.features.fixed) ? ch.viewport.getPosition() : context,
					
					// Returnable value
						r;

					switch (reference) {
					// X references
					case "ll": r = ctx.left + offset[0]; break;
					case "lr": r = ctx.right + offset[0]; break;
					case "rl": r = ctx.left - $element.outerWidth() + offset[0]; break;
					case "rr": r = ctx.right - $element.outerWidth() + offset[0]; break;
					case "cc": r = ctx.left + (ctx.width / 2) - ($element.outerWidth() / 2) + offset[0]; break;
					// Y references
					case "tt": r = ctx.top + offset[1]; break;
					case "tb": r = ctx.bottom + offset[1]; break;
					case "bt": r = ctx.top - $element.outerHeight() + offset[1]; break;
					case "bb": r = ctx.bottom - $element.outerHeight() + offset[1]; break;
					case "mm": r = ctx.top + (ctx.height / 2) - ($element.outerHeight() / 2) + offset[1]; break;
					}

					return r;
				},

				// Splitted points
					splittedPoints = pts.split(" ");

				// Calculates left and top with references to X and Y axis points (crossed points)
				return {
					"left": calculate(splittedPoints[0].charAt(0) + splittedPoints[1].charAt(0)),
					"top": calculate(splittedPoints[0].charAt(1) + splittedPoints[1].charAt(1))
				};
			},

		/**
		* Gets new coordinates and checks its space into viewport.
		* @private
		* @name ch.Positioner#getPosition
		* @function
		* @returns Offset measures
		*/
			getPosition = function () {

				// Gets coordinates from main points
				var coordinates = getCoordinates(points);

				// Update friendly classname
				// TODO: Is this ok in this place?
				friendly = CLASS_MAP[points];

				// Default behavior: returns left and top offset related to main points
				if (!conf.reposition) { return coordinates; }

				if (points !== "lt lb" && points !== "rt rb" && points !== "lt rt") { return coordinates; }

				// Intelligence
				// TODO: Improve and unify intelligence code
				var newData,
					newPoints = points,
					offsetX = /*relativeParent.left + */offset[0],
					offsetY = /*relativeParent.top + */offset[1];
				
				if (!parentIsBody) {
					offsetX += relativeParent.left;
					offsetY += relativeParent.top;
				}

				// Viewport limits (From bottom to top)
				if (coordinates.top + offsetY + $element.outerHeight() > ch.viewport.bottom && points !== "lt rt") {
					newPoints = newPoints.charAt(0) + "b " + newPoints.charAt(3) + "t";
					newData = getCoordinates(newPoints);

					newData.friendly = CLASS_MAP[newPoints];

					if (newData.top + offsetY > ch.viewport.top) {
						coordinates.top = newData.top - (2 * offset[1]);
						coordinates.left = newData.left;
						friendly = newData.friendly;
					}
				}

				// Viewport limits (From right to left)
				if (coordinates.left + offsetX + $element.outerWidth() > ch.viewport.right) {
					// TODO: Improve this
					var orientation = (newPoints.charAt(0) === "r") ? "l" : "r";
					// TODO: Use splice or slice
					newPoints = orientation + newPoints.charAt(1) + " " + orientation + newPoints.charAt(4);

					newData = getCoordinates(newPoints);
					newData.friendly = CLASS_MAP[newPoints];

					if (newData.left + offsetX > ch.viewport.left) {
						coordinates.top = newData.top;
						coordinates.left = newData.left - (2 * offset[0]);
						friendly = newData.friendly;
					}
				}

				// Returns left and top offset related to modified points
				return coordinates;
			},

		/**
		* Reference that stores last changes on coordinates for evaluate necesaries redraws.
		* @private
		* @name ch.Positioner#lastCoordinates
		* @type Object
		*/
			lastCoordinates = {},

		/**
		* Checks if there are changes on coordinates to reposition the element.
		* @private
		* @name ch.Positioner#draw
		* @function
		*/
			draw = function () {

				// New element position
				var coordinates,
					
				// Removes all classnames related to friendly positions and adds classname for new points
				// TODO: improve this method. maybe knowing which one was the last added classname
					updateClassName = function ($element) {
						$element.removeClass("ch-left ch-top ch-right ch-bottom ch-center").addClass(friendly);
					};

				// Gets definitive coordinates for element repositioning
				coordinates = getPosition();

				// Coordinates equal to last coordinates means that there aren't changes on position
				if (coordinates.left === lastCoordinates.left && coordinates.top === lastCoordinates.top) {
					return;
				}

				// If there are changes, it stores new coordinates on lastCoordinates
				lastCoordinates = coordinates;

				// Element reposition (Updates element position based on new coordinates)
				updateClassName($element.css({ "left": coordinates.left, "top": coordinates.top }));

				// Context class-names
				if (contextIsNotViewport) { updateClassName(context.element); }
			},

		/**
		* Constructs a new position, gets viewport size, checks for relative parent's offset,
		* finds the context and sets the position to a given element.
		* @private
		* @function
		* @constructs
		* @name ch.Positioner#init
		*/
			init = function () {
				// Calculates viewport position for prevent auto-scrolling
				//ch.viewport.getOffset();
				
				// Refresh parent parameter
				// TODO: Put this code in some better place, where it's been calculated few times
				parentIsBody = $element.parent().length > 0 && $element.parent().prop("tagName") === "BODY";
				
				// Calculates relative parent position
				relativeParent.getOffset();

				// If context isn't the viewport, calculates its position and size
				if (contextIsNotViewport) { context.getOffset(); }

				// Calculates coordinates and redraws if it's necessary	
				draw();
			},

		/**
		* Listen to LAYOUT.CHANGE and VIEWPORT.CHANGE events and recalculate data as needed.
		* @private
		* @function
		* @name ch.Positioner#changesListener
		*/
			changesListener = function (event) {
				// Only recalculates if element is visible
				if (!$element.is(":visible")) { return; }
	
				// If context isn't the viewport...
				if (contextIsNotViewport) {
					// On resize and layout change, recalculates relative parent position
					relativeParent.getOffset();
	
					// Recalculates its position and size
					context.getOffset();
				}
	
				draw();
			},

		/**
		* Position "element" as fixed or absolute as needed.
		* @private
		* @function
		* @name ch.Positioner#addCSSproperties
		*/
			addCSSproperties = function () {

				// Fixed position behavior
				if (!contextIsNotViewport && ch.features.fixed) {

					// Sets position of element as fixed to avoid recalculations
					$element.css("position", "fixed");

					// Bind reposition only on resize
					ch.utils.window.bind("resize", changesListener);

				// Absolute position behavior
				} else {

					// Sets position of element as absolute to allow continuous positioning
					$element.css("position", "absolute");

					// Bind reposition recalculations (scroll, resize and changeLayout)
					ch.utils.window.bind(ch.events.VIEWPORT.CHANGE + " " + ch.events.LAYOUT.CHANGE, changesListener);
				}

			},

		/**
		* Friendly classname relative to position points.
		* @private
		* @name ch.Positioner#friendly
		* @type Boolean
		* @default "ch-center"
		*/
			friendly = CLASS_MAP[points];

		/**
		* Control object that allows to change configuration properties, refresh current position or get current configuration.
		* @public
		* @name ch.Positioner#position
		* @function
		* @param {Object} [o] Configuration object.
		* @param {String} ["refresh"] Refresh current position.
		* @returns Control Object
		* @example
		* // Sets a new configuration
		* var foo = ch.positioner({ ... });
		*     foo.position({ ... });
		* @example
		* // Refresh current position
		*     foo.position("refresh");
		* @example
		* // Gets current configuration properties
		*     foo.position();
		*/
		that.position = function (o) {

			var r = that;

			switch (typeof o) {
			
			// Changes configuration properties and repositions the element
			case "object":
				// New points
				if (ch.utils.hasOwn(o, "points")) { points = o.points; }

				// New reposition
				if (ch.utils.hasOwn(o, "reposition")) { conf.reposition = o.reposition; }

				// New offset (splitted)
				if (ch.utils.hasOwn(o, "offset")) { offset = o.offset.split(" "); }

				// New context
				if (ch.utils.hasOwn(o, "context")) {
					// Sets conf value
					conf.context = o.context;

					// Clear the conf.context variable
					if (o.context === "viewport") { conf.context = undefined; }

					// Regenerate the context object
					context = getContext();
					
					// Update CSS properties to element (position fixed or absolute)
					addCSSproperties();
				}

				// Reset
				init();

				break;

			// Refresh current position
			case "string":
				if (o !== "refresh") {
					alert("Chico UI error: expected to find \"refresh\" parameter on position() method of Positioner component.");
				}

				// Reset
				init();

				break;

			// Gets current configuration
			case "undefined":
			default:
				r = {
					"context": context.element,
					"element": $element,
					"points": points,
					"offset": offset.join(" "),
					"reposition": conf.reposition
				};

				break;
			}

			return r;
		};

		/**
		* @ignore
		*/

		// Apply CSS properties to element (position fixed or absolute)
		addCSSproperties();

		// Inits positioning
		init();

		return that.position;
	};

}());/**
* Creates required validations.
* @name Required
* @class Required
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {String} [message] Validation message.
* @returns itself
* @see ch.Validation
* @see ch.Custom
* @see ch.Number
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* // Simple validation
* $("input").required("This field is required");
*/
ch.extend("validation").as("required", function(conf) {

	conf.condition = {
		name: "required",
		expr: function(e) {

			var $e = $(e);

			var tag = ( $e.hasClass("options") || $e.hasClass("ch-form-options")) ? "OPTIONS" : e.tagName;
			switch (tag) {
				case 'OPTIONS':
					return $e.find('input:checked').length !== 0;
				break;

				case 'SELECT':
					var val = $e.val();
					return (val != "-1" && val != "");
				break;

				case 'INPUT':
				case 'TEXTAREA':
					return $.trim($e.val()).length !== 0;
				break;
			};
		},
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});/**
* Validate strings.
* @name String 
* @class String
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {String} [message] Validation message
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a string validation
* $("input").string("This field must be a string.");
*/
ch.extend("validation").as("string", function (conf) {

	conf.condition = {
		name: "string",
		// the following regular expression has the utf code for the lating characters
		// the ranges are A,EI,O,U,a,ei,o,u,ç,Ç please for reference see http://www.fileformat.info/info/charset/UTF-8/list.htm
		patt: /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
		message: conf.msg || conf.message
	};

	return conf;

});

/**
* Validate email sintaxis.
* @name Email
* @class Email
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {String} [message] Validation message
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a email validation
* $("input").email("This field must be a valid email.");
*/
ch.extend("validation").as("email", function (conf) {

	conf.condition = {
		name: "email",
		patt: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
		message: conf.msg || conf.message
	};

	return conf;

});

/**
* Validate URL sintaxis.
* @name Url
* @class Url
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {String} [message] Validation message
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a URL validation
* $("input").url("This field must be a valid URL.");
*/
ch.extend("validation").as("url", function (conf) {

	conf.condition = {
		name: "url",
		patt: /^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/,
		message: conf.msg || conf.message
	};

	return conf;

});


/**
* Validate a minimun amount of characters.
* @name MinLength
* @class MinLength
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Number} value Minimun number value.
* @param {String} [message] Validation message
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a minLength validation
* $("input").minLength(10, "At least 10 characters..");
*/
ch.extend("validation").as("minLength", function (conf) {

	conf.condition = {
		name: "minLength",
		expr: function(a,b) { return a.length >= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});


/**
* Validate a maximun amount of characters.
* @name MaxLength
* @class MaxLength
* @interface
* @augments ch.Controls
* @requires ch.Validation
* @memberOf ch
* @param {Number} value Maximun number value.
* @param {String} [message] Validation message
* @returns itself
* @see ch.Validation
* @see ch.Required
* @see ch.Custom
* @see ch.Number
* @see ch.Validator
* @see ch.Condition
* @example
* // Create a maxLength validation
* $("input").maxLength(10, "No more than 10 characters..");
*/
ch.extend("validation").as("maxLength", function (conf) {

	conf.condition = {
		name: "maxLength",
		expr: function(a,b) { return a.length <= b },
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});/**
* TabNavigator UI-Component for static and dinamic content.
* @name TabNavigator
* @class TabNavigator
* @augments ch.Controllers
* @requires ch.Tab
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded. By default, the value is 1.
* @returns itself
* @example
* // Create a new Tab Navigator with configuration.
* var me = $(".example").tabNavigator({
*     "selected": 2
* });
* @example
* // Create a new Tab Navigator without configuration.
* var me = $(".example").tabNavigator();
*/

ch.tabNavigator = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.TabNavigator#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.controllers.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* The actual location hash, is used to know if there's a specific tab selected.
	* @private
	* @name ch.TabNavigator#hash
	* @type string
	*/
	var hash = window.location.hash.replace("#!", ""),

	/**
	* A boolean property to know if the some tag should be selected.
	* @private
	* @name ch.TabNavigator#hashed
	* @type boolean
	* @default false
	*/
		hashed = false,

	/**
	* Get wich tab is selected.
	* @private
	* @name ch.TabNavigator#selected
	* @type number
	*/
		selected = conf.selected - 1 || conf.value - 1 || 0,

	/**
	* Create controller's children.
	* @private
	* @name ch.TabNavigator#createTabs
	* @function
	*/
		createTabs = function () {
	
			// Children
			that.$triggers.find("a").each(function (i, e) {
	
				// Tab context
				var tab = {};
					tab.uid = that.uid + "#" + i;
					tab.type = "tab";
					tab.element = e;
					tab.$element = $(e);
					tab.controller = that["public"];
	
				// Tab configuration
				var config = {};
					config.open = (selected == i);
					config.onShow = function () { selected = i; };
				
				if (ch.utils.hasOwn(that.conf, "cache")) { config.cache = that.conf.cache; }
	
				/**
				* Callback function
				* @name ch.TabNavigator#onContentLoad
				* @event
				* @public
				*/
				if (ch.utils.hasOwn(that.conf, "onContentLoad")) { config.onContentLoad = that.conf.onContentLoad; }
				
				/**
				* Callback function
				* @name ch.TabNavigator#onContentError
				* @event
				* @public
				*/
				if (ch.utils.hasOwn(that.conf, "onContentError")) { config.onContentError = that.conf.onContentError; }
	
				// Create Tabs
				that.children.push(ch.tab.call(tab, config));
	
				// Bind new click to have control
				$(e).unbind("click").bind("click", function (event) {
					that.prevent(event);
					select(i + 1);
				});
	
			});
	
			return;
	
		},

	/**
	* Select a child to show its content.
	* @name ch.TabNavigator#select
	* @private
	* @function
	*/
		select = function (tab) {
	
			tab = that.children[tab - 1];

			// Don't click me if I'm open
			if (tab === that.children[selected]) { return; }
	
			// Hide my open bro
			$.each(that.children, function (i, e) {
				if (tab !== e) { e.hide(); }
			});
	
			tab.show();
	
			//Change location hash
			window.location.hash = "#!" + tab.$content.attr("id");
	
			/**
			* Callback function
			* @name ch.TabNavigator#onSelect
			* @event
			* @public
			*/
			that.callbacks("onSelect");
			// new callback
			that.trigger("select");
	
			return that;
			
		};

/**
*	Protected Members
*/

	/**
	* The component's triggers container.
	* @private
	* @name ch.TabNavigator#$triggers
	* @type jQuery
	*/
	that.$triggers = that.$element.children(":first").addClass("ch-tabNavigator-triggers").attr("role", "tablist");

	/**
	* The component's content.
	* @private
	* @name ch.TabNavigator#$content
	* @type jQuery
	*/
	that.$content = that.$triggers.next().addClass("ch-tabNavigator-content box").attr("role", "presentation");


/**
*	Public Members
*/

	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.TabNavigator#uid
	* @type number
	*/

	/**
	* The element reference.
	* @public
	* @name ch.TabNavigator#element
	* @type HTMLElement
	*/

	/**
	* The component's type.
	* @public
	* @name ch.TabNavigator#type
	* @type string
	*/

	/**
	* Children instances associated to this controller.
	* @public
	* @name ch.TabNavigator#children
	* @type collection
	*/
	that["public"].children = that.children;

	/**
	* Select a specific child.
	* @public
	* @function
	* @name ch.TabNavigator#select
	* @param {number} tab Tab's index.
	*/
	that["public"].select = function (tab) {
		select(tab);

		return that["public"];
	};

	/**
	* Returns the selected child's index.
	* @public
	* @function
	* @name ch.TabNavigator#getSelected
	* @returns {number} selected Tab's index.
	*/
	that["public"].getSelected = function () { return (selected + 1); };

/**
*	Default event delegation
*/

	that.$element.addClass("ch-tabNavigator");

	createTabs();

	// Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i -= 1;) {
		if (that.children[i].$content.attr("id") === hash) {
			select(i + 1);

			hashed = true;

			break;
		};
	};
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.TabNavigator#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as tabNavigator's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	//This avoit to trigger execute after the component was instanciated
	setTimeout(function(){that.trigger("ready")}, 50);

	return that;

};

ch.factory("tabNavigator");

/**
* Simple unit of content for TabNavigators.
* @abstract
* @name Tab
* @class Tab
* @augments ch.Navs
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
*/

ch.tab = function (conf) {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tab#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);
	conf.icon = false;

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	/**
	* Creates the basic structure for the tab's content.
	* @private
	* @name ch.Tab#createContent
	* @function
	*/
	var createContent = function () {
		
		var href = that.element.href.split("#"),
			controller = that.$element.parents(".ch-tabNavigator"),
			content = controller.find("#" + href[1]);

		// If there are a tabContent...
		if (content.length > 0) {

			return content;

		// If tabContent doesn't exists
		} else {
			/**
			* Content configuration property.
			* @public
			* @name ch.Tab#source
			* @type string
			*/
			that.source = that.element.href;

			var id = (href.length === 2) ? href[1] : "ch-tab" + that.uid.replace("#", "-");

			// Create tabContent
			return $("<div id=\"" + id + "\" role=\"tabpanel\" class=\"ch-hide\">").appendTo(controller.children().eq(1));
		}

	};

/**
*	Protected Members
*/
	/**
	* Reference to the trigger element.
	* @private
	* @name ch.Tab#$trigger
	* @type jQuery
	*/
	that.$trigger = that.$element;

	/**
	* The component's content.
	* @private
	* @name ch.Tab#$content
	* @type jQuery
	*/
	that.$content = createContent();

	/**
	* Process the show event.
	* @private
	* @function
	* @name ch.Tab#show
	* @returns jQuery
	*/
	that.show = function (event) {
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if (ch.utils.hasOwn(that, "source")) { that.content(); }

		// Show me
		that.parent.show(event);

		// Set me as hidden false
		that.$content.attr("aria-hidden", "false");
		
		// It removes the class ch-js-hide because the content be visible on click
		//that.$content.hasClass('ch-js-hide')?that.$content.removeClass('ch-js-hide'):null;

		// When click or enter to the tab, then it will be focused
		// Deprecated: Issue GH-346
		//that.$trigger.focus();

		return that;
	};
	
	/**
	* Process the hide event.
	* @private
	* @function
	* @name ch.Tab#hide
	* @returns jQuery
	*/
	that.hide = function (event) {
		that.prevent(event);

		// Hide me
		that.parent.hide(event);

		// Set all inactive tabs as hidden
		that.$content.attr("aria-hidden", "true");

		return that;
	};

	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @protected
	* @name ch.Tab#contentCallback
	*/
	that["public"].on("contentLoad", function (event, context) {

		that.$content.html(that.staticContent);

		if (ch.utils.hasOwn(conf, "onContentLoad")) {
			conf.onContentLoad.call(context, that.staticContent);
		}

	});

	/**
	* This callback is triggered when async request fails.
	* @public
	* @name contentCallback
	* @returns {Chico-UI Object}
	* @memberOf ch.TabNavigator
	*/
	that["public"].on("contentError", function (event, data) {

		that.$content.html(that.staticContent);

		// Get the original that.source
		var originalSource = that.source;

		if (ch.utils.hasOwn(conf, "onContentError")) {
			conf.onContentError.call(data.context, data.jqXHR, data.textStatus, data.errorThrown);
		}

		// Reset content configuration
		that.source = originalSource;
		
		that.staticContent = undefined;

	});

/**
*	Public Members
*/

/**
*	Default event delegation
*/

	that.configBehavior();
	
	// Add the attributes for WAI-ARIA to the tabs and tabpanel
	that.$content.attr({
		"role": "tabpanel",
		"aria-hidden": that.$content.hasClass("ch-hide")
	});
	
	that.$trigger.attr({
		"role": "tab",
		"arial-controls": that.$content.attr("id")
	});
		
	return that;
}/**
* Simple Tooltip UI-Object. It uses the 'alt' and 'title' attributes to grab its content.
* @name Tooltip
* @class Tooltip
* @augments ch.Floats
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are enable.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or centered by default: "cm cm".
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @returns itself
* @see ch.Modal
* @see ch.Layer
* @see ch.Zoom
* @example
* // Create a new tooltip with configuration.
* var me = $("a.example").tooltip({
*     "fx": false,
*     "offset": "10 -10",
*     "points": "lt rt"
* });
* @example
* // Create a simple tooltip
* var me = $(".some-element").tooltip();
* @example
* // Now 'me' is a reference to the tooltip instance controller.
* // You can set a new content by using 'me' like this: 
* me.width(300);
*/

ch.tooltip = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Tooltip#that
	* @type object
	*/
	var that = this;

	conf = ch.clon(conf);

	conf.cone = true;
	conf.content = "<span>" + (that.element.title || that.element.alt) + "</span>";
	conf.closeButton = ch.utils.hasOwn(conf, "closeButton");

	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";

	conf.position = {};
	conf.position.context = $(that.element);
	conf.position.offset = conf.offset || "0 10";
	conf.position.points = conf.points || "lt lb";

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/
	/**
	* The attribute that will provide the content. It can be "title" or "alt" attributes.
	* @protected
	* @name ch.Tooltip#attrReference
	* @type string
	*/
	var attrReference = (that.element.title) ? "title" : "alt",

	/**
	* The original attribute content.
	* @private
	* @name ch.Tooltip#attrContent
	* @type string
	*/
		attrContent = that.element.title || that.element.alt;

/**
*	Protected Members
*/

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @name ch.Tooltip#innerShow
	* @function
	* @returns itself
	*/
	that.innerShow = function (event) {
		
		// Reset all tooltip, except me
		$.each(ch.instances.tooltip, function (i, e) {
			if (e !== that["public"]) {
				e.hide();
			}
		});
		
		// IE8 remembers the attribute even when is removed, so ... empty the attribute to fix the bug.
		that.element[attrReference] = "";

		that.parent.innerShow(event);

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @name ch.Tooltip#innerHide
	* @function
	* @returns itself
	*/
	that.innerHide = function (event) {
		that.element[attrReference] = attrContent;

		that.parent.innerHide(event);

		return that;
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Tooltip#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Tooltip#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Tooltip#type
	* @type string
	*/

	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'me.content()'. To define a new content pass an argument to it, like 'me.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Tooltip#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @example
	* // Get the defined content
	* me.content();
	* @example
	* // Set static content
	* me.content("Some static content");
	* @example
	* // Set DOM content
	* me.content("#hiddenContent");
	* @example
	* // Set AJAX content
	* me.content("http://chico.com/some/content.html");
	* @see ch.Object#content
	*/

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @name ch.Tooltip#isActive
	* @function 
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Tooltip#show
	* @function
	* @returns itself
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @name ch.Tooltip#hide
	* @function
	* @returns itself
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @name ch.Tooltip#width
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the width
	* me.width(700);
	* @example
	* // to get the width
	* me.width // 700
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @name ch.Tooltip#height
	* @function
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // to set the heigth
	* me.height(300);
	* @example
	* // to get the heigth
	* me.height // 300
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @name ch.Tooltip#position
	* @example
	* // Change component's position.
	* me.position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @see ch.Object#position
	*/

/**
*	Default event delegation
*/

	that.$element
		.bind("mouseenter", that.innerShow)
		.bind("mouseleave", that.innerHide);

	/**
	* Triggers when component is visible.
	* @name ch.Tooltip#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Tooltip#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when component is ready to use.
	* @name ch.Tooltip#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as tooltip's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("tooltip");/**
* Validation is a validation engine for html forms elements.
* @name Validation
* @class Validation
* @augments ch.Controls
* @requires ch.Form
* @requires ch.Validator
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @returns itself
* @see ch.Required
* @see ch.String
* @see ch.Number
* @see ch.Custom
*/

ch.validation = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Validation#that
	* @type itself
	*/
	var that = this;

	conf = ch.clon(conf);
	
	// Configuration by default
	conf.closeButton = ch.utils.hasOwn(conf, "closeButton");
	conf.offset = conf.offset || "15 0";
	conf.points = conf.points || "lt rt";

	that.conf = conf;

/**
* Inheritance
*/

	that = ch.controls.call(that);
	that.parent = ch.clon(that);

/**
* Private Members
*/

	// Reference to a Validator instance. If there isn't any, the Validation instance will create one.
	var validator = that.validator = (function(){
		var c = {};
			c.condition = conf.condition
	 	return that.$element.validator(c);
	})();

	/**
	* Search for instances of Validation with the same trigger, and then merge it's properties with it.
	* @private
	* @name ch.Validation#checkInstance
	* @function
	* @returns Object
	*/
	var checkInstance;
	if (checkInstance = function() {

		var instance, instances = ch.instances.validation;
		if ( instances && instances.length > 0 ) {
			for (var i = 0, j = instances.length; i < j; i+=1) {
				instance = instances[i];

				if (instance.element !== that.element) {
					continue;
				}

				return {
					exists: true,
					object: instance
				}
			}
		}
	}()){
		return checkInstance;
	};

	// Reference to a Form instance. If there isn't any, the Validation instance will create one.
	var form = that.form = (function() {
		if (ch.utils.hasOwn(ch.instances, "form") && ch.instances.form.length > 0) {
			var i = 0, j = ch.instances.form.length;
			for (i; i < j; i+=1) {
				if (ch.instances.form[i].element === that.$element.parents("form")[0]) {
					return ch.instances.form[i]; // Get my parent
				};
			};
		} else {
			that.$element.parents("form").form();
			var last = (ch.instances.form.length - 1);
			return ch.instances.form[last]; // Set my parent
		}
	})();
	form.children.push(that["public"]);

	/**
	* Validation event
	* @private
	* @name ch.Validation#validationEvent
	*/
	var validationEvent = (that.$element.hasClass("options") || that.$element.hasClass("ch-form-options") || that.element.tagName == "SELECT") ? "change" : "blur";

	var clear = function() {

		that.$element.removeClass("error ch-form-error");
		that.float.innerHide();

		validator.clear();

		/**
		* Triggers when al validations are cleared.
		* @name ch.Validation#clear
		* @event
		* @public
		* @example
		* me.on("clear",function(){
		*	submitButton.enable();
		* });
		*/
		// old callback system
		that.callbacks('onClear');
		// new callback
		that.trigger("clear");
	};

	/**
	* Returns a value of element
	* @private
	* @name ch.Validation#value
	* @function
	* @returns string
	*/
	var value = function(){
		return that.element.value;
	};


/**
* Protected Members
*/

	/**
	* Flag that let you know if the validations is enabled or not.
	* @protected
	* @name ch.Validation#enabled
	* @type boolean
	*/
	that.enabled = true;
	
	/**
	* Reference to the Float component instanced.
	* @protected
	* @type Object
	* @name ch.Validation#float
	*/
	that.float = that.createFloat({
		"$element": (function() {
			var reference;
			// CHECKBOX, RADIO
			if (that.$element.hasClass("options") || that.$element.hasClass("ch-form-options")) {
				// Helper reference from will be fired
				// H4
				if (that.$element.find("h4").length > 0) {
					var h4 = that.$element.find("h4"); // Find h4
						h4.wrapInner("<span>"); // Wrap content with inline element
					reference = h4.children(); // Inline element in h4 like helper reference
				// Legend
				} else if (that.$element.prev().prop("tagName") == "LEGEND") {
					reference = that.$element.prev(); // Legend like helper reference
				} else {
					reference = $(that.$element.find("label")[0]);
				}
			// INPUT, SELECT, TEXTAREA
			} else {
				reference = that.$element;
			}
			return reference;
		})(),
		"type": "validation",
		"content": "<p class=\"ch-message ch-error\">Error.</p>",
		"cone": true,
		"cache": false,
		"closeButton": conf.closeButton,
		"aria": {
			"role": "alert"
		},
		"offset": conf.offset,
		"points": conf.points
	});

	/**
	* Runs all validations to check if it has an error.
	* @protected
	* @type function
	* @returns boolean
	* @name ch.Validation#process
	*/
	that.process = function () {

		// Pre-validation: Don't validate disabled
		if (that.$element.attr('disabled') || !that.enabled) { return false; }

		/**
		* Triggers before start validation process.
		* @name ch.Validation#beforeValidate
		* @event
		* @public
		* @example
		* me.on("beforeValidate",function(event) {
		*	submitButton.disable();
		* });
		*/
		// old callback system
		that.callbacks('beforeValidate');
		// new callback
		that.trigger("beforeValidate");
		
		// Executes the validators engine with a specific value and returns an object.
		var gotError = validator.validate(value());

		// Save the validator's status.
		var status = !gotError.status;

		// If has Error...
		if (status) {

			if (that.$element.prop("tagName") === "INPUT" || that.$element.prop("tagName") === "TEXTAREA") {
				that.$element.addClass("error ch-form-error");
			}

			that.float["public"].show("<p class=\"ch-message ch-error\">" + (gotError.msg || form.messages[gotError.condition] || "Error") + "</p>");

			// Add blur or change event only one time
			if (!that.$element.data("events")) { that.$element.one(validationEvent, that.process); }

			/**
			* Triggers when an error occurs on the validation process.
			* @name ch.Validation#error
			* @event
			* @public
			* @example
			* me.on("error",function(event, condition) {
			*	if (condition === "required") {
			* 		errorModal.show();
			* 	}
			* });
			*/
			// old callback system
			that.callbacks('onError', gotError.condition);
			// new callback
			that.trigger("error", gotError.condition);

		// else NOT Error!
		} else {
			that.$element.removeClass("error ch-form-error");
			that.float.innerHide();
		}

		/**
		* Triggers when the validation process ends.
		* @name ch.Validation#afterValidate
		* @event
		* @public
		* @example
		* me.on("afterValidate",function(){
		*	submitButton.disable();
		* });
		*/
		// old callback system
		that.callbacks('afterValidate');
		// new callback
		that.trigger("afterValidate");

		return status;

	};


/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Validation#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Validation#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Validation#type
	* @type string
	*/
	that["public"].type = "validation"; // Everything is a "validation" type, no matter what interface is used

	/**
	* Deprecated: Used by the helper's positioner to do his magic.
	* @public
	* @deprecated
	* @name ch.Validation#reference
	* @type jQuery Object
	* @TODO: remove 'reference' from public scope
	*/
	//that["public"].reference = that.$reference;

	/**
	* Run all configured validations.
	* @public
	* @function
	* @name ch.Validation#hasError
	* @returns boolean
	*/
	that["public"].hasError = function(){
		return that.process();
	}
	
	/**
	* Run all configured validations.
	* @public
	* @function
	* @name ch.Validation#validate
	* @returns boolean
	*/
	that["public"].validate = function(){
		that.process();

		return that["public"];
	}

	/**
	* Clear all active validations.
	* @public
	* @name ch.Validation#clear
	* @function
	* @returns itself
	*/
	that["public"].clear = function() {
		clear();

		return that["public"];
	};

	/**
	* Let you keep chaining methods.
	* @public
	* @name ch.Validation#and
	* @function
	* @returns jQuery Object
	*/
	that["public"].and = function(){
		return that.$element;
	};

	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Validation#form
	* @type ch.Form
	* @see ch.Form
	*/
	that["public"].form = form;

	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @name ch.Validation#validator
	* @type ch.Validator
	* @see ch.Validator
	*/
	that["public"].validator = validator;
	
	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @Deprecated
	* @name ch.Validation#helper
	* @type ch.Helper
	* @see ch.Floats
	*/
	that["public"].helper = that.float["public"];
	
	/**
	* Is the little sign that floats showing the validation message. Is a Float component, so you can change it's content, width or height and change its visibility state.
	* @public
	* @since 0.10.2
	* @name ch.Validation#float
	* @type ch.Floats
	* @see ch.Floats
	*/
	that["public"].float = that.float["public"];

	/**
	* Turn on Validation and Validator engine or an specific condition.
	* @public
	* @name ch.Validation#enable
	* @function
	* @returns itself
	* @see ch.Validator
	*/
	that["public"].enable = function(condition){
		validator.enable(condition);

		if (!condition) {
			that.enabled = true;
		}

		return that["public"];
	}

	/**
	* Turn off Validation and Validator engine or an specific condition.
	* @public
	* @name ch.Validation#disable
	* @function
	* @returns itself
	* @see ch.Validator
	*/
	that["public"].disable = function (condition) {
		// Clean the validation if is active;
		clear();

		// Turn off validator
		validator.disable(condition);

		// Turn off validation, if all conditions are disabled
		if (!condition){
			that.enabled = false;
		}

		return that["public"];
	}


	/**
	* Turn off Validation and Validator engine or an specific condition.
	* @public
	* @name ch.Validation#isActive
	* @function
	* @returns boolean
	* @see ch.Validator
	*/
	that["public"].isActive = function(){
		return validator.isActive();
	}

/**
*	Default event delegation
*/

	/**
	* Triggers when the component is ready to use.
	* @name ch.Validation#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.on("ready",function(){
	*	this.show();
	* });
	*/
	that.trigger("ready");

	return that;
};
ch.factory("validation");
/**
* Zoom shows a contextual reference to an augmented version of main declared image.
* @name Zoom
* @class Zoom
* @augments ch.Floats
* @requires ch.Positioner
* @requires ch.onImagesLoads
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.fx] Enable or disable fade effect on show. By default, the effect are disabled.
* @param {Boolean} [conf.context] Sets a reference to position of component that will be considered to carry out the position. By default is the anchor of HTML snippet.
* @param {String} [conf.points] Sets the points where component will be positioned, specified by configuration or "lt rt" by default.
* @param {String} [conf.offset] Sets the offset in pixels that component will be displaced from original position determined by points. It's specified by configuration or "20 0" by default.
* @param {String} [conf.message] This message will be shown when component needs to communicate that is in process of load. It's "Loading zoom..." by default.
* @param {Number} [conf.width] Width of floated area of zoomed image. Example: 500, "500px", "50%". Default: 350.
* @param {Number} [conf.height] Height of floated area of zoomed image. Example: 500, "500px", "50%". Default: 350.
* @returns itself
* @see ch.Modal
* @see ch.Tooltip
* @see ch.Layer
*/

ch.zoom = function (conf) {
	/**
	* Reference to an internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Zoom#that
	* @type itself
	*/
	var that = this;

/**
*	Constructor
*/
	conf = ch.clon(conf);

	conf.fx = conf.fx || false;
	
	conf.cache = false;

	// WAI-ARIA
	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";

	// Position
	conf.position = {};
	conf.position.context = conf.context || that.$element;
	conf.position.offset = conf.offset || "20 0";
	conf.position.points = conf.points || "lt rt";
	conf.reposition = false;

	// Transition message and size
	conf.message = conf.message || "Loading zoom...";
	conf.width = conf.width || 300;
	conf.height = conf.height || 300;

	that.conf = conf;

/**
*	Inheritance
*/

	that = ch.floats.call(that);
	that.parent = ch.clon(that);

/**
*	Private Members
*/

	/**
	* Element showed before zoomed image is load. It's a transition message and its content can be configured through parameter "message".
	* @private
	* @name ch.Zoom#$loading
	* @type Object
	*/
	var $loading = $("<p class=\"ch-zoom-loading loading ch-hide\">" + conf.message + "</p>").appendTo(that.$element),

	/**
	* Position of main anchor. It's for calculate cursor position hover the image.
	* @private
	* @name ch.Zoom#offset
	* @type Object
	*/
		offset = that.$element.offset(),

	/**
	* Visual element that follows mouse movement for reference to zoomed area into original image.
	* @private
	* @name ch.Zoom#seeker
	* @type Object
	*/
		seeker = {
			/**
			* Element shown as seeker.
			* @private
			* @name shape
			* @memberOf ch.Zoom#seeker
			* @type Object
			*/
			"$shape": $("<div class=\"ch-seeker ch-hide\">"),

			/**
			* Half of width of seeker element. It's only half to facilitate move calculations.
			* @private
			* @name width
			* @memberOf ch.Zoom#seeker
			* @type Number
			*/
			"width": 0,

			/**
			* Half of height of seeker element. It's only half to facilitate move calculations.
			* @private
			* @name height
			* @memberOf ch.Zoom#seeker
			* @type Number
			*/
			"height": 0
		},

	/**
	* Reference to main image declared on HTML code snippet.
	* @private
	* @name ch.Zoom#original
	* @type Object
	*/
		original = (function () {
			// Define the content source
			var $img = that.$element.children("img");

			// Grab some data when image loads
			$img.onImagesLoads(function () {

				// Grab size of original image
				original.width = $img.prop("width");
				original.height = $img.prop("height");

				// Anchor size (same as image)
				that.$element.css({
					"width": original.width,
					"height": original.height
				});

				// Loading position centered at anchor
				$loading.css({
					"left": (original.width - $loading.width()) / 2,
					"top": (original.height - $loading.height()) / 2
				});

			});

			return {
				/**
				* Reference to HTML Element of original image.
				* @private
				* @name img
				* @memberOf ch.Zoom#original
				* @type Object
				*/
				"$image": $img,

				/**
				* Position of original image relative to viewport.
				* @private
				* @name offset
				* @memberOf ch.Zoom#original
				* @type Object
				*/
				"offset": {},

				/**
				* Width of original image.
				* @private
				* @name width
				* @memberOf ch.Zoom#original
				* @type Number
				*/
				"width": 0,

				/**
				* Height of original image.
				* @private
				* @name height
				* @memberOf ch.Zoom#original
				* @type Number
				*/
				"height": 0
			};
		}()),

	/**
	* Relative size between zoomed and original image.
	* @private
	* @name ch.Zoom#ratio
	* @type Object
	*/
		ratio = {
			/**
			* Relative size of X axis.
			* @private
			* @name width
			* @memberOf ch.Zoom#ratio
			* @type Number
			*/
			"width": 0,

			/**
			* Relative size of Y axis.
			* @private
			* @name height
			* @memberOf ch.Zoom#ratio
			* @type Number
			*/
			"height": 0
		},

	/**
	* Reference to the augmented version of image, that will be displayed into a floated element.
	* @private
	* @name ch.Zoom#zoomed
	* @type Object
	*/
		zoomed = (function () {
			// Define the content source
			var $img = that.source = $("<img src=\"" + that.element.href + "\">");

			// Grab some data when zoomed image loads
			$img.onImagesLoads(function () {

				// Save the zoomed image size
				zoomed.width = $img.prop("width");
				zoomed.height = $img.prop("height");

				// Save the zoom ratio
				ratio.width = zoomed.width / original.width;
				ratio.height = zoomed.height / original.height;

				// Seeker: Size relative to zoomed image respect zoomed area
				var w = ~~(conf.width / ratio.width),
					h = ~~(conf.height / ratio.height);

				// Seeker: Save half width and half height
				seeker.width = w / 2;
				seeker.height = h / 2;

				// Seeker: Set size and append it
				seeker.$shape.css({"width": w, "height": h}).appendTo(that.$element);

				// Remove loading
				$loading.remove();

				// Change zoomed image status to Ready
				zoomed.ready = true;

				// TODO: MAGIC here! if mouse is over image show seeker and make all that innerShow do
			});

			return {
				/**
				* Reference to HTML Element of augmented image.
				* @private
				* @name img
				* @memberOf ch.Zoom#zoomed
				* @type Object
				*/
				"$image": $img,

				/**
				* Status of augmented image. When it's load, the status is "true".
				* @private
				* @name ready
				* @memberOf ch.Zoom#zoomed
				* @type Boolean
				*/
				"ready": false,

				/**
				* Width of augmented image.
				* @private
				* @name width
				* @memberOf ch.Zoom#zoomed
				* @type Number
				*/
				"width": 0,

				/**
				* Height of augmented image.
				* @private
				* @name height
				* @memberOf ch.Zoom#zoomed
				* @type Number
				*/
				"height": 0
			};
		}()),

	/**
	* Calculates movement limits and sets it to seeker and augmented image.
	* @private
	* @function
	* @name ch.Zoom#move
	* @param {Event} event Mouse event to take the cursor position.
	*/
		move = function (event) {

			var x, y;

			// Left side of seeker LESS THAN left side of image
			if (event.pageX - seeker.width < offset.left) {
				x = 0;
			// Right side of seeker GREATER THAN right side of image
			} else if (event.pageX + seeker.width > original.width + offset.left) {
				x = original.width - (seeker.width * 2) - 2;
			// Free move
			} else {
				x = event.pageX - offset.left - seeker.width;
			}

			// Top side of seeker LESS THAN top side of image
			if (event.pageY - seeker.height < offset.top) {
				y = 0;
			// Bottom side of seeker GREATER THAN bottom side of image
			} else if (event.pageY + seeker.height > original.height + offset.top) {
				y = original.height - (seeker.height * 2) - 2;
			// Free move
			} else {
				y = event.pageY - offset.top - seeker.height;
			}

			// Move seeker
			seeker.$shape.css({"left": x, "top": y});

			// Move zoomed image
			zoomed.$image.css({"left": (-ratio.width * x), "top": (-ratio.height * y)});

		};

/**
*	Protected Members
*/

	/**
	* Inner show method. Attach the component's layout to the DOM tree and load defined content.
	* @protected
	* @name ch.Zoom#innerShow
	* @function
	* @returns itself
	*/
	that.innerShow = function () {

		// If the component isn't loaded, show loading transition
		if (!zoomed.ready) {
			$loading.removeClass("ch-hide");
			return that;
		}

		// Update position of anchor here because Zoom can be inside a Carousel and its position updates
		offset = that.$element.offset();

		// Bind move calculations
		that.$element.bind("mousemove", function (event) { move(event); });

		// Show seeker
		seeker.$shape.removeClass("ch-hide");

		// Show float
		that.parent.innerShow();

		return that;

	};

	/**
	* Inner hide method. Hides the component's layout and detach it from DOM tree.
	* @protected
	* @name ch.Zoom#innerHide
	* @function
	* @returns itself
	*/
	that.innerHide = function () {

		// If the component isn't loaded, hide loading transition
		if (!zoomed.ready) {
			$loading.addClass("ch-hide");
			return that;
		}

		// Unbind move calculations
		that.$element.unbind("mousemove");

		// Hide seeker
		seeker.$shape.addClass("ch-hide");

		// Hide float
		that.parent.innerHide();

		return that;

	};

	/**
	* Getter and setter for size attributes of float that contains the zoomed image.
	* @protected
	* @function
	* @name ch.Zoom#size
	* @param {string} prop Property that will be setted or getted, like "width" or "height".
	* @param {string} [data] Only for setter. It's the new value of defined property.
	* @returns itself
	*/
	that.size = function (prop, data) {

		// Seeker: Updates styles and size value
		if (data) {
			// Seeker: Size relative to zoomed image respect zoomed area
			var size = ~~(data / ratio[prop]);

			// Seeker: Save half width and half height
			seeker[prop] = size / 2;

			// Seeker: Set size
			seeker.$shape.css(prop, size);
		}

		// Change float size
		return that.parent.size(prop, data);
	};

/**
*	Public Members
*/

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Zoom#uid
	* @type number
	*/

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Zoom#element
	* @type HTMLElement
	*/

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Zoom#type
	* @type string
	*/

	/**
	* Gets the Float component content.
	* @public
	* @name ch.Zoom#content
	* @function
	* @returns {HTMLIMGElement}
	* @example
	* // Get the defined content
	* me.content();
	* @see ch.Object#content
	*/

	that["public"].content = function () {
		// Only on Zoom it's limmited to be a getter
		return that.content();
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @function 
	* @name ch.Zoom#isActive
	* @returns boolean
	*/

	/**
	* Triggers the innerShow method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Zoom#show
	* @returns itself
	* @see ch.Floats#show
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.show();
	*/

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Zoom#hide
	* @returns itself
	* @see ch.Floats#hide
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* me.hide();
	*/
	
	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @function
	* @name ch.Zoom#width
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // Gets width of Zoom float element.
	* foo.width();
	* @example
	* // Sets width of Zoom float element and updates the seeker size to keep these relation.
	* foo.width(500);
	*/

	/**
	* Sets or gets the height property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '100' or '100px'.
	* @public
	* @function
	* @name ch.Zoom#height
	* @returns itself
	* @see ch.Floats#size
	* @example
	* // Gets height of Zoom float element.
	* foo.height();
	* @example
	* // Sets height of Zoom float element and update the seeker size to keep these relation.
	* foo.height(500);
	*/

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @function
	* @name ch.Zoom#position
	* @example
	* // Change default position.
	* $("a").zoom().position({
	*	offset: "0 10",
	*	points: "lt lb"
	* });
	* @example
	* // Refresh position.
	* $("a").zoom().position("refresh");
	* @example
	* // Get current position.
	* $("a").zoom().position();
	* @see ch.Object#position
	*/


/**
*	Default event delegation
*/

	// Anchor
	that.$element
		.addClass("ch-zoom-trigger")

		// Prevent click
		.bind("click", function (event) { that.prevent(event); })

		// Show component or loading transition
		.bind("mouseenter", that.innerShow)

		// Hide component or loading transition
		.bind("mouseleave", that.innerHide);	

	/**
	* Triggers when component is visible.
	* @name ch.Zoom#show
	* @event
	* @public
	* @example
	* me.on("show",function () {
	*	this.content("Some new content");
	* });
	* @see ch.Floats#event:show
	*/

	/**
	* Triggers when component is not longer visible.
	* @name ch.Zoom#hide
	* @event
	* @public
	* @example
	* me.on("hide",function () {
	*	otherComponent.show();
	* });
	* @see ch.Floats#event:hide
	*/

	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.Zoom#ready
	* @event
	* @public
	* @since 0.8.0
	* @example
	* // Following the first example, using 'me' as zoom's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function () { that.trigger("ready"); }, 50);

	return that;
};

ch.factory("zoom");;ch.init();})(jQuery);