import {PluginFunction} from "../types";

export interface IParserPlugins {
    [name: string]: PluginFunction;
}
