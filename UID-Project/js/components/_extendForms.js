/*exported ExtendForms */
/**
 * @file _extendForms.js
 * @author OtherCo
 *
 * @classdesc Handle additional form styling
 */
class ExtendForms {
	/**
	 * Pass all form inputs to handle label switching.
	 * @constructs
	 * @param {HTMLelmenet} form - Form to handle inputs
	 */
	constructor(form){
		
		this.form = form;
		this.inputs = {};
		for(let i = 0; i < form.length; i++){
			let input = form[i];
			
			this.inputs[input.id] = {
				"input" : input,
				"label" : form.querySelector(`label[for="${input.id}"]`)
			};
			
			if(input.type === "text" || input.type === "password"){
				input.addEventListener("focus", this.inputFocus.bind(this), false);
				if(input.value !== ""){
					
					this.inputs[input.id].label.classList.add("hide");
				}
			}
			if(input.type === "checkbox" || input.type === "radio"){
				this.inputs[input.id].label.addEventListener("keydown", this.labelKey.bind(this), false);
			}
		}
	}
	/**
	 * On focus state to hide labels when input is navigated to
	 * @param {object} evt - Focus event
	 */
	inputFocus(evt){
		
		let input = evt.target || evt.srcELement,
			inputId = input.id;
		
		this.inputs[inputId].label.classList.add("hide");
		input.addEventListener("blur", this.inputBlur.bind(this), false);
		
	}
	/**
	 * On blur state to show labels, if no input has been made
	 * @param {object} evt - Focus event
	 */
	inputBlur(evt){
		let input = evt.target || evt.srcELement,
			inputId = input.id;
		if(input.value === ""){
			this.inputs[inputId].label.classList.remove("hide");
			input.removeEventListener("blur", this.inputBlur.bind(this), false);
		}
	}
	/**
	 * Handles keyboard event when a label is focused to control
	 * the checked status of the label"s corresponding input
	 * @param {object} evt - Keydown event
	 */
	labelKey(evt){
		//console.log(evt);
		if(evt.key === " " || evt.key === "Enter"){
			evt.preventDefault();
			let label = evt.target || evt.srcElement;
			let id = label.getAttribute("for");
			let input = this.inputs[id].input;
			input.checked = !input.checked;
		}
	}
}