var Parser = require('./lib/index');

(async () => {
  var parser = new Parser({
    url: 'https://www.kinopoisk.ru/top/navigator/m_act%5Bgenre%5D/8/order/rating/page/2/'
  });

  var $ = await parser.load('https://www.kinopoisk.ru/top/navigator/m_act%5Bgenre%5D/8/order/rating/page/2/');
  var s = $('#itemList .item .info .name a').map(function () {
    debugger;
    return this.children.map(x => x.data).join('');
  });
  debugger;
})();
