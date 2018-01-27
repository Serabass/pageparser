var argv = require('minimist')(process.argv.slice(2));

// TODO Add a tty support
// For example: cat file.html | parser ".selector" :fn

var source, selector, processing;

if (argv._.length === 3) {
    [source, selector, processing] = argv._;
} else if (argv._.length === 2) {
    [selector, processing] = argv._;
} else {
    throw new Error(`Wrong arguments count: ${argv._.length}`);
}

var Parser = require('../lib/index');
var fs = require('fs');
var cwd = process.cwd();
var path = require('path');
var extendedConfigPath = path.join(cwd, '.parserconfig.js');

(async () => {
    var parser;
    if (process.stdin.isTTY) {
        // non piped
        parser = new Parser(source);
    } else {
        // piped
        parser = new Parser(process.stdin);
    }

    if (fs.existsSync(extendedConfigPath)) {
        var config = require(extendedConfigPath);
        parser.extend(config);
    }

    var $ = await parser.load();
    let proc = parser.getProcessor(processing);
    let data = await Promise.resolve(proc.processor.call($(selector), ...proc.args));
    console.log(data);
})();