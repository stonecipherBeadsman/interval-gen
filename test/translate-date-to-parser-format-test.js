var path = require('path');
var translateDateToParserFormat = require(path.resolve(__dirname, "../Helper/translateDateToParserFormat.js"));
var assert = require('chai').assert;

//TODO: add failure cases

var tests = {};
tests.niscMepmd01 = {};
tests.niscMepmd01.success = ['2017','1','2','3'];
tests.niscMepmd01.failure = [];
tests.lgGridstream = {};
tests.lgGridstream.success = ['2018','1','2','3'];
tests.lgGridstream.failure = [];
describe('translateDateToParserFormat.niscMepmd01 Test', function() {
	var returnedData = translateDateToParserFormat.niscMepmd01.apply(null, tests.niscMepmd01.success);
	it('Should return a String representation of the date w/no spaces and prepended 0\'s', function() {
			assert.equal('201701020300', returnedData);
	});
});

describe('translatedDateToParserFormat.lgGridstream Test', function() {
	var returnedData = translateDateToParserFormat.lgGridstream.apply(null, tests.lgGridstream.success);
	it('Should return a String representation of the date  MMDDYYYHHMMSS{AM/PM}0', function() {
			assert.equal('01022018030000AM', returnedData);
	});
});