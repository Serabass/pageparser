import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite';
import Parser from '../lib/parser';

describe('Parser', function () {
    this.timeout(10000);
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

        it('URL test with transform', async () => {
            var parser = new Parser('http://example.com/');
            parser.transform(data => iconv.decode(data, 'win1251'));

            assert.notEqual(parser, void 0);
            assert.equal(typeof parser.load, 'function');
            var $ = await parser.load();
            assert.equal(typeof $, 'function');
            assert.equal($('h1').html(), 'Example Domain');
            assert.equal($('p a').attr('href'), 'http://www.iana.org/domains/example');
        });

        xit('Custom selector (under construction)', async () => {

        });

        xit('XML (under construction)', async () => {
            // ...
        });
    });
});