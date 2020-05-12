const inquirer = require("inquirer");
const { v4: uuidv4 } = require("uuid");

const app = require("./lib/app");
const { orderSchema, operationSchema } = require("./utils/promptSchemas");
const {
  printOrderPlacedResults,
  printShowOrderbook,
} = require("./utils/resultsPrinter");

app.init();

const askForOrder = async () => {
  try {
    const { operation } = await inquirer.prompt(operationSchema);

    if (operation === "Take a look at the orderbook") {
      printShowOrderbook(app.getOrderbook());
      return askForOrder();
    }

    const { price, type, amount } = await inquirer.prompt(orderSchema);

    const order = {
      uuid: uuidv4(),
      price,
      type,
      amount: parseFloat(amount),
    };
    const { localResult, broadcastResults } = await app.placeOrder(order);

    printOrderPlacedResults({ localResult, broadcastResults });
    askForOrder();

  } catch (err) {
    console.error(err.message);
    askForOrder();
  }
};

askForOrder();
