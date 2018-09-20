/*global module:true, MenuIcon, CookieManager, CookieBanner, LanguageSwitch, Typewriter, LinkToAccordion, ExtendForms */
/*jshint unused:false*/

//=include ../../node_modules/uid-framework/UID-project/js/components/_eventHandler.js
//=include ./components/_menuIcon.js
//=include ./components/_cookieBanner.js
//=include ./components/_cookieManager.js
//=include ./components/_extendForms.js
//=include ./components/_typewriter.js
//=include ../../node_modules/uid-framework/UID-project/js/components/accordions/_accordion.js
//=include ../../node_modules/uid-framework/UID-project/js/components/accordions/_linkToAccordion.js

const init = function(){
	
	const acceptCookieName = "acceptCookies",
		  menuIcon = new MenuIcon(document.getElementById("menuIcon"), document.getElementById("menuNav")),
		  cookieManager = new CookieManager();
	
	var acceptCookieVal = cookieManager.getCookie(acceptCookieName);
	
	const cookieBanner = new CookieBanner(acceptCookieVal);
	
	cookieBanner.addEventListener(cookieBanner.EVENT_COOKIE_SET, function(evt){
		
		cookieManager.setCookie(acceptCookieName, "true", (2 * 365));
		acceptCookieVal = true;
		
	});
	cookieBanner.addEventListener(cookieBanner.EVENT_COOKIE_CLOSED, function(evt){
		
		cookieManager.setCookie(acceptCookieName, "true");
		acceptCookieVal = true;
		
	});

	var allAccordionElems = document.querySelectorAll(".accordions");
	var accordOpts = {
		keepOpen : true,
		animate : true,
		allOpen : false,
		firstOpen : false
	};
	let i = 0;
	for(i = 0; i < allAccordionElems.length; i++){
		var accordElem = allAccordionElems[i];
		new LinkToAccordion(accordElem, accordOpts);
	}
	var allForms = document.getElementsByTagName("form");
	for(i = 0; i < allForms.length; i++){
		var form = allForms[i];
		new ExtendForms(form);
	}
	new Typewriter();
};
init();