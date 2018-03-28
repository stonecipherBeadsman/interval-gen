var path = require('path');
var translateDateToParserFormat = require(path.resolve(__dirname, "../Helper/translateDateToParserFormat.js"));
var assert = require('chai').assert;


var tests = ['2017','1','2','3']
describe('translateDateToParserFormat Test', function(){


	var returnedData = translateDateToParserFormat.apply(null, tests);
	it('Should return a String representation of the datew/no spaces and prepended 0\'s', function(){
			assert.equal('201701020300', returnedData);
	});

});