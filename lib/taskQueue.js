function TaskQueue() {
  this.queue = [];
  this.running = false;

  this.pushTaskToQueue = (task) => {
    this.queue.push(task);
    if (!this.running) this.next();
  };

  this.next = () => {
    this.running = true;
    while (this.queue.length) {
      const task = this.queue.shift();
      task(() => {
        this.next();
      });
    }
    this.running = false;
  };
}

module.exports = { TaskQueue };
