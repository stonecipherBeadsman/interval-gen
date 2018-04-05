var path = require("path");
var getScaledIntervalBound = require(path.resolve(__dirname, "../Helper/getScaledIntervalBound.js"));
var randomIntFromInterval = require(path.resolve(__dirname, "../Helper/randomIntFromInterval.js"));
var assert = require('chai').assert;

var tests = [];
var test = {};
var unscaledMax = 0;
var intervalMultiplier = 0;
var multiplier = 0;

function getScaledIntervalBoundBaseline(unscaledMax, multiplier, intervalMultiplier) {
    return (unscaledMax / intervalMultiplier)  * multiplier;
}

for (var i = 0; i < 100; i++) {
	unscaledMax = randomIntFromInterval(0,1);
	intervalMultiplier = randomIntFromInterval(0.5,5);
	multiplier = randomIntFromInterval(0.75, 2);
	test.arguments = [unscaledMax,multiplier,intervalMultiplier];
	test.expected = getScaledIntervalBoundBaseline.apply(null, test.arguments);
	test.testLable = test.arguments + ' Should -> ' + test.expected;
	tests.push(test);
	test = {};
};


describe('getScaledIntervalBound Test', function() {
	var returnedData;
	tests.forEach(function(test) {
		it(test.testLable, function() {
			returnedData = getScaledIntervalBound.apply(null, test.arguments);
			assert.equal(returnedData, test.expected);
		});
	});
});