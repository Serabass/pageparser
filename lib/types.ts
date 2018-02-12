import * as fs from "fs";

export type ReadableSource = string | fs.ReadStream;
export type ParserFunction = (element: any, ...args: any[]) => any;
export type PluginFunction = (...args: any[]) => any;
