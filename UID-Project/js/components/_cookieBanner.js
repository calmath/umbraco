/*global EventHandler */
/*exported CookieBanner */
/**
 * @file _cookieBanner.js
 * @author OtherCo
 *
 * @classdesc Displays a cookie banner message
 */
class CookieBanner extends EventHandler{
	/**
	 * Sets up interactions with user
	 * @constructs
	 * @param {Boolean} [isSet=False] - If the cookie has been set or not.
	 */
	constructor(isSet = false){
		
		super();
		
		this.elem = null;
		this.cookieSet = isSet;
		this.acceptButton = null;
		this.body = document.body;
		
		/**
		 * Associate with user click on accept event.
		 * @static
		 */
		this.EVENT_COOKIE_SET = "EVENT_COOKIE_SET";
		/**
		 * Associate with user click on close event.
		 * @static
		 */
		this.EVENT_COOKIE_CLOSED = "EVENT_COOKIE_CLOSED";
		
		if(!this.cookieSet){
			this.body.classList.add("cookie-no-set");
			this.elem = document.getElementById("cookieBanner");
			let buttons = this.elem.getElementsByTagName("button");
			this.acceptButton = buttons[0];
			this.closeButton = buttons[1];
			this.acceptButton.addEventListener("click", this.acceptCookies.bind(this), false);
			this.closeButton.addEventListener("click", this.closeCookies.bind(this), false);
		}
	}
	/**
	 * Event when user clicks on the accept button
	 * @param {Object} evt - Click event object
	 */
	acceptCookies(evt){
		
		console.log(evt);
		this.body.classList.remove("cookie-no-set");
		this.dispatchEvent(this.EVENT_COOKIE_SET, evt);
		
	}
	/**
	 * Event when user clicks on the close button
	 * @param {Object} evt - Click event object
	 */
	closeCookies(evt){
		
		console.log(evt);
		this.body.classList.remove("cookie-no-set");
		this.dispatchEvent(this.EVENT_COOKIE_CLOSED, evt);
		
	}
}