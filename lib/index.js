var cheerio = require('cheerio');
var request = require('request');
var path = require('path');
var fs = require('fs'); // TODO Use fs-promise
var config = require('./config-default');
var deepExtend = require('deep-extend');
var stream = require('stream');
var streamToPromise = require('stream-to-promise');

class Parser {

    constructor(source, extraOptions) {
        this.source = source;
        this.config = config;

        this.extraOptions = {
            xmlMode: false
        };

        deepExtend(this.extraOptions, extraOptions);
    }

    async load() {
        var stream = this.read();
        var buffer = await streamToPromise(stream);
        var data = buffer.toString();
        return cheerio.load(data, {
            xmlMode: !!this.extraOptions.xmlMode
        });
    }

    read() {
        if (typeof this.source === 'string') {
            if (/^\w+:\/\//.test(this.source))
                return request(this.source);

            if (fs.existsSync(this.source))
                return fs.createReadStream(this.source);

        } else if (this.source instanceof stream.Readable) {
            return this.source;
        }
    }

    extend(config) {
        deepExtend(this.config, config);
        return this;
    }

    getProcessor(string) {
        var noop = function (arg) {
            return arg;
        };
        var [empty, fn, ...args] = string.split(':');

        if (fn in this.config.processors) {
            return {
                processor: this.config.processors[fn],
                args: args || []
            };
        }

        return {
            processor: noop,
            args: []
        };
    }

    static async process(source, selector, processing, extraOptions) {
        var parser = new Parser(source, extraOptions);
        var cwd = process.cwd();
        var extendedConfigPath = path.join(cwd, '.parserconfig.js');

        if (fs.existsSync(extendedConfigPath)) {
            var config = require(extendedConfigPath);
            parser.extend(config);
        }

        var $ = await parser.load();
        let processor = parser.getProcessor(processing);
        let element = $(selector);
        return await Promise.resolve(processor.processor(element, ...processor.args));
    }
}

Parser.URL = 'URL';
Parser.PIPED = 'PIPED';
Parser.FILE = 'FILE';

module.exports = Parser;
