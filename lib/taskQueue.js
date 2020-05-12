const queue = [];
let running = false;

const next = () => {
  running = true;
  while (queue.length) {
    const task = queue.shift();
    task();
    next();
  }
  running = false;
};

module.exports = {
  pushTaskToQueue: (task) => {
    queue.push(task);
    if (!running) next();
  },
};
