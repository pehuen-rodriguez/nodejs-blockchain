module.exports = {
  orderSchema: [
    {
      type: "input",
      name: "price",
      message: "Price for the operation",
      validate: (value) => {
        const pass = value.match(/^(0|[1-9][0-9]*)$/);
        if (pass) {
          return true;
        }
        return "Please enter a valid integer price.";
      },
    },
    {
      type: "list",
      name: "type",
      message: "Buy or Sell",
      choices: ["buy", "sell"],
    },
    {
      type: "input",
      name: "amount",
      message: "Amount for the operation",
      validate: (value) => {
        const pass = value.match(/^\d+(\.\d{1,2})?$/);
        if (pass) {
          return true;
        }
        return "Please enter a valid decimal amount.";
      },
    },
  ],
  operationSchema: [
    {
      type: "list",
      name: "operation",
      message: "What would you like to do?",
      choices: ["Place an order", "Take a look at the orderbook"],
    },
  ],
};
