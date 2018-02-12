import * as cheerio from "cheerio";
import * as deepExtend from "deep-extend";
import * as fs from "fs"; // TODO Use fs-promise
import * as path from "path";
import * as request from "request";
import * as stream from "stream";
import * as streamToPromise from "stream-to-promise";
import config from "./config-default";
import {ParserFunction, ReadableSource} from "./types";
import {IParserExtraOptions} from "./interfaces/IParserExtraOptions";
import {IParserConfig} from "./interfaces/IParserConfig";

export enum ParserType {
    URL = "URL",
    STREAM = "STREAM",
    FILE = "FILE",
}

export class Parser {

    public static async process(source: ReadableSource, selector: string, processing: string, extraOptions: any = {}) {
        const parser = new Parser(source, extraOptions);
        const $ = await parser.load();
        const processor = parser.getProcessor(processing);
        const element = $(selector);
        return await Promise.resolve(processor.processor(element, ...processor.args));
    }

    public contents: Buffer;

    // TODO set extended type
    public transforms: ParserFunction[];

    // TODO set extended type
    public extraOptions: IParserExtraOptions;

    // TODO set extended type
    public config: IParserConfig;

    public type: ParserType;

    constructor(public source: ReadableSource, extraOptions: object = {}) {

        this.config = config as IParserConfig;

        this.extraOptions = {
            xmlMode: false,
        };

        this.transforms = [];

        deepExtend(this.extraOptions, extraOptions);

        this.extendFromFileIfExists();
    }

    public transform(callback: ParserFunction) {
        this.transforms.push(callback);
        return this;
    }

    public extend(configObject: any) {
        deepExtend(this.config, configObject);
        return this;
    }

    public async load(): Promise<any> {
        const readableStream = this.read();
        let data: any = await (streamToPromise as any)(readableStream);

        for (const transform of this.transforms) {
            data = await Promise.resolve(transform(data));
        }

        this.contents = data;

        const $ = cheerio.load(data, {
            xmlMode: this.extraOptions.xmlMode,
        });

        const x = () => {
            return (selector: any, ...args: any[]) => {
                let selectorSplitted = selector.split(/\s*\|\s*/);
                let firstElement = selectorSplitted.shift();
                let result = ($ as any)(firstElement, ...args);

                for (let chunk of selectorSplitted) {
                    if (chunk.startsWith("%")) {
                        let [fnName, ...fnArgs] = chunk.substring(1).split(/\s*:\s*/);
                        let custom = this.config.customSelectors;

                        fnArgs = fnArgs.map((arg: any) => {
                            if (/^\d+(?:\.\d+)?$/.test(arg)) {
                                return parseFloat(arg);
                            }

                            return arg;
                        });

                        result = custom[fnName](result, ...fnArgs);
                    } else {
                        result = result.filter(chunk);
                    }
                }

                return result;
            };
        };

        let jQuery = x();

        (jQuery as any).fn = jQuery.prototype = $.prototype;
        deepExtend(jQuery.prototype, this.config.plugins);
        deepExtend(jQuery, $);

        return jQuery;
    }

    public extendFromFileIfExists() {
        const cwd = process.cwd();
        const extendedConfigPath = path.join(cwd, ".parserconfig.js");

        if (fs.existsSync(extendedConfigPath)) {
            const requiredConfig = require(extendedConfigPath);
            this.extend(requiredConfig);
        }

    }

    public read() {
        if (typeof this.source === "string") {
            if (/^\w+:\/\//.test(this.source)) {
                this.type = ParserType.URL;
                return request(this.source);
            }

            if (fs.existsSync(this.source)) {
                this.type = ParserType.FILE;
                return fs.createReadStream(this.source);
            }

        } else if (this.source instanceof stream.Readable) {
            this.type = ParserType.STREAM;
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
