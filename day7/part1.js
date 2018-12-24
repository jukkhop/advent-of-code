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
      prevStep = { id: prev, nextSteps: [] };
      acc.push(prevStep);
    }
    if (!nextStep) {
      nextStep = { id: next, nextSteps: [] };
      acc.push(nextStep);
    }

    prevStep.nextSteps.push(nextStep);
    return acc;
  }, []);

  let availableSteps = findAvailableSteps(allSteps);
  const takenSteps = [];

  while (availableSteps.length > 0) {
    availableSteps = _.sortBy(availableSteps, 'id');

    const step = availableSteps.shift();
    step.completed = true;
    takenSteps.push(step.id);

    const remainingSteps = allSteps.filter(s => !s.completed);
    availableSteps = findAvailableSteps(remainingSteps);
  }

  return takenSteps.join('');
};
