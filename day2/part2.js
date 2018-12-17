/* eslint-disable no-console */

const readFile = require('fs-readfile-promise');
const _ = require('lodash');

if (process.argv.length !== 3) {
  console.log('Filename required');
  return;
}

const filename = process.argv[2];

(async () => {
  const data = await readFile(filename, 'utf8');
  const ids = data.split('\n').filter(Boolean);

  const common = ids.reduce((acc1, id, i) => {
    const sub = ids.reduce((acc2, other, j) => {
      if (acc2) {
        return acc2;
      }
      if (j <= i) {
        return acc2;
      }

      return [...id].reduce((acc3, _c, k) => {
        if (acc3) {
          return acc3;
        }

        const first = _.filter([...id], (_v, m) => m !== k);
        const second = _.filter([...other], (_v, m) => m !== k);

        const equal = _.isEqual(first, second);
        return equal ? first : false;
      }, false);
    }, false);

    return sub ? acc1.concat(sub) : acc1;
  }, []);

  console.log(common.join(''));
})();
