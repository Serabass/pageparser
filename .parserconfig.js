module.exports = {
  plugins: {},
  customSelectors: {
    has2Children(query) {
      return query.filter(function() {
        return this.childNodes
          .filter(n => n.type !== 'text')
          .length === 2;
      });
    },
    hasNChildren(query, count) {
      return query.filter(function() {
        return this.childNodes
          .filter(n => n.type !== 'text')
          .length === count;
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
