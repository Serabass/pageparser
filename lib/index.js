var cheerio = require('cheerio');
var rp = require('request-promise');
var config = require('./config-default');

module.exports = class Parser {
  constructor(args) {
    this.args = args;
    this.config = config;
  }

  load() {
    return rp(this.args)
      .then(function(content) {
        return cheerio.load(content);
      });
  }

  extend(config) {
    config = Object.assign(this.config, config);
    return this;
  }

  getProcessor(string) {
    var noop = function (arg) { return arg; };
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
};
