var Parser = require('./lib/index');

(async () => {
    var result = await Parser.process('tests/testpage.html', '.we > .need > .to > .go > .deeper', ':html');
    console.log(result);
})();
