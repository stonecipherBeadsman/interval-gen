;(function(){
	'use strict';
	module.exports = createMeterNumbers;
    var path = require('path');
    var fs = require('fs');
    var padNumber = require(path.resolve(__dirname, 'padNumber.js'));
    var inputToArrayAtNewline = require(path.resolve(__dirname, 'inputToArrayAtNewline.js'));

	function createMeterNumbers(quantity, meterName, usePrefix, randomDigitsInName) {
        var number = 0;
        var meterNumber = '';
        var meterNumbers = [];
        meterName = meterName === '_' ? '' : meterName;
        if(quantity > -1){
        	if (usePrefix === true) {
        	    if (randomDigitsInName) {
        	        for (var i = 0; i < quantity;) {
        	            for (var j = 0; j < 9; j++) {
        	                number = Math.floor((Math.random() * 10));
        	                meterNumber += number.toString();
        	            }
        	            if (meterNumbers.indexOf(meterNumber) < 0) {
        	                meterNumbers[i] = meterName + meterNumber;
        	                i++;
        	            } else {
        	                console.log('Duplicate ' + meterNumber);
        	            }
        	            meterNumber = '';
        	        }
        	    } else {
        	        for (var k = 0; k < quantity;) {
        	            meterNumber = padNumber(k + 1);
        	            meterNumbers[k] = meterName + meterNumber;
        	            k++;
        	        }
        	    }	
        	    return meterNumbers;
        	} else if (usePrefix === false) {
        	    meterNumbers.push([meterName]);
        	    return meterNumbers;
        	}
        } else {
        	//get list of meters from file
        	var meterFile = '../Input/meterList.txt';
        	var filePath = meterFile;
        	var meters = fs.readFileSync(filePath, {
            	encoding: 'utf-8'
       		 });
        	return inputToArrayAtNewline(meters);
        }
    }
}());