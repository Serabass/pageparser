module.exports = {
  processors: {
    // May return Promise
    kp() {
      return this
        .toArray()
        .map(el => el.children.map(x => x.data).join(''));
    }
  }
};
