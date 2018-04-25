;(function() {
	'use strict';
	module.exports = createMepmd01Data;

    var fs = require('fs');
    var path = require('path');

    var Counter = require( path.resolve(__dirname ,'../Helper/Counter.js'));
    var setUtcOffset = require( path.resolve(__dirname ,'../Helper/setUtcOffset.js'));
    var translateDateToParserFormat = require( path.resolve(__dirname ,'../Helper/translateDateToParserFormat.js'));
    var dateTransition = require( path.resolve(__dirname ,'../Helper/dateTransition.js'));
    var monthTransition = require( path.resolve(__dirname ,'../Helper/monthTransition.js'));
    var setUOM = require( path.resolve(__dirname ,'../Helper/setUOM.js'));
    var addRegisterReadAndMeterNumbersMepmd01 = require( path.resolve(__dirname ,'../Helper/addRegisterReadAndMeterNumbersMepmd01.js'));
    var createMeterNumbers = require( path.resolve(__dirname ,'../Helper/createMeterNumbers.js'));
    var getScaledIntervalBound = require(path.resolve(__dirname, '../Helper/getScaledIntervalBound.js'));
    var createLifeLikePseudoRandomInterval = require(path.resolve(__dirname, '../Helper/createLifeLikePseudoRandomInterval.js'));
    var addIntervalsToCumulative = require(path.resolve(__dirname, '../Helper/addIntervalsToCumulative.js'));

	function createMepmd01Data(readingsBlueprint) {
        var meterText = [];
        var oneMinCounter = 0;
        var fifteenMinCounter = 0;
        var fiveMinCounter = 0;
        var dailyRegisterRead = readingsBlueprint.dailyUsage;
        var yyyy = readingsBlueprint.startYear;
        var mm = readingsBlueprint.startMonth;
        var dd = readingsBlueprint.startDay;
        //for UTC offset use 5 if parser configuration set to useLocalTime=false, 0 if true
        var hh = setUtcOffset(readingsBlueprint.useUtcOffset);
        var monthList = [];
        var dates = [];
        var meterNumberList = createMeterNumbers(readingsBlueprint.howManyMeters, readingsBlueprint.meterName, readingsBlueprint.usePrefix, readingsBlueprint.randomDigitsInName);
        var completeRawMeterReadingsList = [];
        var textOut = '';
        var counter = new Counter(readingsBlueprint.readingsPerDay);
        var countDown = new Counter();
        var dayOfTheMonthCount = 0;
        var daysInCurrentMonth = 0;
        var daysLeftInCurrentMonth = 0;
        var isLastDayOfMonth = 0;
        var intervalValue = 0;
        var intervalValues = [];
        var lifeLikeMetersCounter = meterNumberList.length;
        var ret = {};
        var lgGridstream = {};

        lgGridstream.recordType = 'MEPMD01';
        lgGridstream.recordVersion = '20080519';
        lgGridstream.timeStamp = translateDateToParserFormat.lgGridstream(yyyy, mm, dd, hh);
        lgGridstream.premiseID = '100074';
        lgGridstream.esiid = '';
        lgGridstream.provisioned = '';
        lgGridstream.meterID = '';
        lgGridstream.purpose = 'OK';
        lgGridstream.commodity = '';
        lgGridstream.units = '';
        lgGridstream.calculationConstant = '';
        lgGridstream.interval = '';
        lgGridstream.count = '';
        lgGridstream.firstIntervalDateTime = '';

        do {
            for (var x = 0; x < readingsBlueprint.durationInDays; x++) {
                daysInCurrentMonth = monthEngine(yyyy, mm);
                //Start the count
                if (x === 0) {
                    daysLeftInCurrentMonth = syncDdAndDayOfTheMonthCount(dd, daysInCurrentMonth);
                    countDown.initCountDown(daysLeftInCurrentMonth);
                }
                isLastDayOfMonth = isLastDayOfTheMonth(dayOfTheMonthCount, daysInCurrentMonth, countDown.getCurrentCountDownPlaceValue());
                dates = translateDateToParserFormat.niscMepmd01(yyyy, mm, dd, hh);
                meterText = [
                    lgGridstream.recordType
                ];
                var intervalLengthTimeValue = 0;
                var comma = '';

                for (var intervalRowSegment = 0; intervalRowSegment < readingsBlueprint.readingsPerDay; intervalRowSegment++) {
                    //populate the value that states the number of intervals on the reading 
                    if ((intervalRowSegment % readingsBlueprint.readingsPerDay) === 0) {
                        if (readingsBlueprint.readingsPerDay === 24) {
                            intervalLengthTimeValue = 100;
                        } else if (readingsBlueprint.readingsPerDay === 48) {
                            counter.turnOver();
                            counter.increment();
                            //if the request is for 48 readings then the initial date needs to be +30 minutes
                            //and the cycle counter needs to be incremented
                            intervalLengthTimeValue = 30;
                        } else if (readingsBlueprint.readingsPerDay === 96) {
                            counter.turnOver();
                            counter.increment();
                            //if the request is for 96 readings then the initial date needs to be +15 minutes
                            //and the cycle counter needs to be incremented
                            intervalLengthTimeValue = 15;
                        } else if (readingsBlueprint.readingsPerDay === 288) {
                            counter.turnOver();
                            counter.increment();
                            //if the request is for 288 readings then the initial date needs to be +5 minutes
                            //and the cycle counter needs to be incremented
                        }
                    }
                    if (isLastDayOfMonth) {
                        var lastDayMm = 0;
                        var lastDayYyyy = 0;
                        if (mm < 12) {
                            lastDayMm = mm + 1;
                            lastDayYyyy = yyyy;
                        } else {
                            lastDayMm = 1;
                            lastDayYyyy = yyyy + 1;
                        }
                        var lastDayDd = 1;
                        if (hh === 5) {
                            if (intervalRowSegment === 18  && readingsBlueprint.readingsPerDay === 24) {
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsBlueprint.readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) { 
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsBlueprint.readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsBlueprint.readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            }
                        } else if (hh === 0) {
                            if (intervalRowSegment === 23  && readingsBlueprint.readingsPerDay === 24) {
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsBlueprint.readingsPerDay === 48 && intervalRowSegment === ((23 * 2) + 1)) { 
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsBlueprint.readingsPerDay === 96 && intervalRowSegment === ((23 * 4) + 3)) {
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsBlueprint.readingsPerDay === 288 && intervalRowSegment === (23 * 4 * 3) + 11) {
                                dates = monthTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            }
                        }
                        countDown.initCountDown(syncDdAndDayOfTheMonthCount(lastDayDd, monthEngine(lastDayYyyy, lastDayMm)));
                    } else {
                        intervalLengthTimeValue += dateTransition(intervalRowSegment, readingsBlueprint.readingsPerDay, hh);
                    }
                    //add a comma to the row unless this is the last segment
                    if (intervalRowSegment !== readingsBlueprint.readingsPerDay - 1) {
                        comma = ',';
                    } else {
                        comma = '';
                    }

                    if (readingsBlueprint.genRandomLifeLikeData === true) {
                        intervalValue = createLifeLikePseudoRandomInterval(intervalRowSegment, readingsBlueprint.readingsPerDay);
                        intervalValues.push(intervalValue);
                        if (intervalRowSegment === readingsBlueprint.readingsPerDay - 1) {
                            cumulativeReadingValues.push(addIntervalsToCumulative(intervalValues));
                            intervalValues = [];
                        }
                    } else {
                        intervalValue = dailyRegisterRead / readingsBlueprint.readingsPerDay;
                    }

                    intervalProtocolCode = getProtocolCode(readingsBlueprint.randomMissingReadings, protocolCode);
                    if (intervalProtocolCode !== 'A') {
                        intervalValue = '';
                    }

                    meterText[1] += (parseInt(dates[0]) + intervalLengthTimeValue) + ',' + intervalProtocolCode + ',' + intervalValue + comma;

                    if (readingsBlueprint.readingsPerDay === 24) {
                        intervalLengthTimeValue += 100;
                    } else if (readingsBlueprint.readingsPerDay === 48) {
                        if (counter.number < 1) {
                            intervalLengthTimeValue += 30;
                            counter.increment();
                        } else {
                            intervalLengthTimeValue += 70;
                            counter.turnOver();
                        }
                    } else if (readingsBlueprint.readingsPerDay === 96) {
                        if (counter.number < 3) {
                            intervalLengthTimeValue += 15;
                            counter.increment();
                        } else {
                            intervalLengthTimeValue += 55;
                            counter.turnOver();
                        }
                    } else if (readingsBlueprint.readingsPerDay === 288) {
                        if (counter.number < 11) {
                            intervalLengthTimeValue += 5;
                            counter.increment();
                        } else {
                            intervalLengthTimeValue += 45;
                            counter.turnOver();
                        }
                    }
                }
                monthList.push(meterText);
                dd++;
                dayOfTheMonthCount++;
                countDown.decrement();
                if (isLastDayOfMonth) { //TODO: abstract, simplify with ln. ~191
                   mm++;
                    if (mm > 12) {
                        mm = 1;
                        yyyy++;
                    }
                    dd = 1;
                   dayOfTheMonthCount = 0;
               }
            }
            cumulativeReadingValuesCollection.push(cumulativeReadingValues);
            cumulativeReadingValues = [];
            intervalValue = 0;
            lifeLikeMetersCounter--;
            //restart time count
            yyyy = readingsBlueprint.startYear;
            mm = readingsBlueprint.startMonth;
            dd = readingsBlueprint.startDay;
            hh = setUtcOffset(readingsBlueprint.useUtcOffset);
        } while (lifeLikeMetersCounter > 0);

        return ret;
    }

}());