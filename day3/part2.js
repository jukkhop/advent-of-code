const tmpl = require('reverse-string-template');
const _ = require('lodash');

const mapInput = input =>
  tmpl(input, '#`id` @ `mLeft`,`mRight`: `width`x`height`', {
    delimiters: ['`', '`'],
  });

const mapClaim = input => {
  const { id, mLeft, mRight, width, height } = mapInput(input);
  const startX = Number(mLeft) + 1;
  const startY = Number(mRight) + 1;
  const endX = startX + Number(width);
  const endY = startY + Number(height);
  return { id, startX, startY, endX, endY };
};

module.exports = inputs => {
  const claims = inputs.map(mapClaim);
  const fabric = [];

  // Make claims
  _.forEach(claims, claim => {
    const { id, startX, endX, startY, endY } = claim;

    _.forEach(_.range(startX, endX), x => {
      _.forEach(_.range(startY, endY), y => {
        if (!fabric[x]) {
          fabric[x] = [];
        }
        if (!fabric[x][y]) {
          fabric[x][y] = id;
        } else if (fabric[x][y] !== 'X') {
          fabric[x][y] = 'X';
        }
      });
    });
  });

  // Check claims
  _.forEach(claims, claim => {
    const { id, startX, endX, startY, endY } = claim;
    let overlaps = false;

    _.forEach(_.range(startX, endX), x => {
      _.forEach(_.range(startY, endY), y => {
        if (fabric[x][y] !== id) {
          overlaps = true;
        }
      });
    });

    if (!overlaps) {
      console.log(id); // eslint-disable-line
    }
  });
};
