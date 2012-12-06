/*!
 * Chico Mobile v0.6
 * http://chico-ui.com.ar/mobile
 *
 * Copyright (c) 2012, MercadoLibre.com
 * Released under the MIT license.
 * http://chico-ui.com.ar/license
 */

;(function (window, $) {
	'use strict';

/**
 * An object which contains all the public members.
 * @namespace
 */
var ch = {},
	/**
	 * A map of all widget's instances created by Chico.
	 * @memberOf ch
	 * @type {Object}
	 */
	instances = {},

	/**
	 * Reference to the window Selector Object.
	 * @private
	 * @type {Selector}
	 */
	$window = $(window),

	/**
	 * Reference to the navigator object.
	 * @private
	 * @type {Object}
	 */
	navigator = window.navigator,

	/**
	 * Reference to the userAgent.
	 * @private
	 * @type {String}
	 */
	userAgent = navigator.userAgent,

	/**
	 * Reference to the HTMLDocument.
	 * @private
	 * @type {Object}
	 */
	document = window.document,

	/**
	 * Reference to the document Selector Object.
	 * @private
	 * @type {Selector}
	 */
	$document = $(document),

	/**
	 * Reference to the HTMLBodyElement.
	 * @private
	 * @type {Object}
	 */
	body = document.body,

	/**
	 * Reference to the body Selector Object.
	 * @private
	 * @type {Selector}
	 */
	$body = $(body),

	/**
	 * Reference to the HTMLElement.
	 * @private
	 * @type {Object}
	 */
	html = document.getElementsByTagName('html')[0],

	/**
	 * Reference to the html Selector Object.
	 * @private
	 * @type {Selector}
	 */
	$html = $(html),

	/**
	 * Reference to the Object Contructor.
	 * @private
	 * @function
	 * @type {Function}
	 */
	Object = window.Object,

	/**
	 * Reference to the Array Contructor.
	 * @private
	 * @function
	 * @type {Function}
	 */
	Array = window.Array,

	/**
	 * Reference to the vendor prefix of the current browser.
	 * @private
	 * @constant
	 * @type {String}
	 * @see <a href="http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/" target="_blank">http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/</a>
	 */
	VENDOR_PREFIX = (function () {

		var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/,
			styleDeclaration = document.getElementsByTagName('script')[0].style,
			prop;

		for (prop in styleDeclaration) {
			if (regex.test(prop)) {
				return prop.match(regex)[0].toLowerCase();
			}
		}

		// Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
		// However (prop in style) returns the correct value, so we'll have to test for
		// the precence of a specific property
		if ('WebkitOpacity' in styleDeclaration) { return 'webkit'; }
		if ('KhtmlOpacity' in styleDeclaration) { return 'khtml'; }

		return '';
	}()),

	/**
	 * zIndex values.
	 * @private
	 * @type {Number}
	 */
	zIndex = 1000;

(function () {
	/**
	 * Provides varies utilities and commons functions that are used across all widgets.
	 * @name ch.util
	 * @namespace
	 */
	var util = {};

	/**
	 * Returns a boolean indicating whether the object has the specified property.
	 * @name hasOwn
	 * @methodOf ch.util
	 * @param {Object} obj The object to be checked.
	 * @param {String} prop The name of the property to test.
	 * @returns {Boolean}
	 */
	util.hasOwn = (function () {
		var hOP = Object.prototype.hasOwnProperty;

		return function (obj, prop) {

			if (obj === undefined) {
				throw new Error('"ch.util.hasOwn(obj, prop)": It must receive an object as first parameter.');
			}

			if (prop === undefined || typeof prop !== 'string') {
				throw new Error('"ch.util.hasOwn(obj, prop)": It must receive a string as second parameter.');
			}

			return hOP.call(obj, prop);
		};
	}());

	/**
	 * Returns true if an object is an array, false if it is not.
	 * @name isArray
	 * @methodOf ch.util
	 * @param {Object} obj The object to be checked.
	 * @returns {Boolean}
	 */
	util.isArray = (function () {
		if (typeof Array.isArray === 'function') {
			return Array.isArray;
		}

		return function (obj) {
			if(obj === undefined){
				throw new Error('"ch.util.isArray(obj)": It must receive a parameter.');
			}

			return (Object.prototype.toString.call(obj) === '[object Array]');
		};
	}());

	/**
	 * Returns a boolean indicating whether the selector is into DOM.
	 * @name inDom
	 * @methodOf ch.util
	 * @param {String} selector The selector to be checked.
	 * @param {String} [context=document] Explicit context to the selector.
	 * @returns {Boolean}
	 */
	util.inDom = function (selector, context) {
		if (selector === undefined || typeof selector !== 'string') {
			return false;
		}
		// jQuery: If you wish to use any of the meta-characters ( such as !"#$%&'()*+,./:;<=>?@[\]^`{|}~ ) as a literal part of a name, you must escape the character with two backslashes: \\.
		selector = selector.replace(/(\!|\"|\$|\%|\&|\'|\(|\)|\*|\+|\,|\/|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\`|\{|\||\}|\~)/gi, function (str, $1) {
			return "\\\\" + $1;
		});
		return $(selector, context).length > 0;
	};

	/**
	 * Checks if the url given is right to load content.
	 * @name isUrl
	 * @methodOf ch.util
	 * @param {String} url The url to be checked.
	 * @returns {Boolean}
	 */
	util.isUrl = function (url) {
		if (url === undefined || typeof url !== 'string') {
			return false;
		}

		/*
		# RegExp

		https://github.com/mercadolibre/chico/issues/579#issuecomment-5206670

		```javascript
		1	1.1						   1.2	 1.3  1.4		1.5		  1.6					2					   3 			   4					5
		/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?))+)((\?)(\w+=(\w?)+(&?))+)?$/
		```

		## Description
		1. Checks for the start of the URL
			1. if starts with a protocols followed by :// Example: file://chico
			2. if start with www followed by . (dot) Example: www.chico
			3. if starts with ./
			4. if starts with ../ and can repeat one or more times
			5. if start with double slash // Example: //chico.server
			6. if start with an ip address
		2. Checks the domain
		  letters, dash followed by a dot or by a slash. All this group can repeat one or more times
		3. Ports
		 Zero or one time
		4. Idem to point two
		5. QueryString pairs

		## Allowed URLs
		1. http://www.mercadolibre.com
		2. http://mercadolibre.com/
		3. http://mercadolibre.com:8080?hola=
		4. http://mercadolibre.com/pepe
		5. http://localhost:2020
		6. http://192.168.1.1
		7. http://192.168.1.1:9090
		8. www.mercadolibre.com
		9. /mercadolibre
		10. /mercadolibre/mercado
		11. /tooltip?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze
		12. ./pepe
		13. ../../mercado/
		14. www.mercadolibre.com?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze
		15. www.mercado-libre.com
		16. http://ui.ml.com:8080/ajax.html

		## Forbiden URLs
		1. http://
		2. http://www&
		3. http://hola=
		4. /../../mercado/
		5. /mercado/../pepe
		6. mercadolibre.com
		7. mercado/mercado
		8. localhost:8080/mercadolibre
		9. pepe/../pepe.html
		10. /pepe/../pepe.html
		11. 192.168.1.1
		12. localhost:8080/pepe
		13. localhost:80-80
		14. www.mercadolibre.com?siteId=MLA&categId=1744&buyi ngMode=buy_it_now&listingTypeId=bronze
		15. `<asd src="www.mercadolibre.com">`
		16. Mercadolibre.................
		17. /laksjdlkasjd../
		18. /..pepe..
		19. /pepe..
		20. pepe:/
		21. /:pepe
		22. dadadas.pepe
		23. qdasdasda
		24. http://ui.ml.com:8080:8080/ajax.html
		*/
		return ((/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?)(#?))+)((\?)(\w+=(\w?)+(&?))+)?(\w+#\w+)?$/).test(url));
	};

	/**
	 * Adds CSS rules to disable text selection highlighting.
	 * @name avoidTextSelection
	 * @methodOf ch.util
	 * @param {Object} Selector1 The HTMLElements to disable text selection highlighting.
	 * @param {Object} [Selector2] The HTMLElements to disable text selection highlighting.
	 * @param {Object} [SelectorN] The HTMLElements to disable text selection highlighting.
	 */
	util.avoidTextSelection = function () {
		var args = arguments;

		if (arguments.length < 1) {
			throw new Error('"ch.util.avoidTextSelection(selector)": The selector parameter is required.');
		}

		$.each(args, function(i, $arg){

			if (!($arg instanceof $)) {
				throw new Error('"ch.util.avoidTextSelection(selector)": The parameter must be a query selector.');
			}

			if ($.browser.msie) {
				$arg.attr('unselectable', 'on');
			} else if ($.browser.opera) {
				$arg.bind('mousedown', function () { return false; });
			} else {
				$arg.addClass('ch-user-no-select');
			};
		});
	};

	/**
	 * Gives the final used values of all the CSS properties of an element.
	 * @name getStyles
	 * @methodOf ch.util
	 * @param {object} el The HTMLElement for which to get the computed style.
	 * @param {string} prop The name of the CSS property to test.
	 * @returns {CSSStyleDeclaration}
	 * @see Based on: <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">http://www.quirksmode.org/dom/getstyles.html</a>
	 */
	util.getStyles = function (el, prop) {

		if (el === undefined || !(el.nodeType === 1)) {
			throw new Error('"ch.util.getStyles(el, prop)": The "el" parameter is required and must be a HTMLElement.');
		}

		if (prop === undefined || typeof prop !== 'string') {
			throw new Error('"ch.util.getStyles(el, prop)": The "prop" parameter is required and must be a string.');
		}

		if (window.getComputedStyle) {
			return window.getComputedStyle(el, "").getPropertyValue(prop);
		// IE
		} else {
			// Turn style name into camel notation
			prop = prop.replace(/\-(\w)/g, function (str, $1) { return $1.toUpperCase(); });
			return el.currentStyle[prop];
		}
	};

	/**
	 * Returns a boolean indicating whether the string is a HTML tag.
	 * @name isTag
	 * @methodOf ch.util
	 * @param {String} tag The name of the tag to be checked.
	 * @returns {Boolean}
	 */
	util.isTag = function (tag) {
		if (tag === undefined || typeof tag !== 'string') {
			return false;
		}

		return (/<([\w:]+)/).test(tag);
	};

	/**
	 * Returns a boolean indicating whether the string is a CSS selector.
	 * @name isSelector
	 * @methodOf ch.util
	 * @param {String} selector The selector to be checked.
	 * @returns {Boolean}
	 */
	util.isSelector = function (selector) {
		if (selector === undefined || typeof selector !== 'string') {
			return false;
		}

		var regex;
		for (regex in $.expr.match) {
			if ($.expr.match[regex].test(selector) && !util.isTag(selector)) {
				return true;
			};
		};
		return false;
	};

	/**
	 * Returns a shallow-copied clone of the object.
	 * @name clone
	 * @methodOf ch.util
	 * @param {Object} obj The object to copy.
	 * @returns {Object}
	 */
	util.clone = function (obj) {
		if (obj === undefined || typeof obj !== 'object') {
			throw new Error('"ch.util.clone(obj)": The "obj" parameter is required and must be a object.');
		}
		var copy = {},
			prop;

		for (prop in obj) {
			if (util.hasOwn(obj, prop)) {
				copy[prop] = obj[prop];
			}
		}
		return copy;
	};

	/**
	 * Inherits the prototype methods from one constructor into another. The parent will be accessible through the obj.super property.
	 * @name inherits
	 * @methodOf ch.util
	 * @param {Function} obj The object that have new members.
	 * @param {Function} superConstructor The construsctor Class.
	 * @returns {Object}
	 * @exampleDescription
	 * @example
	 * inherit(obj, parent);
	 */
	util.inherits = function (obj, superConstructor) {

		if (obj === undefined || typeof obj !== 'function') {
			throw new Error('"ch.util.inherits(obj, superConstructor)": The "obj" parameter is required and must be a constructor function.');
		}
		if (superConstructor === undefined || typeof superConstructor !== 'function') {
			throw new Error('"ch.util.inherits(obj, superConstructor)": The "superConstructor" parameter is required and must be a constructor function.');
		}

		var child = obj.prototype || {};
		obj.prototype = $.extend(child, superConstructor.prototype);
		obj.prototype.uber = superConstructor.prototype;

		/*var fn = function () {};
		fn.prototype = superConstructor.prototype;
		obj.prototype = new fn();
		obj.prototype.constructor = obj;*/
	};

	/**
	 * Uses a spesific class or collecton of classes
	 * @name use
	 * @methodOf ch.util
	 * @param {Object} obj The object that have new members.
	 * @param {Function} deps The dependecies objects.
	 * @returns {Object}
	 * @exampleDescription
	 * @example
	 * use(obj, [foo, bar]);
	 */
	util.use = function (obj, deps) {
		if (obj === undefined) {
			throw new Error('"ch.util.use(obj, deps)": The "obj" parameter is required and must be an object or constructor function.');
		}

		if (deps === undefined) {
			throw new Error('"ch.util.use(obj, deps)": The "deps" parameter is required and must be a function or collection.');
		}

		var context = obj.prototype
			deps = (util.isArray(deps)) ? deps : [deps];

		$.each(deps, function (i, dep) {
			dep.call(context);
		});

	};

	/**
	 * Prevent propagation and default actions.
	 * @name prevent
	 * @methodOf ch.util
	 * @param {Event} event The event ot be prevented.
	 * @returns {Object}
	 */
	util.prevent = function (event) {

		if (typeof event === 'object') {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	/**
	 * Reference to the vendor prefix of the current browser.
	 * @name VENDOR_PREFIX
	 * @constant
	 * @methodOf ch.util
	 * @type {String}
	 * @see <a href="http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/" target="_blank">http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/</a>
	 */
	util.VENDOR_PREFIX = (function () {

		var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/,
			styleDeclaration = document.getElementsByTagName('script')[0].style,
			prop;

		for (prop in styleDeclaration) {
			if (regex.test(prop)) {
				return prop.match(regex)[0].toLowerCase();
			}
		}

		// Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
		// However (prop in style) returns the correct value, so we'll have to test for
		// the precence of a specific property
		if ('WebkitOpacity' in styleDeclaration) { return 'webkit'; }
		if ('KhtmlOpacity' in styleDeclaration) { return 'khtml'; }

		return '';
	}());

	/**
	 * zIndex values.
	 * name zIndex
	 * @methodOf ch.util
	 * @type {Number}
	 */
	util.zIndex = 1000;

	ch.util = util;
}());

(function () {

	$.extend(ch.util, {

		/**
		 * Reference to the index page
		 * @name $mainView
		 * @memberOf ch.util
		 * @type {Selector}
		 */
		'$mainView': (function () {
			var $view = $('div[data-page=index]');

			if ($view.length === 0) {
				alert('Chico Mobile Error\n$mainView: The document doesn\'t contain an index "page" view.');
				throw new Error('Chico Mobile Error\n$mainView: The document doesn\'t contain an index "page" view.');
			}

			return $view;
		}()),

		/**
		 * Fixes the broken iPad/iPhone form label click issue.
		 * @name fixLabels
		 * @methodOf ch.util
		 * @see Based on: <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">http://www.quirksmode.org/dom/getstyles.html</a>
		 */
		'fixLabels': function () {
			var labels = document.getElementsByTagName('label'),
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
				if (labels[i].getAttribute('for')) {
					$(labels[i]).bind(ch.events.TAP, labelClick);
				}
			}
		},

		/*!
		 * MBP - Mobile boilerplate helper functions
		 * @name MBP
		 * @memberOf ch.util
		 * @namespace
		 * @see View on <a href="https://github.com/h5bp/mobile-boilerplate" target="_blank">https://github.com/h5bp/mobile-boilerplate</a>
		 */
		'MBP': {

			// Fix for iPhone viewport scale bug
			// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
			'viewportmeta': $('meta[name=viewport]'),

			'gestureStart': function () {
				ch.util.MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
			},

			'scaleFix': function () {
				if (ch.util.MBP.viewportmeta && /iPhone|iPad|iPod/.test(userAgent) && !/Opera Mini/.test(userAgent)) {
					ch.util.MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
					document.addEventListener('gesturestart', ch.util.MBP.gestureStart, false);
				}
			},

			/*
			* Normalized hide address bar for iOS & Android
			* (c) Scott Jehl, scottjehl.com
			* MIT License
			*/
			// If we cache this we don't need to re-calibrate everytime we call
			// the hide url bar
			'BODY_SCROLL_TOP': false,

			// So we don't redefine this function everytime we
			// we call hideUrlBar
			'getScrollTop': function () {
				return window.pageYOffset || document.compatMode === 'CSS1Compat' && document.documentElement.scrollTop || document.body.scrollTop || 0;
			},

			// It should be up to the mobile
			'hideUrlBar': function () {
				// if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
				if (!window.location.hash && ch.util.MBP.BODY_SCROLL_TOP !== false) {
					window.scrollTo( 0, ch.util.MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
				}
			},

			'hideUrlBarOnLoad': function () {
				// If there's a hash, or addEventListener is undefined, stop here
				if( !window.location.hash && window.addEventListener ) {

					//scroll to 1
					window.scrollTo(0, 1);
					ch.util.MBP.BODY_SCROLL_TOP = 1;

					//reset to 0 on bodyready, if needed
					var bodycheck = setInterval(function () {
						if(body) {
							clearInterval(bodycheck);
							ch.util.MBP.BODY_SCROLL_TOP = ch.util.MBP.getScrollTop();
							ch.util.MBP.hideUrlBar();
						}
					}, 15 );

					window.addEventListener('load', function() {
						setTimeout(function () {
							//at load, if user hasn't scrolled more than 20 or so...
							if(ch.util.MBP.getScrollTop() < 20) {
								//reset to hide addr bar at onload
								ch.util.MBP.hideUrlBar();
							}
						}, 0);
					});
				}
			},

			// Prevent iOS from zooming onfocus
			// https://github.com/h5bp/mobile-boilerplate/pull/108
			'preventZoom': function () {
				var formFields = $('input, select, textarea'),
					contentString = 'width=device-width,initial-scale=1,maximum-scale=',
					i = 0;
				for (; i < formFields.length; i += 1) {

					formFields[i].onfocus = function() {
						ch.util.MBP.viewportmeta.content = contentString + '1';
					};

					formFields[i].onblur = function () {
						ch.util.MBP.viewportmeta.content = contentString + '10';
					};
				}
			}
		}

	});

}());

(function () {
	/**
	 * Global events reference.
	 * @name ch.events
	 * @namespace
	 */
	var events = {};

	/**
	 * Layout events collection.
	 * @name layout
	 * @namespace
	 * @memberOf ch.events
	 */
	events.layout = {};

	/**
	 * Every time Chico-UI needs to inform all visual components that layout has been changed, it emits this event.
	 * @name CHANGE
	 * @constant
	 * @memberOf ch.events.layout
	 * @type {String}
	 */
	events.layout.CHANGE = 'change';

	/**
	 * Viewport events collection.
	 * @name viewport
	 * @namespace
	 * @memberOf ch.events
	 */
	events.viewport = {};

	/**
	 * Every time Chico UI needs to inform all visual components that window has been scrolled or resized, it emits this event.
	 * @name CHANGE
	 * @constant
	 * @memberOf ch.events.viewport
	 * @type {String}
	 * @see ch.Positioner
	 */
	events.viewport.CHANGE = 'change';

	ch.events = events;
}());

(function () {

	$.extend(ch.events, {
		/**
		 *
		 * @name TAP
		 * @constant
		 * @memberOf ch.events
		 * @type {String}
		 */
		'TAP': (('ontouchend' in window) ? 'touchend' : 'click'),

		/**
		 *
		 * @name PATH_CHANGE
		 * @constant
		 * @memberOf ch.events
		 * @type {String}
		 */
		'PATH_CHANGE': (('onpopstate' in window) ? 'popstate' : 'hashchange')

	});

}());

(function () {
	/**
	 * Reference to determine what "options" member should be created using the type of parameter that is received through the $-plugin.
	 * @namespace
	 */
	// TODO: This should be in the init() method of each widget
	var map = {
		/**
		 * When a type String is received, an options.content should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'string': 'content',
		/**
		 * When a type Object and instance of $ is received, an options.content should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'object': 'content',
		/**
		 * When a type Number is received, an options.num should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'number': 'num',
		/**
		 * When a type Function is received, an options.fn should be created.
		 * @memberOf map
		 * @type {String}
		 */
		'function': 'fn'
	};

	/**
	 * Method in change of expose a friendly interface of the Chico constructors.
	 * @methodOf ch
	 * @param {Object} Klass Direct reference to the constructor from where the $-plugin will be created.
	 * @see <a href="http://docs.jquery.com/Plugins/Authoring" target="_blank">http://docs.jquery.com/Plugins/Authoring</a>
	 */
	function factory(Klass) {
		/**
		 * Identification of the constructor, in lowercases.
		 * @type {String}
		 */
		var name = Klass.prototype.name,
			/**
			 * Reference to the class name. When it's a interface, take its constructor name via the "interface" property.
			 * @type {String}
			 */
			constructorName = Klass.prototype['interface'] || name;

		/**
		 * The class constructor exposed directly into the "ch" namespace.
		 * @exampleDescription Creating a widget instance by specifying a query selector and a configuration object.
		 * @example
		 * ch.Widget($('#example'), {
		 *     'key': 'value'
		 * });
		 */
		// Uses the function.name property (non-standard) on the newest browsers OR
		// uppercases the first letter from the identification name of the constructor
		ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;

		/**
		 * The class constructor exposed into the "$" namespace.
		 * @exampleDescription Creating a widget instance by specifying a query selector and a configuration object.
		 * @example
		 * $.widget($('#example'), {
		 *     'key': 'value'
		 * });
		 * @exampleDescription Creating a widget instance by specifying only a query selector. The default options of each widget will be used.
		 * @example
		 * $.widget($('#example')});
		 * @exampleDescription Creating a widget instance by specifying only a cofiguration object. It only works on compatible widgets, when those doesn't depends on a element to be created.
		 * @example
		 * $.widget({
		 *     'key': 'value'
		 * });
		 * @exampleDescription Creating a widget instance by no specifying parameters. It only works on compatible widgets, when those doesn't depends on a element to be created. The default options of each widget will be used.
		 * @example
		 * $.widget();
		 */
		$[name] = function ($el, options) {
			// When exists only the first parameter containing the options object
			// ($.widget({'key': 'value'})), then accommodate the resources
			// TODO: This should be in the init() method of each widget
			if (options === undefined && typeof $el === 'object') {
				options = $el;
				$el = undefined;
			}
			// Create a new instance of the constructor and return it
			return new Klass($el, options);
		};

		/**
		 * The class constructor exposed as a "$" plugin.
		 * @exampleDescription Creating a widget instance by specifying only a cofiguration object.
		 * @example
		 * $('#example').widget({
		 *     'key': 'value'
		 * });
		 * @exampleDescription Creating a widget instance by specifying only a query selector as parameter. It will be into the "options" object as "content".
		 * @example
		 * $('#example').widget($('#anotherElement'));
		 * @exampleDescription Creating a widget instance by specifying only a string parameter. It will be into the "options" object as "content".
		 * @example
		 * $('#example').widget('A string parameter');
		 * @exampleDescription Creating a widget instance by specifying only a numeric parameter. It will be into the "options" object as "num".
		 * @example
		 * $('#example').widget(123);
		 * @exampleDescription Creating a widget instance by specifying a numeric parameter followed by a string parameter. These will be into the "options" object as "num" and "content" respectively.
		 * @example
		 * $('#example').widget(123, 'A string parameter');
		 * @exampleDescription Creating a widget instance by specifying only a function as parameter. It will be into the "options" object as "fn".
		 * @example
		 * $('#example').widget(function () { ... });
		 * @exampleDescription Creating a widget instance by specifying a function followed by a string parameter. These will be into the "options" object as "fn" and "content" respectively.
		 * @example
		 * $('#example').widget(function () { ... }, 'A string parameter');
		 * @exampleDescription Creating a widget instance by no specifying parameters. The default options of each widget will be used.
		 * @example
		 * $('#example').widget();
		 */
		$.fn[name] = function (options) {
			// Collection with each instanced widget
			var widgets = [],
				// Each instance of the widget
				widget,
				// What kind of parameter is "options"
				type = typeof options;

			// Put the specified parameters into corresponding options object
			// when the "options" parameter is not the configuration object or
			// it's a query selector
			// TODO: This should be in the init() method of each widget
			if ((options !== undefined && type !== 'object') || options instanceof $) {
				// Grab temporally the received parameter
				var parameter = options,
					// Grab the second parameter
					content = arguments[1];
				// Empty "options" to use it as the real configuration object
				options = {};
				// Put the received parameter into options object with correspondig name getted from the map
				options[map[type]] = parameter;

				// Could have a content as a second argument when it receives a string or a query selector
				if (typeof content === 'string' || content instanceof $) {
					options.content = content;
				}
			}

			// Analize every match of the main query selector
			$.each(this, function (i, el) {
				// Get into the "$" scope
				var $el = $(el),
					// Try to get the "data" reference to this widget related to the element
					data = $el.data(constructorName);

				// When this widget isn't related to the element via data, create a new instance and save
				if (!data) {
					// Create a new instance of the widget
					widget = new Klass($el, options);
					// Save the reference to this instance into the element data
					$el.data(constructorName, widget);
				// When this widget is related to the element via data, return it
				} else {
					// Get the data as the widget itself
					widget = data;
					// By dispatching an event, widgets can know when it already exists
					if (ch.util.hasOwn(widget, 'trigger')) {
						widget.trigger('exists', {
							'type': name,
							'options': options
						});
					}
				}

				// Add the widget reference to the final collection
				widgets.push(widget);
			});

			// Return the instance/instances of widgets
			return ((widgets.length > 1) ? widgets : widgets[0]);
		};
	}

	// Export
	ch.factory = factory;
}());

(function () {

	/**
	 * Exposes all widget's instances into the ch.instances object.
	 * @returns {Object} ch
	 */
	function debug () {
		ch.instances = instances;
		return ch;
	}

	ch.instances = instances;

	ch.debug = debug;
}());

/**
 * Core constructor function.
 * @private
 */
(function init() {
	var util = ch.util;

	// Remove no-js classname
	$html.removeClass('no-js');
	// Iphone scale fix
	util.MBP.scaleFix();
	// Hide navigation url bar
	util.MBP.hideUrlBarOnLoad();
	// Prevent zoom onfocus
	util.MBP.preventZoom();
	// Fix the broken iPad/iPhone form label click issue
	util.fixLabels();
}());

ch.version = '0.6';


	window.ch = ch;
})(this, Zepto);

/**
* Event Emitter Class for the browser.
* @name EventEmitter
* @class EventEmitter
* @memberOf ch
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function EventEmitter() {
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
	}

	ch.EventEmitter = EventEmitter;

}(this, this.Zepto, this.ch));

(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	var routes = (function () {
		var pages = {},
			data,
			location = window.location,
			history = window.history,
			$window = $(window),
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

		$window.bind(ch.events.PATH_CHANGE, resolvePaths);

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

	ch.routes = routes

}(this, this.Zepto, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	/**
	 * Global instantiation widget id.
	 * @private
	 * @type {Number}
	 */
	var uid = 0;

	function Widget($el, options) {
		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Widget-that
		* @type object
		*/
		var that = this;

		// Use ch.EventEmitter
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
		that["public"].uid = that.uid = (uid += 1);

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
		* @name ch.Widget#removeAllListeners
		* @param {string} event Event name.
		* @returns itself
		* @example
		* widget.removeAllListeners("ready");
		*/
		that["public"].removeAllListeners = that.removeAllListeners;

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
	}

	Widget.prototype.name = 'widget';
	Widget.prototype.constructor = Widget;

	ch.Widget = Widget;

}(this, this.Zepto, this.ch));

/**
* Expandable lets you show or hide the content. Expandable needs a pair: the title and the content related to that title.
* @name Expandable
* @class Expandable
* @augments ch.Widget
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the Expandable open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @factorized
* @see ch.Widget
* @exampleDescription Create a new Expandable without configuration.
* @example
* var widget = $(".example").expandable();
* @exampleDescription Create a new Expandable with configuration.
* @example
* var widget = $(".example").expandable({
*     "open": true
* });
*/
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Expandable($el, conf) {
		/**
		* Reference to a internal component instance, saves all the information and configuration properties.
		* @private
		* @name ch.Expandable-that
		* @type object
		*/
		var that = this,

			/**
			* Reference to Parent Class.
			* @private
			* @name ch.Expandable-parent
			* @type object
			*/
			parent;

		that.$element = $el;
		that.element = $el[0];
		that.type = that.type || 'expandable';
		conf = conf || {};

		conf = ch.util.clone(conf);
		conf.open = conf.open || false;
		conf.classes = conf.classes || "";
		that.conf = conf;

	/**
	*	Inheritance
	*/
		that = ch.Widget.call(that);
		parent = ch.util.clone(that);

	/**
	*  Private Members
	*/

		/**
		* Private reference to the Zepto element
		* @privated
		* @name ch.Expandable-$el
		* @type Zepto Object
		*/
		var $el = that.$element,

			/**
			* Private reference to the element
			* @privated
			* @name ch.Expandable-el
			* @type HTMLElement

			*/
			el = that.element,

			/**
			* The component's toggle.
			* @privated
			* @function
			* @name ch.Expandable-$toggle
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
		* @name ch.Expandable#trigger
		* @type HTMLElement
		*/
		that.trigger = el.firstElementChild;

		/**
		* The component's trigger.
		* @protected
		* @name ch.Expandable#$trigger
		* @type Zepto Object
		*/
		that.$trigger = $(that.trigger);

		/**
		* The component's content.
		* @protected
		* @name ch.Expandable#content
		* @type HTMLElement
		*/
		that.content = el.lastElementChild;

		/**
		* The component's content.
		* @protected
		* @name ch.Expandable#$content
		* @type Zepto Object
		*/
		that.$content = $(that.content);

		/**
		* Shows component's content.
		* @protected
		* @function
		* @name ch.Expandable#innerShow
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
			* @name ch.Expandable#show
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
		* @name ch.Expandable#innerHide
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
			* @name ch.Expandable#hide
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
		* @name ch.Expandable#configBehavior
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
			that.$trigger.bind(ch.events.TAP, function (event) { event.preventDefault(); that.innerShow(event); });

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
		* @borrows ch.Widget#uid as ch.Expandable#uid
		*/

		/**
		* @borrows ch.Widget#el as ch.Expandable#el
		*/

		/**
		* @borrows ch.Widget#type as ch.Expandable#type
		*/

		/**
		* @borrows ch.Widget#emit as ch.Expandable#emit
		*/

		/**
		* @borrows ch.Widget#on as ch.Expandable#on
		*/

		/**
		* @borrows ch.Widget#once as ch.Expandable#once
		*/

		/**
		* @borrows ch.Widget#off as ch.Expandable#off
		*/

		/**
		* @borrows ch.Widget#offAll as ch.Expandable#offAll
		*/

		/**
		* @borrows ch.Widget#setMaxListeners as ch.Expandable#setMaxListeners
		*/


		/**
		* Shows component's content.
		* @public
		* @function
		* @name ch.Expandable#show
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
		* @name ch.Expandable#hide
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
		* @name ch.Expandable#ready
		* @event
		* @public
		* @example
		* // Following the first example, using 'me' as Expandable's instance controller:
		* widget.on("ready",function () {
		*	this.show();
		* });
		*/
		window.setTimeout(function(){ that.emit("ready")}, 50);

		return that['public'];
	}

	Expandable.prototype.name = 'expandable';
	Expandable.prototype.constructor = Expandable;

	ch.factory(Expandable);

}(this, this.Zepto, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Layer($el, conf) {
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
			parent;

		conf = conf || {};

		conf.icon = false;
		conf.aria = {};
		conf.aria.role = "tooltip";
		conf.aria.identifier = "aria-describedby";
		conf.classes = conf.classes || "ch-box ch-cone ch-points-ltlb";

		that.type = "layer";

	/**
	*	Inheritance
	*/
		// Borrow a constructor and return a parent
		parent = ch.Expandable.call(that, $el, conf);


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

		return that['public'];
	}

	Layer.prototype.name = 'layer';
	Layer.prototype.constructor = Layer;

	ch.factory(Layer);

}(this, this.Zepto, this.ch));

/**
* Menu lets you organize the links by categories.
* @name Menu
* @class Menu
* @augments ch.Widget
* @requires ch.Expandable
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Number} [conf.selected] Selects a child that will be open when component was loaded.
* @returns itself
* @factorized
* @see ch.Expandable
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
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Menu($el, conf) {
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
			parent;

		that.$element = $el;
		that.element = $el[0];
		that.type = that.type || 'menu';
		conf = conf || {};

		conf = ch.util.clone(conf);
		conf.icon = ch.util.hasOwn(conf, "icon") ? conf.icon : true;

		that.conf = conf;

		/**
		 * Inheritance
		 */
		// Borrow a constructor and return a parent
		that = ch.Widget.call(that);
		parent = ch.util.clone(that);;

		/**
		*  Private Members
		*/

		/**
		* Private reference to the element
		* @privated
		* @name ch.Menu-el
		* @type HTMLElement
		*/
		var el = that.element,

			/**
			* Private reference to the Zepto element
			* @privated
			* @name ch.Menu-$el
			* @type Zepto Object
			*/
			$el = that.$element,

			/**
			* Indicates witch child is opened
			* @private
			* @name ch.Menu-selected
			* @type number
			*/
			selected = (conf.selected) ? conf.selected - 1 : undefined,

			/**
			* Opens specific Expandable child and optionally grandson
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
		* Collection of expandables and bellows.
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

			$.each(that.triggers, function (i, e) {
				var c = e.children;

				if (c.length === 1) {
					that.cretateBellows(e);

					return;
				}

				that.children.push(
					$(e).expandable({
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
		window.setTimeout(function(){ that.emit("ready")}, 50);

		return that['public'];
	}

	Menu.prototype.name = 'menu';
	Menu.prototype.constructor = Menu;

	ch.factory(Menu);

}(this, this.Zepto, this.ch));

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
(function (window, $, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	function Modal($el, conf) {
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
			parent;

		that.$element = $el;
		that.element = $el[0];
		that.type = that.type || 'modal';
		conf = conf || {};

		conf = ch.util.clone(conf);
		that.conf = conf;

	/**
	*	Inheritance
	*/
		that = ch.Widget.call(that);
		parent = ch.util.clone(that);

	/**
	*  Private Members
	*/

		/**
		* Private reference to the element
		* @privated
		* @name ch.Modal-el
		* @type HTMLElement
		*/
		var el = that.element,


			/**
			* Private reference to the Zepto element
			* @privated
			* @name ch.Modal-$el
			* @type Zepto Object
			*/
			$el = that.$element,

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

				ch.util.$mainView.removeClass("ch-hide");
				ch.util.$mainView[0].setAttribute("aria-hidden", false);

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

			ch.util.$mainView.addClass("ch-hide");
			ch.util.$mainView[0].setAttribute("aria-hidden", true);

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

			ch.util.$mainView.after(that.$container);

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
		window.setTimeout(function(){ that.emit("ready")}, 50);

		return that['public'];
	}

	Modal.prototype.name = 'modal';
	Modal.prototype.constructor = Modal;

	ch.factory(Modal);

}(this, this.Zepto, this.ch));