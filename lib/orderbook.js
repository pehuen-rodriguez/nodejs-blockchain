const util = require("util");
const events = require("events");

// orderbook will be a hash with the shape:
// { price: { buy: [{amount: x}], sell: [{amount: x}], match: [{buy: uuid, sell: uuid}] } }
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
    const oppositeBucket = bucket[opposite(order.type)];

    if (oppositeBucket && oppositeBucket.length > 0) {
      let i = 0;
      let opposite = oppositeBucket[i];
      let matchedAmount = opposite.amount;

      // go through opposite orders
      while (i + 1 < oppositeBucket.length && opposite.amount <= order.amount) {
        opposite = oppositeBucket[++i];
        matchedAmount += opposite.amount;
      }

      // splice them from the list
      // do I want them removed or the amount substracted? Or none
      const oppositeBucketMatched = oppositeBucket.splice(0, i + 1);

      if (matchedAmount < order.amount) {
        // there's still amount left
        console.log("CASE A")
        this.availableOrders -= i + 1;
        bucket[order.type].push({
          ...order,
          amount: order.amount - matchedAmount,
        });
        this.emit(
          "match",
          { ...order, amount: order.amount - matchedAmount },
          oppositeBucketMatched
        );
      } else if (matchedAmount === order.amount) {
        console.log("CASE B");
        this.availableOrders -= i + 2;
        this.emit("match", order, oppositeBucketMatched);
      } else {
        console.log("CASE C");
        this.availableOrders -= i + 1;
        // take the last back because we will still drain it
        const remainer = order.amount + opposite.amount - matchedAmount;
        const lastOppositeEntry = oppositeBucketMatched.pop();
        oppositeBucket.push({...lastOppositeEntry, amount: lastOppositeEntry.amount - remainer});
        oppositeBucketMatched.push({
          ...opposite,
          amount: remainer,
        });
        this.emit("match", order, oppositeBucketMatched);
      }
    } else {
      // no options to match. Just push it
      bucket[order.type].push(order);
    }
    console.log(
      "shape of the orderbook after put order",
      JSON.stringify(this.orderbook)
    );
    console.log("available orders", this.availableOrders);
  });

  this.on("match", (order, fullfilledOrders) => {
    const bucket = getBucket(order);
    const oppositeType = opposite(order.type);
    const match = { [order.type]: [order], [oppositeType]: fullfilledOrders };
    bucket.match.push(match);
  });

  const getBucket = (order) => {
    // get me the list of orders for the corresponding price: a bucket
    // initialize if there's no price attached
    if (this.orderbook[order.price] === undefined) {
      this.orderbook[order.price] = {
        buy: [],
        sell: [],
        match: [],
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
