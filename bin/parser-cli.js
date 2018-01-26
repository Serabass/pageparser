var argv = require('minimist')(process.argv.slice(2));

// TODO Add a tty support
// For example: cat file.html | parser ".selector" :fn

var [url, selector, processing] = argv._;
var Parser = require('../lib/index');
var fs = require('fs');
var cwd = process.cwd();
var path = require('path');
var extendedConfigPath = path.join(cwd, '.parserconfig.js');


var parser = new Parser({
  url: url
});
if (fs.existsSync(extendedConfigPath)) {
  var config = require(extendedConfigPath);
  parser.extend(config);
}

parser.load().then(function ($) {
  let proc = parser.getProcessor(processing);
  return proc.processor.call($(selector), ...proc.args);
})
  .then(function (data) {
    console.log(data);
  });
