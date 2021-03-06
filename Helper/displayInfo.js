;(function() {
	'use strict';
	module.exports = displayInfo;

	function displayInfo(readingsBlueprint, displayType) {
		var meterName = '';
		if (displayType === 'parameters') {
			if (readingsBlueprint.meterName === '_' & readingsBlueprint.howManyMeters === -1){
				meterName = 'Meters from /Input/metersList.txt'; 
			} else {
				meterName = readingsBlueprint.meterName;
			}
			console.log('------------------------------------------',
	                    '\n--------------Parameters Used-------------',
	                    '\n------------------------------------------',
	                    '\n01| startYear:',readingsBlueprint.startYear,
	                    '\n------------------------------------------',
	                    '\n02| month:',readingsBlueprint.startMonth,
	                    '\n------------------------------------------',
	                    '\n03| startDay:',readingsBlueprint.startDay,
	                    '\n------------------------------------------',
	                    '\n04| durationInDays:',readingsBlueprint.durationInDays,
	                    '\n------------------------------------------',
	                    '\n05| howManyMeters:',readingsBlueprint.howManyMeters,
	                    '\n------------------------------------------',
	                    '\n06| fileName:',readingsBlueprint.fileName,
	                    '\n------------------------------------------',
	                    '\n07| startingUsage:',readingsBlueprint.startingUsage,
	                    '\n------------------------------------------',
	                    '\n08| dailyUsage:',readingsBlueprint.dailyUsage,
	                    '\n------------------------------------------',
	                    '\n09| readingsPerDay:',readingsBlueprint.readingsPerDay,
	                    '\n------------------------------------------',
	                    '\n10| parser:',readingsBlueprint.parser,
	                    '\n------------------------------------------',
	                    '\n11| flowDirection:',readingsBlueprint.flowDirection,
	                    '\n------------------------------------------',
	                    '\n12| meterName:',meterName,
	                    '\n------------------------------------------',
	                    '\n13| usePrefix: (assigned automatically) ',readingsBlueprint.usePrefix,
	                    '\n------------------------------------------',                
	                    '\n14| randomMissingReadings:',readingsBlueprint.randomMissingReadings,
	                    '\n------------------------------------------',
	                    '\n15| randomDigitsInName:',readingsBlueprint.randomDigitsInName,
	                    '\n------------------------------------------',
	                    '\n16| useUtcOffset:',readingsBlueprint.useUtcOffset,
	                    '\n------------------------------------------',
	                    '\n17| genRandomLifeLikeData:',readingsBlueprint.genRandomLifeLikeData,
	                    '\n------------------------------------------',
	                    '\n18| createGAIFileForMeters:',readingsBlueprint.createGAIFileForMeters,
	                    '\n------------------------------------------',
	                    '\n19| ownerName:',readingsBlueprint.ownerName,
	                    '\n------------------------------------------');			
		} else if (displayType === 'menu') {
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
                        '\n----------------------------------------------------------------',
						'\n 18| Owner Name: If 17 is true you can edit the owner of the',
						'\n  +| asset in the form of <name>@<domain>',
	                    '\n----------------------------------------------------------------');
		} else {
			throw Error('Must choose \'parameters\' or \'menu\'');
		}
	}
}());