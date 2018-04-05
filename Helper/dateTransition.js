;(function() {
	'use strict';
	module.exports = dateTransition;

	function dateTransition(intervalRowSegment, readingsPerDay, hh) {
        var dateTransitionValue = 7600;
        //the incrementation is done by arithmatic on the date string as if it where simply an integer
        if (intervalRowSegment === (23 - hh) && readingsPerDay === 24) {
            //this is the value that makes the day increment from d-1 to d after 2300
            return dateTransitionValue;
        } else if (readingsPerDay === 48 && intervalRowSegment === (((23 - hh) * 2) + 1)) {
            return dateTransitionValue;
        } else if (readingsPerDay === 96 && intervalRowSegment === (((23 - hh) * 4) + 3)) {
            return dateTransitionValue;
        } else if (readingsPerDay === 288 && intervalRowSegment === ((23 - hh) * 4 * 3) + 11) {
            return dateTransitionValue;
        } else {
            return 0;
        }
    }
}())