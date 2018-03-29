var path = require('path');
var makeFile = require(path.resolve(__dirname, '../Helper/makeFile.js'));
var assert = require('chai').assert;
var mock_fs = require('mock-fs');


mock_fs({
  'path/to/fake/dir': {
    'some-file.txt': 'file content here',
    'empty-dir': {/** empty directory */}
  },
  'path/to/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
  'some/other/path': {/** another empty directory */}
});