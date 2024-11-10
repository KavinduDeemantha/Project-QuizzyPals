const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  quizQuestion: {
    type: String,
    required: true,
  },
  quizAnswer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
