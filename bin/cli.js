var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var fs = require('fs');

// For example: cat file.html | parser ".selector" :fn

var source, selector, processing;

if (argv._.length === 3) {
    if (!process.stdin.isTTY)
        throw new Error('Three arguments may only passed in tty mode (non pipe)');

    [source, selector, processing] = argv._;
} else if (argv._.length === 2) {

    if (process.stdin.isTTY)
        throw new Error('Two arguments may only passed in non-tty mode (pipe)');

    source = process.stdin;

    [selector, processing] = argv._;
} else if (argv._.length === 0) {

    if (argv['init-config'] === true) {
        var src = path.join(__dirname, '../.parserconfig.js');
        var dest = path.join(process.cwd(), '.parserconfig.js');
        fs.copyFileSync(src, dest);
        console.log('Config file copied successfully');
        return;
    }

    showHelp();
    return;
} else {
    throw new Error(`Wrong arguments count: ${argv._.length}`);
}

var Parser = require('../lib/index');
(async () => {
    let result = await Parser.process(source, selector, processing);
    console.log(result);
})();

function showHelp() {
    console.log('Usage:');
    console.log('   pageparser http://example.com/ "<selector>" :<function>');
    console.log('   cat <file> | pageparser "<selector>" :<function>');
    console.log('   pageparser "<selector>" :<function> < <file>');
    console.log('   pageparser --init-config - Place example .parserconfig.js to cwd');
}