const tmpl = require('reverse-string-template');
const _ = require('lodash');
const moment = require('moment');

const mapInput = input =>
  tmpl(input, '[{{date}}] Guard #{{guardId}} {{verb}} {{noun}}') ||
  tmpl(input, '[{{date}}] {{verb}}');

module.exports = data => {
  const inputs = data.map(mapInput).map(({ date, ...input }) => ({
    date: moment(date),
    ...input,
  }));
  const sortedInputs = _.sortBy(inputs, 'date');
  const sleepMinutes = {};
  let currentGuard = null;
  let sleepStarted = null;

  _.forEach(sortedInputs, ({ verb, guardId, date }) => {
    switch (verb) {
      case 'begins':
        currentGuard = guardId;
        break;
      case 'falls asleep':
        sleepStarted = date.minutes();
        break;
      case 'wakes up':
        if (!sleepMinutes[currentGuard]) {
          sleepMinutes[currentGuard] = {};
        }
        _.forEach(_.range(sleepStarted, date.minutes()), minute => {
          if (!sleepMinutes[currentGuard][minute]) {
            sleepMinutes[currentGuard][minute] = 0;
          }
          sleepMinutes[currentGuard][minute] += 1;
        });
        break;
      default:
    }
  });

  let mostSleptGuard = null;
  let mostSleptMinutes = 0;

  _.forEach(sleepMinutes, (minutes, guard) => {
    let sleptMinutes = 0;

    _.forEach(minutes, count => {
      sleptMinutes += count;
    });

    if (sleptMinutes > mostSleptMinutes) {
      mostSleptGuard = guard;
      mostSleptMinutes = sleptMinutes;
    }
  });

  let bestMinute = null;
  let bestMinuteCount = 0;

  _.forEach(sleepMinutes[mostSleptGuard], (count, minute) => {
    if (count > bestMinuteCount) {
      bestMinute = minute;
      bestMinuteCount = count;
    }
  });

  return Number(mostSleptGuard) * bestMinute;
};
