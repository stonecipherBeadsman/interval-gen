;(function(){
    'use strict';
    module.exports = createLifeLikePseudoRandomInterval;
    var path = require('path');
    var getBooleanValue = require(path.resolve(__dirname, 'getBooleanValue.js'));
    var randomIntFromInterval = require(path.resolve(__dirname, 'randomIntFromInterval.js'));
    var getScaledIntervalBound = require(path.resolve(__dirname, 'getScaledIntervalBound.js'));

    function createLifeLikePseudoRandomInterval(hourOfTheDay, readingsPerDay){
        var multiplier = 1;
        var intervalMultiplier = (readingsPerDay / 24);
        var useMultiplier = readingsPerDay === 24 ? getBooleanValue(0.9) : false;
        if(useMultiplier){
            multiplier = randomIntFromInterval(0, 1);
        }
        if(hourOfTheDay <= 5 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0, 1, intervalMultiplier), getScaledIntervalBound(0.25, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 6 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.2, 1, intervalMultiplier), getScaledIntervalBound(0.75, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 7 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.2, 1, intervalMultiplier), getScaledIntervalBound(1, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 8 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(2, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 10 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.5, 1, intervalMultiplier), getScaledIntervalBound(2, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 11 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(1.75, multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 12 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.25, 1, intervalMultiplier), getScaledIntervalBound(2,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 13 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.75, 1, intervalMultiplier), getScaledIntervalBound(1.75,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 14 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.65, 1, intervalMultiplier), getScaledIntervalBound(1.5,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 15 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.85, 1, intervalMultiplier), getScaledIntervalBound(2.5,  multiplier, intervalMultiplier));
        }else if(hourOfTheDay <= 20 * intervalMultiplier){
            return randomIntFromInterval(getScaledIntervalBound(0.75, 1, intervalMultiplier), getScaledIntervalBound(3.5, multiplier, intervalMultiplier));
        }else{
            return randomIntFromInterval(getScaledIntervalBound(0.05, 1, intervalMultiplier), getScaledIntervalBound(1.25, multiplier, intervalMultiplier));
        }
    }

}());