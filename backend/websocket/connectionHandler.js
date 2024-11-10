const messageHandler = require("./messageHandler");

const connectionHandler = (rooms) => {
  function connection(ws) {
    console.log("A new player has connected!");
    ws.send("Hello, player!");

    ws.on("message", messageHandler(ws, rooms));
  }

  return connection;
};

module.exports = connectionHandler;
