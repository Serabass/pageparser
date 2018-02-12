import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";
import {Parser} from "../lib/parser";
import {ParserType} from "../lib/parser";

describe("#load", function() {
    this.timeout(10000);
    it("all the constants should equal", () => {
        assert.equal(ParserType.URL, "URL");
        assert.equal(ParserType.STREAM, "STREAM");
        assert.equal(ParserType.FILE, "FILE");
    });

    it("URL Parser simple test", async () => {
        const parser = new Parser("http://example.com/");
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        assert.equal(parser.contents, void 0);
        const $ = await parser.load();
        assert.equal(parser.type, ParserType.URL);
        assert.notEqual(parser.contents, void 0);
        assert.equal(typeof $, "function");
        assert.equal($("h1").html(), "Example Domain");
        assert.equal($("p a").attr("href"), "http://www.iana.org/domains/example");
    });

    it("File Parser simple test", async () => {
        const filePath = path.join(__dirname, "testpage.html");
        const parser = new Parser(filePath);
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(parser.type, ParserType.FILE);
        assert.equal(typeof $, "function");
        const $h1 = $("h1");
        assert.equal($h1.length, 1);
        assert.equal($h1.html(), "Example page");
        const $deepElement = $(".we > .need > .to > .go > .deeper");
        assert.equal($deepElement.length, 1);
        assert.equal($deepElement.html(), ":)");
    });

    it("ReadStream Parser simple test", async () => {
        const filePath = path.join(__dirname, "testpage.html");
        const stream = fs.createReadStream(filePath);
        const parser = new Parser(stream);
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(parser.type, ParserType.STREAM);
        assert.equal(typeof $, "function");
        const $h1 = $("h1");
        assert.equal($h1.length, 1);
        assert.equal($h1.html(), "Example page");
        const $deepElement = $(".we > .need > .to > .go > .deeper");
        assert.equal($deepElement.length, 1);
        assert.equal($deepElement.html(), ":)");
    });

    it("URL test with transform", async () => {
        const parser = new Parser("http://example.com/");
        parser.transform((data: any) => iconv.decode(data, "win1251"));

        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(typeof $, "function");
        assert.equal($("h1").html(), "Example Domain");
        assert.equal($("p a").attr("href"), "http://www.iana.org/domains/example");
    });

    xit("XML", async () => {
        // ...
    });
});
