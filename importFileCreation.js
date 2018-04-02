;(function() {
    'use strict';
    var fs = require('fs');
    var path = require('path');

    var createGenericAssetImportFiles = require( path.resolve(__dirname ,'./Helper/genericAssetImportFileCreation.js'));
    var makeFile = require(path.resolve(__dirname, './Helper/makeFile.js'));
    var createMepmd01Data = require(path.resolve(__dirname, './Helper/createMepmd01Data.js'));

    function createReadings(startYear, month, startDay, durationInDays, howManyMeters, fileName, startingUsage, dailyUsage, readingsPerDay, parser, flowDirection, meterName, usePrefix, randomMissingReadings, randomDigitsInName, useUtcOffset, genRandomLifeLikeData, createGAIFileForMeters) { 

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
                '\n13| usePrefix:',usePrefix,
                '\n------------------------------------------',                
                '\n14| randomMissingReadings:',randomMissingReadings,
                '\n------------------------------------------',
                '\n15| randomDigitsInName:',randomDigitsInName,
                '\n------------------------------------------',
                '\n16| useUtcOffset:',useUtcOffset,
                '\n------------------------------------------',
                '\n17| genRandomLifeLikeData:',genRandomLifeLikeData,
                '\n------------------------------------------',
                '\n18| createGAIFileForMeters:',createGAIFileForMeters,
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
                       parseInt(process.argv[11]), process.argv[12], process.argv[13],
                       (parseInt(process.argv[6]) > 1 ? true : false), JSON.parse(process.argv[15]), JSON.parse(process.argv[16]),
                       JSON.parse(process.argv[17]), JSON.parse(process.argv[18]), JSON.parse(process.argv[19]));
    }
}());
