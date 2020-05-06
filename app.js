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
