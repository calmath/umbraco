/*exported CookieManager */
/**
 * @file _cookieManager.js
 * @author OtherCo
 *
 * @classdesc Manage cookies
 */
class CookieManager{
	
	/**
	 * Passes all set cookies into an object
	 * @constructs
	 */
	constructor(){
		
		let allCookies = document.cookie,
			arrayCookies = allCookies.split(";");
		
		/**
		 * cookies - Object with cookies key value pair
		 * @public
		 */
		this.cookies = {};
		for(let key in arrayCookies){
			let strCookie = arrayCookies[key];
			let cookiePair = strCookie.split("=");
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
	setCookie(name, val, days = null){
		
		if(val === "true" || val === "false"){
			let isTrueSet = (val === "true");
			val = isTrueSet ? 1 : 0;
		}
		
		var expires = "";
    	if (days) {
        	var date = new Date();
        	date.setTime(date.getTime() + (days*24*60*60*1000));
        	expires = "; expires=" + date.toUTCString();
    	}
    	document.cookie = name + "=" + (val || "")  + expires + "; path=/";
		
	}
	/**
	 * Get the value of a cookie
	 * @param {String} val - Cookie name
	 * @return {String} Value of cookie or empty if cookie name hasn"t been set
	 */
	getCookie(val){
		
		var returnVal = "";
		if(this.cookies[val]){
			returnVal = this.cookies[val];
			if(returnVal === "1" || returnVal === "0"){
				let isTrueSet = (returnVal === "1");
				returnVal = isTrueSet ? 1 : 0;
			}
		}else{
			console.log(`${val} cookie not set`);
		}
		return returnVal;
	}
}