;(function() {
	'use strict';
	module.exports = getProtocolCode;
    function getProtocolCode(randomMissingReadings, protocolCode) {
        if (randomMissingReadings && getBooleanValue()) {
            protocolCode = 'N0'; //E0
        } else if (protocolCode !== 'A') {
            protocolCode = 'A';
        }
        return protocolCode;
    }	
}());