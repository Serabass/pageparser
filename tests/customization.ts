import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";
import {Parser} from "../lib/parser";
import {ParserType} from "../lib/parser";

describe("#customization", function() {
    this.timeout(10000);
    it("Selector piping", async () => {
        const filePath = path.join(__dirname, "testpage.html");
        const stream = fs.createReadStream(filePath);
        const parser = new Parser(stream);
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(typeof $, "function");
        const $ul = $("ul.has-li | .has-two-children");
        assert.equal($ul.length, 1);
        assert.equal($ul.children().length, 2);
    });

    it("Selector piping with custom function", async () => {
        const filePath = path.join(__dirname, "testpage.html");
        const stream = fs.createReadStream(filePath);
        const parser = new Parser(stream);
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(typeof $, "function");
        const $ul = $("ul.has-li | %has2Children");
        assert.equal($ul.length, 1);
        assert.equal($ul.children().length, 2);
        const $ul2 = $("ul.has-li | %hasNChildren : 2");
        assert.equal($ul2.length, 1);
        assert.equal($ul2.children().length, 2);
    });

    it("Selector piping with custom function with string argument", async () => {
        const filePath = path.join(__dirname, "testpage.html");
        const stream = fs.createReadStream(filePath);
        const parser = new Parser(stream);
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(typeof $, "function");
        const $ul = $("ul.has-li | %hasChildrenWithTag : li");
        assert.equal($ul.length, 1);
        const $ul2 = $("ul.has-li | %hasChildrenWithTag : a");
        assert.equal($ul2.length, 0);
    });

    it("Test plugin", async () => {
        const filePath = path.join(__dirname, "testpage.html");
        const stream = fs.createReadStream(filePath);
        const parser = new Parser(stream);
        assert.notEqual(parser, void 0);
        assert.equal(typeof parser.load, "function");
        const $ = await parser.load();
        assert.equal(typeof $, "function");
        const $deepElement = $(".we > .need > .to > .go > .deeper");
        assert.equal(typeof $deepElement.test, "function");
        assert.equal(typeof $.fn.test, "function");
        assert.equal($deepElement.test(), "test plugin");
        assert.equal($deepElement.htmlReversed(), $deepElement.html().split("").reverse().join(""));
    });
});
