;(function() {
	'use strict';
    module.exports = {
        niscMepmd01,
        lgGridstream
    };
    
	function niscMepmd01(input) {
        var flowDirection = {
            intUom: '',
            regUom: ''
        };

        if(input !== null && input !== undefined){
            input = input.toUpperCase();
        } else {
            throw Error('Invalid input to setUOM.niscMepmd01: must not pass in null or undefined, Got: ' + input);
        }
        switch (input[0]) {
            case 'R':
                flowDirection.intUom = 'GKWH';
                flowDirection.regUom = 'GKWHREG';
                break;
            case 'N':
                flowDirection.intUom = 'NKWH';
                flowDirection.regUom = 'NKWHREG';
                break;
            case 'T':
                flowDirection.intUom = 'SKWH';
                flowDirection.regUom = 'SKWHREG';
                break;
            case 'F':
                flowDirection.intUom = 'KWH';
                flowDirection.regUom = 'KWHREG';
                break;
            default:
                throw Error('Invalid input to setUOM.niscMepmd01: Given: ' + input + ', Expected: FORWARD, REVERSE, NET, or TOTAL');
        }
        return flowDirection;
    }

    function lgGridstream(input) {
        var flowDirection = {
            intUom: ''
        };

        if(input !== null && input !== undefined){
            input = input.toUpperCase();
        } else {
            throw Error('Invalid input to setUOM.lgGridstream: must not pass in null or undefined, Got: ' + input);
        }
        input = input.toUpperCase();
        switch (input[0]) {
            case 'R':
                flowDirection.intUom = 'kWh-RcvdRateA';
                break;
            case 'F':
                flowDirection.intUom = 'kWh-DelRateA';
                break;
            default:
                throw Error('Invalid input to setUOM.lgGridstream: Given: ' + input + ', Expected: FORWARD or REVERSE');
        }
        return flowDirection;
    }
}())