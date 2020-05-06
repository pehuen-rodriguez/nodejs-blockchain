const { PeerRPCServer, PeerRPCClient } = require("grenache-nodejs-http");
let clientPeer;

module.exports = {
  init: (link) => {
    clientPeer = new PeerRPCClient(link, {});
    clientPeer.init();
  },
  putOrder: (order) => {
    console.log("got an order. Broadcast");
    clientPeer.map(
      "listener",
      { ...order },
      { timeout: 10000 },
      (err, data) => {
        if (err) {
          console.error(err);
          // process.exit(-1);
        }
        console.log(data);
      }
    );
  },
};
