const prompt = require("prompt");
const { App } = require("./app");
const { v4: uuidv4 } = require("uuid");

const schema = {
  properties: {
    price: {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "Price must be a number",
      required: true,
    },
    type: {
      pattern: /^(buy|sale)$/,
      message: "Operation type is either buy or sale",
      required: true,
    },
    amount: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: "Amount must be a number",
      required: true,
    },
  },
};

const app = new App();
app.init();

prompt.start();

const askForOrder = () => {
  prompt.get(schema, function (err, {price, type, amount}) {
    console.log("Command-line input received:");
    console.log("  price: " + price);
    console.log("  type: " + type);
    console.log("  amount: " + amount);
    app.putOrder({ uuid: uuidv4(), price, type, amount: parseFloat(amount) });
    askForOrder();
  });
};

askForOrder();
