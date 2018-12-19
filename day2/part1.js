const _ = require('lodash');

module.exports = inputs => {
  const numbers = [2, 3];

  const counts = inputs.map(id => {
    let letters = [...id].reduce((acc, curr) => {
      if (!acc[curr]) {
        acc[curr] = 0;
      }
      acc[curr] += 1;
      return acc;
    }, {});

    letters = _.map(letters, (value, key) => ({ key, value }));

    return numbers.reduce((acc, curr) => {
      acc[curr] = _.some(letters, { value: curr });
      return acc;
    }, {});
  });

  return numbers.reduce((acc, curr) => {
    const sum = _.sumBy(counts, curr);
    return sum * acc;
  }, 1);
};
