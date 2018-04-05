var path = require('path');
var getIntervalLengthTime = require(path.resolve(__dirname, '../Helper/getIntervalLengthTime.js'));
var randomIntFromInterval = require(path.resolve(__dirname, '../Helper/randomIntFromInterval.js'));
var assert = require('chai').assert;
var expect = require('chai').expect;

var testsContainer = [];
var tests = [];
var test = {};
var possibilities = [24,48,96,288, undefined];
var impossibilities = [-1,NaN,3,4,6,7,8,9,null,0];

function getIntervalLengthTimeBaseline(readingsPerDay) {
   if (readingsPerDay === 24) {
        return 100;
    } else if (readingsPerDay === 48) {
        return 30;
    } else if (readingsPerDay === 96) {
        return 15;
    } else if (readingsPerDay === 288) {
        return 5;
    } else if (readingsPerDay === undefined) {
        return {possibleReadingsPerDay: [24,48,96,288], possibleIntervalValues:[100,30,15,5]};
    } else {
        throw new Error('readingsPerDay Must be 5, 15, 30, 100\n\treadingsPerDay given: ' + readingsPerDay);
    }
}

for (var x = 0; x < possibilities.length; x++) {
	test.arguments = [possibilities[x]];
	test.expected = getIntervalLengthTimeBaseline.apply(null, test.arguments);
	test.label =  test.arguments + ' Should -> ' + test.expected
	tests.push(test);
	test = {};
}

testsContainer.push(tests);
tests = [];

for (var i = 0; i < impossibilities.length; i++) {
	test.arguments = [impossibilities[i]];
	test.label =  test.arguments + ' Should -> ' + 'Error';
	tests.push(test);
	test = {};
}
testsContainer.push(tests);
tests = [];

describe('getIntervalLengthTime Test', function() {
	var returnedData = null;
	testsContainer[0].forEach(function(test) {
		it(test.label, function() {
			returnedData = getIntervalLengthTime.apply(null, test.arguments);
			assert.deepEqual(returnedData, test.expected);
		});
	});

	returnedData = null;

	testsContainer[1].forEach(function(test) {
		it(test.label, function() {
			//throw() requires that you pass in a function, so wrapping the function with the 
			//applied params in an anonymous function works, if it is a synchronous call
			expect(function() {
				getIntervalLengthTime.apply(null, test.arguments)
			}).to.throw(Error, 'readingsPerDay Must be 5, 15, 30, 100');
		});
	});
});