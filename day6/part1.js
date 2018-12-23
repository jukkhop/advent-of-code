const tmpl = require('reverse-string-template');
const _ = require('lodash');

const distance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
const coord2str = (x, y) => `${x},${y}`;

module.exports = data => {
  const areas = data
    .map(input => tmpl(input, '{{x}}, {{y}}'))
    .map(({ x, y }) => ({
      x: Number(x),
      y: Number(y),
      key: coord2str(x, y),
    }));

  const xMin = _.minBy(areas, 'x').x;
  const xMax = _.maxBy(areas, 'x').x;
  const yMin = _.minBy(areas, 'y').y;
  const yMax = _.maxBy(areas, 'y').y;
  const locations = [];

  _.forEach(_.range(xMin, xMax + 1), x => {
    _.forEach(_.range(yMin, yMax + 1), y => {
      if (!locations[x]) {
        locations[x] = [];
      }

      const closest = areas.reduce((acc, area) => {
        const dist = distance(x, y, area.x, area.y);

        if (acc.length === 0 || dist < acc[0].dist) {
          return [{ ...area, dist }];
        }

        if (dist === acc[0].dist) {
          return acc.concat({ ...area, dist });
        }

        return acc;
      }, []);

      if (closest.length === 1) {
        locations[x][y] = closest[0].key;
      }
    });
  });

  const nonInfiniteAreas = _.reject(areas, ({ key }) => {
    for (let x = xMin; x <= xMax; x += 1) {
      if (locations[x][yMin] === key || locations[x][yMax] === key) {
        return true;
      }
    }
    for (let y = yMin; y <= yMax; y += 1) {
      if (locations[xMin][y] === key || locations[xMax][y] === key) {
        return true;
      }
    }
    return false;
  });

  const largestArea = nonInfiniteAreas.reduce(
    (acc, area) => {
      const points = [];

      _.forEach(_.range(xMin, xMax + 1), x => {
        _.forEach(_.range(yMin, yMax + 1), y => {
          if (locations[x][y] === area.key) {
            points.push({ x, y });
          }
        });
      });

      return points.length > acc.points.length ? { ...area, points } : acc;
    },
    { points: [] },
  );

  return largestArea.points.length;
};
