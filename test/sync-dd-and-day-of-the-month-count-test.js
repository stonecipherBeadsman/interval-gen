var path = require('path');
var syncDdAndDayOfTheMonthCount = require(path.resolve(__dirname, "../Helper/syncDdAndDayOfTheMonthCount.js"));
var monthEngine = require(path.resolve(__dirname, "../Helper/monthEngine.js"));
var assert = require('chai').assert;

var tests = [];
var test = {}
var daysInCurrentMonth;
for (var year = 2016; year < 2017; year++) {
	for (var month = 1; month <= 3; month++) {
		daysInCurrentMonth = monthEngine(year, month)
		for (var day = 1; day <= daysInCurrentMonth; day++) {
			test.arguments = [day, daysInCurrentMonth];
			test.expected = (daysInCurrentMonth - day);
			test.testLable = year + ' ' + month + ' ' + daysInCurrentMonth + ' - ' + day + ' = ' + test.expected;
			tests.push(test);
			test = {};
		}
	}
}

describe('syncDdAndDayOfTheMonthCount Test \n\tShould take a day of the month counter and a number of days in the month and return the difference between the two if the day value is > 1', function(){
	tests.forEach(function(test){
		it(test.testLable, function(){
			var returnedData = syncDdAndDayOfTheMonthCount.apply(null, test.arguments);
			assert.equal(returnedData, test.expected);		
		});
	});
	
});