;(function() {
    'use strict';
    module.exports = syncDdAndDayOfTheMonthCount;

    function syncDdAndDayOfTheMonthCount(dd, daysInCurrentMonth) {
       // if (dd > 1) {
        //    console.log('in if');
            return daysInCurrentMonth - dd;
        // } else {
        //     console.log('in else');
        //     return daysInCurrentMonth;
        // }
    }

}());