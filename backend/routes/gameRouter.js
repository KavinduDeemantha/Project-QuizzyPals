const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
  startGame,
  createQuiz,
  endGame,
  getQuizzes,
  submitAnswers,
  getTimeRemaining,
  getPlayerQandA,
} = require("../controllers/gameController");

const router = express.Router();

router.use(requireAuth);

// Creating new quiz...
router.post("/createquiz", createQuiz);

// Start new game...
router.post("/startgame", startGame);

// End game by the host
router.get("/endgame/:userId", endGame);

// Get quizzes by room id
router.get("/getquizzes/:userId", getQuizzes);

router.get("/get-all-player-answers/:roomId", getPlayerQandA);

router.post("/submitanswers", submitAnswers);

router.get("/remainingtime/:userId", getTimeRemaining);

module.exports = router;
