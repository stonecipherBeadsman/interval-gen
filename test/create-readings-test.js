var path = require("path");
var createReadings = require(path.resolve(__dirname, "../Helper/createReadings.js"));
var expect = require('chai').expect;

var tests = [];
var test = {};
var readingsPerDay = [1,3,6,9,7,1000];
var parserNumber = [1,2];
var validCase = [2017, 1, 1, 1, 1, 0, 24,             24,            1,'FORWARD', 'TestMeter', false, false, false, false, false, undefined];
var baseCase =  [2017, 1, 1, 1, 1, 0, 24, readingsPerDay, parserNumber,'FORWARD', 'TestMeter', false, false, false, false, false, undefined];
var testCase = [1,2,3];
var testCaseObj = {};

function translateParamsToObject(paramsArray) {
	var readingsBlueprint = {};
	readingsBlueprint.startYear = paramsArray[0];
	readingsBlueprint.startMonth = paramsArray[1];
	readingsBlueprint.startDay = paramsArray[2];
	readingsBlueprint.durationInDays = paramsArray[3];
	readingsBlueprint.howManyMeters = paramsArray[4];
	readingsBlueprint.startingUsage = paramsArray[5];
	readingsBlueprint.dailyUsage = paramsArray[6];
	readingsBlueprint.readingsPerDay = paramsArray[7];
	readingsBlueprint.parser = paramsArray[8];
	readingsBlueprint.flowDirection = paramsArray[9];
	readingsBlueprint.meterName = paramsArray[10];
	readingsBlueprint.usePrefix = paramsArray[11];
	readingsBlueprint.randomMissingReadings = paramsArray[12];
	readingsBlueprint.randomDigitsInName = paramsArray[13];
	readingsBlueprint.useUtcOffset = paramsArray[14];
	readingsBlueprint.genRandomLifeLikeData = paramsArray[15];
	readingsBlueprint.createGAIFileForMeters = paramsArray[16];
	readingsBlueprint.ownerName = paramsArray[17];
	return readingsBlueprint;
}

for (var i = 0; i < parserNumber.length; i++) {
	for (var j = 0; j < readingsPerDay.length; j++) {
		testCase = baseCase;
		testCase[8] = parserNumber[i];
		if (i > 1) {
			testCase[7] = 24;
			test.expected = '1 and 2 are the only parse numbers currently supported';
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


describe('createReadings Test', function() {
	tests.forEach(function(test) {
		it(test.label, function() {
			expect(function() {
				createReadings.apply(null, test.arguments)
			}).to.throw(Error, test.expected);
		});
	});
	it('Should display parameter table', function() {
		expect(function() {
			createReadings.apply(null, [translateParamsToObject(validCase)]);
		}).not.to.throw('Must choose \'parameters\' or \'menu\'');
	});
	it('Should reject due to no @ sign in owner name format', function(){
		expect(function(){
			createReadings.apply(null, [translateParamsToObject([2017, 1, 1, 1, 1, 0, 24, 24, 1,'FORWARD', 'TestMeter', false, false, false, false, false, true, 'namedomain'])])
		}).to.throw(Error);
	});
	it('Should reject due to no a username with a domain but no username like @domain', function(){
		expect(function(){
			createReadings.apply(null, [translateParamsToObject([2017, 1, 1, 1, 1, 0, 24, 24, 1,'FORWARD', 'TestMeter', false, false, false, false, false, true, '@domain'])])
		}).to.throw(Error);
	});
	it('Should reject due to no a username with a domain but no username like name@', function(){
		expect(function(){
			createReadings.apply(null, [translateParamsToObject([2017, 1, 1, 1, 1, 0, 24, 24, 1,'FORWARD', 'TestMeter', false, false, false, false, false, true, 'name@'])])
		}).to.throw(Error);
	});
});