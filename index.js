const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Buy or sell? ", function (operation) {
  rl.question("Amount? ", function (amount) {
    console.log(`Cool, let's check for ${operation}ing ${amount}`);
  });
});

rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
