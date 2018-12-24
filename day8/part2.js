const _ = require('lodash');

const getNodeValue = data => {
  const children = data.shift();
  const metadata = data.shift();
  const childValues = [];

  _.forEach(_.range(0, children), i => {
    childValues[i + 1] = getNodeValue(data);
  });

  const entries = data.splice(0, metadata);

  return children
    ? entries.reduce(
        (sum, entry) => (childValues[entry] ? sum + childValues[entry] : sum),
        0,
      )
    : _.sum(entries);
};

module.exports = ([data]) => getNodeValue(data.split(' ').map(Number));
