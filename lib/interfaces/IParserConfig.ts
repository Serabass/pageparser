import {IParserProcessors} from "./IParserProcessors";
import {IParserPlugins} from "./IParserPlugins";

export interface IParserConfig {
    processors: IParserProcessors;
    plugins: IParserPlugins;
    customSelectors: any;
}
