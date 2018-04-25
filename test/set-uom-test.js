var path = require('path');
var setUOM = require(path.resolve(__dirname, "../Helper/setUOM.js"));
var assert = require('chai').assert;
var expect = require('chai').expect;

var tests = {};
tests.niscMepmd01 = {};
tests.lgGridstream = {};

tests.niscMepmd01.success = [
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
		arguments:['FASD'],
		expected: {
			intUom: 'KWH',
            regUom: 'KWHREG'
		},
		testLable: 'FASD -> KWH, KWHREG'
	}
];

tests.niscMepmd01.failure = [
	{
		arguments:['ASD'],
		testLable: 'Invalid input to setUOM.niscMepmd01: Given: ' + 'ASD' + ', Expected: FORWARD, REVERSE, NET, or TOTAL'
	},
	{
		arguments:[''],
		testLable: 'Invalid input to setUOM.niscMepmd01: Given: ' + '' + ', Expected: FORWARD, REVERSE, NET, or TOTAL'
	},
	{
		arguments:['!'],
		testLable: 'Invalid input to setUOM.niscMepmd01: Given: ' + '!' + ', Expected: FORWARD, REVERSE, NET, or TOTAL'
	},
	{
		arguments:['1234'],
		testLable: 'Invalid input to setUOM.niscMepmd01: Given: ' + '1234' + ', Expected: FORWARD, REVERSE, NET, or TOTAL'
	},
	{
		arguments:[undefined],
		testLable: 'Invalid input to setUOM.niscMepmd01: must not pass in null or undefined, Got: ' + undefined 
	},
	{
		arguments:[null],
		testLable: 'Invalid input to setUOM.niscMepmd01: must not pass in null or undefined, Got: ' + null 
	}
];

tests.lgGridstream.success = [
	{
		arguments:['Rdfgh'],
		expected: 'kWh-RcvdRateA',
		testLable: 'Rdfgh  ->  kWh-RcvdRateA'
	},
	{
		arguments:['FASD'],
		expected: 'kWh-DelRateA',
		testLable: 'FASD -> kWh-DelRateA'
	}
];
tests.lgGridstream.failure = [
	{
		arguments:['ASD'],
		testLable: 'Invalid input to setUOM.lgGridstream: Given: ' + 'ASD' + ', Expected: FORWARD or REVERSE'
	},
	{
		arguments:[''],
		testLable: 'Invalid input to setUOM.lgGridstream: Given: ' + '' + ', Expected: FORWARD or REVERSE'
	},
	{
		arguments:['!'],
		testLable: 'Invalid input to setUOM.lgGridstream: Given: ' + '!' + ', Expected: FORWARD or REVERSE'
	},
	{
		arguments:['1234'],
		testLable: 'Invalid input to setUOM.lgGridstream: Given: ' + '1234' + ', Expected: FORWARD or REVERSE'
	},
	{
		arguments:[undefined],
		testLable: 'Invalid input to setUOM.lgGridstream: must not pass in null or undefined, Got: ' + undefined 
	},
	{
		arguments:[null],
		testLable: 'Invalid input to setUOM.lgGridstream: must not pass in null or undefined, Got: ' + null 
	}
];


describe('setUOM.niscMepmd01 Test \n\tLooks at the first Letter in the \n\tgiven string and returns a result', function() {
	tests.niscMepmd01.success.forEach(function(test) {
		it(test.testLable, function() {
			var returnedData = setUOM.niscMepmd01.apply(null, test.arguments);
			assert.equal(returnedData.intUom, test.expected.intUom);
			assert.equal(returnedData.regUom, test.expected.regUom);
		});
	});
	tests.niscMepmd01.failure.forEach(function(test){
		it(test.testLable, function(){
			expect(function(){
				setUOM.niscMepmd01.apply(null, test.arguments);
			}).to.throw(Error, test.testLable);
		});
	});
	
});

describe('setUOM.lgGridstream Test \n\tLooks at the first Letter in the \n\tgiven string and returns a result', function() {
	tests.lgGridstream.success.forEach(function(test) {
		it(test.testLable, function() {
			var returnedData = setUOM.lgGridstream.apply(null, test.arguments);
			assert.equal(returnedData.intUom, test.expected);
		});
	});
	tests.lgGridstream.failure.forEach(function(test){
		it(test.testLable, function(){
			expect(function(){
				setUOM.lgGridstream.apply(null, test.arguments);
			}).to.throw(Error, test.testLable);
		});
	});
	
});