var path = require('path');
var addIntervalsToCumulative = require(path.resolve(__dirname, '../Helper/addIntervalsToCumulative.js'));
var getIntervalLengthTime = require(path.resolve(__dirname, '../Helper/getIntervalLengthTime.js'));
var randomIntFromInterval = require(path.resolve(__dirname, '../Helper/randomIntFromInterval.js'));
var expect = require('chai').expect;

var testsContainer = [];
var tests = [];
var test = {};
var intervals = [];
var interval = 0;

var intervalLengthTimes = getIntervalLengthTime().possibleReadingsPerDay;

function sum(intervalArray){
    var cumulativeSum = 0;
    for (var i = 0; i < intervalArray.length; i++){
        cumulativeSum += intervalArray[i];
    }
    return cumulativeSum;
}

for (var readingsPerDayPosition = 0; readingsPerDayPosition < intervalLengthTimes.length; readingsPerDayPosition++) {
	for (var intervalTime = 0; intervalTime < intervalLengthTimes[readingsPerDayPosition]; intervalTime++) {
        interval = randomIntFromInterval(0,10000);
		intervals.push(interval); 
	}
    test.arguments = [intervals];
    test.expected = sum(intervals);
    test.label = ' Should add up to -> ' + test.expected;
    tests.push(test);
    test = {}
    intervals = [];
}

describe('addIntervalsToCumulative Test', function(){
	var returnedData;
	tests.forEach(function(test){
		it(test.label,function(){            
            returnedData = addIntervalsToCumulative.apply(null, test.arguments);
			expect(returnedData).to.be.equal(test.expected);
		});
	});		
});