module.exports = {
  processors: {
    html() {
      return this.html();
    },

    attr(name) {
      return this.attr(name);
    },

    prop(name) {
      return this.prop(name);
    },

    count() {
      return this.length;
    },

    val() {
      return this.val();
    }
  }
};
