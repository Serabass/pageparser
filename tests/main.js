var assert = require('assert'),
    Parser = require('../lib/index'),
    path = require('path'),
    fs = require('fs');

describe('Parser', function () {
    this.timeout(5000);
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
            assert.equal($('p a').attr('href'), 'http://www.iana.org/domains/example');
        });

        it('File Parser simple test', async () => {
            let filePath = path.join(__dirname, 'testpage.html');
            var parser = new Parser(filePath);
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

        it('ReadStream Parser simple test', async () => {
            let filePath = path.join(__dirname, 'testpage.html');
            var stream = fs.createReadStream(filePath);
            var parser = new Parser(stream);
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

        xit('Custom selector (under construction)', async () => {

        });

        xit('XML (under construction)', async () => {
            // ...
        });
    });

    describe('#process', () => {
        it('Call process static method', async function () {
            let actual = await Parser.process('http://example.com/', 'h1', ':html');
            assert.equal(actual, 'Example Domain');
            let count = await Parser.process('http://example.com/', 'h1', ':count');
            assert.equal(count, 1);
        });

        it('Call process static method (attr processor)', async function () {
            let href = await Parser.process('http://example.com/', 'p a', ':attr:href');
            assert.equal(href, 'http://www.iana.org/domains/example');
        });

        it('Call process static method (prop processor)', async function () {
            let tagName = await Parser.process('http://example.com/', 'h1', ':prop:tagName');
            assert.equal(tagName, 'H1');
        });

        it('Call process static with unknown processor', async function () {
            let actual = await Parser.process('http://example.com/', 'h1', ':iAmNotExist');
            assert.equal(typeof actual, 'object');
        });
    });
});