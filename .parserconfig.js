module.exports = {
    plugins: {},
    customSelectors: {},
    processors: {
        // May return Promise
        textOfSubElement(element) {
            return element.find('p a').text();
        }
    }
};
