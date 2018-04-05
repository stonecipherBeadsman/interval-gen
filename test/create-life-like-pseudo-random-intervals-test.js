var path = require('path');
var createLifeLikePseudoRandomInterval = require(path.resolve(__dirname, '../Helper/createLifeLikePseudoRandomInterval.js'));
var getIntervalLengthTime = require(path.resolve(__dirname, '../Helper/getIntervalLengthTime.js'));
var randomIntFromInterval = require(path.resolve(__dirname, '../Helper/randomIntFromInterval.js'));
var expect = require('chai').expect;
var assert = require('chai').assert;
var tests = [];
var test = {};

var intervalLengthTimes = getIntervalLengthTime().possibleReadingsPerDay;

for (var intervalLengthTime = 0; intervalLengthTime < intervalLengthTimes.length; intervalLengthTime++) {
	for (var hour = 1; hour <= intervalLengthTimes[intervalLengthTime]; hour++) {
		test.arguments = [hour, intervalLengthTimes[intervalLengthTime]];
		test.label = test.arguments + ' Should be >= 0 or <= 3.5';
		tests.push(test);
		test = {};
	}
}

describe('createLifeLikePseudoRandomInterval Test', function() {
	var returnedData;
	tests.forEach(function(test) {
		returnedData = createLifeLikePseudoRandomInterval.apply(null, test.arguments);
		it(test.label + ' = ' + returnedData,function() {
			expect(returnedData).to.be.within(0,3.5);
		});
	});		
});