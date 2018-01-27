var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');
var fs = require('fs'); // TODO Use fs-promise
var config = require('./config-default');
var deepExtend = require('deep-extend');
var stream = require('stream');
var streamToPromise = require('stream-to-promise');
// https://stackoverflow.com/questions/23885095/nodejs-check-if-variable-is-readable-stream

class Parser {

    constructor(source, extraOptions) {
        this.source = source;
        this.config = config;
        this.extraOptions = extraOptions;
    }

    load() {
        return new Promise((resolve, reject) => {
            var stream = this.read();
            streamToPromise(stream).then(function (buffer) {
                let data = buffer.toString();
                let $ = cheerio.load(data);
                resolve($);
            });
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
}

Parser.URL = 'URL';
Parser.PIPED = 'PIPED';
Parser.FILE = 'FILE';

module.exports = Parser;
