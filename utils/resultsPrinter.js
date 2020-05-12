module.exports = {
  printOrderPlacedResults: ({ localResult, broadcastResults }) => {
    console.log(`Order ${localResult} was placed`);
    if (broadcastResults && broadcastResults.length) {
      console.log("It was processed by the following peers: ");
    }
    broadcastResults.forEach((result) => {
      console.log(` - ${result.id}`);
    });
  },
  printShowOrderbook: (orderbook) => {
    const priceKeys = Object.keys(orderbook);

    if (!priceKeys.length) {
      return console.log("Orderbook is currently empty");
    }

    priceKeys.forEach((priceKey) => {
      console.log(`> Details for price: ${priceKey}`);

      const operationKeys = Object.keys(orderbook[priceKey]);

      operationKeys.forEach((operationKey) => {
        if (
          orderbook[priceKey][operationKey] &&
          orderbook[priceKey][operationKey].length
        ) {
          if (operationKey === "match") {
            console.log("  >> MATCHES");
            orderbook[priceKey][operationKey].forEach((match) => {
              const matchesKeys = Object.keys(match);
              matchesKeys.forEach((matchKey) => {
                match[matchKey].forEach(
                  ({ type, uuid, amount }) => {
                    console.log("     Type:", type, "| Amount:", amount, "| UUID:", uuid );
                  }
                );
              });
            });
          } else {
            orderbook[priceKey][operationKey].forEach(
              ({ type, uuid, amount }) => {
                console.log("  Type:", type, "| Amount:", amount, "| UUID:", uuid);
              }
            );
          }
        }
      });
    });
  },
};
