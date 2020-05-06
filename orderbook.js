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
      console.log("spliced", JSON.stringify(oppositeBucketMatched));

      if (matchedAmount < order.amount) {
        console.log("case A");
        // there's still amount left
        this.availableOrders -= i + 1;
        bucket[order.type].push(order);
        this.emit(
          "match",
          { ...order, amount: order.amount - matchedAmount },
          oppositeBucketMatched
        );
      } else if (matchedAmount === order.amount) {
        console.log("case B");
        this.availableOrders -= i + 2;
        this.emit("match", order, oppositeBucketMatched);
      } else {
        console.log("case C");
        this.availableOrders -= i + 1;
        // take the last back because we will still drain it
        oppositeBucket.push(oppositeBucketMatched.pop());
        // console.log("values", order.amount, opposite.amount, matchedAmount);
        oppositeBucketMatched.push({
          ...opposite,
          ammount: order.amount + opposite.amount - matchedAmount,
        });
        this.emit("match", order, oppositeBucketMatched);
      }
    } else {
      // no options to match. Just push it
      bucket[order.type].push(order);
    }
    console.log(
      "current shape of the orderbook",
      JSON.stringify(this.orderbook)
    );
  });

  this.on("match", (order, fullfillOrders) => {
    console.log("there was a match", order, fullfillOrders);
  })

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
