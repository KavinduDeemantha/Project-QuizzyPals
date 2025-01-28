const mongoose = require("mongoose");

const userQuizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: false,
  },
  roomId: {
    type: String,
    required: true,
  },
  quizOwner: {
    type: String,
    required: false,
  },
  answerOwner: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  playerAnswer: {
    type: String,
    required: false,
  },
  answeredCorrectly: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("UserQuiz", userQuizSchema);
