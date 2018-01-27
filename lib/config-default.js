module.exports = {
    plugins: {},
    customSelectors: {},
    processors: {
        html(element) {
            return element.first().html();
        },

        attr(element, name) {
            return element.first().attr(name);
        },

        prop(element, name) {
            return element.first().prop(name);
        },

        count(element) {
            return element.length;
        },

        val(element) {
            return element.first().val();
        }
    }
};
