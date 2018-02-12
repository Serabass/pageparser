module.exports = {
    plugins: {
        test() {
            return 'test plugin';
        },
        htmlReversed() {
            return this.html().split('').reverse().join('');
        }
    },
    customSelectors: {
        has2Children(query) {
            return query.filter(function () {
                return this.childNodes
                    .filter(n => n.type !== 'text')
                    .length === 2;
            });
        },
        hasNChildren(query, count) {
            return query.filter(function () {
                return this.childNodes
                    .filter(n => n.type !== 'text')
                    .length === count;
            });
        },
        hasChildrenWithTag(query, tagName) {
            return query.filter(function () {
                return this.childNodes
                    .filter(n => n.type !== 'text')
                    .filter(n => n.name.toLowerCase() === tagName.toLowerCase())
                    .length > 1;
            });
        },
    },
    processors: {
        // May return Promise
        textOfSubElement(element) {
            return element.find('p a').text();
        }
    }
};
