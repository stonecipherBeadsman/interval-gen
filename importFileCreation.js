;(function() {
    'use strict';
    var fs = require('fs');
    var path = require('path');

    var monthEngine = require( path.resolve(__dirname ,'./Helper/monthEngine.js'));
    var Counter = require( path.resolve(__dirname ,'./Helper/Counter.js'));
    var createGenericAssetImportFiles = require( path.resolve(__dirname ,'./Helper/genericAssetImportFileCreation.js'));
    var getBooleanValue = require( path.resolve(__dirname ,'./Helper/getBooleanValue.js'));
    var setUtcOffset = require( path.resolve(__dirname ,'./Helper/setUtcOffset.js'));
    var syncDdAndDayOfTheMonthCount = require( path.resolve(__dirname ,'./Helper/syncDdAndDayOfTheMonthCount.js'));
    var isLastDayOfTheMonth = require( path.resolve(__dirname ,'./Helper/isLastDayOfTheMonth.js'));
    var randomIntFromInterval = require( path.resolve(__dirname ,'./Helper/randomIntFromInterval.js'));
    var padNumber = require( path.resolve(__dirname ,'./Helper/padNumber.js'));
    var inputToArrayAtNewline = require( path.resolve(__dirname ,'./Helper/inputToArrayAtNewline.js'));
    var getProtocolCode = require( path.resolve(__dirname ,'./Helper/getProtocolCode.js'));
    var translateDateToParserFormat = require( path.resolve(__dirname ,'./Helper/translateDateToParserFormat.js'));
    var dateTransition = require( path.resolve(__dirname ,'./Helper/dateTransition.js'));
    var monthTransition = require( path.resolve(__dirname ,'./Helper/monthTransition.js'));
    var setUOM = require( path.resolve(__dirname ,'./Helper/setUOM.js'));
    var addRegisterReadAndMeterNumbersMepmd01 = require( path.resolve(__dirname ,'./Helper/addRegisterReadAndMeterNumbersMepmd01.js'));
    var createMeterNumbers = require( path.resolve(__dirname ,'./Helper/createMeterNumbers.js'));
    var getScaledIntervalBound = require(path.resolve(__dirname, './Helper/getScaledIntervalBound.js'));

    module.exports = {
        makeFile,
        createLifeLikePseudoRandomInterval,//
        addIntervalsToCumulative,//
        createMepmd01Data
    }

    function makeFile(data, fileName) {
        var dir = __dirname + '/Output/';
        if (fileName === undefined) {
            fileName = 'Meter_Readings';
        } else {
            fileName = fileName.toString();
        }
        var writer = data;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFile(dir + fileName + '.txt', writer, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved ' + fileName + '.txt');
        });
    }

    function createLifeLikePseudoRandomInterval(hourOfTheDay, readingsPerDay){
        var multiplier = 1;
        var intervalMultiplier = (readingsPerDay / 24);
        var useMultiplier = readingsPerDay === 24 ? getBooleanValue(0.9) : false;
        if(useMultiplier){
            multiplier = randomIntFromInterval(0, 1);
        }
        if(hourOfTheDay <= 5 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0, 1, intervalMultiplier), getScaledIntervalBound(0.25, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 6 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.2, 1, intervalMultiplier), getScaledIntervalBound(0.75, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 7 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.2, 1, intervalMultiplier), getScaledIntervalBound(1, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 8 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(2, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 10 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.5, 1, intervalMultiplier), getScaledIntervalBound(2, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 11 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(1.75, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 12 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(2,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 13 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.75, 1, intervalMultiplier), getScaledIntervalBound(1.75,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 14 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.65, 1, intervalMultiplier), getScaledIntervalBound(1.5,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 15 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.85, 1, intervalMultiplier), getScaledIntervalBound(2.5,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 20 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.75, 1, intervalMultiplier), getScaledIntervalBound(3.5, multiplier, intervalMultiplier));
        }else{
            return randomIntFromInterval(getScaledIntervalBound(0.05, 1, intervalMultiplier), getScaledIntervalBound(1.25, multiplier, intervalMultiplier));
        }
    }

    function addIntervalsToCumulative(intervalValues, intervalsPerDay){
        if(intervalValues > intervalsPerDay){
            throw 'ERROR: must be less than or equal ' + intervalsPerDay;
        } else{
            var cumulativeReadingValue = 0;
            for (var i = 0; i < intervalValues.length; i++){
                cumulativeReadingValue += intervalValues[i];
            }
            return cumulativeReadingValue;
        }
    }

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

    function createReadings(startYear, month, startDay, durationInDays, howManyMeters, fileName, startingUsage, dailyUsage, readingsPerDay, parser,flowDirection, meterName, usePrefix, randomMissingReadings, randomDigitsInName, useUtcOffset, genRandomLifeLikeData, createGAIFileForMeters) { 
    console.log('------------------------------------------',
                '\n--------------Parameters Used-------------',
                '\n------------------------------------------',
                '\n01| startYear:',startYear,
                '\n------------------------------------------',
                '\n02| month:',month,
                '\n------------------------------------------',
                '\n03| startDay:',startDay,
                '\n------------------------------------------',
                '\n04| durationInDays:',durationInDays,
                '\n------------------------------------------',
                '\n05| howManyMeters:',howManyMeters,
                '\n------------------------------------------',
                '\n06| fileName:',fileName,
                '\n------------------------------------------',
                '\n07| startingUsage:',startingUsage,
                '\n------------------------------------------',
                '\n08| dailyUsage:',dailyUsage,
                '\n------------------------------------------',
                '\n09| readingsPerDay:',readingsPerDay,
                '\n------------------------------------------',
                '\n10| parser:',parser,
                '\n------------------------------------------',
                '\n11| flowDirection:',flowDirection,
                '\n------------------------------------------',
                '\n12| meterName:',meterName,
                '\n------------------------------------------',
                '\n13| randomMissingReadings:',randomMissingReadings,
                '\n------------------------------------------',
                '\n14| randomDigitsInName:',randomDigitsInName,
                '\n------------------------------------------',
                '\n15| useUtcOffset:',useUtcOffset,
                '\n------------------------------------------',
                '\n16| genRandomLifeLikeData:',genRandomLifeLikeData,
                '\n------------------------------------------',
                '\n17| createGAIFileForMeters:',createGAIFileForMeters,
                '\n------------------------------------------');
        var data;
        if (readingsPerDay != 24 && readingsPerDay != 48 && readingsPerDay != 96 && readingsPerDay != 288 && readingsPerDay != 1440) {
            console.log('Please Choose 24, 48, 96, or 288 readings per day');
        } else {
            if (parser === 1) {
                if (readingsPerDay > 288) {
                    console.log('This Parser Limited to <= 288 Reads Per Day');
                } else {
                    data = createMepmd01Data(startYear, month, startDay, durationInDays, howManyMeters,
                            startingUsage, dailyUsage, readingsPerDay, 
                            flowDirection, meterName, usePrefix, randomMissingReadings, 
                            randomDigitsInName, useUtcOffset, genRandomLifeLikeData);

                    makeFile(data.data, fileName);

                    if(createGAIFileForMeters){
                        createGenericAssetImportFiles.createFile(data.meterNumberList, fileName);
                    }
                }
            }
        }
    }

    if (process.argv[2] === undefined) {
        //console.log('enter \'help\' for cli arguments');
    } else if (process.argv[2].toLowerCase() === 'help') {
        console.log(  '----------------------------------------------------------------',
                    '\n-------------------------Arguments------------------------------', 
                    '\n----------------------------------------------------------------',
                    '\n 01| Four digit year [ex:1999|2016]',
                    '\n----------------------------------------------------------------',
                    '\n 02| Month number [ex:12|1]',
                    '\n----------------------------------------------------------------',
                    '\n 03| Start date number [ex:31|1]',
                    '\n----------------------------------------------------------------',
                    '\n 04| Duration from start date in days [ex:500|10|3]',
                    '\n----------------------------------------------------------------',
                    '\n 05| Number of meters to create [-1 To use /Input/meterList.txt]',
                    '\n----------------------------------------------------------------',
                    '\n 06| Name of output file',
                    '\n----------------------------------------------------------------',
                    '\n 07| Starting usage',
                    '\n----------------------------------------------------------------',
                    '\n 08| Daily usage desired',
                    '\n----------------------------------------------------------------',
                    '\n 09| Number of readings per day [24|48|96|288]',
                    '\n----------------------------------------------------------------',
                    '\n 10| Parser number [1 for MEPMD01]',
                    '\n----------------------------------------------------------------',
                    '\n 11| Flow Direction [NET|TOTAL|REVERSE|FORWARD]',
                    '\n----------------------------------------------------------------',
                    '\n 12| Meter name [\'_\' if using input file]',
                    '\n----------------------------------------------------------------',
                    '\n 13| Random Missing Readings? [true|false] BROKEN',
                    '\n----------------------------------------------------------------',
                    '\n 14| Random Digits in MeterName? [true|false]',
                    '\n----------------------------------------------------------------',
                    '\n 15| Use UTC Offset [true|false]',
                    '\n----------------------------------------------------------------',
                    '\n 16| Generate Life Like Data [true|false]',
                    '\n----------------------------------------------------------------',
                    '\n 17| Create Asset Import File for Meters? [true|false]',
                    '\n----------------------------------------------------------------');
    } else if (process.argv[2] === undefined || process.argv[2].length != 4) {
        //console.log('please enter a four digit year');
    } else if(parseInt(process.argv[6])===0){
        console.log('please choose -1, or any whole number greater than 0');
    }else if (process.argv[10] === undefined) {
        console.log('please choose a parser by entering: \n1 for MEPMD01\n ---OR---\n2 for Generic Parser V1');
    } else if ('NET,TOTAL,REVERSE,FORWARD'.indexOf(process.argv[12].toUpperCase()) < 0) {
        console.log('Choices Limited to: NET, TOTAL, REVERSE, FORWARD');
    } else {
        createReadings(parseInt(process.argv[2]), parseInt(process.argv[3]), parseInt(process.argv[4]),
                       parseInt(process.argv[5]), parseInt(process.argv[6]), process.argv[7],
                       parseInt(process.argv[8]), parseInt(process.argv[9]), parseInt(process.argv[10]), 
                       parseInt(process.argv[11]), process.argv[12], process.argv[13], (parseInt(process.argv[6]) > 1 ? true : false), 
                       JSON.parse(process.argv[15]), JSON.parse(process.argv[16]), JSON.parse(process.argv[17]), 
                       JSON.parse(process.argv[18]),JSON.parse(process.argv[19]));
    }
}());
