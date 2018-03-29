var path = require('path');
var createLifeLikePseudoRandomInterval = require(path.resolve(__dirname, '../Helper/createLifeLikePseudoRandomInterval.js'));
var getIntervalLengthTime = require(path.resolve(__dirname, '../Helper/getIntervalLengthTime.js'));
var randomIntFromInterval = require(path.resolve(__dirname, '../Helper/randomIntFromInterval.js'));
var expect = require('chai').expect;
var assert = require('chai').assert;
var tests = [];
var test = {};

var intervalLengthTimes = getIntervalLengthTime().possibleReadingsPerDay;

function createLifeLikePseudoRandomIntervalBaseline(hourOfTheDay, readingsPerDay){
    var multiplier = 1;
    var intervalMultiplier = (readingsPerDay / 24);
    var useMultiplier = readingsPerDay === 24 ? getBooleanValue(0.9) : false;
    if(useMultiplier){
        multiplier = randomIntFromInterval(0, 1);
    }
    if(hourOfTheDay <= 5 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0, 1, intervalMultiplier), getScaledIntervalBound(0.25, multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 6 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.2, 1, intervalMultiplier), getScaledIntervalBound(0.75, multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 7 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.2, 1, intervalMultiplier), getScaledIntervalBound(1, multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 8 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(2, multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 10 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.5, 1, intervalMultiplier), getScaledIntervalBound(2, multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 11 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(1.75, multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 12 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(2,  multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 13 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.75, 1, intervalMultiplier), getScaledIntervalBound(1.75,  multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 14 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.65, 1, intervalMultiplier), getScaledIntervalBound(1.5,  multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 15 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.85, 1, intervalMultiplier), getScaledIntervalBound(2.5,  multiplier, intervalMultiplier));
    }else if(hourOfTheDay <= 20 * intervalMultiplier){
        return randomIntFromInterval(getScaledIntervalBound(0.75, 1, intervalMultiplier), getScaledIntervalBound(3.5, multiplier, intervalMultiplier));
    }else{
        return randomIntFromInterval(getScaledIntervalBound(0.05, 1, intervalMultiplier), getScaledIntervalBound(1.25, multiplier, intervalMultiplier));
    }
}

for (var intervalLengthTime = 0; intervalLengthTime < intervalLengthTimes.length; intervalLengthTime++) {
	for (var hour = 0; hour < 24; hour++) {
		test.arguments = [hour, intervalLengthTimes[intervalLengthTime]];
		test.label = test.arguments + ' Should be >= 0 or <= 3.5';
		tests.push(test);
		test = {};
	}
}

describe('createLifeLikePseudoRandomInterval Test', function(){
	var returnedData;
	tests.forEach(function(test){
		returnedData = createLifeLikePseudoRandomInterval.apply(null, test.arguments);
		it(test.label,function(){
			expect(returnedData).to.be.within(0,3.5);
		});
	});		
});