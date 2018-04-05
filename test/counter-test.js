var path = require("path");
var Counter = require(path.resolve(__dirname, "../Helper/Counter.js"));
var should = require('chai').should();
var counter; 
var counter288;
var counter96;
var counter48;
before(function() {
    counter = new Counter()
    counter288 = new Counter(288)
    counter96 = new Counter(96)
    counter48 = new Counter(48)
    counter24 = new Counter(24)
});

describe('Counter Test', function() {

	it('The Value of a new counter should be 0', function() {
		counter.getValue().should.be.equal(0);
		counter288.getValue().should.be.equal(0);
		counter96.getValue().should.be.equal(0);
		counter48.getValue().should.be.equal(0);
	});
	it('Increment should add the interval to the existing value \n\tand cycle to 0 when the intervals per hour are exhausted', function() {
		counter.increment().should.be.equal(0);
		counter288.increment().should.be.equal(5);
		counter96.increment().should.be.equal(15);
		counter48.increment().should.be.equal(30);
		counter.increment().should.be.equal(0);
		counter288.increment().should.be.equal(10);
		counter96.increment().should.be.equal(30);
		counter48.increment().should.be.equal(0);
		counter.increment().should.be.equal(0);
		counter288.increment().should.be.equal(15);
		counter96.increment().should.be.equal(45);
		counter48.increment().should.be.equal(30);
		counter.increment().should.be.equal(0);
		counter288.increment().should.be.equal(20);
		counter96.increment().should.be.equal(0);
		counter48.increment().should.be.equal(0);
		counter.increment().should.be.equal(0);
		counter288.increment().should.be.equal(25);
		counter96.increment().should.be.equal(15);
		counter48.increment().should.be.equal(30);
	});
	it('turnOver should reset the interval/hr counter to 0', function() {
		counter.turnOver().should.be.equal(0);
		counter288.turnOver().should.be.equal(0);
		counter96.turnOver().should.be.equal(0);
		counter48.turnOver().should.be.equal(0);		
	});
	it('initCountDown should set the countdown to the passed in value', function() {
		counter.initCountDown(4);
		counter.getCurrentCountDownPlaceValue().should.be.equal(4);
		counter.initCountDown(10);
		counter.getCurrentCountDownPlaceValue().should.be.equal(10);
		counter.initCountDown(3);
		counter.getCurrentCountDownPlaceValue().should.be.equal(3);		
	});
	it('decrement should subtract 1 from the countdown value and\n\t return the new value', function() {
		counter.decrement().should.be.equal(2);
		counter.decrement().should.be.equal(1);
		counter.decrement().should.be.equal(0);
	});
	it('getCurrentCountDownPlaceValue should return the value of\n\t the countdown token', function() {
		counter.initCountDown(10);
		counter.getCurrentCountDownPlaceValue().should.be.equal(10);
	});

});