const _ = require('lodash');

const powerLevel = (serial, x, y) => {
  const rack = x + 10;
  let level = rack * y;
  level += serial;
  level *= rack;
  const digits = level
    .toString(10)
    .split('')
    .map(Number);
  level = digits.length > 2 ? digits[digits.length - 3] : 0;
  return level - 5;
};

const totalPower = (grid, sqSize, x, y) => {
  let power = 0;

  _.range(x, x + sqSize).forEach(xs => {
    _.range(y, y + sqSize).forEach(ys => {
      power += grid[xs][ys];
    });
  });

  return power;
};

const powerIncrease = (grid, sqSize, x, y) => {
  let power = 0;
  const xMax = x + sqSize - 1;
  const yMax = y + sqSize - 1;

  for (let xs = x; xs <= xMax; xs += 1) {
    power += grid[xs][yMax];
  }

  for (let ys = y; ys <= yMax; ys += 1) {
    power += grid[xMax][ys];
  }

  return power - grid[xMax][yMax];
};

module.exports = ([data]) => {
  const serial = Number(data);
  const grid = [];
  const GRID_SIZE = 300;

  _.range(0, GRID_SIZE).forEach(x => {
    _.range(0, GRID_SIZE).forEach(y => {
      if (!grid[x]) {
        grid[x] = [];
      }
      grid[x][y] = powerLevel(serial, x, y);
    });
  });

  let maxKey = null;
  let maxValue = 0;
  let prevPower = {};

  _.range(1, GRID_SIZE + 1).forEach(sqSize => {
    const power = {};
    const last = GRID_SIZE - sqSize;

    _.range(0, last + 1).forEach(x => {
      _.range(0, last + 1).forEach(y => {
        const cachedKey = `${x},${y},${sqSize - 1}`;
        const key = `${x},${y},${sqSize}`;

        if (prevPower[cachedKey]) {
          power[key] = prevPower[cachedKey] + powerIncrease(grid, sqSize, x, y);
        } else {
          power[key] = totalPower(grid, sqSize, x, y);
        }
      });
    });

    Object.keys(power).forEach(key => {
      if (power[key] > maxValue) {
        maxValue = power[key];
        maxKey = key;
      }
    });

    prevPower = power;
  });

  return maxKey;
};
