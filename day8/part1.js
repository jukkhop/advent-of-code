const _ = require('lodash');

const parseNode = data => {
  const children = data.shift();
  const metadata = data.shift();
  const result = [];

  _.forEach(_.range(0, children), () => {
    result.push(parseNode(data));
  });

  const entries = data.splice(0, metadata);
  result.unshift(entries);
  return _.flatten(result);
};

module.exports = ([data]) => {
  const entries = parseNode(data.split(' ').map(Number));
  return _.sum(entries);
};
