const { PeerRPCServer } = require("grenache-nodejs-http");

module.exports = {
  init: (link, receiveOrder) => {
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
      receiveOrder(payload);
      handler.reply(null, {
        msg: `order with uuid ${payload.uuid} received ok`,
      });
    });
  },
};
