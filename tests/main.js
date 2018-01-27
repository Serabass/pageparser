var assert = require('assert'),
    Parser = require('../lib/index'),
    path = require('path');

describe('Parser', () => {
    describe('#load', () => {
        it('all the constants should equal', () => {
            assert.equal(Parser.URL, 'URL');
            assert.equal(Parser.PIPED, 'PIPED');
            assert.equal(Parser.FILE, 'FILE');
        });

        it('URL Parser simple test', async () => {
            var parser = new Parser('http://example.com/');
            assert.notEqual(parser, void 0);
            assert.equal(typeof parser.load, 'function');
            var $ = await parser.load();
            assert.equal(typeof $, 'function');
            assert.equal($('h1').html(), 'Example Domain');
        });

        it('File Parser simple test', async () => {
            var parser = new Parser(path.join(__dirname, 'testpage.html'));
            assert.notEqual(parser, void 0);
            assert.equal(typeof parser.load, 'function');
            var $ = await parser.load();
            assert.equal(typeof $, 'function');
            let $h1 = $('h1');
            assert.equal($h1.length, 1);
            assert.equal($h1.html(), 'Example page');
            let $deepElement = $('.we > .need > .to > .go > .deeper');
            assert.equal($deepElement.length, 1);
            assert.equal($deepElement.html(), ':)');
        });
    });
});