import {IParserProcessors} from "./IParserProcessors";

export interface IParserConfig {
    processors: IParserProcessors;
    plugins: any;
    customSelectors: any;
}
