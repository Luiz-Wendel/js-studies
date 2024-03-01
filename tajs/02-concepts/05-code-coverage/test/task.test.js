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
    it('should only run tasks that are due', () => {
      jest.useFakeTimers();

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
        {
          name: 'Task-Will-Run-In-15-Seconds',
          dueAt: new Date(Date.now() + 15000),
          fn: jest.fn(),
        },
      ];

      tasks.forEach((task) => _task.save(task));

      _task.run(200);

      // time = 4s
      jest.advanceTimersByTime(4000);

      expect(tasks.at(0).fn).not.toHaveBeenCalled();
      expect(tasks.at(1).fn).not.toHaveBeenCalled();
      expect(tasks.at(2).fn).not.toHaveBeenCalled();

      // time = 4s + 5s = 9s
      jest.advanceTimersByTime(5000);

      expect(tasks.at(0).fn).toHaveBeenCalled();
      expect(tasks.at(1).fn).not.toHaveBeenCalled();
      expect(tasks.at(2).fn).not.toHaveBeenCalled();

      // time = 9s + 5s = 14s
      jest.advanceTimersByTime(5000);

      expect(tasks.at(0).fn).toHaveBeenCalled();
      expect(tasks.at(1).fn).toHaveBeenCalled();
      expect(tasks.at(2).fn).not.toHaveBeenCalled();

      // time = 14s + 1s = 15s
      jest.advanceTimersByTime(1000);

      expect(tasks.at(0).fn).toHaveBeenCalled();
      expect(tasks.at(1).fn).toHaveBeenCalled();
      expect(tasks.at(2).fn).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
