const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: false,
  },
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
  correctAnswer: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
