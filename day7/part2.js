const tmpl = require('reverse-string-template');
const _ = require('lodash');

const mapInput = input =>
  tmpl(input, 'Step {{prev}} must be finished before step {{next}} can begin.');

const prevStepsCompleted = (remainingSteps, { id }) =>
  remainingSteps.every(step => step.nextSteps.every(s => s.id !== id));

const findAvailableSteps = remainingSteps =>
  remainingSteps.reduce(
    (acc, step) =>
      prevStepsCompleted(remainingSteps, step) ? acc.concat(step) : acc,
    [],
  );

module.exports = data => {
  const rules = data.map(mapInput);
  const allSteps = rules.reduce((acc, { prev, next }) => {
    let prevStep = _.find(acc, { id: prev });
    let nextStep = _.find(acc, { id: next });

    if (!prevStep) {
      prevStep = { id: prev, nextSteps: [], secsLeft: prev.charCodeAt(0) - 4 };
      acc.push(prevStep);
    }
    if (!nextStep) {
      nextStep = { id: next, nextSteps: [], secsLeft: next.charCodeAt(0) - 4 };
      acc.push(nextStep);
    }

    prevStep.nextSteps.push(nextStep);
    return acc;
  }, []);

  let availableSteps = findAvailableSteps(allSteps);
  let seconds = 0;
  const workers = 5;

  while (availableSteps.length > 0) {
    availableSteps = _.sortBy(availableSteps, ['inProgress', 'id']);

    for (let i = 0; i < workers; i += 1) {
      const step = availableSteps[i];

      if (step && step.secsLeft > 0) {
        step.inProgress = true;
        step.secsLeft -= 1;
      }
    }

    const remainingSteps = allSteps.filter(s => s.secsLeft > 0);
    availableSteps = findAvailableSteps(remainingSteps);
    seconds += 1;
  }

  return seconds;
};
