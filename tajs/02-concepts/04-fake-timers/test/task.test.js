import { describe , beforeEach, it, jest, expect } from '@jest/globals';
import { setTimeout } from 'timers/promises';

import Task from '../src/task';

describe('Task Suite', () => {
  let _logMock;
  let _task;

  beforeEach(() => {
    _logMock = jest.spyOn(
      console,
      console.log.name,
    ).mockImplementation();

    _task = new Task();
  });

  describe('run', () => {
    it('should only run tasks that are due - without fake timers (slow)', async () => {
      const tasks = [
        {
          name: 'Task-Will-Run-In-5-Seconds',
          dueAt: new Date(Date.now() + 5000),
          fn: jest.fn(),
        },
        {
          name: 'Task-Will-Run-In-10-Seconds',
          dueAt: new Date(Date.now() + 10000),
          fn: jest.fn(),
        },
      ];

      tasks.forEach((task) => _task.save(task));

      _task.run(200);

      await setTimeout(11000);

      expect(tasks.at(0).fn).toHaveBeenCalled();
      expect(tasks.at(1).fn).toHaveBeenCalled();
    }, 15e3);
  });
});
