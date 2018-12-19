const _ = require('lodash');

const initFabric = (array, value) => {
  _.forEach(_.range(array.length), (_val, idx) => {
    array[idx] = new Array(array.length); // eslint-disable-line
    _.fill(array[idx], value);
  });
};

const processClaim = claim => {
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
  const claims = inputs.map(processClaim);
  const fabric = new Array(2000);
  initFabric(fabric, 0);

  // Make claims
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
        }
      });
    });
  });

  // Check claims
  _.forEach(claims, claim => {
    const { claimId, startX, endX, startY, endY } = claim;
    const rangeX = _.range(startX, endX);
    const rangeY = _.range(startY, endY);
    let overlaps = false;

    _.forEach(rangeX, x => {
      _.forEach(rangeY, y => {
        if (fabric[x][y] !== claimId) {
          overlaps = true;
        }
      });
    });

    if (!overlaps) {
      console.log(claimId); // eslint-disable-line
    }
  });
};
