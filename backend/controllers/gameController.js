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

    res.status(StatusCodes.OK).json(responseEntity);
  } catch (error) {
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

    if (room.saveData != undefined && room.saveData != null) {
      if (room.saveData === false) {
        await Quiz.deleteMany({ roomId: room.roomId });
      }
    }

    if (room.host == user.userId) {
      room.gameEnd = null;
      room.gameStart = null;
      await room.save();
    } else {
      user.roomId = null;
      await user.save();
    }

    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  const { userId, quizQuestion, quizAnswer, correctAnswer } = req.body;

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

    if (room.answerRoundEnd < Date.now()) {
      // A player is trying to access quizzes before the game ended (so correct answer is not there)
      for (let quiz of quizzes) {
        if (quiz.userId != user.userId) {
          quizzesExceptMe.push({
            question: quiz.quizQuestion,
            answer: quiz.quizAnswer,
            correct: quiz.correctAnswer,
          });
        }
      }
      // A player is trying the access quizzes after the game ended (so correct answer is there)
    } else {
      for (let quiz of quizzes) {
        if (quiz.userId != user.userId) {
          quizzesExceptMe.push({
            question: quiz.quizQuestion,
            answer: quiz.quizAnswer,
          });
        }
      }
    }

    res.status(StatusCodes.OK).json(quizzesExceptMe);
  } catch (error) {
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

    // const players = await User.find(
    //   { roomId },
    //   { userId: 0, password: 0, score: 0, roomId: 0 }
    // );

    // const response = [];
    // for (const player of players) {
    //   if (!player.questionAnswer) {
    //     continue;
    //   }

    //   const questionAndAnswer = {};
    //   questionAndAnswer["questionAndAnswer"] = JSON.parse(
    //     player.questionAnswer
    //   );

    //   for (let question of Object.keys(
    //     questionAndAnswer["questionAndAnswer"]
    //   )) {
    //     // TODO: what if two players create the same question with different answers?
    //     const quizzes = await Quiz.find({
    //       quizQuestion: question,
    //     });
    //     for (const quiz of quizzes) {
    //       console.log(quiz);
    //       questionAndAnswer["answeredBy"] = player.email;
    //       questionAndAnswer["correctAnswer"] = quiz.correctAnswer;

    //       const creator = await _getUserById(quiz.userId);
    //       questionAndAnswer["createdBy"] = creator.email;
    //       response.push(questionAndAnswer);
    //     }
    //   }
    // }

    const response = [];
    const qAndAs = JSON.parse(room.questionAnswer);
    // console.log(qAndAs);
    for (const qAndA of Object.values(qAndAs)) {
      // console.log(Object.values(qAndA));
      const q = Object.keys(qAndA)[0];
      for (const ans of Object.values(qAndA)) {
        const questionAndAnswer = { question: q };

        // TODO: what if two players create the same question with different answers?
        const quiz = await Quiz.findOne({
          quizQuestion: q,
        });

        questionAndAnswer["answeredBy"] = ans.player; // player.email;
        questionAndAnswer["answer"] = ans.answer;
        questionAndAnswer["correctAnswer"] = quiz.correctAnswer;

        const creator = await _getUserById(quiz.userId);
        questionAndAnswer["createdBy"] = creator.email;
        response.push(questionAndAnswer);
      }
    }

    // console.log(response);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const submitAnswers = async (req, res) => {
  const { userId, answers } = req.body;

  try {
    const user = await _getUserById(userId);

    if (!user) {
      throw Error("Invalid user");
    }

    const room = await _getRoomById(user.roomId);

    if (!room) {
      throw Error("User is not joined to a room");
    }

    const quizzes = await _getQuizzesByRoom(room.roomId);
    const answerMap = new Map();
    for (let answer of answers) {
      answerMap.set(answer.quizQuestion, {
        answer: answer.playerAnswer,
        player: user.email,
      });
    }

    const startTime = new Date();
    const endTime = room.answerRoundEnd;
    const duration = endTime - startTime;

    if (duration > 0 || true) {
      // A player is trying to access quizzes before the game ended (so correct answer is not there)
      for (let quiz of quizzes) {
        if (quiz.userId == user.userId) {
          continue;
        }

        if (answerMap.has(quiz.quizQuestion)) {
          if (answerMap.get(quiz.quizQuestion).answer == quiz.correctAnswer) {
            user.score += 1;
            await user.save();
          }
        }
      }

      if (room.questionAnswer) {
        const existingData = JSON.parse(room.questionAnswer);
        const data = Object.fromEntries(answerMap);
        const newData = [...existingData, data];
        room.questionAnswer = JSON.stringify(newData);
      } else {
        room.questionAnswer = JSON.stringify([Object.fromEntries(answerMap)]);
      }
      await room.save();
      await user.save();
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Times up!" });
      return;
    }

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
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

    res.status(StatusCodes.OK).json({ remainingTime: `${duration / 1000}s` });
  } catch (error) {
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
