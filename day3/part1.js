const _ = require('lodash');

const createFabric = (array, value) => {
  _.forEach(_.range(array.length), (_val, idx) => {
    array[idx] = new Array(array.length); // eslint-disable-line
    _.fill(array[idx], value);
  });
};

const mapClaim = claim => {
  const colonIdx = claim.indexOf(':');
  const claimId = claim.substring(1, claim.indexOf(' '));
  const claimMargins = claim.substring(claim.indexOf('@') + 2, colonIdx);
  const claimCoords = claim.substring(colonIdx + 2);
  const [marginLeft, marginTop] = claimMargins.split(',').map(Number);
  const [width, height] = claimCoords.split('x').map(Number);
  const startX = marginLeft + 1;
  const startY = marginTop + 1;
  const endX = startX + width;
  const endY = startY + height;
  return { claimId, startX, startY, endX, endY };
};

module.exports = inputs => {
  const claims = inputs.map(mapClaim);
  const fabric = new Array(2000);
  createFabric(fabric, 0);
  let overlaps = 0;

  // Make claims and count overlaps
  _.forEach(claims, claim => {
    const { claimId, startX, endX, startY, endY } = claim;
    const rangeX = _.range(startX, endX);
    const rangeY = _.range(startY, endY);

    _.forEach(rangeX, x => {
      _.forEach(rangeY, y => {
        if (fabric[x][y] === 0) {
          fabric[x][y] = claimId;
        } else if (fabric[x][y] !== 'X') {
          fabric[x][y] = 'X';
          overlaps += 1;
        }
      });
    });
  });

  return overlaps;
};
