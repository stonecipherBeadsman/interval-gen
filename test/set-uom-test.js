var path = require('path');
var setUOM = require(path.resolve(__dirname, "../Helper/setUOM.js"));
var assert = require('chai').assert;

var tests = [
	{
		arguments:['Rdfgh'],
		expected: {
			intUom: 'GKWH',
            regUom: 'GKWHREG'
		},
		testLable: 'Rdfgh  ->  GKWH, GKWHREG'
	},
	{
		arguments:['NASDF'],
		expected: {
			intUom: 'NKWH',
            regUom: 'NKWHREG'
		},
		testLable: 'NASDF -> NKWH, NKWHREG'
	},
	{
		arguments:['Tasdf'],
		expected: {
			intUom: 'SKWH',
            regUom: 'SKWHREG'
		},
		testLable: 'Tasdf -> SKWH, SKWHREG'
	},
	{
		arguments:['KASD'],
		expected: {
			intUom: 'KWH',
            regUom: 'KWHREG'
		},
		testLable: 'KASD -> KWH, KWHREG'
	}
];

describe('setUOM Test \n\tLooks at the first Letter in the \n\tgiven string and returns a result', function() {
	tests.forEach(function(test) {
		it(test.testLable, function() {
			var returnedData = setUOM.apply(null, test.arguments);
			assert.equal(returnedData.intUom, test.expected.intUom);
			assert.equal(returnedData.regUom, test.expected.regUom);
		});
	});
	
});