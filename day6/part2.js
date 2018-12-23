const tmpl = require('reverse-string-template');
const _ = require('lodash');

const distance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

const distanceSum = (areas, x, y) =>
  areas.reduce((sum, area) => sum + distance(x, y, area.x, area.y), 0);

module.exports = data => {
  const areas = data
    .map(input => tmpl(input, '{{x}}, {{y}}'))
    .map(({ x, y }) => ({
      x: Number(x),
      y: Number(y),
    }));

  const xMin = _.minBy(areas, 'x').x;
  const xMax = _.maxBy(areas, 'x').x;
  const yMin = _.minBy(areas, 'y').y;
  const yMax = _.maxBy(areas, 'y').y;
  const points = [];
  const maxSum = 10000;

  _.forEach(_.range(xMin, xMax + 1), x => {
    _.forEach(_.range(yMin, yMax + 1), y => {
      if (distanceSum(areas, x, y) < maxSum) {
        points.push({ x, y });
      }
    });
  });

  return points.length;
};
