/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const tmpl = require('reverse-string-template');
const _ = require('lodash');

const mapInput = input =>
  _.mapValues(
    tmpl(input, 'position=<{{xPos}}, {{yPos}}> velocity=<{{xVel}}, {{yVel}}>'),
    value => Number(value),
  );

const forward = points => {
  for (let i = 0; i < points.length; i += 1) {
    points[i].xPos += points[i].xVel;
    points[i].yPos += points[i].yVel;
  }
};

const rewind = points => {
  for (let i = 0; i < points.length; i += 1) {
    points[i].xPos -= points[i].xVel;
    points[i].yPos -= points[i].yVel;
  }
};

const print = points => {
  const padding = 5;
  const xMin = _.minBy(points, 'xPos').xPos - padding;
  const xMax = _.maxBy(points, 'xPos').xPos + padding;
  const yMin = _.minBy(points, 'yPos').yPos - padding;
  const yMax = _.maxBy(points, 'yPos').yPos + padding;

  _.forEach(_.range(yMin, yMax + 1), y => {
    let line = '';

    _.forEach(_.range(xMin, xMax + 1), x => {
      line += _.some(points, { xPos: x, yPos: y }) ? '#' : '.';
    });

    console.log(line);
  });
};

module.exports = data => {
  const points = data.map(mapInput);
  let secs = 0;
  let stop = false;
  let prevWidth = Number.MAX_SAFE_INTEGER;
  let prevHeight = Number.MAX_SAFE_INTEGER;

  while (!stop) {
    forward(points);
    secs += 1;

    const xMin = _.minBy(points, 'xPos').xPos;
    const xMax = _.maxBy(points, 'xPos').xPos;
    const yMin = _.minBy(points, 'yPos').yPos;
    const yMax = _.maxBy(points, 'yPos').yPos;
    const width = xMax - xMin;
    const height = yMax - yMin;

    if (width > prevWidth && height > prevHeight) {
      rewind(points);
      console.log(`After ${secs - 1} seconds:`);
      print(points);
      stop = true;
    }

    prevWidth = width;
    prevHeight = height;
  }
};
