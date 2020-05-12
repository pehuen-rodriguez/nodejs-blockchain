const { PeerRPCServer, PeerRPCClient } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const { v4: uuidv4 } = require("uuid");

const orderbook = require("./orderbook");

let clientPeer;
const me = uuidv4();

const broadcast = (order) => {
  return new Promise((resolve, reject) => {
    clientPeer.map(
      "order_listener",
      { order, createdBy: me },
      { timeout: 10000 },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      }
    );
  });
};

const processRequest = (rid, key, payload, handler) => {
  const { createdBy, order } = payload;

  if (createdBy === me) {
    return handler.reply(null, { id: "Self" });
  }

  const localResult = orderbook.putOrder(order);

  // reply to the client
  handler.reply(null, {
    id: me,
  });
};

module.exports = {
  // initialize client and server
  init: () => {
    const link = new Link({
      grape: "http://127.0.0.1:30001",
    });
    link.start();

    // start and init both client and server peer instances
    const serverPeer = new PeerRPCServer(link, {
      timeout: 300000,
    });
    serverPeer.init();

    clientPeer = new PeerRPCClient(link, {});
    clientPeer.init();

    const port = 1024 + Math.floor(Math.random() * 1000);
    const service = serverPeer.transport("server");
    service.listen(port);

    // it will not do its first announce until 1 sec has passed
    setInterval(function () {
      link.announce("order_listener", service.port, {});
    }, 1000);

    service.on("request", processRequest);
  },
  placeOrder: async (order) => {
    const localResult = orderbook.putOrder(order);
    try {
      const broadcastResults = await broadcast(order);
      return { localResult, broadcastResults };
    } catch (err) {
      throw new Error(localResult ? `Order ${localResult} was placed. Error broadcasting ${err.message}` : err.message);
    }
  },
  getOrderbook: orderbook.getOrderbook,
};
