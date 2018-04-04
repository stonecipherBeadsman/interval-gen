var path = require("path");
var createReadings = require(path.resolve(__dirname, "../Helper/createReadings.js"));
var expect = require('chai').expect;

var tests = [];
var test = {};
var readingsPerDay = [1,3,6,9,7,1000];
var parserNumber = [1,2];
var baseCase = [2017, 1, 1, 1, 1, 0, 24, readingsPerDay, parserNumber,'FORWARD', 'TestMeter', false, false, false, false, false]
var testCase = [];
var testCaseObj = {};

function translateParamsToObject(paramsArray){
	var readingsBlueprint = {};
	readingsBlueprint.startYear = paramsArray[0];
	readingsBlueprint.startMonth = paramsArray[1];
	readingsBlueprint.startDay = paramsArray[2];
	readingsBlueprint.durationInDays = paramsArray[3];
	readingsBlueprint.howManyMeters = paramsArray[4];
	readingsBlueprint.startingUsage = paramsArray[5];
	readingsBlueprint.dailyUsage = paramsArray[6];
	readingsBlueprint.readingsPerDay = paramsArray[7];
	readingsBlueprint.flowDirection = paramsArray[8];
	readingsBlueprint.meterName = paramsArray[9];
	readingsBlueprint.usePrefix = paramsArray[10];
	readingsBlueprint.randomMissingReadings = paramsArray[11];
	readingsBlueprint.randomDigitsInName = paramsArray[12];
	readingsBlueprint.useUtcOffset = paramsArray[13];
	readingsBlueprint.genRandomLifeLikeData = paramsArray[14];
	readingsBlueprint.createGAIFileForMeters = paramsArray[15];
	return readingsBlueprint;
}

for (var i = 0; i < parserNumber.length; i++) {
	for (var j = 0; j < readingsPerDay.length; j++) {
		testCase = baseCase;
		testCase[8] = parserNumber[i];
		if (i > 0){
			testCase[7] = 24;
			test.expected = '1 is the only parser number currently supported';
		} else {
			testCase[7] = readingsPerDay[j];
			test.expected = 'Please Choose 24, 48, 96, or 288 readings per day';
		}
		testCaseObj = translateParamsToObject(testCase);
		test.arguments = [testCaseObj];
		test.label = testCase + ' Should -> ' + test.expected;
		tests.push(test);
		test = {};
		testCaseObj = {}
		testCase = [];
	}
}


describe('createReadings Test', function(){
	tests.forEach(function(test){
		it(test.label, function(){
			expect(function(){
				createReadings.apply(null, test.arguments)
			}).to.throw(Error, test.expected);
		});
	});
});