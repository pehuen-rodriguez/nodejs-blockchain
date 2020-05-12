// orderbook will be a hash with the shape:
// { price: { buy: [{amount: x}], sell: [{amount: x}], match: [{buy: uuid, sell: uuid}] } }
// it will match on a price and the opposite operation type
let availableOrders = 0;
let orderbook = {};

const getBucket = (order) => {
  // get me the list of orders for the corresponding price: a bucket
  // initialize if there's no price attached
  if (orderbook[order.price] === undefined) {
    orderbook[order.price] = {
      buy: [],
      sell: [],
      match: [],
    };
  }
  return orderbook[order.price];
};

const putMatch = (order, matches) => {
  const bucket = getBucket(order);
  const oppositeType = opposite(order.type);
  const match = { [order.type]: [order], [oppositeType]: matches };
  bucket.match.push(match);
};

const opposite = (type) => {
  return type === "sell" ? "buy" : "sell";
};

module.exports = {
  putOrder: (order) => {
    availableOrders++;

    // will fetch buy and sell for that price
    const bucket = getBucket(order);
    const oppositeBucket = bucket[opposite(order.type)];

    if (oppositeBucket && oppositeBucket.length > 0) {
      let i = 0;

      let opposite = oppositeBucket[i];
      let matchedAmount = opposite.amount;

      // if the first one is not enough, try to go through opposite orders
      while (i + 1 < oppositeBucket.length && opposite.amount <= order.amount) {
        opposite = oppositeBucket[++i];
        matchedAmount += opposite.amount;
      }

      const oppositeBucketMatched = oppositeBucket.splice(0, i + 1);

      if (matchedAmount < order.amount) {
        availableOrders -= i + 1;
        bucket[order.type].push({
          ...order,
          amount: order.amount - matchedAmount,
        });
        putMatch(
          { ...order, amount: order.amount - matchedAmount },
          oppositeBucketMatched
        );
      } else if (matchedAmount === order.amount) {
        availableOrders -= i + 2;
        putMatch(order, oppositeBucketMatched);
      } else {
        availableOrders -= i + 1;
        // take the last back because we will still drain it
        const remainer = order.amount + opposite.amount - matchedAmount;
        const lastOppositeEntry = oppositeBucketMatched.pop();
        oppositeBucket.push({
          ...lastOppositeEntry,
          amount: lastOppositeEntry.amount - remainer,
        });
        oppositeBucketMatched.push({
          ...opposite,
          amount: remainer,
        });
        putMatch(order, oppositeBucketMatched);
      }
    } else {
      // no options to match. Just push it
      bucket[order.type].push(order);
    }

    return order.uuid;
  },
  getOrderbook: () => {
    return orderbook;
  }
};
