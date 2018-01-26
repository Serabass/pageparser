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
  }

  getProcessor(string) {
    debugger;
  }
};
