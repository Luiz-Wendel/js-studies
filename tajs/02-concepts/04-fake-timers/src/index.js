import Task from "./task.js";

const oneSecond = 1000;
const runInASecond = new Date(Date.now() + oneSecond);
const runInTwoSeconds = new Date(Date.now() + oneSecond * 2);
const runInThreeSeconds = new Date(Date.now() + oneSecond * 3);

const task = new Task();

task.save({
  name: 'task 1',
  dueAt: runInASecond,
  fn: () => console.log('task 1 executed'),
});

task.save({
  name: 'task 2',
  dueAt: runInTwoSeconds,
  fn: () => console.log('task 2 executed'),
});

task.save({
  name: 'task 3',
  dueAt: runInThreeSeconds,
  fn: () => console.log('task 3 executed'),
});

task.run(oneSecond);
