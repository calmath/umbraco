 /*jshint unused:false*/

/**
 * @file _accordion.js
 * @author Netcel
 *
 * @classdesc Extending css controlled accordions
 */
class Accordion{
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
	constructor(accordionList, options = {
		"keepOpen" : false,
		"animate" : true,
		"allOpen" : false,
		"firstOpen" : false
	}){
		if(options.allOpen && options.firstOpen){
			console.warn("Can't keep all accordions open and only first, all accordions will be open by default.");
		}
		
		this.options = options;
		
		let accordionContents = accordionList.querySelectorAll(".accordionContent"),
			accordionWrappers = accordionList.querySelectorAll(".accordionWrapper"),
			accordionInputs = accordionList.querySelectorAll("input"),
			accordionLabels = accordionList.querySelectorAll("label");
		
		this.accordions = [];
		
		for(let i = 0; i < accordionInputs.length; i++){
			let accordionInput = accordionInputs[i];
			if(options.keepOpen || options.allOpen){
				accordionInput.type = "checkbox";
				if(options.allOpen){
					accordionInput.checked = true;
				}else if(options.firstOpen && i === 0){
					accordionInput.checked = true;
				}
			}else if(options.firstOpen && i === 0){
				accordionInput.checked = true;
			}
			accordionInput.setAttribute("data-index", i);
			if(options.animate){
				accordionInput.addEventListener("change", this.toggleAccordion.bind(this), false);
			}
			let label = accordionLabels[i];
			let accordionObj = {
				input : accordionInput,
				content : accordionContents[i],
				wrapper : accordionWrappers[i],
				label : label,
				id : label.id
			};
			this.accordions.push(accordionObj);
		}
		for(let i = 0; i < accordionLabels.length; i++){
			let accordionLabel = accordionLabels[i];
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
	setOpenSizes(){
		
		for(let key in this.accordions){
			let accordion = this.accordions[key];
			let accordionContent = accordion.content;
			accordionContent.setAttribute("data-height", accordionContent.offsetHeight);
			if(accordion.input.checked === true){
				let accordionWrapper = accordion.wrapper;
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
	labelKeyHandler(evt){
		
		let keyLabel = evt.key,
			elem = evt.target || evt.srcElement;
		if((keyLabel === " " ||keyLabel === "Spacebar" || keyLabel === "Enter") && elem.tagName === "LABEL"){
			evt.preventDefault();
			let inputId = elem.getAttribute("for"),
				inputElem = document.getElementById(inputId);
			if(inputElem.checked === true){
				inputElem.checked = false;
			}else if(inputElem.checked === false){
				inputElem.checked = true;
			}
			this.toggleAccordion({
				target : inputElem
			});
		}
	}
	/**
	 * Override default click handling for labels
	 * @param {Object} evt - Click event
	 */
	labelClickHandler(evt){
		
		let elem = evt.target || evt.srcElement;
		
		while(elem.tagName !== "LABEL"){
			elem = elem.parentNode;
		}
		
		let inputId = elem.getAttribute("for"),
			inputElem = document.getElementById(inputId);
		
		if(inputElem.type === "radio" && inputElem.checked === true){
			inputElem.checked = false;
			evt.preventDefault();
			this.toggleAccordion({
				target : inputElem
			});
		}
	}
	/**
	 * If the accordion has been set to animate this event will
	 * handle the height styling.
	 * @param {Object} evt - Change event
	 * @param {HTMLelement} evt.target - HTML element associated with the event
	 */
	toggleAccordion(evt){
		
		for(let key in this.accordions){
			let accordion = this.accordions[key];
			if(accordion.input.checked === false){
				let accordionWrapper = accordion.wrapper;
				accordionWrapper.style.height = "0px";
			}
		}
		
		let elem = evt.target || evt.srcElement,
			elemInd = elem.getAttribute("data-index"),
			accordion = this.accordions[elemInd],
			accordionContent = accordion.content,
			accordionWrapper = accordion.wrapper;
		
		if(elem.checked){
			accordionWrapper.style.height = accordionContent.getAttribute("data-height") + "px";
		}else{
			accordionWrapper.style.height = "0px";
		}
	}
	/**
	 * Opens all accordions, if not limited to only one accordion
	 * being opened.
	 */
	openAll(){
		
		if(this.options.allOpen || this.options.keepOpen){
			for(let i = 0; i < this.accordions.length; i++){
				let accordion = this.accordions[i];
				let accordionInput = accordion.input;
				accordionInput.checked = true;
			}
		}else{
			console.error("Only one accordion can be opened at a time");
		}
	}
	/**
	 * Closes all accordions.
	 */
	closeAll(){
		
		for(let key in this.accordions){
			let accordion = this.accordions[key];
			let accordionInput = accordion.input;
			accordionInput.checked = false;
		}
	}
	/**
	 * Get the accordion object based on it"s id
	 * @param {string} val - Id to match accordion element against
	 * @return {object} Accordion object
	 */
	getAccordionById(val){
		
		let returnItem = null;
		for(let i in this.accordions){
			let accordion = this.accordions[i];
			if(accordion.id === val){
				returnItem = accordion;
				break;
			}
		}
		return returnItem;
	}
}