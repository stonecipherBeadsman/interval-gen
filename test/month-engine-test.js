var path = require('path');
var monthEngine = require(path.resolve(__dirname, '../Helper/monthEngine.js'));
var should = require('chai').assert;
var leapYears = [1804, 1808, 1812, 1816, 1820, 1824, 1824, 1832, 1836, 1840, 1844, 1848, 1852, 1856, 1860, 1864, 1868, 1872, 1876, 1880, 1884, 1888, 1892, 1896, 1904, 1908, 1912, 1916, 1920, 1924, 1928, 1932, 1936, 1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096];
var startYear = 1800;
var endYear = 2100;
var months = {
                '1': 31,'2': 28,'3': 31,'4': 30,'5': 31,'6': 30,'7': 31,'8': 31,'9': 30,'10': 31,'11': 30,'12': 31
            };
var monthEngineResult;
var tests = [];
var test = {};


       
	for (var year = startYear; year <= endYear; year++) {
		for (var month = 2; month <= 2; month++) {			
			if (leapYears.indexOf(year)>-1 && month === 2) {
				test.arguments = [year, month]
				test.label = 'Feb in ' + year + ' is a Leap Year.'
				test.expected = 29;
				tests.push(test);
				test = {};
			} else if (month === 2) {
				test.arguments = [year, month]
				test.label = 'Feb in ' + year + ' is a Common Year.'
				test.expected = 28;
				tests.push(test);
				test = {};
			}
		}
	}

describe('monthEngine Test', function() {
	tests.forEach(function(test){
		it(test.label, function(){
			var returnedData = monthEngine.getDaysInMonth.apply(null, test.arguments);
				it.only(test.label, function() {
					assert.equal(returnedData, test.expected)
				});
			})
	});

    it('Should Return the correct number of days for each month', function(done) {

        for (var year = startYear; year <= endYear; year++) {
        	for (var month = 1; month <= 12; month++) {
        		monthEngineResult = monthEngine.getDaysInMonth(year,month);        		
        		if (leapYears.indexOf(year)>-1 && month === 2) {
        			monthEngineResult.should.equal(29);
        		}
        	}
        	if (year === endYear) {
        		done();
        	}
        }

    });

});