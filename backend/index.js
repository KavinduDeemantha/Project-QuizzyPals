require("dotenv").config();

const http = require("http");
const cors = require("cors");
const WebSocket = require("ws");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const gameRouter = require("./routes/gameRouter");
const roomRouter = require("./routes/roomRouter");
const configureWebSocket = require("./websocket/eventHandlers");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
configureWebSocket(wss);

// middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/users", userRouter);
app.use("/api/game", gameRouter);
app.use("/api/rooms", roomRouter);

app.get("/", (req, res) => {
  res.send(
    `QuizzyPals backend is up and running at: http://localhost:${process.env.PORT}...`
  );
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  })
  .catch((error) => {
    console.log(`Database connection failed: ${error}`);
  });
