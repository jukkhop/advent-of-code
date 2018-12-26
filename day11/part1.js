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

const totalPower = (grid, x, y) => {
  let power = 0;

  for (let xSquare = x; xSquare < x + 3; xSquare += 1) {
    for (let ySquare = y; ySquare < y + 3; ySquare += 1) {
      power += grid[xSquare][ySquare];
    }
  }

  return power;
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

  const power = [];
  const SQUARE_SIZE = 3;
  const last = GRID_SIZE - SQUARE_SIZE;

  _.range(0, last + 1).forEach(x => {
    _.range(0, last + 1).forEach(y => {
      power.push({
        x,
        y,
        value: totalPower(grid, x, y),
      });
    });
  });

  return _.maxBy(power, 'value');
};
