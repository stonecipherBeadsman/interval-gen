;(function(){
	'use strict';
	module.exports = createMepmd01Data;

    var fs = require('fs');
    var path = require('path');

    var monthEngine = require( path.resolve(__dirname ,'../Helper/monthEngine.js'));
    var Counter = require( path.resolve(__dirname ,'../Helper/Counter.js'));
    //var createGenericAssetImportFiles = require( path.resolve(__dirname ,'../Helper/genericAssetImportFileCreation.js'));
    var getBooleanValue = require( path.resolve(__dirname ,'../Helper/getBooleanValue.js'));
    var setUtcOffset = require( path.resolve(__dirname ,'../Helper/setUtcOffset.js'));
    var syncDdAndDayOfTheMonthCount = require( path.resolve(__dirname ,'../Helper/syncDdAndDayOfTheMonthCount.js'));
    var isLastDayOfTheMonth = require( path.resolve(__dirname ,'../Helper/isLastDayOfTheMonth.js'));
    var randomIntFromInterval = require( path.resolve(__dirname ,'../Helper/randomIntFromInterval.js'));
    var padNumber = require( path.resolve(__dirname ,'../Helper/padNumber.js'));
    var inputToArrayAtNewline = require( path.resolve(__dirname ,'../Helper/inputToArrayAtNewline.js'));
    var getProtocolCode = require( path.resolve(__dirname ,'../Helper/getProtocolCode.js'));
    var translateDateToParserFormat = require( path.resolve(__dirname ,'../Helper/translateDateToParserFormat.js'));
    var dateTransition = require( path.resolve(__dirname ,'../Helper/dateTransition.js'));
    var monthTransition = require( path.resolve(__dirname ,'../Helper/monthTransition.js'));
    var setUOM = require( path.resolve(__dirname ,'../Helper/setUOM.js'));
    var addRegisterReadAndMeterNumbersMepmd01 = require( path.resolve(__dirname ,'../Helper/addRegisterReadAndMeterNumbersMepmd01.js'));
    var createMeterNumbers = require( path.resolve(__dirname ,'../Helper/createMeterNumbers.js'));
    var getScaledIntervalBound = require(path.resolve(__dirname, '../Helper/getScaledIntervalBound.js'));
    var createLifeLikePseudoRandomInterval = require(path.resolve(__dirname, '../Helper/createLifeLikePseudoRandomInterval.js'));
    var addIntervalsToCumulative = require(path.resolve(__dirname, '../Helper/addIntervalsToCumulative.js'));
    /*var makeFile = require(path.resolve(__dirname, '../Helper/makeFile.js'));
    var createMepmd01Data = require(path.resolve(__dirname, '../Helper/createMepmd01Data.js'));*/

	function createMepmd01Data(startYear, startMonth, startDay, durationInDays, howManyMeters, startingUsage, dailyUsage, readingsPerDay, flowDirection, meterName, usePrefix, randomMissingReadings, randomDigitsInName, useUtcOffset, genRandomLifeLikeData) {
        var meterText = [];
        var oneMinCounter = 0;
        var fifteenMinCounter = 0;
        var fiveMinCounter = 0;
        var dailyRegisterRead = dailyUsage;
        var yyyy = startYear;
        var mm = startMonth;
        var dd = startDay;
        //for UTC offset use 5 if parser configuration set to useLocalTime=false, 0 if true
        var hh = setUtcOffset(useUtcOffset);
        var monthList = [];
        var dates = [];
        var meterNumberList = createMeterNumbers(howManyMeters, meterName, usePrefix, randomDigitsInName);
        var completeRawMeterReadingsList = [];
        var textOut = '';
        var counter = new Counter(readingsPerDay);
        var countDown = new Counter();
        var dayOfTheMonthCount = 0;
        var daysInCurrentMonth = 0;
        var daysLeftInCurrentMonth = 0;
        var isLastDayOfMonth = 0;
        var regUom = '';
        var intUom = '';
        var protocolCode = 'A';
        var intervalProtocolCode = '';
        var intervalValue = 0;
        var intervalValues = [];
        var cumulativeReadingValues = [];
        var cumulativeReadingValuesCollection = [];
        var lifeLikeMetersCounter = meterNumberList.length;
        var ret = {};

        flowDirection = setUOM(flowDirection);
        intUom = flowDirection.intUom;
        regUom = flowDirection.regUom;

        do {
            for (var x = 0; x < durationInDays; x++) {
                daysInCurrentMonth = monthEngine(yyyy, mm);
                //Start the count
                if (x === 0) {
                    daysLeftInCurrentMonth = syncDdAndDayOfTheMonthCount(dd, daysInCurrentMonth);
                    countDown.initCountDown(daysLeftInCurrentMonth);
                }
                isLastDayOfMonth = isLastDayOfTheMonth(dayOfTheMonthCount, daysInCurrentMonth, countDown.getCurrentCountDownPlaceValue());
                dates = translateDateToParserFormat(yyyy, mm, dd, hh);
                meterText = [
                    'MEPMD01,19970819,DCSI,,,,201407071645,METER_NUMBER_PLACEHOLDER,OK,E,' + regUom + ',1,00000000,1,' + dates[0] + ',A,' + 'REGISTER_READ_PLACEHOLDER',
                    'MEPMD01,19970819,DCSI,,,,201407071645,METER_NUMBER_PLACEHOLDER,OK,E,' + intUom + ',1,'
                ];
                var intervalLengthTimeValue = 0;
                var comma = '';

                for (var intervalRowSegment = 0; intervalRowSegment < readingsPerDay; intervalRowSegment++) {
                    //populate the value that states the number of intervals on the reading 
                    if ((intervalRowSegment % readingsPerDay) === 0) {
                        if (readingsPerDay === 24) {
                            meterText[1] += '00000100,24,';
                            //if the request is for 24 readings then the initial date needs to be +1 hour
                            intervalLengthTimeValue = 100;
                        } else if (readingsPerDay === 48) {
                            counter.turnOver();
                            counter.increment();
                            //if the request is for 48 readings then the initial date needs to be +30 minutes
                            //and the cycle counter needs to be incremented
                            meterText[1] += '00000030,48,';
                            intervalLengthTimeValue = 30;
                        } else if (readingsPerDay === 96) {
                            counter.turnOver();
                            counter.increment();
                            //if the request is for 96 readings then the initial date needs to be +15 minutes
                            //and the cycle counter needs to be incremented
                            meterText[1] += '00000015,96,';
                            intervalLengthTimeValue = 15;
                        } else if (readingsPerDay === 288) {
                            counter.turnOver();
                            counter.increment();
                            //if the request is for 288 readings then the initial date needs to be +5 minutes
                            //and the cycle counter needs to be incremented
                            meterText[1] += '00000005,288,';
                            intervalLengthTimeValue = 5;
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
                        if(hh === 5){
                            if (intervalRowSegment === 18  && readingsPerDay === 24) {
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) { 
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            }
                        } else if (hh === 0){
                            if (intervalRowSegment === 23  && readingsPerDay === 24) {
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsPerDay === 48 && intervalRowSegment === ((23 * 2) + 1)) { 
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsPerDay === 96 && intervalRowSegment === ((23 * 4) + 3)) {
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            } else if (readingsPerDay === 288 && intervalRowSegment === (23 * 4 * 3) + 11) {
                                dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh);
                                intervalLengthTimeValue = 0;
                            }
                        }
                        countDown.initCountDown(syncDdAndDayOfTheMonthCount(lastDayDd, monthEngine(lastDayYyyy, lastDayMm)));
                    } else {
                        intervalLengthTimeValue += dateTransition(intervalRowSegment, readingsPerDay, hh);
                    }
                    //add a comma to the row unless this is the last segment
                    if (intervalRowSegment !== readingsPerDay - 1) {
                        comma = ',';
                    } else {
                        comma = '';
                    }

                    if(genRandomLifeLikeData === true){
                        intervalValue = createLifeLikePseudoRandomInterval(intervalRowSegment, readingsPerDay);
                        intervalValues.push(intervalValue);
                        if(intervalRowSegment === readingsPerDay - 1){
                            cumulativeReadingValues.push(addIntervalsToCumulative(intervalValues));
                            intervalValues = [];
                        }
                    } else {
                        intervalValue = dailyRegisterRead / readingsPerDay;
                    }

                    intervalProtocolCode = getProtocolCode(randomMissingReadings, protocolCode);
                    if(intervalProtocolCode !== 'A'){
                        intervalValue = '';
                    }

                    meterText[1] += (parseInt(dates[0]) + intervalLengthTimeValue) + ',' + intervalProtocolCode + ',' + intervalValue + comma;

                    if (readingsPerDay === 24) {
                        intervalLengthTimeValue += 100;
                    } else if (readingsPerDay === 48) {
                        if (counter.number < 1) {
                            intervalLengthTimeValue += 30;
                            counter.increment();
                        } else {
                            intervalLengthTimeValue += 70;
                            counter.turnOver();
                        }
                    } else if (readingsPerDay === 96) {
                        if (counter.number < 3) {
                            intervalLengthTimeValue += 15;
                            counter.increment();
                        } else {
                            intervalLengthTimeValue += 55;
                            counter.turnOver();
                        }
                    } else if (readingsPerDay === 288) {
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
            yyyy = startYear;
            mm = startMonth;
            dd = startDay;
            hh = setUtcOffset(useUtcOffset);
        } while (lifeLikeMetersCounter > 0);
        completeRawMeterReadingsList = addRegisterReadAndMeterNumbersMepmd01(meterNumberList, monthList, dailyRegisterRead, startingUsage, cumulativeReadingValuesCollection, genRandomLifeLikeData); //, yyyy, mm);
        for (var fileLine = 0; fileLine < completeRawMeterReadingsList.length; fileLine++) {
            textOut += (completeRawMeterReadingsList[fileLine] + '\n');
        }
        ret.data = textOut;
        ret.meterNumberList = meterNumberList ;
        return ret;
    }

}());