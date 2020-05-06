const util = require("util");
const events = require("events");

// orderbook will be a hash with the shape:
// { price: { buy: [{amount: x}], sell: [{amount: x}] } }
// it will match on a price and the opposite operation type

function Orderbook() {
  this.availableOrders = 0;
  this.orderbook = {};

  this.putOrder = (order) => {
    this.emit("putOrder", order);
  };

  this.on("putOrder", (order) => {
    this.availableorders++;
    // will fetch buy and sell for that price
    const bucket = get_bucket(order);
    bucket[order.type].push(order);

    console.log(bucket);
  });

  const get_bucket = (order) => {
    if (this.orderbook[order.price] === undefined) {
      this.orderbook[order.price] = {
        buy: [],
        sell: [],
      };
    }
    return this.orderbook[order.price];
  };
}

util.inherits(Orderbook, events.EventEmitter);

module.exports = { Orderbook };
