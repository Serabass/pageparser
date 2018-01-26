var Parser = require('./lib/index');

(async () => {
  var parser = new Parser({
    url: 'https://www.kinopoisk.ru/'
  });

  var $ = await parse('https://www.kinopoisk.ru/');
  var s = $('#top_menu').html();
  debugger;
})();
