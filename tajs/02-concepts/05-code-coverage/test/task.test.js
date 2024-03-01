import { describe , beforeEach, it, jest, expect } from '@jest/globals';

import Task from '../src/task';

const FUNC_NAMES = {
  LOG: console.log.name,
  CLEAR_INTERVAL: global.clearInterval.name,
};

describe('Task Suite', () => {
  let _logMock;
  let _task;

  beforeEach(() => {
    _logMock = jest.spyOn(
      console,
      FUNC_NAMES.LOG,
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

    it('should clear the interval when there are no more tasks', () => {
      jest.useFakeTimers();

      jest.spyOn(
        global,
        FUNC_NAMES.CLEAR_INTERVAL,
      ).mockImplementation();

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

      // time = 10s
      jest.advanceTimersByTime(1e4);

      expect(global.clearInterval).not.toHaveBeenCalled();

      // time = 10s + 5.2s = 15.2s
      jest.advanceTimersByTime(52e2);

      expect(global.clearInterval).toHaveBeenCalled();
    });
  });
});
