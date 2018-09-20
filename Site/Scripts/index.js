"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global module:true, MenuIcon, CookieManager, CookieBanner, LanguageSwitch, Typewriter, LinkToAccordion, ExtendForms */
/*jshint unused:false*/

/*exported EventHandler */

/**

 * @file _eventHandler.js

 * @author Netcel

 *

 * @classdesc Base class for adding eventhandling to a class

 */

var EventHandler = function () {

	/**
 
  * Creates an empty events object for adding functions to
 
  * @constructs
 
  */

	function EventHandler() {
		_classCallCheck(this, EventHandler);

		this.events = {};
	}

	/**
 
  * Will run the function that is the value of the passed
 
  * event key. A second argument for an object can be passed
 
  * @param {String} event - Event key name to run function
 
  * @param {Object} args - Arguments to pass to callback function
 
  */

	_createClass(EventHandler, [{
		key: "dispatchEvent",
		value: function dispatchEvent(event) {
			var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


			if (this.events[event]) {

				this.events[event](args);
			}
		}

		/**
  
   * Adds a callback function to the key identifier
  
   * @param {String} event - Event key name to associate with function
  
   * @param {Function} func - Callback function to associate with key name
  
   */

	}, {
		key: "addEventListener",
		value: function addEventListener(event, func) {

			this.events[event] = func;
		}

		/**
  
   * Removes a callback function associated with the event key
  
   * @param {String} event - Event name to remove from class
  
   */

	}, {
		key: "removeEventListener",
		value: function removeEventListener(event) {

			delete this.events[event];
		}
	}]);

	return EventHandler;
}();

/*exported MenuIcon */
/**
 * @file _menuIcon.js
 * @author Netcel
 *
 * @classdesc Hamburger menu functionality
 */


var MenuIcon = function () {
	/**
  * Set up the menu icon and navigation drawer.
  * @constructs
  * @param {HTMLelmenet} elemMenu - Html element for menu icon
  * @param {HTMLelmenet} elemNav - Html element for navigation drawer containing links
  */
	function MenuIcon(elemMenu, elemNav) {
		_classCallCheck(this, MenuIcon);

		this.open = false;
		this.body = document.documentElement;
		this.menuButton = elemMenu;
		this.menuNav = elemNav;
		this.links = this.menuNav.getElementsByTagName("a");

		this.menuButton.addEventListener("click", this.toggleMenu.bind(this), false);
		this.menuButton.disabled = false;

		this.linkFirst = this.menuButton;
		this.linkLast = this.links[this.links.length - 1];

		window.addEventListener("keydown", this.tabControl.bind(this), false);
	}
	/**
  * Event handler for when user interacts with the menu icon
  * @param {Object} evt - Click event
  */


	_createClass(MenuIcon, [{
		key: "toggleMenu",
		value: function toggleMenu(evt) {

			this.open = !this.open;

			if (this.open) {
				this.body.classList.add("menuOpen");
			} else {
				this.body.classList.remove("menuOpen");
			}
		}
		/**
   * Event handler for when user tabs through the open
   * navigation menu. If the menu is open the tabbing
   * will loop around the open menu links.
   * @param {Object} evt - Keydown event
   */

	}, {
		key: "tabControl",
		value: function tabControl(evt) {

			if (this.open) {
				if (evt.keyCode === 27) {

					this.linkFirst.focus();
					this.toggleMenu();
				} else {
					if (evt.code === "Tab" || evt.keyCode === 9) {

						if (evt.shiftKey) {

							if (document.activeElement === this.linkFirst) {
								this.linkLast.focus();
								evt.preventDefault();
							}
						} else {

							if (document.activeElement === this.linkLast) {
								this.linkFirst.focus();
								evt.preventDefault();
							}
						}
					}
				}
			}
		}
	}]);

	return MenuIcon;
}();
/*global EventHandler */
/*exported CookieBanner */
/**
 * @file _cookieBanner.js
 * @author Netcel
 *
 * @classdesc Displays a cookie banner message
 */


var CookieBanner = function (_EventHandler) {
	_inherits(CookieBanner, _EventHandler);

	/**
  * Sets up interactions with user
  * @constructs
  * @param {Boolean} [isSet=False] - If the cookie has been set or not.
  */
	function CookieBanner() {
		var isSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		_classCallCheck(this, CookieBanner);

		var _this = _possibleConstructorReturn(this, (CookieBanner.__proto__ || Object.getPrototypeOf(CookieBanner)).call(this));

		_this.elem = null;
		_this.cookieSet = isSet;
		_this.acceptButton = null;
		_this.body = document.body;

		/**
   * Associate with user click on accept event.
   * @static
   */
		_this.EVENT_COOKIE_SET = "EVENT_COOKIE_SET";
		/**
   * Associate with user click on close event.
   * @static
   */
		_this.EVENT_COOKIE_CLOSED = "EVENT_COOKIE_CLOSED";

		if (!_this.cookieSet) {
			_this.body.classList.add("cookie-no-set");
			_this.elem = document.getElementById("cookieBanner");
			var buttons = _this.elem.getElementsByTagName("button");
			_this.acceptButton = buttons[0];
			_this.closeButton = buttons[1];
			_this.acceptButton.addEventListener("click", _this.acceptCookies.bind(_this), false);
			_this.closeButton.addEventListener("click", _this.closeCookies.bind(_this), false);
		}
		return _this;
	}
	/**
  * Event when user clicks on the accept button
  * @param {Object} evt - Click event object
  */


	_createClass(CookieBanner, [{
		key: "acceptCookies",
		value: function acceptCookies(evt) {

			console.log(evt);
			this.body.classList.remove("cookie-no-set");
			this.dispatchEvent(this.EVENT_COOKIE_SET, evt);
		}
		/**
   * Event when user clicks on the close button
   * @param {Object} evt - Click event object
   */

	}, {
		key: "closeCookies",
		value: function closeCookies(evt) {

			console.log(evt);
			this.body.classList.remove("cookie-no-set");
			this.dispatchEvent(this.EVENT_COOKIE_CLOSED, evt);
		}
	}]);

	return CookieBanner;
}(EventHandler);
/*exported CookieManager */
/**
 * @file _cookieManager.js
 * @author Netcel
 *
 * @classdesc Manage cookies
 */


var CookieManager = function () {

	/**
  * Passes all set cookies into an object
  * @constructs
  */
	function CookieManager() {
		_classCallCheck(this, CookieManager);

		var allCookies = document.cookie,
		    arrayCookies = allCookies.split(";");

		/**
   * cookies - Object with cookies key value pair
   * @public
   */
		this.cookies = {};
		for (var key in arrayCookies) {
			var strCookie = arrayCookies[key];
			var cookiePair = strCookie.split("=");
			this.cookies[cookiePair[0].replace(/[\s]/, "")] = cookiePair[1];
		}
	}
	/**
  * Pass a unique identifier for cookie with it"s value and
  * expiration time in number of days.
  * @param {String} name - Key for cookie
  * @param {String} val - Value to associate with cookie
  * @param {int} [days=null] - Number of days for the cookie to expire. If null
  * cookie will only be set for the session.
  */


	_createClass(CookieManager, [{
		key: "setCookie",
		value: function setCookie(name, val) {
			var days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


			if (val === "true" || val === "false") {
				var isTrueSet = val === "true";
				val = isTrueSet ? 1 : 0;
			}

			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (val || "") + expires + "; path=/";
		}
		/**
   * Get the value of a cookie
   * @param {String} val - Cookie name
   * @return {String} Value of cookie or empty if cookie name hasn"t been set
   */

	}, {
		key: "getCookie",
		value: function getCookie(val) {

			var returnVal = "";
			if (this.cookies[val]) {
				returnVal = this.cookies[val];
				if (returnVal === "1" || returnVal === "0") {
					var isTrueSet = returnVal === "1";
					returnVal = isTrueSet ? 1 : 0;
				}
			} else {
				console.log(val + " cookie not set");
			}
			return returnVal;
		}
	}]);

	return CookieManager;
}();
/*exported ExtendForms */
/**
 * @file _extendForms.js
 * @author Netcel
 *
 * @classdesc Handle additional form styling
 */


var ExtendForms = function () {
	/**
  * Pass all form inputs to handle label switching.
  * @constructs
  * @param {HTMLelmenet} form - Form to handle inputs
  */
	function ExtendForms(form) {
		_classCallCheck(this, ExtendForms);

		this.form = form;
		this.inputs = {};
		for (var i = 0; i < form.length; i++) {
			var input = form[i];

			this.inputs[input.id] = {
				"input": input,
				"label": form.querySelector("label[for=\"" + input.id + "\"]")
			};

			if (input.type === "text" || input.type === "password") {
				input.addEventListener("focus", this.inputFocus.bind(this), false);
				if (input.value !== "") {

					this.inputs[input.id].label.classList.add("hide");
				}
			}
			if (input.type === "checkbox" || input.type === "radio") {
				this.inputs[input.id].label.addEventListener("keydown", this.labelKey.bind(this), false);
			}
		}
	}
	/**
  * On focus state to hide labels when input is navigated to
  * @param {object} evt - Focus event
  */


	_createClass(ExtendForms, [{
		key: "inputFocus",
		value: function inputFocus(evt) {

			var input = evt.target || evt.srcELement,
			    inputId = input.id;

			this.inputs[inputId].label.classList.add("hide");
			input.addEventListener("blur", this.inputBlur.bind(this), false);
		}
		/**
   * On blur state to show labels, if no input has been made
   * @param {object} evt - Focus event
   */

	}, {
		key: "inputBlur",
		value: function inputBlur(evt) {
			var input = evt.target || evt.srcELement,
			    inputId = input.id;
			if (input.value === "") {
				this.inputs[inputId].label.classList.remove("hide");
				input.removeEventListener("blur", this.inputBlur.bind(this), false);
			}
		}
		/**
   * Handles keyboard event when a label is focused to control
   * the checked status of the label"s corresponding input
   * @param {object} evt - Keydown event
   */

	}, {
		key: "labelKey",
		value: function labelKey(evt) {
			//console.log(evt);
			if (evt.key === " " || evt.key === "Enter") {
				evt.preventDefault();
				var label = evt.target || evt.srcElement;
				var id = label.getAttribute("for");
				var input = this.inputs[id].input;
				input.checked = !input.checked;
			}
		}
	}]);

	return ExtendForms;
}();
/*exported Typewriter */
/**
 * @file _typewriter.js
 * @author Netcel
 *
 * @classdesc Creates typewriter effects of text
 */


var Typewriter = function () {
	/**
  * Sets up text areas for type writer effect text. If no typewriter
  * effect text is found and h1 child elements of heroblock class
  * will be checked for "able futures" text
  * @constructs
  * @param {string} tags - String of tags to pass to query selector
  */
	function Typewriter() {
		var tags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "h1";

		_classCallCheck(this, Typewriter);

		this.options = {
			"time": 4000,
			"fullStopPause": 750
		};

		this.typeElems = [];
		this.typeObjs = [];
		var typewriterElems = document.querySelectorAll(".typewriter");
		for (var i = 0; i < typewriterElems.length; i++) {
			var typewriterElem = typewriterElems[i];
			var elems = typewriterElem.querySelectorAll(tags);
			for (var ii = 0; ii < elems.length; ii++) {
				this.typeElems.push(elems[ii]);
			}
		}

		for (var key in this.typeElems) {
			var typeElem = this.typeElems[key];
			var typeChars = [],
			    typeString = this.getTextNode(typeElem),
			    boldTextInd = -1;
			typeElem.setAttribute("data-typewriter", key);
			while (typeElem.firstChild) {
				typeElem.removeChild(typeElem.firstChild);
			}

			for (var _ii = 0; _ii < typeString.length; _ii++) {
				var stringSpan = document.createElement("span");
				var letter = typeString.substr(_ii, 1);
				stringSpan.appendChild(document.createTextNode(letter));
				//console.log(stringSpan);
				if (boldTextInd > -1 && _ii >= boldTextInd) {
					stringSpan.className = "bold";
				}
				typeElem.appendChild(stringSpan);
				typeChars.push(stringSpan);
			}

			var cursor = this.cursor();
			typeElem.appendChild(cursor);
			this.createTypeObj(typeElem, typeChars);
			typeElem.classList.add("ready");
		}

		window.addEventListener("scroll", this.isInView.bind(this), false);
		window.addEventListener("resize", this.checkHeight.bind(this), false);
		window.setTimeout(function () {
			window.scrollTo(0, 1);
		}, 0);
		this.isInView();
	}

	_createClass(Typewriter, [{
		key: "getTextNode",
		value: function getTextNode(elem) {
			for (var i = 0; i < elem.childNodes.length; i++) {
				var childNode = elem.childNodes[i];
				if (childNode.nodeType === 3) {
					var typeString = String(childNode.textContent);
					return typeString;
				}
			}
		}
		/**
   * Object of typewriter text containing information on all
   * its properties
   * @param {HTMLelement} elem - HTML element containing typewriter effect text
   * @param {Array} chars - Characters converted to HTML span elements
   */

	}, {
		key: "createTypeObj",
		value: function createTypeObj(elem, chars) {

			var pauseTime = this.options.time / chars.length;
			var lastChar = chars[chars.length - 1];
			var obj = {
				"elem": elem,
				"characters": chars,
				"hasPlayed": false,
				"start": 0,
				"passed": 0,
				"pos": -1,
				"pause": pauseTime,
				"isPauseFullStop": false,
				"last": lastChar
			};
			console.log(lastChar.offsetTop);
			this.setElemHeight(elem, lastChar);
			this.typeObjs.push(obj);
		}
		/**
   * Set the height of the typewriter element based on the
   * position of the last character
   * @param {HTMLelement} elem - HTML element containing typewriter effect text
   * @param {HTMLelement} lastChar - Last span in the typewriter text
   */

	}, {
		key: "setElemHeight",
		value: function setElemHeight(elem, lastChar) {
			elem.style.minHeight = lastChar.offsetHeight + (lastChar.offsetTop - 25) + "px";
		}
		/**
   * Set the height of the typewriter element when the
   * viewport changes size
   * @param {Object} evt - Resize event
   */

	}, {
		key: "checkHeight",
		value: function checkHeight(evt) {
			for (var i = 0; i < this.typeObjs.length; i++) {
				var typeObj = this.typeObjs[i];
				this.setElemHeight(typeObj.elem, typeObj.last);
			}
		}
		/**
   * Create the cursor element to add to the dom
   * @returns {HTMLelement} - Cursor as a HTML span
   */

	}, {
		key: "cursor",
		value: function cursor() {
			var cursor = document.createElement("span");
			cursor.className = "typeWriterCursor";
			cursor.innerHTML = "_";
			return cursor;
		}
		/**
   * Checks if the typewriter element is within the viewport
   * and begins the animation if it hasn"t already played through.
   */

	}, {
		key: "isInView",
		value: function isInView() {

			for (var i = 0; i < this.typeElems.length; i++) {
				var typeElem = this.typeElems[i];
				var id = typeElem.getAttribute("data-typewriter");
				var typeObj = this.typeObjs[id];
				if (!typeObj.hasPlayed) {
					var rect = typeElem.getBoundingClientRect();
					if (this.rectCalc(rect)) {
						this.animate(id);
					}
				}
			}
		}
		/**
   * Checks if the bounding rectangle is within the viewport
   * @returns {boolean} - true if rectangle is within the viewport
   */

	}, {
		key: "rectCalc",
		value: function rectCalc(rect) {

			return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
		}
		/**
   * Starts animating the typewriter effect
   * @param {String|int} id - Number that references the typewriter element
   */

	}, {
		key: "animate",
		value: function animate(id) {
			var _this2 = this;

			console.log("start aniamting " + id);
			var typeObj = this.typeObjs[id];
			typeObj.hasPlayed = true;

			window.requestAnimationFrame(function (timeStamp) {
				_this2.step(timeStamp, id);
			});
		}
		/**
   * The next animation step for playback
   * @param {TimeStamp} timeStamp - Timestamp to check how much time has passed
   * since the last request animation frame
   * @param {String|int} id - Number that references the typewriter element
   */

	}, {
		key: "step",
		value: function step(timeStamp, id) {
			var _this3 = this;

			var typeObj = this.typeObjs[id];
			if (typeObj.start === 0) {
				typeObj.start = timeStamp;
			}
			typeObj.passed = timeStamp - typeObj.start;
			if (typeObj.passed > typeObj.pause) {
				typeObj.passed = 0;
				typeObj.start = timeStamp;
				typeObj.pos++;

				if (typeObj.pos < typeObj.characters.length) {

					var char = typeObj.characters[typeObj.pos];
					if (char.textContent === "." && this.options.fullStopPause > 0 && typeObj.pos < typeObj.characters.length - 1) {
						typeObj.pause += this.options.fullStopPause;
						typeObj.isPauseFullStop = true;
					} else if (typeObj.isPauseFullStop) {
						typeObj.pause -= this.options.fullStopPause;
						typeObj.isPauseFullStop = false;
					}
					if (!char.classList.contains("show")) {
						char.classList.add("show");
					}

					window.requestAnimationFrame(function (timeStamp) {
						_this3.step(timeStamp, id);
					});
				} else {
					typeObj.elem.classList.add("ended");
				}
			} else {
				window.requestAnimationFrame(function (timeStamp) {
					_this3.step(timeStamp, id);
				});
			}
		}
	}]);

	return Typewriter;
}();

/*jshint unused:false*/

/**
 * @file _accordion.js
 * @author Netcel
 *
 * @classdesc Extending css controlled accordions
 */


var Accordion = function () {
	/**
  * Populates varaibles of elements that make up an accordion.
  * @constructs
  * @param {HtmlElement} accordionList - Html element that contains the accordions "accordion".
  * @param {Object} options - Configure the behaviour of the accordions.
  * @param {Boolean} options.keepOpen - If true the accordion will remain open until the user closes it.
  * @param {Boolean} options.animate - Will set heights on the opened accordion content to allow for CSS transition animation.
  * @param {Boolean} options.allOpen - Will set open all of the accordions by default. This means that accordions can"t automatically close all others.
  * @param {Boolean} options.firstOpen - Only open the first accordion on load. Only one accordion will then open at a time.
  */
	function Accordion(accordionList) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
			"keepOpen": false,
			"animate": true,
			"allOpen": false,
			"firstOpen": false
		};

		_classCallCheck(this, Accordion);

		if (options.allOpen && options.firstOpen) {
			console.warn("Can't keep all accordions open and only first, all accordions will be open by default.");
		}

		this.options = options;

		var accordionContents = accordionList.querySelectorAll(".accordionContent"),
		    accordionWrappers = accordionList.querySelectorAll(".accordionWrapper"),
		    accordionInputs = accordionList.querySelectorAll("input"),
		    accordionLabels = accordionList.querySelectorAll("label");

		this.accordions = [];

		for (var i = 0; i < accordionInputs.length; i++) {
			var accordionInput = accordionInputs[i];
			if (options.keepOpen || options.allOpen) {
				accordionInput.type = "checkbox";
				if (options.allOpen) {
					accordionInput.checked = true;
				} else if (options.firstOpen && i === 0) {
					accordionInput.checked = true;
				}
			} else if (options.firstOpen && i === 0) {
				accordionInput.checked = true;
			}
			accordionInput.setAttribute("data-index", i);
			if (options.animate) {
				accordionInput.addEventListener("change", this.toggleAccordion.bind(this), false);
			}
			var label = accordionLabels[i];
			var accordionObj = {
				input: accordionInput,
				content: accordionContents[i],
				wrapper: accordionWrappers[i],
				label: label,
				id: label.id
			};
			this.accordions.push(accordionObj);
		}
		for (var _i = 0; _i < accordionLabels.length; _i++) {
			var accordionLabel = accordionLabels[_i];
			accordionLabel.addEventListener("keydown", this.labelKeyHandler.bind(this), false);
			accordionLabel.addEventListener("click", this.labelClickHandler.bind(this), false);
		}
		window.addEventListener("resize", this.setOpenSizes.bind(this), false);
		this.setOpenSizes();
	}
	/**
  * Sets the height of the accordion content based on it"s
  * offset height and stores it on the element as a data attribute.
  */


	_createClass(Accordion, [{
		key: "setOpenSizes",
		value: function setOpenSizes() {

			for (var key in this.accordions) {
				var accordion = this.accordions[key];
				var accordionContent = accordion.content;
				accordionContent.setAttribute("data-height", accordionContent.offsetHeight);
				if (accordion.input.checked === true) {
					var accordionWrapper = accordion.wrapper;
					accordionWrapper.style.height = accordionContent.offsetHeight + "px";
				}
			}
		}
		/**
   * Keyboard event handler for labels, so if enter or space is
   * pressed the matching input will toggle.
   * @param {Object} evt - Keyboard event
   * @param {String} evt.key - Keyboard key as string value
   * @param {HTMLelement} evt.target - HTML element associated with the event
   */

	}, {
		key: "labelKeyHandler",
		value: function labelKeyHandler(evt) {

			var keyLabel = evt.key,
			    elem = evt.target || evt.srcElement;
			if ((keyLabel === " " || keyLabel === "Spacebar" || keyLabel === "Enter") && elem.tagName === "LABEL") {
				evt.preventDefault();
				var inputId = elem.getAttribute("for"),
				    inputElem = document.getElementById(inputId);
				if (inputElem.checked === true) {
					inputElem.checked = false;
				} else if (inputElem.checked === false) {
					inputElem.checked = true;
				}
				this.toggleAccordion({
					target: inputElem
				});
			}
		}
		/**
   * Override default click handling for labels
   * @param {Object} evt - Click event
   */

	}, {
		key: "labelClickHandler",
		value: function labelClickHandler(evt) {

			var elem = evt.target || evt.srcElement;

			while (elem.tagName !== "LABEL") {
				elem = elem.parentNode;
			}

			var inputId = elem.getAttribute("for"),
			    inputElem = document.getElementById(inputId);

			if (inputElem.type === "radio" && inputElem.checked === true) {
				inputElem.checked = false;
				evt.preventDefault();
				this.toggleAccordion({
					target: inputElem
				});
			}
		}
		/**
   * If the accordion has been set to animate this event will
   * handle the height styling.
   * @param {Object} evt - Change event
   * @param {HTMLelement} evt.target - HTML element associated with the event
   */

	}, {
		key: "toggleAccordion",
		value: function toggleAccordion(evt) {

			for (var key in this.accordions) {
				var _accordion = this.accordions[key];
				if (_accordion.input.checked === false) {
					var _accordionWrapper = _accordion.wrapper;
					_accordionWrapper.style.height = "0px";
				}
			}

			var elem = evt.target || evt.srcElement,
			    elemInd = elem.getAttribute("data-index"),
			    accordion = this.accordions[elemInd],
			    accordionContent = accordion.content,
			    accordionWrapper = accordion.wrapper;

			if (elem.checked) {
				accordionWrapper.style.height = accordionContent.getAttribute("data-height") + "px";
			} else {
				accordionWrapper.style.height = "0px";
			}
		}
		/**
   * Opens all accordions, if not limited to only one accordion
   * being opened.
   */

	}, {
		key: "openAll",
		value: function openAll() {

			if (this.options.allOpen || this.options.keepOpen) {
				for (var i = 0; i < this.accordions.length; i++) {
					var accordion = this.accordions[i];
					var accordionInput = accordion.input;
					accordionInput.checked = true;
				}
			} else {
				console.error("Only one accordion can be opened at a time");
			}
		}
		/**
   * Closes all accordions.
   */

	}, {
		key: "closeAll",
		value: function closeAll() {

			for (var key in this.accordions) {
				var accordion = this.accordions[key];
				var accordionInput = accordion.input;
				accordionInput.checked = false;
			}
		}
		/**
   * Get the accordion object based on it"s id
   * @param {string} val - Id to match accordion element against
   * @return {object} Accordion object
   */

	}, {
		key: "getAccordionById",
		value: function getAccordionById(val) {

			var returnItem = null;
			for (var i in this.accordions) {
				var accordion = this.accordions[i];
				if (accordion.id === val) {
					returnItem = accordion;
					break;
				}
			}
			return returnItem;
		}
	}]);

	return Accordion;
}();
/* globals Accordion */
/*jshint unused:false*/

/**
 * @file _linkToAccordion.js
 * @author Netcel
 *
 * @classdesc Extends default accordion functionality to allow
 * hash links to open a corresponding accordion
 */


var LinkToAccordion = function (_Accordion) {
	_inherits(LinkToAccordion, _Accordion);

	/**
  * Sets up accordions and starts listening for changes in the
  * hash location
  * @constructs
  * @augments Accordion
  */
	function LinkToAccordion(accordionList) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
			"keepOpen": false,
			"animate": true,
			"allOpen": false,
			"firstOpen": false
		};

		_classCallCheck(this, LinkToAccordion);

		var _this4 = _possibleConstructorReturn(this, (LinkToAccordion.__proto__ || Object.getPrototypeOf(LinkToAccordion)).call(this, accordionList, options));

		window.addEventListener("hashchange", _this4.hashNav.bind(_this4), false);
		_this4.getHash();
		return _this4;
	}
	/**
  * Listener for when the hash location changes
  * @param {Object} evt - hashchange event
  */


	_createClass(LinkToAccordion, [{
		key: "hashNav",
		value: function hashNav(evt) {

			this.getHash();
		}
		/**
   * Gets the hash value and checks if an accordion has a
   * corresponding id, if one matches the accordion will
   * be opened
   */

	}, {
		key: "getHash",
		value: function getHash() {

			if (location.hash !== "") {
				var hashVal = location.hash.split("#")[1];
				var accordion = this.getAccordionById(hashVal);
				if (accordion) {
					accordion.input.checked = true;
					this.toggleAccordion({
						target: accordion.input
					});
				}
			}
		}
	}]);

	return LinkToAccordion;
}(Accordion);

var init = function init() {

	var acceptCookieName = "acceptCookies",
	    menuIcon = new MenuIcon(document.getElementById("menuIcon"), document.getElementById("menuNav")),
	    cookieManager = new CookieManager();

	var acceptCookieVal = cookieManager.getCookie(acceptCookieName);

	var cookieBanner = new CookieBanner(acceptCookieVal);

	cookieBanner.addEventListener(cookieBanner.EVENT_COOKIE_SET, function (evt) {

		cookieManager.setCookie(acceptCookieName, "true", 2 * 365);
		acceptCookieVal = true;
	});
	cookieBanner.addEventListener(cookieBanner.EVENT_COOKIE_CLOSED, function (evt) {

		cookieManager.setCookie(acceptCookieName, "true");
		acceptCookieVal = true;
	});

	var allAccordionElems = document.querySelectorAll(".accordions");
	var accordOpts = {
		keepOpen: true,
		animate: true,
		allOpen: false,
		firstOpen: false
	};
	var i = 0;
	for (i = 0; i < allAccordionElems.length; i++) {
		var accordElem = allAccordionElems[i];
		new LinkToAccordion(accordElem, accordOpts);
	}
	var allForms = document.getElementsByTagName("form");
	for (i = 0; i < allForms.length; i++) {
		var form = allForms[i];
		new ExtendForms(form);
	}
	new Typewriter();
};
init();