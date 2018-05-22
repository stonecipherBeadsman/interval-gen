;(function() {
	'use strict';
	module.exports = createReadings;

    var path = require('path');
    var createMepmd01Data = require(path.resolve(__dirname, 'createMepmd01Data.js'));
    var createLGGridStreamCMEPData = require(path.resolve(__dirname, 'createLGGridStreamCMEPData.js'));
    var makeFile = require(path.resolve(__dirname, 'makeFile.js'));
    var createGenericAssetImportFiles = require(path.resolve(__dirname, 'genericAssetImportFileCreation.js'));
    var displayInfo = require(path.resolve(__dirname, 'displayInfo.js'));

	function createReadings(readingsBlueprint) {
        var data;
        if (readingsBlueprint.readingsPerDay != 24 && readingsBlueprint.readingsPerDay != 48 && readingsBlueprint.readingsPerDay != 96 && readingsBlueprint.readingsPerDay != 288 && readingsBlueprint.readingsPerDay != 1440) {
            throw new Error('Please Choose 24, 48, 96, or 288 readings per day');
        } else {
            if (readingsBlueprint.createGAIFileForMeters && readingsBlueprint.ownerName !== undefined) {
                var ats = (readingsBlueprint.ownerName.match(/@/g) || []).length;
                if(ats !== 1){
                    throw new Error('There must be one and only one @ sign in a owner name,\ngiven owner name included ' +  ats + ' @ symbols\nsubmit an owner name of the form <name>@<domain>');
                }
                if (readingsBlueprint.ownerName.indexOf('@') === readingsBlueprint.ownerName.length-1 ||
                    readingsBlueprint.ownerName.indexOf('@') === 0){
                    throw new Error('Submit an owner name of the form <name>@<domain>');
                }
            }
            if (readingsBlueprint.parser === 1 || readingsBlueprint.parser === 2) {
                displayInfo(readingsBlueprint, 'parameters');
                if(readingsBlueprint.parser === 1){                    
                    data = createMepmd01Data(readingsBlueprint);
                } else if (readingsBlueprint.parser === 2){
                    data = createLGGridStreamCMEPData(readingsBlueprint);
                }
                makeFile(data.data, readingsBlueprint.fileName);
                if (readingsBlueprint.createGAIFileForMeters) {
                    createGenericAssetImportFiles.createFile(data.meterNumberList, readingsBlueprint.fileName, readingsBlueprint.ownerName);
                }
            } else {
                throw Error('1 and 2 are the only parse numbers currently supported');
            }
        }
    }
}());