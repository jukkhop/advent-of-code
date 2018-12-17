/* eslint-disable no-console */

const readFile = require('fs-readfile-promise');
const _ = require('lodash');

if (process.argv.length !== 3) {
  console.log('Filename required');
  return;
}

const filename = process.argv[2];

const fillArray = (array, value) => {
  _.forEach(_.range(array.length), (_val, idx) => {
    array[idx] = new Array(array.length); // eslint-disable-line
    _.fill(array[idx], value);
  });
};

const processClaims = claims =>
  claims.map(claim => {
    const spaceIdx = claim.indexOf(' ');
    const atIdx = claim.indexOf('@');
    const colonIdx = claim.indexOf(':');
    const claimId = claim.substring(1, spaceIdx);
    const claimMargins = claim.substring(atIdx + 2, colonIdx);
    const claimCoords = claim.substring(colonIdx + 2);
    const [marginLeft, marginTop] = claimMargins.split(',').map(Number);
    const [width, height] = claimCoords.split('x').map(Number);

    const startX = marginLeft + 1;
    const endX = startX + width;
    const startY = marginTop + 1;
    const endY = startY + height;

    return { claimId, startX, endX, startY, endY };
  });

(async () => {
  const data = await readFile(filename, 'utf8');
  const claimStrings = data.split('\n').filter(Boolean);
  const claims = processClaims(claimStrings);

  const fabric = new Array(2000);
  fillArray(fabric, 0);

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
    let overlaps = false;

    const rangeX = _.range(startX, endX);
    const rangeY = _.range(startY, endY);

    _.forEach(rangeX, x => {
      _.forEach(rangeY, y => {
        if (fabric[x][y] !== claimId) {
          overlaps = true;
        }
      });
    });

    if (!overlaps) {
      console.log(claimId);
    }
  });
})();
