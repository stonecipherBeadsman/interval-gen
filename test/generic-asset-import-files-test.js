var path = require("path");
var genericAssetImportFileCreation = require(path.resolve(__dirname,"../Helper/genericAssetImportFileCreation.js"));
var should = require('chai').should();
var meterList = ['a', 'b', 'c'];
var resultArray = ['a,ACTIVE,1,9,aclara,KWH,01/01/2014,,a,,,,,,,,63303,,,,,,,,,,,,intervalGenScript@nisc,,,intervalGenScript@nisc,SERVICE,,sla,,,,,,,,,,,,1,ELECTRIC_METER',
			  	   'b,ACTIVE,1,9,aclara,KWH,01/01/2014,,b,,,,,,,,63303,,,,,,,,,,,,intervalGenScript@nisc,,,intervalGenScript@nisc,SERVICE,,slb,,,,,,,,,,,,1,ELECTRIC_METER',
			  	   'c,ACTIVE,1,9,aclara,KWH,01/01/2014,,c,,,,,,,,63303,,,,,,,,,,,,intervalGenScript@nisc,,,intervalGenScript@nisc,SERVICE,,slc,,,,,,,,,,,,1,ELECTRIC_METER'];
var resultArray2 = ['a,ACTIVE,1,9,aclara,KWH,01/01/2014,,a,,,,,,,,63303,,,,,,,,,,,,prospero@CloudIsland,,,prospero@CloudIsland,SERVICE,,sla,,,,,,,,,,,,1,ELECTRIC_METER',
			  	   'b,ACTIVE,1,9,aclara,KWH,01/01/2014,,b,,,,,,,,63303,,,,,,,,,,,,prospero@CloudIsland,,,prospero@CloudIsland,SERVICE,,slb,,,,,,,,,,,,1,ELECTRIC_METER',
			  	   'c,ACTIVE,1,9,aclara,KWH,01/01/2014,,c,,,,,,,,63303,,,,,,,,,,,,prospero@CloudIsland,,,prospero@CloudIsland,SERVICE,,slc,,,,,,,,,,,,1,ELECTRIC_METER'];

var result = '';
var result2 = '';
function buildResults(resultsArray) {
	var resultsString = '';
	for (var i = 0; i < resultsArray.length; i++) {
		resultsString += resultsArray[i] + '\n';
	}
	return resultsString;
}
before(function() {
	 result = buildResults(resultArray);
	 result2 = buildResults(resultArray2);
});

describe('genericAssetImportFileCreation Test', function() {
	
	it('createAssetsFromList Should take a list of meter numbers and\n\t create a set of generic Asset Import lines', function() {
		genericAssetImportFileCreation.createAssetsFromList(meterList).should.be.equal(result);
	});
	it('createAssetsFromList Should take a list of meter numbers and\n\t create a set of generic Asset Import lines with an edited owner', function() {
		genericAssetImportFileCreation.createAssetsFromList(meterList, 'prospero@CloudIsland').should.be.equal(result2);
	});

});