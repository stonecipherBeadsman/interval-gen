;(function() {
    'use strict';
    var fs = require('fs');
    var path = require('path');

    var createGenericAssetImportFiles = require(path.resolve(__dirname, './Helper/genericAssetImportFileCreation.js'));
    var makeFile = require(path.resolve(__dirname, './Helper/makeFile.js'));
    var createMepmd01Data = require(path.resolve(__dirname, './Helper/createMepmd01Data.js'));
    var createReadings = require(path.resolve(__dirname, './Helper/createReadings.js'));
    var displayInfo = require(path.resolve(__dirname, './Helper/displayInfo.js'));

    var readingsBlueprint = {};

    try {
        if (process.argv[2] === undefined || process.argv[2].toLowerCase() === 'help') {
            displayInfo(null, 'menu');
        } else if (process.argv[2] === undefined || process.argv[2].length != 4) {
            throw Error('please enter a four digit year');
        } else if (parseInt(process.argv[6]) === 0) {
            throw Error('please choose -1, or any whole number greater than 0');
        } else if (process.argv[10] === undefined) {
            throw Error('please choose a parser by entering: \n1 for MEPMD01\n ---OR---\n2 for Generic Parser V1');
        } else if ('NET,TOTAL,REVERSE,FORWARD'.indexOf(process.argv[12].toUpperCase()) < 0) {
            throw Error('Choices Limited to: NET, TOTAL, REVERSE, FORWARD');
        } else {
            readingsBlueprint.startYear = parseInt(process.argv[2]);
            readingsBlueprint.startMonth = parseInt(process.argv[3]);
            readingsBlueprint.startDay = parseInt(process.argv[4]);
            readingsBlueprint.durationInDays = parseInt(process.argv[5]);
            readingsBlueprint.howManyMeters = parseInt(process.argv[6]);
            readingsBlueprint.fileName = process.argv[7];
            readingsBlueprint.startingUsage = parseInt(process.argv[8]);
            readingsBlueprint.dailyUsage = parseInt(process.argv[9]);
            readingsBlueprint.readingsPerDay = parseInt(process.argv[10]);
            readingsBlueprint.parser = parseInt(process.argv[11]);
            readingsBlueprint.flowDirection = process.argv[12];
            readingsBlueprint.meterName = process.argv[13];
            readingsBlueprint.usePrefix = (parseInt(process.argv[6]) > 1 ? true : false);
            readingsBlueprint.randomMissingReadings = JSON.parse(process.argv[15]);
            readingsBlueprint.randomDigitsInName = JSON.parse(process.argv[16]);
            readingsBlueprint.useUtcOffset = JSON.parse(process.argv[17]);
            readingsBlueprint.genRandomLifeLikeData = JSON.parse(process.argv[18]);
            readingsBlueprint.createGAIFileForMeters = JSON.parse(process.argv[19]);

            createReadings(readingsBlueprint);
        }
    } catch (error) {
        console.log(error);
    }
}());