/* eslint-disable no-console */

const readFile = require('fs-readfile-promise');

if (process.argv.length !== 3) {
  console.log('Filename required');
  return;
}

const filename = process.argv[2];

(async () => {
  const data = await readFile(filename, 'utf8');
  const inputs = data.split('\n').filter(Boolean);
  const result = inputs.reduce((acc, curr) => acc + Number(curr), 0);
  console.log(result);
})();
