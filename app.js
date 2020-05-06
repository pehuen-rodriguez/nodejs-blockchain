const { Orderbook } = require("./orderbook");

function App() {
  this.orderbook = new Orderbook();

  this.orderbook.on("match", () => {});

  this.init = () => {
    // Connect here to the grape?
  };

  this.stop = () => {
    // disconnect?
  };

  this.putOrder = (order) => {
    // create an order
    // inform everybody

    // find a match
    // inform everybody
    return this.orderbook.putOrder(order);
  };
}

module.exports = { App };
