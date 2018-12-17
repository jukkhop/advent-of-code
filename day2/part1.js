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

  const numbers = [2, 3];

  const counts = ids.map(id => {
    let letters = [...id].reduce((acc, curr) => {
      if (!acc[curr]) {
        acc[curr] = 0;
      }
      acc[curr] += 1;
      return acc;
    }, {});

    letters = _.map(letters, (value, key) => ({ key, value }));

    return numbers.reduce((acc, curr) => {
      acc[curr] = _.some(letters, { value: curr });
      return acc;
    }, {});
  });

  const product = numbers.reduce((acc, curr) => {
    const sum = _.sumBy(counts, curr);
    return sum * acc;
  }, 1);

  console.log(product);
})();
