;(function() {
    'use strict';
    module.exports = syncDdAndDayOfTheMonthCount;

    function syncDdAndDayOfTheMonthCount(dd, daysInCurrentMonth) {
        if (dd >= 1) {
            return daysInCurrentMonth - dd;
        } else {
            return daysInCurrentMonth;
        }
    }

}());