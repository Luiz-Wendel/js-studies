export default class Task {
  #tasks = new Set();

  save({ name, dueAt, fn }) {
    console.log(`saving task ${name} with due date ${dueAt.toISOString()}`)

    this.#tasks.add({ name, dueAt, fn });
  }

  run(everyMs) {
    const intervalId = setInterval(() => {
      if (this.#tasks.size === 0) {
        console.log('no tasks to run!');

        clearInterval(intervalId);

        return;
      }

      const now = new Date();

      this.#tasks.forEach((task) => {
        if (task.dueAt <= now) {
          task.fn();
          this.#tasks.delete(task);
        }
      });
    }, everyMs);
  }
}
