/*!
 * Chico Mobile v0.5
 * http://chico-ui.com.ar/mobile
 *
 * Copyright (c) 2012, MercadoLibre.com
 * Released under the MIT license.
 * http://chico-ui.com.ar/license
 */

;(function (exports, $) {

"use strict";

/**
* Private reference to the window obecjt
* @private
* @name win
* @type Window object
*/
var win = exports,


	/**
	* Private reference to the html zepto object
	* @private
	* @name $win
	* @type Zepto Object
	*/
	$win = $(win),

	/**
	* Private reference to the navigator object
	* @private
	* @name browser
	* @type Navigator Object
	*/
	browser = win.navigator,

	/**
	* Private reference to the document object
	* @private
	* @name doc
	* @type Document Object
	*/
	doc = win.document,

	/**
	* Private reference to the body element
	* @private
	* @name body
	* @type HTMLBodyElement
	*/
	body = doc.body,

	/**
	* Private reference to the html element
	* @private
	* @name html
	* @type HTMLElement
	*/
	html = doc.getElementsByTagName("html")[0],

	/**
	* Private reference to the html zepto object
	* @private
	* @name $html
	* @type Zepto Object
	*/
	$html = $(html),

	/** 
	* Utility to clone objects
	* @private
	* @function
	* @name clon
	* @param {Object} [o] Object to clone
	* @returns object
	*/
	clone = function (o) {
		var copy = {},
			x;
		for (x in o) {
			if (hasOwn(o, x)) {
				copy[x] = o[x];
			}
		}
		return copy;
	},
	/**
	* Extend is a method that allows you to extend Chico or other objects with new members.
	* @private
	* @name extend
	* @function
	* @param {Object} [obj] The object that have new members.
	* @param {Object} [destination] The destination object. If this object is undefined, ch will be the destination object.
	* @returns Object
	* @example
	* var Gizmo = {"name": "foo"};
	* ch.extend({
	*     "sayName": function () { console.log(this.name); },
	*     "foobar": "Some string"
	* }, Gizmo);
	*
	* // Returns Gizmo
	* console.dir(gizmo);
	*
	* // Gizmo Object
	* // foobar: "Some string"
	* // name: "foo"
	* // sayName: function () {}
	* @example
	* // Add new funcionality to CH
	* ch.extend({
	*     "foobar": "Some string"
	* });
	*
	* // Returns ch
	* console.dir(ch);
	*
	* // ch Object
	* // foobar: "Some string"
	*/
	extend = function(o, destination) {
		var x,
			d = destination || this;
		for (x in o) {
			d[x] = o[x];
		}
		return d;
	},

	/** 
	* Returns if an object is an array.
	* @private
	* @function
	* @name isArray
	* @param {Object} [o] The object to be checked.
	* @returns {boolean}
	*/
	isArray = (function () {

		if (Array.hasOwnProperty("isArray")) {
			return Array.isArray;
		}

		return function (o) {
			return Object.prototype.toString.apply(o) === "[object Array]";
		};
	}()),

	/** 
	* Returns a boolean indicating whether the object has the specified property.
	* @private
	* @function
	* @name hasOwn
	* @param {Object} [o] The object to be checked.
	* @param {String} [property] The name of the property to test.
	* @returns {boolean}
	*/
	hasOwn = (function () {
		var hOP = Object.prototype.hasOwnProperty;

		return function (o, property) {
			return hOP.call(o, property);
		};
	}()),

	/** 
	* Returns a boolean indicating whether the string is a HTML tag.
	* @private
	* @function
	* @name isTag
	* @param {String} [tag] The name of the tag to be checked.
	* @returns {boolean}
	*/
	isTag = function (tag) {
		return (/<([\w:]+)/).test(tag);
	},

	/** 
	* Returns a boolean indicating whether the string is a CSS selector.
	* @private
	* @function
	* @name isSelector
	* @param {String} [selector] The selector to be checked.
	* @returns {boolean}
	*/
	isSelector = function (selector) {
		if (typeof selector !== "string") { return false; }
		var regex;
		for (regex in $.expr.match) {
			if ($.expr.match[ regex ].test(selector) && !isTag(selector)) {
				return true;
			};
		};
		return false;
	},

	/** 
	* Returns a boolean indicating whether the selector is into DOM.
	* @private
	* @function
	* @name inDom
	* @param {String} [selector] The selector to be checked.
	* @param {String} [context] Explicit context to the selector.
	* @returns {boolean}
	*/
	inDom = function (selector, context) {
		if (typeof selector !== "string") { return false; }
		// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
		var selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
			return "\\\\" + $1;
		});
		return $(selector, context).length > 0;
	},

	/** 
	* Returns a boolean indicating whether the string is an URL.
	* @private
	* @function
	* @name isUrl
	* @param {String} [url] The URL to be checked.
	* @returns {boolean}
	*/
	isUrl = function (url) {
		return ((/^((http(s)?|ftp|file):\/{2}(www)?|www.|((\/|\.{1,2})([\w]|\.{1,2})*\/)+|(\.\/|\/|\:\d))([\w\-]*)?(((\.|\/)[\w\-]+)+)?([\/?]\S*)?/).test(url));
	},

	/** 
	* Adds CSS rules to disable text selection highlighting.
	* @private
	* @function
	* @name avoidTextSelection
	* @param {HTMLElement} The HTMLElement to disable text selection highlighting.
	*/
	avoidTextSelection = function () {
		$.each(arguments, function(e){
			if ($.browser.msie) {
				$(e).attr('unselectable', 'on');
			} else if ($.browser.opera) {
				$(e).bind("mousedown", function(){ return false; });
			} else { 
				$(e).addClass("ch-user-no-select");
			};
		});
		return;
	},

	/** 
	* Gives the final used values of all the CSS properties of an element.
	* @private
	* @function
	* @name getStyles
	* @param {HTMLElement} [element] The element for which to get the computed style.
	* @param {String} [style] The name of the CSS property to test.
	* @see Based on: http://www.quirksmode.org/dom/getstyles.html
	* @returns {CSSStyleDeclaration}
	*/
	getStyles = function (element, style) {
		return getComputedStyle(element, "").getPropertyValue(style);
	},

	/** 
	* Fixes the broken iPad/iPhone form label click issue.
	* @private
	* @function
	* @name labels
	* @see Based on: http://www.quirksmode.org/dom/getstyles.html
	* @returns {CSSStyleDeclaration}
	*/
	fixLabels = function () {
		var labels = document.getElementsByTagName("label"),
			target_id, 
			el,
			i = 0;

		function labelClick() {
			el = document.getElementById(this.getAttribute('for'));
			if (['radio', 'checkbox'].indexOf(el.getAttribute('type')) != -1) {
				el.setAttribute('selected', !el.getAttribute('selected'));
			} else {
				el.focus();
			}
		}

		for (; labels[i]; i += 1) {
			if (labels[i].getAttribute("for")) {
				$(labels[i]).bind(EVENT.TAP, labelClick);
			}
		}
	},

	/** 
	* zIndex values
	* @private
	* @name index
	* @type {Number}
	*/
	zIndex = 1000,

	/** 
	* Global instantiation widget id
	* @private
	* @name uid
	* @type {Number}
	*/
	uid = 0,

	/**
	* Private reference to the index page
	* @privated
	* @name ch.Modal#$mainView
	* @type Zepto Object
	*/
	$mainView = (function () {
		var $view = $("div[data-page=index]");

		if ($view.length === 0) {
			alert("Chico Mobile Error\n$mainView: The document doesn't contain an index \"page\" view.");
			throw new Error("Chico Mobile Error\n$mainView: The document doesn't contain an index \"page\" view.");
		}

		return $view;
	}()),

	/**
	* Chico Mobile global events reference.
	* @name Event
	* @class Event
	* @static
	*/	
	EVENT = {
		"TAP": (("ontouchend" in win) ? "touchend" : "click"),
		"PATH_CHANGE": (("onpopstate" in win) ? "popstate" : "hashchange")
	};

/**
* ch is the namespace for Chico Mobile.
* @namespace ch
* @name ch
* @static
*/
var ch = {

	/**
	* Current version
	* @name version
	* @type number
	* @memberOf ch
	*/
	"VERSION": "0.5",

	/**
	* Here you will find a map of all component's instances created by Chico-UI.
	* @name instances
	* @type object
	* @memberOf ch
	*/
	"instances": {},

	/**
	* Inherit from a Class borrowing a constructor
	* @name inherits
	* @function
	* @returns {object}
	* @memberOf ch
	*/
	"inherit": function (Parent, child) {
		if (Parent !== undefined) {
			Parent.call(child, child.conf);
			return clone(child);
		}

		throw("Chico Mobile - ch.inherit: Parent is not defined.");
	},

	/**
	* Core constructor function.
	* @name init
	* @function
	* @memberOf ch
	*/
	"init": function () {
		// Iphone scale fix
		ch.scaleFix();
		// Hide navigation url bar
		ch.hideUrlBarOnLoad();
		// Prevent zoom onfocus
		ch.preventZoom();
		// Fix the broken iPad/iPhone form label click issue
		fixLabels();
		// Remove no-js classname
		$html.removeClass("no-js");
	},

	/**
	* Available device's features
	* @name Support
	* @class Support
	* @returns {Object}
	* @memberOf ch 
	*/
	"SUPPORT": (function () {

	}())

};


/*
 * MBP - Mobile boilerplate helper functions
 */
(function () {

	var MBP = exports.MBP || {};

	// Fix for iPhone viewport scale bug 
	// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
	MBP.viewportmeta = $('meta[name="viewport"]');
	MBP.ua = browser.userAgent || navigator.userAgent;

	MBP.gestureStart = function () {
		MBP.viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
	};

	MBP.scaleFix = function () {
		if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
			MBP.viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
			doc.addEventListener("gesturestart", MBP.gestureStart, false);
		}
	};

	/*
	* Normalized hide address bar for iOS & Android
	* (c) Scott Jehl, scottjehl.com
	* MIT License
	*/
	// If we cache this we don't need to re-calibrate everytime we call
	// the hide url bar
	MBP.BODY_SCROLL_TOP = false;

	// So we don't redefine this function everytime we
	// we call hideUrlBar
	MBP.getScrollTop = function () {
		return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
	};

	// It should be up to the mobile
	MBP.hideUrlBar = function () {
		// if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
		if( !win.location.hash && MBP.BODY_SCROLL_TOP !== false){
			win.scrollTo( 0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
		}
	};

	MBP.hideUrlBarOnLoad = function () {
		// If there's a hash, or addEventListener is undefined, stop here
		if( !win.location.hash && win.addEventListener ) {

			//scroll to 1
			win.scrollTo(0, 1);
			MBP.BODY_SCROLL_TOP = 1;

			//reset to 0 on bodyready, if needed
			var bodycheck = setInterval(function () {
				if(body) {
					clearInterval(bodycheck);
					MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
					MBP.hideUrlBar();
				}
			}, 15 );

			win.addEventListener("load", function() {
				setTimeout(function () {
					//at load, if user hasn't scrolled more than 20 or so...
					if(MBP.getScrollTop() < 20) {
						//reset to hide addr bar at onload
						MBP.hideUrlBar();
					}
				}, 0);
			});
		}
	};

	// Prevent iOS from zooming onfocus
	// https://github.com/h5bp/mobile-boilerplate/pull/108
	MBP.preventZoom = function () {
		var formFields = $('input, select, textarea'),
			contentString = 'width=device-width,initial-scale=1,maximum-scale=',
			i = 0;
		for (; i < formFields.length; i += 1) {

			formFields[i].onfocus = function() {
				MBP.viewportmeta.content = contentString + '1';
			};

			formFields[i].onblur = function () {
				MBP.viewportmeta.content = contentString + '10';
			};
		}
	};

	extend(MBP, ch);
}());

/**
* Event Emitter Class for the browser.
* @name EventEmitter
* @class EventEmitter
* @memberOf ch
*/
ch.EventEmitter = function () {
	var collection = {},
		maxListeners = 10;

	/**
	* Adds a listener to the collection for a specified event.
	* @public
	* @function
	* @name ch.EventEmitter#addListener
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @exampleDescription Adds a new listener.
	* @example
	* // Will add a event listener to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* me.addListener("ready", startDoingStuff);
	* // or
	* me.on("ready", startDoingStuff);
	*/
	this.addListener = this.on = function (event, listener) { // Event: 'newListener'
		if (typeof collection[event] === "undefined") {
			collection[event] = [];
		}

		if (collection[event].length + 1 > maxListeners) {
			throw "Warning: So many listeners for an event.";
		}
		
		collection[event].push(listener);

		if (event !== "newListener") {
			this.emit("newListener");
		}

		return this;
	};

	/**
	* Adds a one time listener to the collection for a specified event. It will execute only once.
	* @public
	* @function
	* @name ch.EventEmitter#once
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @returns itself
	* @exampleDescription Adds a new listener that will execute only once.
	* @example
	* // Will add a event handler to the "contentLoad" event once
	* me.once("contentLoad", startDoingStuff);
	*/
	this.once = function (event, listener) {

		var fn = function (event, data) {
			listener.call(this, event, data);
			this.off(event.type, fn);
		};

		this.on(event, fn);

		return this;
	};

	/**
	* Removes a listener from the collection for a specified event.
	* @public
	* @function
	* @name ch.EventEmitter#removeListener
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @returns itself
	* @exampleDescription Removes a listener.
	* @example
	* // Will remove event handler to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* me.removeListener("ready", startDoingStuff);
	* // or
	* me.off("ready", startDoingStuff);
	*/
	this.removeListener = this.off = function (event, listener) {
		if (collection[event] instanceof Array) {

			if (listener) {
				var listeners = collection[event],
					j = 0,
					len = listeners.length;

				for (j; j < len; j += 1) {
					if (listeners[j] === listener) {
						listeners.splice(j, 1);
						break;
					}
				}
			}
		}

		return this;
	};

	/**
	* Removes all listeners from the collection for a specified event.
	* @public
	* @function
	* @name ch.EventEmitter#removeAllListeners
	* @param {string} event Event name.
	* @returns itself
	* @exampleDescription Removes all listeners.
	* @example
	* me.removeAllListeners("ready");
	*/
	this.removeAllListeners = function (event) {
		delete collection[event];

		return this;
	};

	/**
	* Increases the number of listeners. Set to zero for unlimited.
	* @public
	* @function
	* @name ch.EventEmitter#setMaxListeners
	* @param {number} n Number of max listeners.
	* @returns itself
	* @exampleDescription Increases the number of listeners.
	* @example
	* me.setMaxListeners(20);
	*/
	this.setMaxListeners = function (n) {
		maxListeners = n;

		return this;
	};

	/**
	* Returns all listeners from the collection for a specified event.
	* @public
	* @function
	* @name ch.EventEmitter#listeners
	* @param {string} event The name of the Event.
	* @returns Array
	* @exampleDescription Gets all listeners.
	* @example
	* me.listeners("ready");
	*/
	this.listeners = function (event) {
		return collection[event];
	};

	/**
	* Execute each of the listener collection in order with the data object.
	* @name ch.EventEmitter#emit
	* @public
	* @function
	* @param {string} event The event name you want to emit.
	* @param {object} data Optionl data
	* @exampleDescription Emits a new custom event.
	* @example
	* // Will add a event handler to the "ready" event
	* me.emit("ready", {});
	*/
	this.emit = function (event, data) {

		if (typeof event === "string") {
			event = { "type": event };
		}

		if (!event.target) {
			event.target = this;
		}

		if (!event.type) {
			throw new Error("Event object missing 'type' property.");
		}

		if (collection[event.type] instanceof Array) {
			var listeners = collection[event.type],
				i = 0,
				len = listeners.length;

			for (i; i < len; i += 1) {
				listeners[i].call(this, event, data);
			}
		}

		return this;

	};

	return this;
};

ch.routes = (function () {
	var pages = {},
		data,
		location = win.location,
		history = win.history,
		url,
		x,
		resolvePaths = function () {
			url = location.hash.split("#!/")[1];
			if (typeof url === "undefined" || url === "") {
				pages[""].forEach(function (e, i) {
					e();
				});
				return;
			}

			if (pages[url]) {
				pages[url]();
			}
		};

	pages[""] = [];

	$win.bind(EVENT.PATH_CHANGE, resolvePaths);

	return {

		"add": function (paths) {
			for (x in paths) {
				if (x === "") {
					pages[""].push(paths[""]);
					continue;
				}
				pages[x] = paths[x];
			}
		},

		"remove": function (path, fn) {
			delete pages[path][fn];
		},

		"update": function (path) {
			if (typeof path === "undefined") {
				history.back();
				return;
			}

			if (location.hash === "") {
				history.pushState(null, "", "#!/" + path);
			}
		}
	};
}());

ch.content = function () {
	
};

/** 
* Creational patterns to create UI Components
* @name factory
* @class Factory
* @static
* @param o Configuration Object
* @returns {Object}
* @memberOf ch
*/
ch.factory = function (klass) {
	// Sets the klass name
	var name = klass.toLowerCase(),

		// Creates a new instance
		create = function (e, conf) {

			var context = {
				"type": name,
				"el": e,
				"$el": $(e),
				"uid": uid += 1 // Global instantiation index
			};

			switch (typeof conf) {
			// If argument is a number, join with the conf
			case "number":
				var num = conf;
				conf = {};
				conf.value = num;

				// Could come a messages as a second argument
				if (arguments[1]) {
					conf.msg = arguments[1];
				}
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
				if (arguments[1]) {
					conf.msg = arguments[1];
				}
			break;
			};

			var created = ch[klass].call(context, conf);
			created = (hasOwn(created, "public")) ? created["public"] : created;

			if (created.type) {
				var type = created.type;
				// If component don't exists in the instances map create an empty array
				if (!ch.instances[type]) { 
					ch.instances[type] = [];
				}
				ch.instances[type].push(created);
			}

			// Avoid mapping objects that already exists
			if (created.exists) {
				// Return the inner object
				created = created.object;
			}

			return created;
		};

	
	// Add class constructor to ch
	$.fn[name] = function (conf) {
		// Collection of instances
		var output = [],
			instantiated = [];

		$.each(this, function (i, e) {
			if (hasOwn(ch.instances, name)) {
				$.each(ch.instances[name], function (i, instance) {
					if (e === instance.el) {
						instantiated.push(instance);
					}
				});
			}

			output.push(((instantiated.length > 1) ? instantiated : instantiated[0]) || create(e, conf));
		});

		// Return the instances or collection of instances
		return (output.length > 1) ? output : output[0];
	};

	return this;
};

/**
* Represents the abstract class of all Widgets.
* @abstract
* @name Widget
* @class Widget
* @memberOf ch
* @see ch.Expando
* @see ch.Menu
* @see ch.Layer
* @see ch.Modal
*/
ch.Widget = function () {
	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Widget-that
	* @type object
	*/
	var that = this;

	// Use ch.EventEmitter Class
	ch.EventEmitter.call(that);

	/**
	* Status of component
	* @protected
	* @name ch.Widget#active
	* @type boolean
	*/
	that.active = false;

	/**
	* Component's public scope. In this scope you will find all public members.
	*/
	that["public"] = {};

	/**
	* The 'uid' is the Chico's unique instance identifier. Every instance has a different 'uid' property. You can see its value by reading the 'uid' property on any public instance.
	* @public
	* @name ch.Widget#uid
	* @type number
	*/
	that["public"].uid = that.uid;

	/**
	* Reference to a DOM Element. This binding between the component and the HTMLElement, defines context where the component will be executed. Also is usual that this element triggers the component default behavior.
	* @public
	* @name ch.Widget#el
	* @type HTMLElement
	*/
	that["public"].el = that.el;

	/**
	* This public property defines the component type. All instances are saved into a 'map', grouped by its type. You can reach for any or all of the components from a specific type with 'ch.instances'.
	* @public
	* @name ch.Widget#type
	* @type string
	*/
	that["public"].type = that.type;
	
	/**
	* Execute each of the listener collection in order with the data object.
	* @name ch.Widget#Emit
	* @public
	* @param {string} event The event name you want to emit.
	* @param {object} data Optionl data
	* @example
	* // Will add a event handler to the "ready" event
	* widget.emit("ready", {});
	*/
	that["public"].emit = that.emit;

	/**
	* Adds a listener to the collection for a specified event.
	* @public
	* @function
	* @name ch.Widget#on
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @example
	* // Will add a event listener to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* widget.on("ready", startDoingStuff);
	*/
	that["public"].on = that.on;

	/**
	* Adds a one time listener to the collection for a specified event. It will execute only once.
	* @public
	* @function
	* @name ch.Widget#once
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @returns itself
	* @example
	* // Will add a event handler to the "contentLoad" event once
	* widget.once("contentLoad", startDoingStuff);
	*/
	that["public"].once = that.once;

	/**
	* Removes a listener from the collection for a specified event.
	* @public
	* @function
	* @name ch.Widget#off
	* @param {string} event Event name.
	* @param {function} listener Listener function.
	* @returns itself
	* @example
	* // Will remove event handler to the "ready" event
	* var startDoingStuff = function () {
	*     // Some code here!
	* };
	*
	* widget.off("ready", startDoingStuff);
	*/
	that["public"].off = that.off;

	/**
	* Removes all listeners from the collection for a specified event.
	* @protected
	* @function
	* @name ch.Widget#offAll
	* @param {string} event Event name.
	* @returns itself
	* @example
	* widget.offAll("ready");
	*/
	that["public"].offAll = that.offAll;

	/**
	* Increases the number of listeners. Set to zero for unlimited.
	* @public
	* @function
	* @name ch.Widget#setMaxListeners
	* @param {number} n Number of max listeners.
	* @returns itself
	* @example
	* widget.setMaxListeners(20);
	*/
	that["public"].setMaxListeners = that.setMaxListeners;

	return that;
};

/**
* Modal is a centered floated window with a dark gray dimmer background. Modal lets you handle its size, positioning and content.
* @name Modal
* @class Modal
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.content] Sets content by: static content, DOM selector or URL. By default, the content is the href attribute value  or form's action attribute.
* @returns itself
* @factorized
* @see ch.Widget
* @see ch.Routes
* @exampleDescription Create a new modal window triggered by an anchor with a class name 'example'.
* @example
* var widget = $("a.example").modal();
* @exampleDescription Create a new modal window triggered by form.
* @example
* var widget = $("form").modal();
* @exampleDescription Create a new modal window with configuration.
* @example
* var widget = $("a.example").modal({
*     "content": "#someDivHidden"
* });
*/

ch.Modal = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Modal-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Modal-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Modal-conf
		* @type object
		*/
		conf = clone(conf) || {};

	that.conf = conf;

/**
*	Inheritance
*/
	// Borrow a constructor and return a parent
	parent = ch.inherit(ch.Widget, that);

/**
*  Private Members
*/

	/**
	* Private reference to the element
	* @privated
	* @name ch.Modal-el
	* @type HTMLElement
	*/
	var el = that.el,


		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Modal-$el
		* @type Zepto Object
		*/
		$el = that.$el,

		/**
		* Hides component's content.
		* @privated
		* @function
		* @name ch.Modal-hide
		* @returns itself
		*/
		hide = function () {

			if (!that.active) { return; }

			that.active = false;
			
			that.$container.addClass("ch-hide");

			$mainView.removeClass("ch-hide");
			$mainView[0].setAttribute("aria-hidden", false);

			return that;
		},

		/**
		* Hash name
		* @privated
		* @name ch.Modal-hash
		* @type String
		*/
		hash = conf.hash || el.href.split("#")[1] || that["type"] + "-" + that.uid,

		/**
		* Routes maps
		* @privated
		* @name ch.Modal-routes
		* @type Object
		*/
		routes = {};


/**
*  Protected Members
*/


	/**
	* The component's source.
	* @protected
	* @name ch.Modal#$source
	* @type Zepto Object
	*/
	that.source = $(conf.content).removeClass("ch-hide");

	/**
	* The component's content.
	* @protected
	* @name ch.Modal#$content
	* @type Zepto Object
	*/
	that.$content = $("<div class=\"ch-modal-content\">").append(that.source);

	/**
	* The component's container
	* @protected
	* @name ch.Modal#$container
	* @type Zepto Object
	*/
	that.$container = (function () {
		var $container = $("<div data-page=\"ch-" + that["type"] + "-" + that.uid +"\" role=\"dialog\" aria-hidden=\"true\" class=\"ch-modal ch-hide\" id=\"ch-" + that["type"] + "-" + that.uid +"\">");

		$container.append(that.$content);

		return $container;
	}())

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name ch.Modal#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {

		if (that.active) { return; }

		that.active = true;

		ch.routes.update(hash);

		$mainView.addClass("ch-hide");
		$mainView[0].setAttribute("aria-hidden", true);

		that.$container.removeClass("ch-hide");

		return that;
	};

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name ch.Modal#innerHide
	* @returns itself
	*/
	that.innerHide = function (hash) {
		hide();
		ch.routes.update(hash);

		return that;
	};

	/**
	* Create component's layout and add behaivor
	* @protected
	* @function
	* @name ch.Modal#configBehavior
	*/
	that.configBehavior = function () {

		// ARIA
		el.setAttribute("aria-label", "ch-" + that["type"] + "-" + that.uid);

		// Update hash
		el.href = "#!/" + hash; 

		// Content behaivor
		// ClassNames
		that.$content
			.addClass("ch-" + that.type + "-content")
			.removeClass("ch-hide");

		$mainView.after(that.$container);

		// Visual configuration
		if (conf.open) { that.innerShow(); }

		// Sets hash routes
		routes[""] = hide;
		routes[hash] = that.innerShow;
		ch.routes.add(routes);
	};

/**
*  Public Members
*/
 
	/**
	* @borrows ch.Widget#uid as ch.Modal#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Modal#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Modal#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Modal#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Modal#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Modal#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Modal#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Modal#offAll
	*/

	/**
	* @borrows ch.Widget#setMaxListeners as ch.Modal#setMaxListeners
	*/

	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Modal#show
	* @returns itself
	*/
	that["public"].show = function () {
		that.innerShow();
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.Modal#hide
	* @returns itself
	*/	
	that["public"].hide = function (page) {
		that.innerHide(page);
		return that["public"];
	};

/**
*  Default behaivor
*/
	
	that.configBehavior();

	/**
	* Emits an event when the component is ready to use.
	* @name ch.Modal#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as modal's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Modal");

/**
* Expando lets you show or hide the content. Expando needs a pair: the title and the content related to that title.
* @name Expando
* @class Expando
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the expando open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @see ch.Widget
* @exampleDescription Create a new expando without configuration.
* @example
* var widget = $(".example").expando();
* @exampleDescription Create a new expando with configuration.
* @example
* var widget = $(".example").expando({
*     "open": true
* });
*/
ch.Expando = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Expando-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Expando-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Expando-conf
		* @type object
		*/
		conf = clone(conf) || {};

	//conf.icon = hasOwn(conf, "icon") ? conf.icon : true;
	conf.open = conf.open || false;
	conf.classes = conf.classes || "";

	that.conf = conf;

/**
*	Inheritance
*/
	// Borrow a constructor and return a parent
	parent = ch.inherit(ch.Widget, that);

/**
*  Private Members
*/

	/**
	* Private reference to the element
	* @privated
	* @name ch.Expando-el
	* @type HTMLElement
	*/
	var el = that.el,

		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Expando-$el
		* @type Zepto Object
		*/
		$el = that.$el,

		/**
		* The component's toggle.
		* @privated
		* @function
		* @name ch.Expando-$toggle
		* @returns itself
		*/
		toggle = function () {
			that.$trigger.toggleClass("ch-" + that["type"] + "-trigger-on");
			that.$content.toggleClass("ch-hide");

			// Arrows icons
			/*if (conf.icon) { }*/

			return that;
		};

/**
*  Protected Members
*/

	/**
	* The component's trigger.
	* @protected
	* @name ch.Expando#trigger
	* @type HTMLElement
	*/
	that.trigger = el.firstElementChild;

	/**
	* The component's trigger.
	* @protected
	* @name ch.Expando#$trigger
	* @type Zepto Object
	*/
	that.$trigger = $(that.trigger);
	
	/**
	* The component's content.
	* @protected
	* @name ch.Expando#content
	* @type HTMLElement
	*/
	that.content = el.lastElementChild;

	/**
	* The component's content.
	* @protected
	* @name ch.Expando#$content
	* @type Zepto Object
	*/
	that.$content = $(that.content);

	/**
	* Shows component's content.
	* @protected
	* @function
	* @name ch.Expando#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {

		if (that.active) { return that.innerHide(event); }

		that.active = true;

		toggle();

		// ARIA attr
		that.trigger.setAttribute("aria-expanded", "true");
		that.content.setAttribute("aria-hidden", "false");


		/**
		* Triggers when component is visible.
		* @name ch.Expando#show
		* @event
		* @public
		* @exampleDescription It change the content when the component was shown.
		* @example
		* widget.on("show",function () {
		*	this.content("Some new content");
		* });
		*/
		that.emit("show");

		return that;
	};

	/**
	* Hides component's content.
	* @protected
	* @function
	* @name ch.Expando#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {

		if (!that.active) { return; }

		that.active = false;

		toggle();

		// ARIA attr
		that.trigger.setAttribute("aria-expanded", "false");
		that.content.setAttribute("aria-hidden", "true");


		/**
		* Triggers when component is not longer visible.
		* @name ch.Expando#hide
		* @event
		* @public
		* @exampleDescription When the component hides show other component.
		* @example
		* widget.on("hide",function () {
		*	otherComponent.show();
		* });
		*/
		that.emit("hide");

		return that;
	};

	/**
	* Create component's behaivor
	* @protected
	* @function
	* @name ch.Expando#configBehavior
	*/
	that.configBehavior = function () {

		$el.addClass("ch-" + that.type);

		// ARIA
		el.setAttribute("role", "presentation");

		that.trigger.setAttribute("aria-expanded", false);
		that.trigger.setAttribute("aria-controls", "ch-" + that["type"] + "-" + that.uid);

		that.content.setAttribute("id", "ch-" + that["type"] + "-" + that.uid);
		that.content.setAttribute("aria-hidden", true);

		// Trigger behaivor
		// ClassNames
		that.$trigger.addClass("ch-" + that.type + "-trigger");


		/*if (conf.icon) { }*/

		// Events
		that.$trigger.bind(EVENT.TAP, function (event) { event.preventDefault(); that.innerShow(event); });

		// Content behaivor

		// ClassNames
		that.$content.addClass("ch-" + that.type + "-content ch-hide " + conf.classes);

		// Visual configuration
		if (conf.open) { that.innerShow(); }

	};


/**
*  Public Members
*/
 
	/**
	* @borrows ch.Widget#uid as ch.Expando#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Expando#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Expando#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Expando#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Expando#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Expando#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Expando#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Expando#offAll
	*/

	/**
	* @borrows ch.Widget#setMaxListeners as ch.Expando#setMaxListeners
	*/

	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.Expando#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.innerShow();
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
		that.innerHide();
		return that["public"];
	};

/**
*  Default behaivor
*/
	
	that.configBehavior();

	/**
	* Emits an event when the component is ready to use.
	* @name ch.Expando#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as expando's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Expando");

/**
* Menu lets you organize the links by categories.
* @name Menu
* @class Menu
* @augments ch.Widget
* @requires ch.Expando
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
* @returns itself
* @factorized
* @see ch.Expando
* @see ch.Widget
* @exampleDescription Create a new menu without configuration.
* @example
* var widget = $(".example").menu();
* @exampleDescription Create a new menu with configuration.
* @example
* var widget = $(".example").menu({
*     "selected": 2
* });
*/
ch.Menu = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Menu-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Menu-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Menu-conf
		* @type object
		*/
		conf = clone(conf) || {};

	conf.icon = hasOwn(conf, "icon") ? conf.icon : true;

	that.conf = conf;

/**
*	Inheritance
*/
	// Borrow a constructor and return a parent
	parent = ch.inherit(ch.Widget, that);

/**
*  Private Members
*/

	/**
	* Private reference to the element
	* @privated
	* @name ch.Menu-el
	* @type HTMLElement
	*/
	var el = that.el,

		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Menu-$el
		* @type Zepto Object
		*/
		$el = that.$el,

		/**
		* Indicates witch child is opened
		* @private
		* @name ch.Menu-selected
		* @type number
		*/
		selected = (conf.selected) ? conf.selected - 1 : undefined,

		/**
		* Opens specific Expando child and optionally grandson
		* @private
		* @function
		* @name ch.Menu-select
		*/
		select = function (child) {
			var child = child - 1,
				c = that.children[child];

			if (child > that.children.length) { return; }

			if (c.nodeType) {

				if (c.firstElementChild.tagName === "A") {
					win.location.href = c.firstElementChild.href;
				}

				return;
			}

			that.children[child].show();
		};

/**
*  Protected Members
*/

	/**
	* The component's triggers.
	* @protected
	* @name ch.Menu#trigger
	* @type HTMLElement
	*/
	that.triggers = el.children;

	/**
	* Collection of expandos and bellows.
	* @protected
	* @name ch.Menu#children
	* @type Array
	*/ 
	that.children = [];


	/**
	* Inits an Menu component on each list inside main HTML code snippet
	* @protected
	* @name ch.Menu#createBellows
	* @function
	*/
	that.cretateBellows = function (bellows) {
		var $bellows = $(bellows);

		$bellows
			.addClass("ch-bellows")
			.children(":first-child")
				.addClass("ch-bellows-trigger");

		that.children.push($bellows);
	};

	/**
	* Inits an Menu component on each list inside main HTML code snippet
	* @protected
	* @name ch.Menu#createLayout
	* @function
	*/
	that.createLayout = function () {
		var expando;

		$.each(that.triggers, function (i, e) {
			var c = e.children;

			if (c.length === 1) {
				that.cretateBellows(e);

				return;
			}

			that.children.push(
				$(e).expando({
					"icon": conf.icon
				})
			);
		});
	};

	/**
	* Create component's layout and add behaivor
	* @protected
	* @function
	* @name ch.Menu#configBehavior
	*/
	that.configBehavior = function () {

		$el.addClass("ch-"+that.type);

		// ARIA
		el.setAttribute("role", "navigation");

	};


/**
*  Public Members
*/
 
	/**
	* @borrows ch.Widget#uid as ch.Menu#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Menu#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Menu#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Menu#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Menu#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Menu#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Menu#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Menu#offAll
	*/

	/**
	* @borrows ch.Widget#setMaxListeners as ch.Menu#setMaxListeners
	*/


	/**
	* Select a specific children.
	* @public
	* @name ch.Menu#select
	* @function
	* @param {Number} [item] The number of the item to be selected
	*/
	that["public"].select = function (item) {
		// Getter
		if (!item) {
			if (isNaN(selected)) {
				return "";
			}
			return selected + 1;
		}

		// Setter
		select(item);

		return that["public"];
	};

/**
*  Default behaivor
*/
	
	that.createLayout();
	that.configBehavior();


	/**
	* Emit when the component is ready to use.
	* @name ch.Menu#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as menu's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Menu");

/**
* Layer lets you show a contextual data.
* @name Layer
* @class Layer
* @augments ch.Expando
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the layer open when component was loaded. By default, the value is false.
* @returns itself
* @factorized
* @see ch.Widget
* @see ch.Expando
* @exampleDescription Create a new layer.
* @example
* var widget = $(".some-element").layer();
*/
ch.Layer = function (conf) {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.Layer-that
	* @type object
	*/
	var that = this,

		/**
		* Reference to Parent Class.
		* @private
		* @name ch.Layer-parent
		* @type object
		*/
		parent,

		/**
		* Reference to configuration object.
		* @private
		* @name ch.Layer-conf
		* @type object
		*/
		conf = clone(conf) || {};

	conf.icon = false;

	conf.aria = {};
	conf.aria.role = "tooltip";
	conf.aria.identifier = "aria-describedby";
	conf.classes = conf.classes || "ch-box ch-cone ch-points-ltlb";

	that.conf = conf;
	that.type = "layer"

/**
*	Inheritance
*/
	// Borrow a constructor and return a parent
	parent = ch.inherit(ch.Expando, that);


	/**
	* @borrows ch.Widget#uid as ch.Layer#uid
	*/	
	
	/**
	* @borrows ch.Widget#el as ch.Layer#el
	*/

	/**
	* @borrows ch.Widget#type as ch.Layer#type
	*/

	/**
	* @borrows ch.Widget#emit as ch.Layer#emit
	*/

	/**
	* @borrows ch.Widget#on as ch.Layer#on
	*/

	/**
	* @borrows ch.Widget#once as ch.Layer#once
	*/

	/**
	* @borrows ch.Widget#off as ch.Layer#off
	*/

	/**
	* @borrows ch.Widget#offAll as ch.Layer#offAll
	*/

	/**
	* @borrows ch.Expando#show as ch.Layer#show
	*/

	/**
	* @borrows ch.Expando#hide as ch.Layer#hide
	*/


	/**
	* Emits an event when the component is ready to use.
	* @name ch.Layer#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as layer's instance controller:
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.emit("ready")}, 50);

	return that;
};
ch.factory("Layer");

exports.chico = exports.ch = ch;

ch.init();

})(window, $);