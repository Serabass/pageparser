var argv = require('minimist')(process.argv.slice(2));

// TODO Add a tty support
// For example: cat file.html | parser ".selector" :fn

var [url, selector, processing] = argv._;
var Parser = require('../lib/index');
var fs = require('fs');
var cwd = process.cwd();
var path = require('path');
var extendedConfigPath = path.join(cwd, '.parserconfig.js');

(async () => {
  var parser = new Parser({
    url: url
  });

  if (fs.existsSync(extendedConfigPath)) {
    var config = require(extendedConfigPath);
    parser.extend(config);
  }

  var $ = await parser.load();
  let proc = parser.getProcessor(processing);
  let data = await Promise.resolve(proc.processor.call($(selector), ...proc.args));
  console.log(data);
})();
