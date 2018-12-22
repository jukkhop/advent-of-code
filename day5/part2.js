const _ = require('lodash');

const react = polymer => {
  const units = [...polymer];
  let ready = false;

  const loop = (curr, idx) => {
    if (idx < units.length - 1) {
      const prev = units[idx + 1];
      const sameType = curr.toLowerCase() === prev.toLowerCase();
      const currCase = curr === curr.toLowerCase();
      const nextCase = prev === prev.toLowerCase();

      if (sameType && currCase !== nextCase) {
        units.splice(idx, 2);
        ready = false;
      }
    }
  };

  while (!ready) {
    ready = true;
    _.forEachRight(units, loop);
  }

  return units;
};

module.exports = ([data]) => {
  const units = [...data];
  const types = _.uniq(_.toLower(data));

  const shortest = types.reduce((acc, type) => {
    const polymer = _.without(units, type, type.toUpperCase());
    const result = react(polymer);
    return Math.min(result.length, acc);
  }, Number.MAX_SAFE_INTEGER);

  return shortest;
};
