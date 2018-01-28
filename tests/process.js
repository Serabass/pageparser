var assert = require('assert'),
    Parser = require('../lib/index');

describe('Parser', function () {
    this.timeout(10000);
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

        it('Call process static method (val processor)', async function () {
            let value = await Parser.process('http://bsime.net/', 'input[type=submit]', ':val');
            assert.equal(value, 'Send Message');
        });

        it('Call process static method (text processor)', async function () {
            let bsime = await Parser.process('http://bsime.net/', '#bsime .wrapper .blurb h2', ':text');
            assert.equal(bsime, 'Black Skies In My Eyes');
            let wtmpm = await Parser.process('http://bsime.net/', '#wtmpm .wrapper .blurb h2', ':text');
            assert.equal(wtmpm, 'When The Music Pierces Me');
        });

        it('Call process static with unknown processor', async function () {
            let actual = await Parser.process('http://example.com/', 'h1', ':iAmNotExist');
            assert.equal(typeof actual, 'object');
        });
    });
});