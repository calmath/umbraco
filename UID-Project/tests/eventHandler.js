var EventHandler = require('../js/components/_eventHandler.js').EventHandler;
var assert = require('assert');
//import EventHandler from '../js/components/_eventHandler.js'
//import assert from 'assert'




var newEventHandler = new EventHandler();

describe('Add and dispatch handler', function() {
	
	var testFunc = function(){
		it('should run this function after dispatch', function() {
			assert.ok(true);
		});
	}

	newEventHandler.addEventListener('add', testFunc);
	it('should have an "add" event', function(){
		assert.deepEqual(newEventHandler.events, {"add" : testFunc});
	})
	newEventHandler.dispatchEvent('add');
	
});

describe('Remove event', function(){
	
	describe('#removeEventListener()', function(){
		
		it('events should be empty', function(){
			newEventHandler.removeEventListener('add');
			assert.deepEqual(newEventHandler.events, {});
		})
		
	});
	
})
