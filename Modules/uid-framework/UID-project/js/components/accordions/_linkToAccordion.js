/* globals Accordion */
/*jshint unused:false*/

/**
 * @file _linkToAccordion.js
 * @author Netcel
 *
 * @classdesc Extends default accordion functionality to allow
 * hash links to open a corresponding accordion
 */
class LinkToAccordion extends Accordion{
	/**
	 * Sets up accordions and starts listening for changes in the
	 * hash location
	 * @constructs
	 * @augments Accordion
	 */
	constructor(accordionList, options = {
		"keepOpen" : false,
		"animate" : true,
		"allOpen" : false,
		"firstOpen" : false
	}){
		
		super(accordionList, options);
		
		window.addEventListener("hashchange", this.hashNav.bind(this), false);
		this.getHash();
	}
	/**
	 * Listener for when the hash location changes
	 * @param {Object} evt - hashchange event
	 */
	hashNav(evt){
		
		this.getHash();
		
	}
	/**
	 * Gets the hash value and checks if an accordion has a
	 * corresponding id, if one matches the accordion will
	 * be opened
	 */
	getHash(){
		
		if(location.hash !== ""){
			let hashVal = location.hash.split("#")[1];
			let accordion = this.getAccordionById(hashVal);
			if(accordion){
				accordion.input.checked = true;
				this.toggleAccordion({
					target : accordion.input
				});
			}
		}
	}
}