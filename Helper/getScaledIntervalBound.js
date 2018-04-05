;(function() {
	module.exports = getScaledIntervalBound;

   function getScaledIntervalBound(unscaledMax, multiplier, intervalMultiplier) {
        return (unscaledMax / intervalMultiplier)  * multiplier;
    }

}());