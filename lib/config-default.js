module.exports = {
    plugins: {},
    customSelectors: {},
    processors: {
        html: element => element.first().html(),
        attr: (element, name) => element.first().attr(name),
        prop: (element, name) => element.first().prop(name),
        count: element => element.length,
        val: element => element.first().val()
    }
};
