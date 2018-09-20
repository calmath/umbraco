/*exported EventHandler */
/**
 * @file _eventHandler.js
 * @author Netcel
 *
 * @classdesc Base class for adding eventhandling to a class
 */
class EventHandler{
	/**
	 * Creates an empty events object for adding functions to
	 * @constructs
	 */
	constructor(){
		
		this.events = {};
		
	}
	/**
	 * Will run the function that is the value of the passed
	 * event key. A second argument for an object can be passed
	 * @param {String} event - Event key name to run function
	 * @param {Object} args - Arguments to pass to callback function
	 */
	dispatchEvent(event, args = {}){
		
		if(this.events[event]){
			this.events[event](args);
		}
		
	}
	/**
	 * Adds a callback function to the key identifier
	 * @param {String} event - Event key name to associate with function
	 * @param {Function} func - Callback function to associate with key name
	 */				
	addEventListener(event, func){
		
		this.events[event] = func;
		
	}
	/**
	 * Removes a callback function associated with the event key
	 * @param {String} event - Event name to remove from class
	 */					
	removeEventListener(event){
		
		delete this.events[event];
		
	}
}
