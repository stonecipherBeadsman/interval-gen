var path = require('path');
var fs = require('fs');
var makeFile = require(path.resolve(__dirname, '../Helper/makeFile.js'));
var assert = require('chai').assert;

function getFile(fileName){
	//get list of meters from file
	var filePath = process.cwd() + '/Output/' + fileName + '.txt';
	var fileContents = fs.readFileSync(filePath, {
		encoding: 'utf-8'
	});	
	return fileContents;
}

function deleteFile(fileName){
	var filePath = process.cwd() + '/Output/' + fileName + '.txt';
	fs.unlink(filePath, (err) => {
	  if (err) throw err;
	});
}

describe('makeFile Test', function(){
	it('should create a file and the contents should be \'test\' ', function(){		
		makeFile('test','testFile');
		console.log('Creating testFile');
		setTimeout(function() {
			var returnedData  = getFile('testFile');
			assert.equal(returnedData, 'test');
			deleteFile('testFile');
		}, 100);		
	});
});