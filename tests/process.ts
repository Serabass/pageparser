import * as assert from "assert";
import Parser from "../index";

describe("#process", function() {
    this.timeout(10000);
    it("Call process static method", async () => {
        const actual = await Parser.process("http://example.com/", "h1", ":html");
        assert.equal(actual, "Example Domain");
        const count = await Parser.process("http://example.com/", "h1", ":count");
        assert.equal(count, 1);
    });

    it("Call process static method (attr processor)", async () => {
        const href = await Parser.process("http://example.com/", "p a", ":attr:href");
        assert.equal(href, "http://www.iana.org/domains/example");
    });

    it("Call process static method (prop processor)", async () => {
        const tagName = await Parser.process("http://example.com/", "h1", ":prop:tagName");
        assert.equal(tagName, "H1");
    });

    it("Call process static method (val processor)", async () => {
        const value = await Parser.process("http://bsime.net/", "input[type=submit]", ":val");
        assert.equal(value, "Send Message");
    });

    it("Call process static method (text processor)", async () => {
        const bsime = await Parser.process("http://bsime.net/", "#bsime .wrapper .blurb h2", ":text");
        assert.equal(bsime, "Black Skies In My Eyes");
        const wtmpm = await Parser.process("http://bsime.net/", "#wtmpm .wrapper .blurb h2", ":text");
        assert.equal(wtmpm, "When The Music Pierces Me");
    });

    it("Call process static with unknown processor", async () => {
        const actual = await Parser.process("http://example.com/", "h1", ":iAmNotExist");
        assert.equal(typeof actual, "object");
    });

    it("Call process static with custom processor", async () => {
        const actual = await Parser.process("http://example.com/", "body div", ":textOfSubElement");
        assert.equal(actual, "More information...");
    });
});
