
import * as fs from "fs";

export type ReadableSource = string | fs.ReadStream;

export type ParserFunction = (...args: any[]) => any;

export interface IParserExtraOptions {
    xmlMode: boolean;
}

export interface IParserProcessors {
    [name: string]: ParserFunction;
}

export interface IParserConfig {
    processors: IParserProcessors;
    plugins: any;
    customSelectors: any;
}
