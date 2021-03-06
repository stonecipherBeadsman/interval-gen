;(function() {
    'use strict';
    module.exports = addRegisterReadAndMeterNumbersMepmd01;
    var path = require('path');
    var padNumber = require(path.resolve(__dirname, "padNumber.js"));

    function addRegisterReadAndMeterNumbersMepmd01(meterNumbers, monthList, dailyRegisterRead, startingUsage, cumulativeReadingValuesCollection, useLifeLikeData, parserNumber) {
        var a = [];
        var b = [];
        var registerReadCounter = 0;
        var numberOfCumulativesPerMeter = monthList.length / meterNumbers.length;
        var start = 0;
        var stop = numberOfCumulativesPerMeter;
        var buildingCumulative = startingUsage;
        var deliminator = getDeliminator(parserNumber);
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

        function getDeliminator(parserNumber) {
            return parserNumber === 2 ? '~' : ',';
        }
    }
}());