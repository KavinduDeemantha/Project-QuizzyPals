require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const quizRouter = require("./routes/quizRouter");
const roomRouter = require("./routes/roomRouter");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/users", userRouter);
app.use("/api/game", quizRouter);
app.use("/api/rooms", roomRouter);

app.get("/", (req, res) => {
  res.send("QuizzyPals backend is up and running at: http://localhost:4000...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  })
  .catch((error) => {
    console.log(`Database connection failed: ${error}`);
  });
