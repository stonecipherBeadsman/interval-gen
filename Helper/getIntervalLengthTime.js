;(function() {
	module.exports = getIntervalLengthTime;
	'use strict';

	function getIntervalLengthTime(readingsPerDay) {
       if (readingsPerDay === 24) {
            return 100;
        } else if (readingsPerDay === 48) {
            return 30;
        } else if (readingsPerDay === 96) {
            return 15;
        } else if (readingsPerDay === 288) {
            return 5;
        } else if (readingsPerDay === undefined) {
            return {possibleReadingsPerDay: [24,48,96,288], possibleIntervalValues:[100,30,15,5]};
        } else {
            throw Error('readingsPerDay Must be 5, 15, 30, 100\n\treadingsPerDay given: ' + readingsPerDay);
        }
    }
}());