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
  quizOwnerId: {
    type: String,
    required: true,
  },
  answerOwnerId: {
    type: String,
    required: true,
  },
  playerAnswer: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("UserQuiz", userQuizSchema);
