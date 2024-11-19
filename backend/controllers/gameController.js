const Quiz = require("../models/quizModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
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
  const { userId, durationHours, durationMinutes, durationSeconds } = req.body;

  try {
    const user = await User.findOne({ userId: userId });

    if (!user) {
      throw Error("Sorry, only registered users can create a game");
    }

    const room = await Room.findOne({ roomId: user.roomId });

    if (!room) {
      throw Error("The user is not attached to an active room!");
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

    room.gameStart = Date.now();
    const endsAt = new Date();
    endsAt.setHours(room.gameStart.getHours() + parseInt(durationHours));
    endsAt.setMinutes(room.gameStart.getMinutes() + parseInt(durationMinutes));
    endsAt.setSeconds(room.gameStart.getSeconds() + parseInt(durationSeconds));
    room.gameEnd = endsAt;
    room.gameRound = room.gameRound ? room.gameRound + 1 : 1;
    await room.save();

    room.host = user.email;
    const responseEntity = { room: room, message: "Game started" };
    responseEntity.host = user.email;

    res.status(StatusCodes.OK).json(responseEntity);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const endGame = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw Error("Invalid user trying to end the game");
    }

    const room = await Room.findOne({ roomId: user.roomId });
    if (!room) {
      throw Error("The user is not attached a room to end the game");
    }

    if (room.host != user.userId) {
      throw Error("Only the host can end the game");
    }

    room.gameEnd = null;
    room.gameStart = null;
    await room.save();

    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  const { userId, quizQuestion, quizAnswer } = req.body;

  try {
    const user = await User.findById(userId);

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

    if (room.gameEnd < Date.now()) {
      throw Error("Quiz creation time is up!");
    }

    const quiz = await Quiz.create({
      roomId: room.roomId,
      userId: userId,
      quizQuestion: quizQuestion,
      quizAnswer: quizAnswer,
    });

    res.status(StatusCodes.OK).json(quiz);
  } catch (error) {
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
    for (let quiz of quizzes) {
      if (quiz.userId != user.userId) {
        quizzesExceptMe.push({
          question: quiz.quizQuestion,
          answer: quiz.quizAnswer,
        });
      }
    }

    res.status(StatusCodes.OK).json(quizzesExceptMe);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  startGame,
  endGame,
  getQuizzes,
};
