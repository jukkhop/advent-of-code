/* eslint-disable no-param-reassign */

const tmpl = require('reverse-string-template');
const _ = require('lodash');

const mapInput = data =>
  _.mapValues(
    tmpl(data, '{{players}} players; last marble is worth {{last}} points'),
    value => Number(value),
  );

const insertMarble = (number, current, index) => {
  if (!current) {
    const newMarble = { number };
    newMarble.prev = newMarble;
    newMarble.next = newMarble;
    return newMarble;
  }
  if (index > 0) {
    return insertMarble(number, current.next, index - 1);
  }
  if (index < 0) {
    return insertMarble(number, current.prev, index + 1);
  }

  const newMarble = { number, prev: current.prev, next: current };
  current.prev.next = newMarble;
  current.prev = newMarble;
  return newMarble;
};

const removeMarble = (current, index) => {
  if (index > 0) {
    return removeMarble(current.next, index - 1);
  }
  if (index < 0) {
    return removeMarble(current.prev, index + 1);
  }

  current.prev.next = current.next;
  current.next.prev = current.prev;
  return current;
};

module.exports = ([data]) => {
  const { players, last } = mapInput(data);
  const scores = [];
  let currMarble = null;
  let currNumber = 0;

  while (currNumber < last) {
    for (let i = 0; i < players; i += 1) {
      if (currNumber === 0 || currNumber % 23 !== 0) {
        currMarble = insertMarble(currNumber, currMarble, 2);
      } else {
        if (!scores[i]) {
          scores[i] = 0;
        }
        const removedMarble = removeMarble(currMarble, -7);
        scores[i] += currNumber;
        scores[i] += removedMarble.number;
        currMarble = removedMarble.next;
      }

      currNumber += 1;

      if (currNumber === last) {
        break;
      }
    }
  }

  return _.max(scores);
};
