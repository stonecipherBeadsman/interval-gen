;(function(){
	'use strict';
    var fs = require('fs');
    var path = require('path');
	module.exports = makeFile;

    function makeFile(data, fileName) {
    	//http://www.hostingadvice.com/how-to/nodejs__dirname/
        var dir = process.cwd() + '/Output/';
        if (fileName === undefined) {
            fileName = 'Meter_Readings';
        } else {
            fileName = fileName.toString();
        }
        var writer = data;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFile(dir + fileName + '.txt', writer, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved ' + fileName + '.txt');
        });
    }
}());