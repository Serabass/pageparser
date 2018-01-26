module.exports = {
  processors: {
    kp() {
      return this
        .toArray()
        .map(el => el.children.map(x => x.data).join(''));
    }
  }
};
