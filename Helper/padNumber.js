;(function(){
	'use strict';
	module.exports = padNumber;
	
	function padNumber(number) {
        if (number < 10) {
            return '00' + number.toString();
        } else if (number < 100) {
            return '0' + number.toString();
        }
        return number.toString();
    }

}());