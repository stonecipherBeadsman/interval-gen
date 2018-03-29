;(function(){
	'use strict';
	module.exports = addIntervalsToCumulative;

	function addIntervalsToCumulative(intervalValuesArray){
        if(intervalValuesArray.length < 1){
        	throw new Error('intervalValuesArray needs to have length > 0');
        } else if (typeof intervalValuesArray !== 'object'){
        	throw new Error('intervalValuesArray needs to be an array');
        }else {
            var cumulativeReadingValue = 0;
            for (var i = 0; i < intervalValuesArray.length; i++){
                cumulativeReadingValue += intervalValuesArray[i];
            }
            return cumulativeReadingValue;
        }
    }

}());