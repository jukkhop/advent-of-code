const _ = require('lodash');

module.exports = inputs => {
  const common = inputs.reduce((acc1, id, i) => {
    const sub = inputs.reduce((acc2, other, j) => {
      if (acc2) {
        return acc2;
      }
      if (j <= i) {
        return acc2;
      }

      return [...id].reduce((acc3, _c, k) => {
        if (acc3) {
          return acc3;
        }

        const first = _.filter([...id], (_v, m) => m !== k);
        const second = _.filter([...other], (_v, m) => m !== k);

        const equal = _.isEqual(first, second);
        return equal ? first : false;
      }, false);
    }, false);

    return sub ? acc1.concat(sub) : acc1;
  }, []);

  return common.join('');
};
