/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const readFile = require('fs-readfile-promise');

if (process.argv.length !== 4) {
  console.log('Script and input required');
  return;
}

const scriptname = process.argv[2];
const filename = process.argv[3];

(async () => {
  const data = await readFile(filename, 'utf8');
  const func = require(`./${scriptname}`);
  const result = func(data.split('\n').filter(Boolean));

  if (result) {
    console.log(result);
  }
})();
