;(function(){
    'use strict';
    module.exports = monthTransition;
    var translateDateToParserFormat = require("../Helper/translateDateToParserFormat.js");

    function monthTransition(intervalRowSegment, readingsPerDay, lastDayYyyy, lastDayMm, lastDayDd, hh) {
        var date = undefined;
        if (hh === 5) {
            if (intervalRowSegment === 18 && readingsPerDay === 24) {
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            } else if (readingsPerDay === 48 && intervalRowSegment === ((18 * 2) + 1)) { //inprocess!!!!
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            } else if (readingsPerDay === 96 && intervalRowSegment === ((18 * 4) + 3)) {
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            } else if (readingsPerDay === 288 && intervalRowSegment === (18 * 4 * 3) + 11) {
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            }
        } else if (hh === 0) {            
            if (intervalRowSegment === 23 && readingsPerDay === 24) {
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);         
            } else if (readingsPerDay === 48 && intervalRowSegment === ((23 * 2) + 1)) { //inprocess!!!!
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            } else if (readingsPerDay === 96 && intervalRowSegment === ((23 * 4) + 3)) {
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            } else if (readingsPerDay === 288 && intervalRowSegment === (23 * 4 * 3) + 11) {
                    date = translateDateToParserFormat(lastDayYyyy, lastDayMm, lastDayDd, 0);
            }
        }
        return date;

    }
}());