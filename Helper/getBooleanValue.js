;(function() {
    'use strict';
    module.exports = getBooleanValue;

    function getBooleanValue(value) {
        if (value === undefined) {
            return Math.random() >= 0.5;
        } else {
            return Math.random() >= value;
        }
    }
}());