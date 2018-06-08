;(function() {
    'use strict';
    var path = require('path');
    var monthEngine = require( path.resolve(__dirname ,'monthEngine.js'));

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

    function validateDatesToTranslate(yyyy, mm, dd, hh){
        if(mm > 12){
            throw new Error('\'mm\' Month must not be greater than 12, given ' + mm);
        } else if (mm === 1 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for Jan, given ' + dd);
        } else if (mm === 2 && dd > 28) {
            if(monthEngine.getDaysInFebForYear(yyyy,mm) < 29){
                throw new Error('\'dd\' Day must not be greater than 28 for Feb in Common Year, given ' + dd);
            } else if (dd > 29){
                throw new Error('\'dd\' Day must not be greater than 29 for Feb in Leap Year, given ' + dd);
            }
        } else if (mm === 3 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for Mar, given ' + dd);
        } else if (mm === 4 && dd > 30) {
            throw new Error('\'dd\' Day must not be greater than 30 for Apr, given ' + dd);
        } else if (mm === 5 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for May, given ' + dd);
        } else if (mm === 6 && dd > 30) {
            throw new Error('\'dd\' Day must not be greater than 30 for Jun, given ' + dd);
        } else if (mm === 7 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for Jul, given ' + dd);
        } else if (mm === 8 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for Aug, given ' + dd);
        } else if (mm === 9 && dd > 30) {
            throw new Error('\'dd\' Day must not be greater than 30 for Sep, given ' + dd);
        } else if (mm === 10 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for Oct, given ' + dd);
        } else if (mm === 11 && dd > 30) {
            throw new Error('\'dd\' Day must not be greater than 30 for Nov, given ' + dd);
        } else if (mm === 12 && dd > 31) {
            throw new Error('\'dd\' Day must not be greater than 31 for Dec, given ' + dd);
        }

    }

	function niscMepmd01(yyyy, mm, dd, hh) {
       validateDatesToTranslate(yyyy, mm, dd, hh);
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