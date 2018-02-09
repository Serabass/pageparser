import * as cheerio from "cheerio";
import * as deepExtend from "deep-extend";
import * as fs from "fs"; // TODO Use fs-promise
import * as path from "path";
import * as request from "request";
import * as stream from "stream";
import {config} from "./config-default";
import {IParserExtraOptions, ParserFunction, ReadableSource} from "../globals";
import {IParserConfig} from "../globals";

const streamToPromise = require("stream-to-promise");

export class Parser {

    public static URL = "URL";
    public static PIPED = "PIPED";
    public static FILE = "FILE";

    public static async process(source: ReadableSource, selector: string, processing: string, extraOptions: any = {}) {
        const parser = new Parser(source, extraOptions);
        const cwd = process.cwd();
        const extendedConfigPath = path.join(cwd, ".parserconfig.js");

        if (fs.existsSync(extendedConfigPath)) {
            const requiredConfig = require(extendedConfigPath);
            parser.extend(requiredConfig);
        }

        const $ = await parser.load();
        const processor = parser.getProcessor(processing);
        const element = $(selector);
        return await Promise.resolve(processor.processor(element, ...processor.args));
    }

    // TODO set extended type
    public transforms: ParserFunction[];

    // TODO set extended type
    public extraOptions: IParserExtraOptions;

    // TODO set extended type
    public config: IParserConfig;

    constructor(public source: ReadableSource, extraOptions: object = {}) {

        this.config = config as IParserConfig;

        this.extraOptions = {
            xmlMode: false,
        };

        this.transforms = [];

        deepExtend(this.extraOptions, extraOptions);
    }

    public transform(callback: ParserFunction) {
        this.transforms.push(callback);
        return this;
    }

    public extend(configObject: any) {
        deepExtend(this.config, configObject);
        return this;
    }

    public async load() {
        const readableStream = this.read();
        let data = await streamToPromise(readableStream);

        for (const transform of this.transforms) {
            data = await Promise.resolve(transform(data));
        }

        return cheerio.load(data, {
            xmlMode: this.extraOptions.xmlMode,
        });
    }

    public read() {
        if (typeof this.source === "string") {
            if (/^\w+:\/\//.test(this.source)) {
                return request(this.source);
            }

            if (fs.existsSync(this.source)) {
                return fs.createReadStream(this.source);
            }

        } else if (this.source instanceof stream.Readable) {
            return this.source;
        }
    }

    public getProcessor(name: string) {
        const noop = (arg: any) => arg;
        const [empty, fn, ...args] = name.split(":");

        if (fn in this.config.processors) {
            return {
                processor: this.config.processors[fn],
                args: args || [],
            };
        }

        return {
            processor: noop,
            args: [],
        };
    }
}
