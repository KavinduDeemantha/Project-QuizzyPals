const Quiz = require("../models/quizModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const UserQuiz = require("../models/userQuizModel");
const { StatusCodes } = require("http-status-codes");

const _getUserById = async (userId) => {
  return await User.findOne({ userId });
};

const _getRoomById = async (roomId) => {
  return await Room.findOne({ roomId });
};

const _getQuizzesByRoom = async (roomId) => {
  return await Quiz.find({ roomId });
};

const startGame = async (req, res) => {
  const {
    userId,
    saveData,
    answerDurationMinutes,
    answerDurationSeconds,
    durationHours,
    durationMinutes,
    durationSeconds,
  } = req.body;

  try {
    const user = await User.findOne({ userId: userId });

    if (!user) {
      throw Error("Sorry, only registered users can create a game");
    }

    const room = await Room.findOne({ roomId: user.roomId });

    if (!room) {
      throw Error(`The user is not attached to an active room! ${user.email}`);
    }

    if (room.host != userId) {
      if (room.gameStart && room.gameEnd && room.gameEnd >= Date.now()) {
        res
          .status(StatusCodes.OK)
          .json({ room: room, message: "Game started" });
        return;
      }
      throw Error("Sorry, the host has not started the game!");
    }

    if (room.gameStart && room.gameEnd && room.gameEnd >= Date.now()) {
      res.status(StatusCodes.OK).json({ message: "Game already running" });
      return;
    }

    if (isNaN(durationHours) || isNaN(durationMinutes)) {
      throw Error("Durations should be integer values");
    }

    if (room.saveData != undefined && room.saveData != null) {
      if (room.saveData === false) {
        await Quiz.deleteMany({ roomId: room.roomId });
      }
    }

    room.gameStart = new Date();
    const endsAt = new Date();
    const answerRoundEnds = new Date(endsAt);
    endsAt.setHours(room.gameStart.getHours() + parseInt(durationHours));
    endsAt.setMinutes(room.gameStart.getMinutes() + parseInt(durationMinutes));
    endsAt.setSeconds(room.gameStart.getSeconds() + parseInt(durationSeconds));
    room.gameEnd = endsAt;
    room.gameRound = room.gameRound ? room.gameRound + 1 : 1;

    answerRoundEnds.setMinutes(
      room.gameEnd.getMinutes() + parseInt(answerDurationMinutes)
    );
    answerRoundEnds.setSeconds(
      room.gameEnd.getSeconds() + parseInt(answerDurationSeconds)
    );
    room.answerRoundEnd = answerRoundEnds;
    room.questionAnswer = "";
    room.saveData = saveData;
    await room.save();

    room.host = user.email;
    const responseEntity = { room: room, message: "Game started" };
    responseEntity.host = user.email;

    await UserQuiz.deleteMany({ roomId: room.roomId });

    res.status(StatusCodes.OK).json(responseEntity);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const endGame = async (req, res) => {
  const { userId, type } = req.body;

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw Error("Invalid user trying to end the game");
    }

    const room = await Room.findOne({ roomId: user.roomId });
    if (!room) {
      throw Error("The user is not attached a room to end the game");
    }

    // Host ended the game for all
    if (room.host == user.userId) {
      room.gameEnd = null;
      room.gameStart = null;

      if (type === "GAME_END") {
        if (room.saveData != undefined && room.saveData != null) {
          if (room.saveData === false) {
            await Quiz.deleteMany({ roomId: room.roomId });
          }
        }
      }

      await room.save();
    } else {
      user.roomId = null;
      await user.save();
    }

    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  const { userId, quizQuestion, quizAnswer, correctAnswer } = req.body;

  try {
    const user = await _getUserById(userId);

    if (!user) {
      throw Error("Invalid user");
    }

    const room = await Room.findOne({ roomId: user.roomId });
    if (!room) {
      throw Error("User has not assigned to a room");
    }

    if (room.gameStart == null) {
      throw Error("Game is not started yet!");
    }

    const nowDate = new Date();
    const gameEndsAt = new Date(room.gameEnd);
    if (gameEndsAt < nowDate) {
      throw Error("Quiz creation time is up!");
    }

    const quiz = await Quiz.create({
      roomId: room.roomId,
      userId: userId,
      quizQuestion: quizQuestion,
      quizAnswer: quizAnswer,
      correctAnswer: correctAnswer,
    });

    quiz.quizId = quiz._id;
    await quiz.save();

    res.status(StatusCodes.OK).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getQuizzes = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await _getUserById(userId);

    if (!user) {
      throw Error("Invalid user");
    }

    const room = await _getRoomById(user.roomId);

    if (!room) {
      throw Error("User is not joined to a room");
    }

    const quizzesExceptMe = [];

    const quizzes = await _getQuizzesByRoom(room.roomId);

    const now = new Date();
    if (room.answerRoundEnd < now) {
      // A player is trying the access quizzes after the game ended (so correct answer is there)
      for (let quiz of quizzes) {
        // console.log(quiz);
        if (quiz.userId != user.userId) {
          quizzesExceptMe.push({
            quizId: quiz.quizId,
            question: quiz.quizQuestion,
            answer: quiz.quizAnswer,
            correct: quiz.correctAnswer,
          });
        }
      }
    } else {
      // A player is trying to access quizzes before the game ended (so correct answer is not there)
      for (let quiz of quizzes) {
        if (quiz.userId != user.userId) {
          quizzesExceptMe.push({
            quizId: quiz.quizId,
            question: quiz.quizQuestion,
            answer: quiz.quizAnswer,
          });
        }
      }
    }
    res.status(StatusCodes.OK).json(quizzesExceptMe);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getPlayerQandA = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    if (!roomId) {
      throw Error("Please provide your roomId!");
    }

    const room = await _getRoomById(roomId);

    if (!room) {
      throw Error("There is no active room with this id: ", roomId);
    }

    const responses = [];
    const playersQA = await UserQuiz.find({ roomId: room.roomId });
    if (playersQA) {
      for (const qa of playersQA) {
        const quiz = await Quiz.findOne({ quizQuestion: qa.question });
        const owner = await User.findOne({ userId: quiz.userId });

        const response = {
          quizId: quiz.quizId,
          question: qa.question,
          answer: qa.playerAnswer,
          answeredBy: qa.answerOwner,
          createdBy: owner.email,
          correctAnswer: quiz.correctAnswer,
        };
        responses.push(response);
      }
    }
    res.status(StatusCodes.OK).json(responses);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const submitAnswers = async (req, res) => {
  const { userId, quizId, quizQuestion, playerAnswer } = req.body;

  try {
    const user = await _getUserById(userId);

    if (!user) {
      throw Error("Invalid user");
    }

    const room = await _getRoomById(user.roomId);

    if (!room) {
      throw Error("User is not joined to a room");
    }

    const startTime = new Date();
    const endTime = room.answerRoundEnd;
    const duration = endTime - startTime;

    if (duration > 0) {
      const quiz = await Quiz.findOne({ quizId });

      if (user.userId == quiz.userId) {
        return;
      }

      let playerQACache = await UserQuiz.findOne({
        question: quiz.quizQuestion,
        roomId: room.roomId,
        answerOwner: user.email,
      });

      if (!playerQACache) {
        playerQACache = await UserQuiz.create({
          question: quiz.quizQuestion,
          roomId: room.roomId,
          answerOwner: user.email,
        });
      }

      if (playerAnswer == quiz.correctAnswer) {
        user.score += 1;
        playerQACache.answeredCorrectly = true;
      } else {
        if (playerQACache.answeredCorrectly) {
          user.score -= 1;
        }
        playerQACache.answeredCorrectly = false;
      }

      playerQACache.playerAnswer = playerAnswer;
      await playerQACache.save();
      await user.save();
      res
        .status(StatusCodes.OK)
        .json({ message: "Answer submitted successfully!" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Times up!" });
      return;
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getTimeRemaining = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await _getUserById(userId);

    if (!user) {
      throw Error("Invalid user");
    }

    const room = await _getRoomById(user.roomId);

    if (!room) {
      throw Error("User is not joined to a room");
    }

    if (!(room.gameStart && room.gameEnd)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Game is not started yet!" });
      return;
    }

    const startTime = new Date();
    const endTime = room.gameEnd;
    const duration = endTime - startTime;

    res.status(StatusCodes.OK).json({ remainingTime: duration });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  startGame,
  endGame,
  getQuizzes,
  submitAnswers,
  getTimeRemaining,
  getPlayerQandA,
};
