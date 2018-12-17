/* eslint-disable no-console */

const readFile = require('fs-readfile-promise');

if (process.argv.length !== 3) {
  console.log('Filename required');
  return;
}

const filename = process.argv[2];

(async () => {
  const data = await readFile(filename, 'utf8');
  const inputs = data
    .split('\n')
    .filter(Boolean)
    .map(i => Number(i));

  const memo = {};
  let accum = 0;
  let ready = false;

  const f = (acc, curr) => {
    const next = acc + curr;
    if (!ready && memo[next]) {
      ready = true;
      console.log(next);
    }
    memo[next] = true;
    return next;
  };

  while (!ready) {
    accum = inputs.reduce(f, accum);
  }
})();
