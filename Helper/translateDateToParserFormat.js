;(function() {
	'use strict';
	module.exports = translateDateToParserFormat;

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
}());