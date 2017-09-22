//look for a way to maybe stream the output to the text file rather than store it as a big string

;(function() {
    'use strict';
    var fs = require('fs');
    var path = require('path');
    var monthEngine = require("./Helper/monthEngine.js");
    var Counter = require("./Helper/Counter.js");

    function getBooleanValue() {
        return Math.random() >= 0.5;
    }

    function setUtsOffset(useOffest){
    	return useOffest === true ? 5 : 0;
    }

    function syncDdAndDayOfTheMonthCount(dd, daysInCurrentMonth) {
        if (dd > 1) {
            return daysInCurrentMonth - dd;
        } else {
            return daysInCurrentMonth;
        }
    }

    function isLastDayOfTheMonth(dayOfTheMonthCount, daysInCurrentMonth, daysLeftInCurrentMonth) {
        if (dayOfTheMonthCount === daysInCurrentMonth - 1 || daysLeftInCurrentMonth === 0) {
            return true;
        }
        return false;
    }

    function padNumber(number) {
        if (number < 10) {
            return '00' + number.toString();
        } else if (number < 100) {
            return '0' + number.toString();
        }
        return number.toString();
    }

    function inputToArray(data) {
        data = data.split('\n');       
        for (var i = data.length - 1; i >= 0; i--) {
        	data[i] = data[i].replace(/\s/g, "");
        }

        return data;
    }

    function getProtocolCode(randomMissingReadings, protocolCode) {
        if (randomMissingReadings && getBooleanValue()) {
            protocolCode = 'N0'; //E0
        } else if (protocolCode !== 'A') {
            protocolCode = 'A';
        }
        return protocolCode;
    }

    function translateDateToParserFormat(yyyy, mm, dd, hh) {
        var dateValues = [mm, dd, hh];
        for (var x = 0; x < dateValues.length; x++) {
            if (dateValues[x] < 10) {
                dateValues[x] = '0' + dateValues[x].toString();
            } else {
                dateValues[x] = dateValues[x].toString();
            }
        }
        return [yyyy + dateValues[0] + dateValues[1] + dateValues[2] + '00'];
    }

    function makeFile(data, fileName) {
        var dir = __dirname + "/Output/";
        if (fileName === undefined) {
            fileName = 'Meter_Readings';
        } else {
            fileName = fileName.toString();
        }
        var writer = data;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFile(dir + fileName + ".txt", writer, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved ' + fileName + ".txt");
        });
    }

    function dateTransition(intervalRowSegment, readingsPerDay, hh) {
        var dateTransitionValue = 7600;
        if (hh === 5) {
            if (intervalRowSegment === 18 && readingsPerDay === 24) {
                //this is the value that makes the day increment from d-1 to d after 2300
                return dateTransitionValue;
            } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) {
                return dateTransitionValue;
            } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
                return dateTransitionValue;
            } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
                return dateTransitionValue;
            } else {
                return 0;
            }
        } else if (hh === 0) {
            //the incrementation is done by arithmatic on the date string as if it where simply an integer
            if (intervalRowSegment === 23 && readingsPerDay === 24) {
                //this is the value that makes the day increment from d-1 to d after 2300
                return dateTransitionValue;
            } else if (readingsPerDay === 48 && intervalRowSegment === ((23 * 2) + 1)) {
                return dateTransitionValue;
            } else if (readingsPerDay === 96 && intervalRowSegment === ((23 * 4) + 3)) {
                return dateTransitionValue;
            } else if (readingsPerDay === 288 && intervalRowSegment === (23 * 4 * 3) + 11) {
                return dateTransitionValue;
            } else {
                return 0;
            }
        }
    }

    function monthTransition(intervalRowSegment, readingsPerDay,lastDayYyyy, 
    						 lastDayMm, lastDayDd) {
        if (intervalRowSegment === 18 && readingsPerDay === 24) {
            return translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) { //inprocess!!!!
            return translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
            return translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
        } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
            return translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
        }

    }


    function setUOM(input) {
        var flowDirection = {
            intUom: '',
            regUom: ''
        };

        input = input.toUpperCase();
        switch (input[0]) {
            case 'R':
                flowDirection.intUom = 'GKWH';
                flowDirection.regUom = 'GKWHREG';
                break;
            case 'N':
                flowDirection.intUom = 'NKWH';
                flowDirection.regUom = 'NKWHREG';
                break;
            case 'T':
                flowDirection.intUom = 'SKWH';
                flowDirection.regUom = 'SKWHREG';
                break;
            default:
                flowDirection.intUom = 'KWH';
                flowDirection.regUom = 'KWHREG';
        }
        return flowDirection;
    }

    function addRegisterReadAndMeterNumbersMepmd01(serialNumbers, monthList, dailyRegisterRead, 
    											   startingUsage, meterText, year, month) {
        var a = [];
        var b = [];
        var registerReadCounter = 0;
        var meterNumber = serialNumbers;
        for (var k = 0; k < serialNumbers.length; k++) {
            for (var l = 0; l < monthList.length; l++) {
                for (var h = 0; h < monthList[l].length; h++) {
                    a = monthList[l][h];
                    if (a.indexOf('REGISTER_READ_PLACEHOLDER') > 0) {
                        a = a.replace('REGISTER_READ_PLACEHOLDER', (dailyRegisterRead * registerReadCounter) + startingUsage);
                        registerReadCounter++;
                    }
                    a = a.replace('METER_NUMBER_PLACEHOLDER', meterNumber[k]);
                    b.push(a);
                }
                if (l === monthList.length - 1) { //flawed
                    var lastRegisterReadRow = [];
                    lastRegisterReadRow = meterText[0].split(',');
                    lastRegisterReadRow[14] = parseInt(lastRegisterReadRow[14]) + 10000;
                    lastRegisterReadRow = lastRegisterReadRow.join(',');
                    b.push(lastRegisterReadRow.replace('METER_NUMBER_PLACEHOLDER', meterNumber[k]).replace('REGISTER_READ_PLACEHOLDER', (dailyRegisterRead * registerReadCounter) + startingUsage));
                }
                a = [];
            }
            registerReadCounter = 0;
        }
        return b;
    }

    function createMeterNumbers(quantity, meterName, usePrefix, randomDigitsInName) {
        var number = 0;
        var meterNumber = '';
        var meterNumbers = [];
        meterName = meterName === '_' ? '' : meterName;
        if(quantity > -1){
        	if (usePrefix === true) {
        	    if (randomDigitsInName) {
        	        for (var i = 0; i < quantity;) {
        	            for (var j = 0; j < 9; j++) {
        	                number = Math.floor((Math.random() * 10));
        	                meterNumber += number.toString();
        	            }
        	            if (meterNumbers.indexOf(meterNumber) < 0) {
        	                meterNumbers[i] = meterName + meterNumber;
        	                i++;
        	            } else {
        	                console.log('Duplicate ' + meterNumber);
        	            }
        	            meterNumber = '';
        	        }
        	    } else {
        	        for (var k = 0; k < quantity;) {
        	            meterNumber = padNumber(k + 1);
        	            meterNumbers[k] = meterName + meterNumber;
        	            k++;
        	        }
        	    }	
        	    return meterNumbers;
        	} else if (usePrefix === false) {
        	    meterNumbers.push([meterName]);
        	    return meterNumbers;
        	}
        } else {
        	//get list of meters from file
        	var meterFile = '/Input/meterList.txt';
        	var filePath = path.join(__dirname, meterFile);
        	var meters = fs.readFileSync(filePath, {
            	encoding: 'utf-8'
       		 });
        	return inputToArray(meters);
        }
    }

    function createMepmd01Data(startYear, startMonth, startDay, 
    						   durationInDays, howManyMeters, startingUsage, 
    						   dailyUsage, readingsPerDay, flowDirection, meterName, usePrefix,
    						   randomMissingReadings, randomDigitsInName, useUtcOffset) {
        var meterText = {};
        var oneMinCounter = 0;
        var fifteenMinCounter = 0;
        var fiveMinCounter = 0;
        var dailyRegisterRead = dailyUsage;
        var yyyy = startYear;
        var mm = startMonth;
        var dd = startDay;
        //for UTC offset use 5 if parser configuration set to useLocalTime=false, 0 if true
        var hh = setUtsOffset(useUtcOffset);
        var monthList = [];
        var dates = [];
        var meterNumberList = [];
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

        flowDirection = setUOM(flowDirection);
        intUom = flowDirection.intUom;
        regUom = flowDirection.regUom;
        /*
            For the number of iterations equal to the lengtgh of day that is specified by the input
                Find the number of days in the "current" month (reletive to the start date)  
                If this is the first iteration 
                    Set the number of days left in the month to the differance between the given start date and total days in the month
                    Initiate the countdown with the number of days left in the month
                Store the result of isLastDayOfTheMonth()
                Store translated date values
                Store the base String template for the Readings
                For the number of Readings per day 
                    If the this is the first section of data for a row of intervals (Interval row segment % Readings per day = 0) 
                        Set the first part of the row to the {{interval-length,readings-per-line}}
                        Turn over the counter (i.e. if this is not the first round of the loop then start the counter over at 0)
                        Increment the counter 
                        Increment the intervalLengthTimeValue by the interval length value (i.e. 100 for 1 hr, 30 for 1/2 hr etc.)
                    If it is the last day of the month check to see how to increment the month value and year value
                        If the month is not December
                            Add one to the month
                            Set year to the year
                        Else 
                            Set month to January
                            Set year to year + 1
                        
        */
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
                    //TODO: this logic is repeated at the end of the main forLoop, condense these two places ~ln. 255
                    if (mm < 12) {
                        lastDayMm = mm + 1;
                        lastDayYyyy = yyyy;
                    } else {
                        lastDayMm = 1;
                        lastDayYyyy = yyyy + 1;
                    }
                    var lastDayDd = 1;
                    if (intervalRowSegment === 18 && readingsPerDay === 24) {
                        dates = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
                        intervalLengthTimeValue = 0;
                    } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) { 
                        dates = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
                        intervalLengthTimeValue = 0;
                    } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
                        dates = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
                        intervalLengthTimeValue = 0;
                    } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
                        dates = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
                        intervalLengthTimeValue = 0;
                    }
                    //dates = monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd);
                    //intervalLengthTimeValue = 0;
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
                meterText[1] += (parseInt(dates[0]) + intervalLengthTimeValue) + ',' + getProtocolCode(randomMissingReadings, protocolCode) + ',' + (dailyRegisterRead / readingsPerDay) + comma;

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

        meterNumberList = createMeterNumbers(howManyMeters, meterName, usePrefix, randomDigitsInName);
        completeRawMeterReadingsList = addRegisterReadAndMeterNumbersMepmd01(meterNumberList, monthList, dailyRegisterRead, startingUsage, meterText); //, yyyy, mm);
        for (var fileLine = 0; fileLine < completeRawMeterReadingsList.length; fileLine++) {
            textOut += (completeRawMeterReadingsList[fileLine] + '\n');
        }
        return textOut;
    }

    function createReadings(startYear, month, startDay, durationInDays, howManyMeters, fileName, startingUsage, dailyUsage, readingsPerDay, parser, flowDirection, meterName, usePrefix, randomMissingReadings, randomDigitsInName) { //don't bridge years ftm
        var data;
        if (readingsPerDay != 24 && readingsPerDay != 48 && readingsPerDay != 96 && readingsPerDay != 288 && readingsPerDay != 1440) {
            console.log('Please Choose 24, 48, 96, or 288 readings per day');
        } else {
            if (parser === 1) {
                if (readingsPerDay > 288) {
                    console.log('This Parser Limited to <= 288 Reads Per Day');
                } else {
                    data = createMepmd01Data(startYear, month, startDay, durationInDays, howManyMeters, startingUsage, dailyUsage, readingsPerDay, flowDirection, meterName, usePrefix, randomMissingReadings, randomDigitsInName);
                    makeFile(data, fileName);
                }
            }
        }
    }

    if (process.argv[2] === undefined) {
        console.log('enter \'help\' for cli arguments');
    } else if (process.argv[2].toLowerCase() === 'help') {
        console.log('Arguments: \n 01 Four digit year [ex:1999|2016] \n 02 Month number [ex:12|1] \n 03 Start date number [ex:31|1] \n 04 Duration from start date in days [ex:500|10|3]\n 05 Number of meters to create [-1 To use contents of a fil] \n 06 Name of output file \n 07 Starting usage \n 08 Daily usage desired \n 09 Number of readings per day [24|48|96|288] \n 10 Parser number [1 for MEPMD01] \n 11 Flow Direction [NET|TOTAL|REVERSE|FORWARD]\n 12 Meter name\n 13 Use prefix? [true|false]\n 14 Random Missing Readings? [true|false]\n 15 Random Digits in MeterName? [true|false] \n 16 Use UTC Offset [true|false]');
    } else if (process.argv[2] === undefined || process.argv[2].length != 4) {
        console.log('please enter a four digit year');
    } else if (process.argv[10] === undefined) {
        console.log('please choose a parser by entering: \n1 for MEPMD01\n ---OR---\n2 for Generic Parser V1');
    } else if ('NET,TOTAL,REVERSE,FORWARD'.indexOf(process.argv[12].toUpperCase()) < 0) {
        console.log('Choices Limited to: NET, TOTAL, REVERSE, FORWARD');
    } else {
        createReadings(parseInt(process.argv[2]), parseInt(process.argv[3]), parseInt(process.argv[4]),
            parseInt(process.argv[5]), parseInt(process.argv[6]), process.argv[7],
            parseInt(process.argv[8]), parseInt(process.argv[9]), parseInt(process.argv[10]), 
            parseInt(process.argv[11]), process.argv[12], process.argv[13], JSON.parse(process.argv[14]), 
            JSON.parse(process.argv[15]), JSON.parse(process.argv[16]), JSON.parse(process.argv[17]));
    }
}());
