var path = require('path');
var setUtcOffset = require(path.resolve(__dirname, "../Helper/setUtcOffset.js"));
var should = require('chai').should();

describe('setUtcOffset Test', function() {

	it('Should return 5 for true and 0 for false', function() {

		setUtcOffset(true).should.be.equal(5);
		setUtcOffset(false).should.be.equal(0);

	});

});