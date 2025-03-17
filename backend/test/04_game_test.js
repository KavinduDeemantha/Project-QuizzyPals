const assert = require("assert");

let JWT = "1234";
let activeUserId = "1234";
let activeRoomId = "1234";
const userEmail = "damian@gmail.com";
const password = "12345678";

const gameData = {
  userId: "",
  durationHours: 0,
  durationMinutes: 0,
  durationSeconds: 10,
  answerDurationMinutes: 0,
  answerDurationSeconds: 10,
  saveData: false,
};

describe("Game API", () => {
  after("Delete Room - Damian", async () => {
    await fetch(`http://localhost:4000/api/rooms/deleteroom/${activeUserId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.message, "Room deleted successfully");
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Sign In - Damian", async () => {
    const userData = {
      email: userEmail,
      password: password,
    };

    await fetch("http://localhost:4000/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.notStrictEqual(data.userJWT, "");

        JWT = data.userJWT;
        activeUserId = data.userId;
      })
      .catch((error) => {
        throw error;
      });
  });

  var johnJWT = "";
  var johnUserId = "";
  it("Sign In - Kavindu", async () => {
    const userData = {
      email: "john@gmail.com",
      password: "12345678",
    };

    await fetch("http://localhost:4000/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.notStrictEqual(data.userJWT, "");

        johnJWT = data.userJWT;
        johnUserId = data.userId;
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Create Room - Damian", async () => {
    const roomData = {
      host: userEmail,
    };

    await fetch("http://localhost:4000/api/rooms/createroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 201);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.host, userEmail);

        activeRoomId = data.roomId;
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Join Room - Damian", async () => {
    const roomData = {
      userEmail: userEmail,
      roomId: activeRoomId,
    };

    await fetch("http://localhost:4000/api/rooms/joinroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.host, userEmail);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Join Room - Kavindu", async () => {
    const roomData = {
      userEmail: "john@gmail.com",
      roomId: activeRoomId,
    };

    await fetch("http://localhost:4000/api/rooms/joinroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.host, userEmail);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Start Game - Host", async () => {
    gameData.userId = activeUserId;

    await fetch("http://localhost:4000/api/game/startgame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(
          data.message,
          "Game started",
          "messages do not match"
        );
        assert.strictEqual(
          data.room.roomId,
          activeRoomId,
          "room ids do not match"
        );
        assert.strictEqual(data.room.host, userEmail, "host do not match");
        assert.notStrictEqual(data.room.gameStart, null);
        assert.notStrictEqual(data.room.gameEnd, null);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("End Game - Host", async () => {
    const endRequestData = {
      userId: activeUserId,
      type: "GAME_END",
    };

    await fetch("http://localhost:4000/api/game/endgame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(endRequestData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.host, activeUserId);
        assert.strictEqual(data.gameStart, null);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Start Game - Damian", async () => {
    gameData.userId = activeUserId;

    await fetch("http://localhost:4000/api/game/startgame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(
          data.message,
          "Game started",
          "messages do not match"
        );
        assert.strictEqual(
          data.room.roomId,
          activeRoomId,
          "room ids do not match"
        );
        assert.strictEqual(data.room.host, userEmail, "host do not match");
        assert.notStrictEqual(data.room.gameStart, null);
        assert.notStrictEqual(data.room.gameEnd, null);
      })
      .catch((error) => {
        throw error;
      });
  });

  const damiansQuizData = {
    userId: activeUserId,
    quizQuestion: "What is your born country?",
    quizAnswer: JSON.stringify(["SL", "UK", "US", "AU"]),
    correctAnswer: "SL",
  };

  it("Create New Quiz - Damian", async () => {
    damiansQuizData.userId = activeUserId;
    await fetch("http://localhost:4000/api/game/createquiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(damiansQuizData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        damiansQuizData.quizId = data.quizId;
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.quizQuestion, damiansQuizData.quizQuestion);
        assert.strictEqual(data.userId, damiansQuizData.userId);
        assert.strictEqual(data.correctAnswer, damiansQuizData.correctAnswer);
        assert.strictEqual(data.quizAnswer, damiansQuizData.quizAnswer);
      })
      .catch((error) => {
        throw error;
      });
  });

  const johnsQuizData = {
    userId: johnUserId,
    quizQuestion: "What is your favourite color?",
    quizAnswer: JSON.stringify(["Red", "Green", "Blue"]),
    correctAnswer: "Green",
  };

  it("Create New Quiz - Kavindu", async () => {
    johnsQuizData.userId = johnUserId;

    await fetch("http://localhost:4000/api/game/createquiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${johnJWT}`,
      },
      body: JSON.stringify(johnsQuizData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        johnsQuizData.quizId = data.quizId;
        assert.strictEqual(data.roomId, activeRoomId);
        assert.strictEqual(data.quizQuestion, johnsQuizData.quizQuestion);
        assert.strictEqual(data.userId, johnsQuizData.userId);
        assert.strictEqual(data.correctAnswer, johnsQuizData.correctAnswer);
        assert.strictEqual(data.quizAnswer, johnsQuizData.quizAnswer);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Please wait game is playing underneath...", () => {});

  it("Quiz creation round ended!", async function () {
    this.timeout(gameData.durationSeconds + 1000);
    await new Promise((resolve) =>
      setTimeout(resolve, gameData.durationSeconds)
    );
  });

  it("Get Quizzes - Damian", async function () {
    await fetch(`http://localhost:4000/api/game/getquizzes/${activeUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        const quiz = data[0];
        assert.strictEqual(quiz["question"], johnsQuizData.quizQuestion);
        assert.strictEqual(quiz["answer"], johnsQuizData.quizAnswer);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Get Quizzes - Kavindu", async function () {
    await fetch(`http://localhost:4000/api/game/getquizzes/${johnUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${johnJWT}`,
      },
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        const quiz = data[0];
        assert.strictEqual(quiz["question"], damiansQuizData.quizQuestion);
        assert.strictEqual(quiz["answer"], damiansQuizData.quizAnswer);
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Please wait game is playing underneath...", () => {});

  it("Quiz answer round started!", async function () {
    this.timeout(gameData.answerDurationSeconds + 1000);
    await new Promise((resolve) =>
      setTimeout(resolve, gameData.answerDurationSeconds)
    );
  });

  it("Answer Quizzes - Damian", async function () {
    const answerData = {
      userId: activeUserId,
      quizId: johnsQuizData.quizId,
      quizQuestion: johnsQuizData.quizQuestion,
      playerAnswer: johnsQuizData.correctAnswer,
    };

    await fetch(`http://localhost:4000/api/game/submitanswers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify(answerData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data["message"], "Answer submitted successfully!");
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Answer Quizzes - Kavindu", async function () {
    const answerData = {
      userId: johnUserId,
      quizId: damiansQuizData.quizId,
      quizQuestion: damiansQuizData.quizQuestion,
      playerAnswer: damiansQuizData.correctAnswer,
    };

    await fetch(`http://localhost:4000/api/game/submitanswers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${johnJWT}`,
      },
      body: JSON.stringify(answerData),
    })
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data["message"], "Answer submitted successfully!");
      })
      .catch((error) => {
        throw error;
      });
  });

  it("Please wait game is playing underneath...", () => {});

  it("Summary round started!", async function () {
    this.timeout(gameData.answerDurationSeconds + 1000);
    await new Promise((resolve) =>
      setTimeout(resolve, gameData.answerDurationSeconds)
    );
  });

  it("Summary Page", async function () {
    const answerData = {
      userId: johnUserId,
      quizId: damiansQuizData.quizId,
      quizQuestion: damiansQuizData.quizQuestion,
      playerAnswer: damiansQuizData.correctAnswer,
    };

    await fetch(
      `http://localhost:4000/api/game/get-all-player-answers/${activeRoomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${johnJWT}`,
        },
      }
    )
      .then((res) => {
        assert.strictEqual(res.status, 200);

        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        assert.strictEqual(data[0]["quizId"], johnsQuizData.quizId);
        assert.strictEqual(data[1]["quizId"], damiansQuizData.quizId);
      })
      .catch((error) => {
        throw error;
      });
  });
});
