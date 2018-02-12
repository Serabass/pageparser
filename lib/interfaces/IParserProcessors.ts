import {ParserFunction} from "../types";

export interface IParserProcessors {
    [name: string]: ParserFunction;
}
