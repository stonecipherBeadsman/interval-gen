;(function() {
	'use strict';
	module.exports = {
        niscMepmd01,
        lgGridstream
    };

    function setMeirdiem(hour){
        if(parseInt(hour) > 11){
            return 'PM';
        } else {
            return 'AM';
        }
    }

	function niscMepmd01(yyyy, mm, dd, hh) {
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

    function lgGridstream(yyyy, mm, dd, hh){
        //right now this will only return pm at 12
        //but, timestamp is only able to be midnight atm soo...
        var dateValues = [mm, dd, hh];
        for (var x = 0; x < dateValues.length; x++) {
            if (dateValues[x] < 10) {
                dateValues[x] = '0' + dateValues[x].toString();
            } else {
                dateValues[x] = dateValues[x].toString();
            }
        }
        return [dateValues[0] + dateValues[1] + yyyy + dateValues[2] + '00' + '00' + setMeirdiem(hh)];
    }
}());