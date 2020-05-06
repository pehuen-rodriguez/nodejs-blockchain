"use strict";

const { Orderbook } = require("./orderbook");
const Link = require("grenache-nodejs-link");

const server = require("./server");
const client = require("./client");

function App() {
  this.orderbook = new Orderbook();

  this.orderbook.on("match", (order, fullFillOrders) => {
    // found a match
    // inform everybody? Think not
    console.log("there was a match", order, fullFillOrders);
  });

  this.init = () => {
    const link = new Link({
      grape: "http://127.0.0.1:30001",
    });
    link.start();

    server.init(link, (order) => {
      console.log("order", order);
      this.orderbook.putOrder(order);
    });
    client.init(link);
  };

  this.stop = () => {
    // disconnect?
  };

  this.putOrder = (order) => {
    client.putOrder(order);
  };
}

module.exports = { App };

// it'll be a server and a client. Would I use PubSub?
// const { PeerRPCServer } = require("grenache-nodejs-ws");
// const Link = require("grenache-nodejs-link");

// function fibonacci(n) {
//   if (n <= 1) {
//     return 1;
//   }
//   return fibonacci(n - 1) + fibonacci(n - 2);
// }

// const link = new Link({
//   grape: "http://127.0.0.1:30001",
// });

// link.start();

// const peer = new PeerRPCServer(link, {});
// peer.init();

// const service = peer.transport("server");
// service.listen(1337);

// setInterval(() => {
//   link.announce("fibonacci_worker", service.port, {});
// }, 1000);

// service.on("request", (rid, key, payload, handler) => {
//   const result = fibonacci(payload.number);
//   handler.reply(null, result);
// });
