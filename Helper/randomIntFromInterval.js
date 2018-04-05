;(function() {
	'use strict';
	module.exports = randomIntFromInterval;

	function randomIntFromInterval(min,max) {
        var number = (Math.floor((Math.random()*(max-min)+min) * 10000)) / 10000;
        return number;
    }
}());