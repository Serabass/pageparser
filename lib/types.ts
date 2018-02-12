import * as fs from "fs";

export type ReadableSource = string | fs.ReadStream;
export type ParserFunction = (...args: any[]) => any;
