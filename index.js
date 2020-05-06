const prompt = require("prompt");
const { App } = require("./app");
const { v4: uuidv4 } = require("uuid");
const schema = require("./promptSchema");

const app = new App();
app.init();

prompt.start();

const askForOrder = () => {
  prompt.get(schema, function (err, {price, type, amount}) {
    app.putOrder({ uuid: uuidv4(), price, type, amount: parseFloat(amount) });
    askForOrder();
  });
};

askForOrder();
