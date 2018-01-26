var Parser = require('./lib/index');

(async () => {
  var parser = new Parser({
    url: 'http://example.com/'
  });
  var $ = await parser.load('http://example.com/');
  var s = $('h1').html();
  debugger;
})();
