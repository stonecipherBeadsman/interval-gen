;(function() {
	'use strict';
	module.exports = inputToArrayAtNewline;

    function inputToArrayAtNewline(data) {
        data = data.split('\n');       
        for (var i = data.length - 1; i >= 0; i--) {
            data[i] = data[i].replace(/\s/g, "");
        }
        return data;
    }	

}());