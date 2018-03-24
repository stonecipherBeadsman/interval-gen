var randomIntFromInterval = require("../Helper/randomIntFromInterval.js");
var assert = require('chai').assert;
var should = require('chai').should();

describe('randomIntFromInterval Test', function(){

	for(var i = 0; i <= 10; i++){
		var random = randomIntFromInterval(i,10);
		console.log(((random <= 10 )));
		console.log((random >= i));
		var result = ((random <= 10 ) && (random >= i));
		it('Should get a random int (' + random + ') between ' + i + ' and ' + 10, function(){
			assert.equal(result, true);
		});
	}

});