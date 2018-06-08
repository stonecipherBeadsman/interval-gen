var path = require("path");
var dateTransition = require(path.resolve(__dirname, "../Helper/dateTransition.js"));
var assert = require('chai').assert;

var tests = [];

var hhValues = [0,5];
var readingsPerdayValues = [24, 48, 96, 288];
var intervalRowSegmentValues = buildIntervalRowSegmentValues(hhValues, readingsPerdayValues);
var tests = buildTestCasesAndExpectedResults(intervalRowSegmentValues, readingsPerdayValues, hhValues);

function dateTransitionBaseline(intervalRowSegment, readingsPerDay, hh) {
    var dateTransitionValue = 7600;
    if (hh === 5) {
        if (intervalRowSegment === 18 && readingsPerDay === 24) {
            //this is the value that makes the day increment from d-1 to d after 2300
            return dateTransitionValue;
        } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) {
            return dateTransitionValue;
        } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
            return dateTransitionValue;
        } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
            return dateTransitionValue;
        } else {
            return 0;
        }
    } else if (hh === 0) {
        //the incrementation is done by arithmatic on the date string as if it where simply an integer
        if (intervalRowSegment === 23 && readingsPerDay === 24) {
            //this is the value that makes the day increment from d-1 to d after 2300
            return dateTransitionValue;
        } else if (readingsPerDay === 48 && intervalRowSegment === ((23 * 2) + 1)) {
            return dateTransitionValue;
        } else if (readingsPerDay === 96 && intervalRowSegment === ((23 * 4) + 3)) {
            return dateTransitionValue;
        } else if (readingsPerDay === 288 && intervalRowSegment === (23 * 4 * 3) + 11) {
            return dateTransitionValue;
        } else {
            return 0;
        }
    }
}

function buildIntervalRowSegmentValues(hhValues, readingsPerdayValues) {
	var ret  = [];
	for (var i = 0; i < readingsPerdayValues.length; i++) {
		ret.push([]);
		for (var j = 1; j <= readingsPerdayValues[i]; j++) {
			ret[i].push(j);
		}
	}
	return ret;
}

function buildTestCasesAndExpectedResults(intervalRowSegmentValues, readingsPerdayValues, hhValues) {
	var tests = [];
	var test = {};
	for (var k = 0; k < hhValues.length; k++) {
		intervalRowSegmentValues.forEach(function(intervalRowSegmentValueList) {
			for (var m = 0; m < intervalRowSegmentValueList.length; m++) {
				test.arguments = [intervalRowSegmentValueList[m],intervalRowSegmentValueList.length,hhValues[k]];
				test.expected = dateTransitionBaseline.apply(null, test.arguments);
				test.testLabel = test.arguments + ' Should yeild ' + test.expected;
				tests.push(test);
				test = {};
			}
		});
	}
	return tests;	
}

describe('dateTransition Test', function() {
	tests.forEach(function(test) {
		it(test.testLabel, function() {
			var returnedData = dateTransition.apply(null, test.arguments);
			assert.equal(returnedData, test.expected);		
		});
	});
	
});