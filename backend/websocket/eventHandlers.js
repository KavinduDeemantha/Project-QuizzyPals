const WebSocket = require("ws");
const connectionHandler = require("./connectionHandler");

const configureWebSocket = (wss = WebSocket) => {
  const rooms = new Map();

  wss.on("connection", connectionHandler(rooms));
};

module.exports = configureWebSocket;
