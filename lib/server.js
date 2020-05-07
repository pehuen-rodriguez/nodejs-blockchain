const { PeerRPCServer } = require("grenache-nodejs-http");
const { TaskQueue } = require("./taskQueue");

module.exports = {
  init: (link, receiveOrder) => {
    const taskQueue = new TaskQueue();

    const serverPeer = new PeerRPCServer(link, {
      timeout: 300000,
    });
    serverPeer.init();

    const port = 1024 + Math.floor(Math.random() * 1000);
    const service = serverPeer.transport("server");
    service.listen(port);

    setInterval(function () {
      link.announce("listener", service.port, {});
    }, 1000);

    service.on("request", (rid, key, payload, handler) => {
      taskQueue.pushTaskToQueue((cb) => {
        receiveOrder(payload);
        cb();
      });
      handler.reply(null, {
        msg: `order with uuid ${payload.uuid} received ok`,
      });
    });
  },
};
