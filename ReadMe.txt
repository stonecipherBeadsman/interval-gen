To run this script, first install node.js

'node importFileCreation.js help' will give this menu:

			----------------------------------------------------------------
			-------------------------Arguments------------------------------
			----------------------------------------------------------------
			01| Four digit year [ex:1999|2016]
			----------------------------------------------------------------
			02| Month number [ex:12|1]
			----------------------------------------------------------------
			03| Start date number [ex:31|1]
			----------------------------------------------------------------
			04| Duration from start date in days [ex:500|10|3]
			----------------------------------------------------------------
			05| Number of meters to create [-1 To use /Input/meterList.txt]
			----------------------------------------------------------------
			06| Name of output file
			----------------------------------------------------------------
			07| Starting usage
			----------------------------------------------------------------
			08| Daily usage desired
			----------------------------------------------------------------
			09| Number of readings per day [24|48|96|288]
			----------------------------------------------------------------
			10| Parser number [1 for MEPMD01]
			----------------------------------------------------------------
			11| Flow Direction [NET|TOTAL|REVERSE|FORWARD]
			----------------------------------------------------------------
			12| Meter name ['_' if using input file]
			----------------------------------------------------------------
			13| Random Missing Readings? [true|false] BROKEN
			----------------------------------------------------------------
			14| Random Digits in MeterName? [true|false]
			----------------------------------------------------------------
			15| Use UTC Offset [true|false]
			----------------------------------------------------------------
			16| Generate Life Like Data [true|false]
			----------------------------------------------------------------
			17| Create Asset Import File for Meters? [true|false]
			----------------------------------------------------------------
			18| Owner Name: If 17 is true you can edit the owner of the
			+| asset in the form of <name>@<domain>
			----------------------------------------------------------------

'node importFileCreation.js 2016 1 1 690 1 OutputFileName 0 24 24 1 FORWARD MeterName false false false true true'
			------------------------------------------
			--------------Parameters Used-------------
			------------------------------------------
			01| startYear: 2016
			------------------------------------------
			02| month: 1
			------------------------------------------
			03| startDay: 1
			------------------------------------------
			04| durationInDays: 690
			------------------------------------------
			05| howManyMeters: 1
			------------------------------------------
			06| fileName: OutputFileName
			------------------------------------------
			07| startingUsage: 0
			------------------------------------------
			08| dailyUsage: 24
			------------------------------------------
			09| readingsPerDay: 24
			------------------------------------------
			10| parser: 1
			------------------------------------------
			11| flowDirection: FORWARD
			------------------------------------------
			12| meterName: MeterName
			------------------------------------------
			13| usePrefix: (assigned automatically)  false
			------------------------------------------
			14| randomMissingReadings: false
			------------------------------------------
			15| randomDigitsInName: false
			------------------------------------------
			16| useUtcOffset: false
			------------------------------------------
			17| genRandomLifeLikeData: true
			------------------------------------------
			18| createGAIFileForMeters: true
			------------------------------------------
			19| ownerName: undefined
			------------------------------------------
This will create two files in /Output one called 'OutputFileName.txt' that has 690 days of readings for one meter with life like data that has aproximately 24 KWH usage per day, and one called 'GenericAssetImportParser_OutputFileName.csv' which contains an entry for importing the asset. If parameter 18 is false, no Generic Asset Import Parser file will be created.

If you add an owner name at the end of the call and createGAIFileForMeters (parameter 18) is true:
'node importFileCreation.js 2016 1 1 690 1 OutputFileName 0 24 24 1 FORWARD MeterName false false false true true name@domain'
The owner name in 'GenericAssetImportParser_OutputFileName.csv' will be 'name@domain', if it remains blank then a default owner will be inserted.

'node importFileCreation.js 2016 1 1 690 -1 OutputFileName 0 24 24 1 FORWARD _ false false false true true'
This will create two files in /Output one called 'OutputFileName.txt' that has 690 days of readings for n meters with life like data that has aproximately 24 KWH usage per day where n is the number of meter ids in 'Input/meterList.txt', and one called 'GenericAssetImportParser_OutputFileName.csv' which contains an entry for each meter id in 'Input/meterList.txt'. If parameter 18 is false, no Generic Asset Import Parser file will be created.