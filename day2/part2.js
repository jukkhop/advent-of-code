const _ = require('lodash');

module.exports = inputs => {
  const result = inputs.reduce((acc, id, idx) => {
    const subResult = inputs.reduce((otherAcc, other, otherIdx) => {
      if (otherAcc) {
        return otherAcc;
      }
      if (otherIdx <= idx) {
        return otherAcc;
      }
      return [...id].reduce((thirdAcc, third, thirdIdx) => {
        if (thirdAcc) {
          return thirdAcc;
        }
        const first = _.filter([...id], (val, i) => i !== thirdIdx);
        const second = _.filter([...other], (val, i) => i !== thirdIdx);
        return _.isEqual(first, second) ? first : false;
      }, false);
    }, false);

    return subResult ? acc.concat(subResult) : acc;
  }, []);

  return result.join('');
};
