var path = require('path');
var displayInfo = require(path.resolve(__dirname, '../Helper/displayInfo.js'));
const sinon  = require('sinon');
const assert = require('assert');

var tests = [];
var test = {};
var readingsPerDay = [24];
var baseCase = [2017, 1, 1, 1, 1, 'displayInfoTestFileName',0, 24, 0, 1,'FORWARD', 'TestMeter', false, false, false, false, false]
var testCase = [];
var testCaseObj = {};

function displayInfoBaseline(readingsBlueprint, displayType){
		if(displayType === 'parameters'){
			return '------------------------------------------' +
	                    '\n--------------Parameters Used-------------' +
	                    '\n------------------------------------------' +
	                    '\n01| startYear:',readingsBlueprint.startYear +
	                    '\n------------------------------------------' +
	                    '\n02| month:',readingsBlueprint.startMonth +
	                    '\n------------------------------------------' +
	                    '\n03| startDay:',readingsBlueprint.startDay +
	                    '\n------------------------------------------' +
	                    '\n04| durationInDays:',readingsBlueprint.durationInDays +
	                    '\n------------------------------------------' +
	                    '\n05| howManyMeters:',readingsBlueprint.howManyMeters +
	                    '\n------------------------------------------' +
	                    '\n06| fileName:',readingsBlueprint.fileName +
	                    '\n------------------------------------------' +
	                    '\n07| startingUsage:',readingsBlueprint.startingUsage +
	                    '\n------------------------------------------' +
	                    '\n08| dailyUsage:',readingsBlueprint.dailyUsage +
	                    '\n------------------------------------------' +
	                    '\n09| readingsPerDay:',readingsBlueprint.readingsPerDay +
	                    '\n------------------------------------------' +
	                    '\n10| parser:',readingsBlueprint.parser +
	                    '\n------------------------------------------' +
	                    '\n11| flowDirection:',readingsBlueprint.flowDirection +
	                    '\n------------------------------------------' +
	                    '\n12| meterName:',readingsBlueprint.meterName +
	                    '\n------------------------------------------' +
	                    '\n13| usePrefix: (assigned automatically) ',readingsBlueprint.usePrefix +
	                    '\n------------------------------------------' +               
	                    '\n14| randomMissingReadings:',readingsBlueprint.randomMissingReadings +
	                    '\n------------------------------------------' +
	                    '\n15| randomDigitsInName:',readingsBlueprint.randomDigitsInName +
	                    '\n------------------------------------------' +
	                    '\n16| useUtcOffset:',readingsBlueprint.useUtcOffset +
	                    '\n------------------------------------------' +
	                    '\n17| genRandomLifeLikeData:',readingsBlueprint.genRandomLifeLikeData +
	                    '\n------------------------------------------' +
	                    '\n18| createGAIFileForMeters:',readingsBlueprint.createGAIFileForMeters +
	                    '\n------------------------------------------';			
		} else if (displayType === 'menu'){
			return  '----------------------------------------------------------------' +
                        '\n-------------------------Arguments------------------------------' + 
                        '\n----------------------------------------------------------------' +
                        '\n 01| Four digit year [ex:1999|2016]' +
                        '\n----------------------------------------------------------------' +
                        '\n 02| Month number [ex:12|1]' +
                        '\n----------------------------------------------------------------' +
                        '\n 03| Start date number [ex:31|1]' +
                        '\n----------------------------------------------------------------' +
                        '\n 04| Duration from start date in days [ex:500|10|3]' +
                        '\n----------------------------------------------------------------' +
                        '\n 05| Number of meters to create [-1 To use /Input/meterList.txt]' +
                        '\n----------------------------------------------------------------' +
                        '\n 06| Name of output file' +
                        '\n----------------------------------------------------------------' +
                        '\n 07| Starting usage' +
                        '\n----------------------------------------------------------------' +
                        '\n 08| Daily usage desired' +
                        '\n----------------------------------------------------------------' +
                        '\n 09| Number of readings per day [24|48|96|288]' +
                        '\n----------------------------------------------------------------' +
                        '\n 10| Parser number [1 for MEPMD01]' +
                        '\n----------------------------------------------------------------' +
                        '\n 11| Flow Direction [NET|TOTAL|REVERSE|FORWARD]' +
                        '\n----------------------------------------------------------------' +
                        '\n 12| Meter name [\'_\' if using input file]' +
                        '\n----------------------------------------------------------------' +
                        '\n 13| Random Missing Readings? [true|false] BROKEN' +
                        '\n----------------------------------------------------------------' +
                        '\n 14| Random Digits in MeterName? [true|false]' +
                        '\n----------------------------------------------------------------' +
                        '\n 15| Use UTC Offset [true|false]' +
                        '\n----------------------------------------------------------------' +
                        '\n 16| Generate Life Like Data [true|false]' +
                        '\n----------------------------------------------------------------' +
                        '\n 17| Create Asset Import File for Meters? [true|false]' +
                        '\n----------------------------------------------------------------';

		} else {
			throw Error('Must choose \'parameters\' or \'menu\'');
		}
	}

function translateParamsToObject(paramsArray){
	var readingsBlueprint = {};
	readingsBlueprint.startYear = paramsArray[0];
	readingsBlueprint.startMonth = paramsArray[1];
	readingsBlueprint.startDay = paramsArray[2];
	readingsBlueprint.durationInDays = paramsArray[3];
	readingsBlueprint.howManyMeters = paramsArray[4];
	readingsBlueprint.fileName = paramsArray[5]
	readingsBlueprint.startingUsage = paramsArray[6];
	readingsBlueprint.dailyUsage = paramsArray[7];
	readingsBlueprint.readingsPerDay = paramsArray[8];
	readingsBlueprint.flowDirection = paramsArray[9];
	readingsBlueprint.meterName = paramsArray[10];
	readingsBlueprint.usePrefix = paramsArray[11];
	readingsBlueprint.randomMissingReadings = paramsArray[12];
	readingsBlueprint.randomDigitsInName = paramsArray[13];
	readingsBlueprint.useUtcOffset = paramsArray[14];
	readingsBlueprint.genRandomLifeLikeData = paramsArray[15];
	readingsBlueprint.createGAIFileForMeters = paramsArray[16];
	return readingsBlueprint;
}

for (var j = 0; j < readingsPerDay.length; j++) {
	testCase = baseCase;
	testCase[7] = readingsPerDay[j];
	testCaseObj = translateParamsToObject(testCase);
	test.arguments = [testCaseObj, 'parameters'];
	test.expected = displayInfoBaseline(testCaseObj, 'parameters');
	tests.push(test);
	test = {};
	testCaseObj = {}
	testCase = [];
}


describe('displayInfo Test', function() {
//https://stackoverflow.com/questions/32321149/sinon-spy-on-standalone-function#44207109
//https://stackoverflow.com/questions/11552991/cleaning-up-sinon-stubs-easily
    tests.forEach(function(test) {
        it('should log the correct value to console', function() {
        	let spy = sinon.spy(console, 'log');
            displayInfo(test.arguments[0], test.arguments[1]);
            assert(spy.calledOnce);
            spy.restore();
        });
    });
});