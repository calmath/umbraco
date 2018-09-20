/*exported Typewriter */
/**
 * @file _typewriter.js
 * @author Netcel
 *
 * @classdesc Creates typewriter effects of text
 */
class Typewriter{
	/**
	 * Sets up text areas for type writer effect text. If no typewriter
	 * effect text is found and h1 child elements of heroblock class
	 * will be checked for "able futures" text
	 * @constructs
	 * @param {string} tags - String of tags to pass to query selector
	 */
	constructor(tags = "h1"){
		
		this.options = {
			"time" : 4000,
			"fullStopPause" : 750
		};
		
		this.typeElems = [];
		this.typeObjs = [];
		let typewriterElems = document.querySelectorAll(".typewriter");
		for(let i = 0; i < typewriterElems.length; i++){
			let typewriterElem = typewriterElems[i];
			let elems = typewriterElem.querySelectorAll(tags);
			for(let ii = 0; ii < elems.length; ii++){
				this.typeElems.push(elems[ii]);
			}
			
		}
		
		for(let key in this.typeElems){
			var typeElem = this.typeElems[key];
			let typeChars = [],
				typeString = this.getTextNode(typeElem),
				boldTextInd = -1;
				typeElem.setAttribute("data-typewriter", key);
			while(typeElem.firstChild){
				typeElem.removeChild(typeElem.firstChild);
			}
			
			for(let ii = 0; ii < typeString.length; ii++){
				let stringSpan = document.createElement("span");
				let letter = typeString.substr(ii, 1);
				stringSpan.appendChild(document.createTextNode(letter));
				//console.log(stringSpan);
				if(boldTextInd > -1 && ii >= boldTextInd){
					stringSpan.className = "bold";
				}
				typeElem.appendChild(stringSpan);
				typeChars.push(stringSpan);
			}

			let cursor = this.cursor();
			typeElem.appendChild(cursor);
			this.createTypeObj(typeElem, typeChars);
			typeElem.classList.add("ready");
		}
		
		window.addEventListener("scroll", this.isInView.bind(this), false);
		window.addEventListener("resize", this.checkHeight.bind(this), false);
		window.setTimeout(function(){
			window.scrollTo(0,1);
		}, 0);
		this.isInView();
	}
	getTextNode(elem){
		for(let i = 0; i < elem.childNodes.length; i++){
			let childNode = elem.childNodes[i];
			if(childNode.nodeType === 3){
				let typeString = String(childNode.textContent);
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
	createTypeObj(elem, chars){
		
		let pauseTime = this.options.time / chars.length;
		let lastChar = chars[chars.length - 1];
		let obj = {
			"elem" : elem,
			"characters" : chars,
			"hasPlayed" : false,
			"start" : 0,
			"passed" : 0,
			"pos" : -1,
			"pause" : pauseTime,
			"isPauseFullStop" : false,
			"last" : lastChar
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
	setElemHeight(elem, lastChar){
		elem.style.minHeight = lastChar.offsetHeight + (lastChar.offsetTop - 25)+ "px";
	}
	/**
	 * Set the height of the typewriter element when the
	 * viewport changes size
	 * @param {Object} evt - Resize event
	 */
	checkHeight(evt){
		for(var i = 0; i < this.typeObjs.length; i++){
			let typeObj = this.typeObjs[i];
			this.setElemHeight(typeObj.elem, typeObj.last);
		}
	}
	/**
	 * Create the cursor element to add to the dom
	 * @returns {HTMLelement} - Cursor as a HTML span
	 */
	cursor(){
		let cursor = document.createElement("span");
		cursor.className = "typeWriterCursor";
		cursor.innerHTML = "_";
		return cursor;
	}
	/**
	 * Checks if the typewriter element is within the viewport
	 * and begins the animation if it hasn"t already played through.
	 */
	isInView(){
		
		for(let i = 0; i < this.typeElems.length; i++){
			let typeElem = this.typeElems[i];
			var id = typeElem.getAttribute("data-typewriter");
			let typeObj = this.typeObjs[id];
			if(!typeObj.hasPlayed){
				let rect = typeElem.getBoundingClientRect();
				if(this.rectCalc(rect)){
					this.animate(id);
				}
			}
		}
	}
	/**
	 * Checks if the bounding rectangle is within the viewport
	 * @returns {boolean} - true if rectangle is within the viewport
	 */
	rectCalc(rect){
		
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
		
	}
	/**
	 * Starts animating the typewriter effect
	 * @param {String|int} id - Number that references the typewriter element
	 */
	animate(id){
		console.log(`start aniamting ${id}`);
		let typeObj = this.typeObjs[id];
		typeObj.hasPlayed = true;
		
		window.requestAnimationFrame((timeStamp) => {
			this.step(timeStamp, id);
		});
	}
	/**
	 * The next animation step for playback
	 * @param {TimeStamp} timeStamp - Timestamp to check how much time has passed
	 * since the last request animation frame
	 * @param {String|int} id - Number that references the typewriter element
	 */
	step(timeStamp, id){
		
		let typeObj = this.typeObjs[id];
		if(typeObj.start === 0){
			typeObj.start = timeStamp;
		}
		typeObj.passed = timeStamp - typeObj.start;
		if(typeObj.passed > typeObj.pause){
			typeObj.passed = 0;
			typeObj.start = timeStamp;
			typeObj.pos++;
		
			if(typeObj.pos < typeObj.characters.length){

				let char = typeObj.characters[typeObj.pos];
				if(char.textContent === "." &&
				   this.options.fullStopPause > 0 &&
				   typeObj.pos < (typeObj.characters.length - 1)){
					typeObj.pause += this.options.fullStopPause;
					typeObj.isPauseFullStop = true;
				}else if(typeObj.isPauseFullStop){
					typeObj.pause -= this.options.fullStopPause;
					typeObj.isPauseFullStop = false;
				}
				if(!char.classList.contains("show")){
					char.classList.add("show");
				}

				window.requestAnimationFrame((timeStamp) => {
					this.step(timeStamp, id);
				});
			}else{
				typeObj.elem.classList.add("ended");
			}
			
		}else{
			window.requestAnimationFrame((timeStamp) => {
				this.step(timeStamp, id);
			});
		}
	}
}
