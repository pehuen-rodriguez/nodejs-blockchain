const readline = require("readline");
const { App } = require("./app");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = new App();
app.init();

const askForOrder = () => {
  rl.question("Price? ", (price) => {
    rl.question("Buy or sell? ", (type) => {
      rl.question("How many? ", (amount) => {
        app.putOrder({ price, type, amount });
        askForOrder();
      });
    });
  });
}

askForOrder();

rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
