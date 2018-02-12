import {IParserConfig} from "./interfaces/IParserConfig";

let config: IParserConfig = {
    plugins: {},
    customSelectors: {},
    processors: {
        html: (element: any) => element.first().html(),
        text: (element: any) => element.first().text(),
        attr: (element: any, name: string) => element.first().attr(name),
        prop: (element: any, name: string) => element.first().prop(name),
        count: (element: any) => element.length,
        val: (element: any) => element.first().val(),
    },
};
export default config;
