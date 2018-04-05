;(function() {
	'use strict';
	module.exports = setUOM;
	function setUOM(input) {
        var flowDirection = {
            intUom: '',
            regUom: ''
        };

        input = input.toUpperCase();
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
            default:
                flowDirection.intUom = 'KWH';
                flowDirection.regUom = 'KWHREG';
        }
        return flowDirection;
    }

}())