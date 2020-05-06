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
    this.availableOrders++;
    // will fetch buy and sell for that price
    const bucket = getBucket(order);
    const oppositeOrders = bucket[opposite(order.type)];

    if (oppositeOrders && oppositeOrders.length > 0) {
      let i = 0;
      let opposite = oppositeOrders[i];
      let matchedAmount = opposite.amount;

      // go through opposite orders
      while (i + 1 < oppositeOrders.length && opposite.amount <= order.amount) {
        opposite = oppositeOrders[++i];
        matchedAmount += opposite.amount;
      }

      // remove them from the list
      const oppositeOrdersMatched = oppositeOrders.splice(0, i + 1);

      if (matchedAmount < order.amount) {
        // there's still amount left
        this.availableOrders -= i + 1;
        bucket[order.type].push(order);
        this.emit(
          "match",
          { ...order, amount: order.amount - matchedAmount },
          oppositeOrdersMatched
        );
      } else if (matchedAmount === order.amount) {
        this.availableOrders -= i + 2;
        this.emit("match", order, oppositeOrdersMatched);
      } else {
        // what if
      }
    } else {
      // no options. Just push it
      bucket[order.type].push(order);
    }
  });

  const getBucket = (order) => {
    // get me the list of orders for the corresponding price: a bucket
    if (this.orderbook[order.price] === undefined) {
      this.orderbook[order.price] = {
        buy: [],
        sell: [],
      };
    }
    return this.orderbook[order.price];
  };

  const opposite = (type) => {
    return type === "sell" ? "buy" : "sell";
  };
}

util.inherits(Orderbook, events.EventEmitter);

module.exports = { Orderbook };
