var path = require('path');
var monthTransition = require(path.resolve(__dirname, '../Helper/monthTransition.js'));
var monthEngine = require(path.resolve(__dirname,'../Helper/monthEngine.js'));
var translateDateToParserFormat = require(path.resolve(__dirname,'../Helper/translateDateToParserFormat.js'));
var assert = require('chai').assert;

function monthTransitionBaseline(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh) {
    var date = [];
    if (hh === 5) {
        if (intervalRowSegment === 18 && readingsPerDay === 24) {
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) { //inprocess!!!!
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        }
    } else if (hh === 0) {            
        if (intervalRowSegment === 23 && readingsPerDay === 24) {
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);         
        } else if (readingsPerDay === 48 && intervalRowSegment === ((23 * 2) + 1)) { //inprocess!!!!
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 96 && intervalRowSegment === ((23 * 4) + 3)) {
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 288 && intervalRowSegment === (23 * 4 * 3) + 11) {
                date = translateDateToParserFormat.niscMepmd01(lastDayYyyy, lastDayMm, lastDayDd, 0);
        }
    }
    return date;

}

function buildDatesObjectArray(daysBackFromLastDayOfMonth, lengthInYears) {
	var dates = [];
	var date = {};
	var startYear = 2017;
	var endYear = startYear + lengthInYears;
	for (var year = startYear; year < endYear; year++) {
		for (var month = 1; month <= 12; month++) {
			for (var day = 1; day <= monthEngine.getDaysInMonth(year, month); day++) {
				if (day > monthEngine.getDaysInMonth(year, month) - daysBackFromLastDayOfMonth) {
					date.year = year; 
					date.month = month; 
					date.day = day;
					dates.push(date);
					date = {};
				}				
			}
		}
	}
	return dates;
}

function buildIntervalRowSegmentValuesObjectArray(readingsPerdayValues) {
	var ret  = [];
	var intervalRowSegment = {};
	var values = [];
	for (var i = 0; i < readingsPerdayValues.length; i++) {
		for (var j = 1; j <= readingsPerdayValues[i]; j++) {
			values.push(j);
		}
		intervalRowSegment.values = values;
		ret.push(intervalRowSegment);
		intervalRowSegment = {};
		values = [];
	}
	return ret;
}

function buildParameterArrays(intervalRowSegmentValues, hh, dates) {
	var parameterObjectArray = [];
	var parameters = {};
	intervalRowSegmentValues.forEach(function(values) {
		//map intervals onto given dates
		var readingsPerDay = values.values.length;
		var readingsPerHour = readingsPerDay / 24;
		var readingsStartIndex = readingsPerDay - (readingsPerHour * 3);
		for (var date = 0; date < dates.length; date++ ) {
			//for each date 
			for (var value = readingsStartIndex; value < readingsPerDay; value++) {
				//map all the values
				for (var hourOffsetIndex = 0; hourOffsetIndex < hh.length; hourOffsetIndex++) {
					//to all the others including the hour offset
					parameters.arguments = [values.values[value], readingsPerDay, dates[date].year, dates[date].month, dates[date].day, hh[hourOffsetIndex].value];
					parameterObjectArray.push(parameters);
					parameters = {};
				}
			}
		}
	});
	return parameterObjectArray;
}

function buildTestCasesAndExpectedResults(parameterObjectArray) {
	var tests = [];
	var test = {};
	for (var parameterObject = parameterObjectArray.length - 1; parameterObject >= 0; parameterObject--) {
		test.arguments = parameterObjectArray[parameterObject].arguments;
			test.expected = monthTransitionBaseline.apply(null,test.arguments)[0];
			test.testLable = test.arguments + ' Should return ' + test.expected;
			tests.push(test);
			test = {};
	}
	return tests;	
}

var tests = [];
var hh = [{value:0},{value:5}];
var readingsPerdayValues = [24, 48, 96, 288];
var dates = buildDatesObjectArray(2,1);
var intervalRowSegmentValues = buildIntervalRowSegmentValuesObjectArray(readingsPerdayValues);
var parameterArrays = buildParameterArrays(intervalRowSegmentValues, hh, dates);
var tests = buildTestCasesAndExpectedResults(parameterArrays);

describe('monthTransition Test', function() {
	tests.forEach(function(test) {
		it(test.testLable, function() {
			var returnedData = monthTransition.apply(null, test.arguments);
			assert.equal(returnedData, test.expected);		
		});
	});
});