var path = require('path');
var padNumber = require(path.resolve(__dirname, '../Helper/padNumber.js'));
var assert = require('chai').assert;

describe('padNumber Test', function(){

	for(var i = 0; i < 100; i+=25){
		var returnedData = padNumber(i);
		var result = ['000','025','050','075','100'];
		it('Should turn an to a string with prepended 0\'s: ' + i + ' -> ' + returnedData , function(){
			assert.equal(result[(i/25)], i);
		});
	}

});