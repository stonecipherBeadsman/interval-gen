var path = require("path");
var inputToArrayAtNewline = require(path.resolve(__dirname, "../Helper/inputToArrayAtNewline.js"));
var assert = require('chai').assert;

describe('inputToArrayAtNewline Test', function() {
tests = ['123 4567\n1234 567890\n1234567 8909-\njhgfdsdfghj','qwe rtyui\nasdfghjk\nasdf \tghjk\noiuytrejhg'];
	for(var i = 0; i < tests.length; i++) {
		var returnedData = inputToArrayAtNewline(tests[i]);
		var result = tests[i].split('\n');
		for (var r = result.length-1; r >= 0; r--) {
			result[r] = result[r].replace(/\s/g, "");
			it('Should change text to an array with no whitespace: ' + tests[i] + ' -> ' + result , function() {
				assert.equal(returnedData[r], result[r]);
			});
		}

	}

});