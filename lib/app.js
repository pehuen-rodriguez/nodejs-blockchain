"use strict";

const Grape = require("grenache-grape").Grape;
const Link = require("grenache-nodejs-link");

const { Orderbook } = require("./orderbook");

const server = require("./server");
const client = require("./client");

function App() {
  this.orderbook = new Orderbook();

  this.init = () => {
    // works with three nodes when spawning grapes from binary. Think it may be due to port sharing
    // const g = new Grape({
    //   host: "127.0.0.1",
    //   dht_port: 20001,
    //   dht_bootstrap: ["127.0.0.1:20002"],
    //   api_port: 30001,
    // });

    // g.start();

    const link = new Link({
      grape: "http://127.0.0.1:30001",
    });
    link.start();

    server.init(link, (order) => {
      this.orderbook.putOrder(order);
    });
    client.init(link);
  };

  this.stop = () => {
    // disconnect?
  };

  this.putOrder = (order, askForOrder) => {
    client.putOrder(order, askForOrder);
  };
}

module.exports = { App };
