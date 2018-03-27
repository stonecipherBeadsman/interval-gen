;(function(){
	module.exports = getIntervalLengthTime;
	'use strict';

	function getIntervalLengthTime(readingsPerDay){
       if(readingsPerDay === 24){
            return 100;
        } else if (readingsPerDay === 48){
            return 30;
        } else if (readingsPerDay === 96) {
            return 15;
        } else if (readingsPerDay === 288) {
            return 5;
        }
    }
}());