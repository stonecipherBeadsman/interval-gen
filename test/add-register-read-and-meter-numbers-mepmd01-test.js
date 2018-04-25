var path = require('path');
var addRegisterReadAndMeterNumbersMepmd01 = require(path.resolve(__dirname, '../Helper/addRegisterReadAndMeterNumbersMepmd01.js'));
var padNumber = require(path.resolve(__dirname, '../Helper/padNumber.js'));
var createMeterNumbers = require(path.resolve(__dirname, '../Helper/createMeterNumbers.js'));
var monthList = require(path.resolve(__dirname, 'meterText.json'));
var assert = require('chai').assert;

var addRegisterReadAndMeterNumbersMepmd01Obj = {};
var tests = [];
var test = {};

//todo make more test cases

addRegisterReadAndMeterNumbersMepmd01Obj.meterNumbers =  createMeterNumbers(5, 'TestMeter', true, false);
addRegisterReadAndMeterNumbersMepmd01Obj.monthList = monthList; 
addRegisterReadAndMeterNumbersMepmd01Obj.dailyRegisterRead = 24;
addRegisterReadAndMeterNumbersMepmd01Obj.startingUsage = 0;
addRegisterReadAndMeterNumbersMepmd01Obj.cumulativeReadingValuesCollection = null;
addRegisterReadAndMeterNumbersMepmd01Obj.useLifeLikeData = false;
addRegisterReadAndMeterNumbersMepmd01Obj.parserNumber = 1;

test.arguments = [addRegisterReadAndMeterNumbersMepmd01Obj.meterNumbers, addRegisterReadAndMeterNumbersMepmd01Obj.monthList, addRegisterReadAndMeterNumbersMepmd01Obj.dailyRegisterRead, 
        addRegisterReadAndMeterNumbersMepmd01Obj.startingUsage, addRegisterReadAndMeterNumbersMepmd01Obj.cumulativeReadingValuesCollection, addRegisterReadAndMeterNumbersMepmd01Obj.useLifeLikeData];
test.expected = addRegisterReadAndMeterNumbersMepmd01.apply(null, test.arguments);
test.testLable = 'The given parameters produce a comination of the interval readings and the meter numbers and the cumulative readings';
tests.push(test);

function addRegisterReadAndMeterNumbersMepmd01(meterNumbers, monthList, dailyRegisterRead, startingUsage, cumulativeReadingValuesCollection, useLifeLikeData, parserNumber) {
    var a = [];
    var b = [];
    var registerReadCounter = 0;
    var numberOfCumulativesPerMeter = monthList.length / meterNumbers.length;
    var start = 0;
    var stop = numberOfCumulativesPerMeter;
    var buildingCumulative = startingUsage;
    var deliminator = parserNumber === 2 ? '~' : ',';
    for (var k = 0; k < meterNumbers.length; k++) {
        for (var l = start; l < stop; l++) {
            for (var h = 0; h < monthList[l].length; h++) {
                a = monthList[l][h];
                if (a.indexOf('REGISTER_READ_PLACEHOLDER') > 0) {
                    if (useLifeLikeData) {
                        a = a.replace('REGISTER_READ_PLACEHOLDER', buildingCumulative);
                        buildingCumulative += cumulativeReadingValuesCollection[k][l];
                    } else {
                        a = a.replace('REGISTER_READ_PLACEHOLDER', (dailyRegisterRead * registerReadCounter) + startingUsage);
                    }
                    registerReadCounter++;
                }
                a = a.replace('METER_NUMBER_PLACEHOLDER', meterNumbers[k]);
                b.push(a);
            }
            if (l === stop - 1) { //flawed
                var lastIntervalRow = a.split(deliminator);
                var dateFromLastInterval = lastIntervalRow[lastIntervalRow.length - 3];
                var lastRegisterReadRow = dateFromLastInterval;
                lastRegisterReadRow = monthList[0][0].split(deliminator);
                lastRegisterReadRow[14] = dateFromLastInterval;
                lastRegisterReadRow = lastRegisterReadRow.join(deliminator);
                if (useLifeLikeData) {
                    b.push(lastRegisterReadRow.replace('METER_NUMBER_PLACEHOLDER', meterNumbers[k]).replace('REGISTER_READ_PLACEHOLDER', buildingCumulative));
                    buildingCumulative = startingUsage;
                } else {
                    b.push(lastRegisterReadRow.replace('METER_NUMBER_PLACEHOLDER', meterNumbers[k]).replace('REGISTER_READ_PLACEHOLDER', (dailyRegisterRead * registerReadCounter) + startingUsage));
                }
            }
            a = [];
        }
        registerReadCounter = 0;
    }
    return b;
}



describe('addRegisterReadAndMeterNumbersMepmd01 Test \n\t', function() {
    tests.forEach(function(test) {
        it('Correctly generates ' + test.testLable, function() {
            var returnedData = addRegisterReadAndMeterNumbersMepmd01.apply(null, test.arguments);
            for (var i = 0; i < returnedData.length; i++) {
                assert.equal(returnedData[i], test.expected[i]);
            }
        });
    });
});