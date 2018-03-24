;(function() {
	'use strict';
	module.exports = isLastDayOfTheMonth;

	function isLastDayOfTheMonth(dayOfTheMonthCount, daysInCurrentMonth, daysLeftInCurrentMonth) {
        if (dayOfTheMonthCount === daysInCurrentMonth || daysLeftInCurrentMonth === 0) {
            return true;
        }
        return false;
    }	

}());