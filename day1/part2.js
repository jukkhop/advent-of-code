module.exports = data => {
  const inputs = data.map(i => Number(i));

  const memo = {};
  let accum = 0;
  let ready = false;

  const f = (acc, curr) => {
    const next = acc + curr;
    if (!ready && memo[next]) {
      ready = true;
      console.log(next); // eslint-disable-line
    }
    memo[next] = true;
    return next;
  };

  while (!ready) {
    accum = inputs.reduce(f, accum);
  }
};
