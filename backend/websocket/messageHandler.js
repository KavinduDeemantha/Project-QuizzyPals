const handleAnswerRoundTimesUpNonHost = (ws, duration, timerId) => {
  clearTimeout(timerId);

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        type: "GAME_ENDED",
        message: "Time's up! Game over!",
      })
    );
  }, duration);
};

const handleGameStartForNonHost = (ws, rooms, data) => {
  // console.log("Starting game...");

  const roomData = rooms.get(data.roomId).data;
  const time1 = new Date();
  const time2 = new Date(roomData.endTime);
  const time3 = new Date(roomData.endAnswerTime);

  const duration = time2 - time1;
  const duration2 = time3 - time2;

  const timerId = setTimeout(() => {
    if (!rooms.has(data.roomId)) {
      return;
    }

    ws.send(
      JSON.stringify({
        type: "ANSWER_ROUND_STARTED",
        message: "Quiz creation time is up! Now answer quizzes!",
        duration: duration2,
      })
    );

    handleAnswerRoundTimesUpNonHost(ws, duration2, timerId);
  }, duration);

  ws.send(
    JSON.stringify({
      type: "GAME_STARTED",
      duration: duration,
    })
  );
};

const handleAnswerRoundTimesUp = (ws, rooms, data) => {
  // console.log("Ending answer round...");
  const roomData = rooms.get(data.roomId).data;

  const time1 = new Date(roomData.endTime);
  const time2 = new Date(roomData.endAnswerTime);
  const duration = time2 - time1;

  setTimeout(() => {
    if (!rooms.has(data.roomId)) {
      return;
    }
    ws.send(
      JSON.stringify({
        type: "GAME_ENDED",
        message: "Time's up! Game over!",
      })
    );

    rooms.delete(data.roomId);
  }, duration);
};

// Handle the request to start the game from user.
const handleGameStart = (ws, rooms, data) => {
  // console.log("Starting game...");

  // If the roomId is in the rooms datastructure already means that a room is
  // created before and still in use. So we return "You can't create a room with
  // that id".
  if (rooms.has(data.roomId)) {
    const gameState = rooms.get(data.roomId)?.gameState;
    if (
      gameState != "GAME_NOT_STARTED" ||
      gameState === "GAME_ENDED" ||
      gameState === undefined ||
      gameState === null
    ) {
      if (data.userId == rooms.get(data.roomId).data.userId) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "Game has already started!",
          })
        );
      } else {
        handleGameStartForNonHost(ws, rooms, data);
      }
      return;
    }
  }

  const time1 = new Date();
  const time2 = new Date(time1);
  time2.setHours(time2.getHours() + data.durationHours);
  time2.setMinutes(time2.getMinutes() + data.durationMinutes);
  time2.setSeconds(time2.getSeconds() + data.durationSeconds);

  const time3 = new Date(time2);
  time3.setMinutes(time3.getMinutes() + data.answerDurationMinutes);
  time3.setSeconds(time3.getSeconds() + data.answerDurationSeconds);

  // Quiz creation duration
  const duration = time2 - time1;
  // Answering duration
  const duration2 = time3 - time2;

  // Start a timer to keep track of the game state. When the time interval is
  // finished we send a ws message to the client to the change its state.
  const timerId = setTimeout(() => {
    ws.send(
      JSON.stringify({
        type: "ANSWER_ROUND_STARTED",
        message: "Quiz creation time is up! Now answer quizzes!",
        duration: duration2,
      })
    );

    const _roomData = rooms.get(data.roomId);
    if (!_roomData) {
      console.error("Room data empty!");
      return;
    }
    // We change the game state of the room to answer round started in our rooms
    // datastructure.
    _roomData.gameState = "ANSWER_ROUND_STARTED";
    rooms.set(data.roomId, _roomData);

    // When the answer round ended we send a request to the client to change its
    // state.
    handleAnswerRoundTimesUp(ws, rooms, data);
  }, duration);

  const room = rooms.get(data.roomId);
  const roomData = room ? room.data : {};

  // room.gameStat = "GAME_STARTED";
  // room.timerId = timerId;
  // roomData.startTime = time1;
  // roomData.endTime = time2;

  rooms.set(data.roomId, {
    timerId: timerId,
    data: {
      ...data,
      ...roomData,
      startTime: time1,
      endTime: time2,
      endAnswerTime: time3,
    },
    gameState: "GAME_STARTED",
  });

  if (!("players" in roomData)) {
    roomData["players"] = [ws];
  } else {
    roomData["players"].push(ws);
  }

  // console.log(rooms);

  // Let other players know that the host has started the game
  if ("players" in roomData) {
    for (const player of roomData.players) {
      player.send(
        JSON.stringify({
          type: "GAME_STARTED_BY_HOST",
          room: data.roomId,
          message: "Game started by the host",
        })
      );
    }
  }

  ws.send(
    JSON.stringify({
      type: "GAME_STARTED",
      duration: duration,
    })
  );
};

const handleAnswerRound = (ws, rooms, data) => {
  if (!rooms.has(data.roomId)) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "game has not started yet!",
      })
    );
    return;
  }

  const room = rooms.get(data.roomId);
  const roomData = room.data;

  if (roomData.gameState !== "GAME_STARTED") {
    ws.send(
      JSON.stringify({
        type: "INFO",
        message: "please wait others still creating quizzes!",
      })
    );
    return;
  }

  handleAnswerRound(ws, rooms, data);

  ws.send(
    JSON.stringify({
      type: "ANSWER_ROUND_STARTED",
      duration: duration,
    })
  );
};

const handleGameEnd = (ws, rooms, data) => {
  // console.log("Game ending...");

  if (!rooms.has(data.roomId)) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Game has not started yet!",
      })
    );
    return;
  }

  const roomData = rooms.get(data.roomId);
  if (roomData.data.userId !== data.userId) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Only the host can end the game!",
      })
    );
    return;
  }

  if ("players" in roomData.data) {
    for (const player of roomData.data.players) {
      player.send(
        JSON.stringify({
          type: "GAME_ENDED",
          room: data.roomId,
          message: "Game ended by the host",
        })
      );
    }
  }

  clearTimeout(roomData.timerId);

  rooms.delete(data.roomId);

  ws.send(
    JSON.stringify({
      type: "GAME_ENDED",
      room: data.roomId,
      message: "You ended the game before!",
    })
  );
};

const handleGameStatus = (ws, rooms, data) => {
  // console.log("Finding game status...");

  if (rooms.has(data.roomId)) {
    const roomData = rooms.get(data.roomId);
    ws.send(
      JSON.stringify({
        type: "GAME_STATUS",
        status: roomData.gameState,
      })
    );
  } else {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "No game in the room",
      })
    );
  }
};

const handleRoomJoin = (ws, rooms, data) => {
  if (!rooms.has(data.roomId)) {
    rooms.set(data.roomId, {
      data: {},
      gameState: "GAME_NOT_STARTED",
    });
  }
  const roomData = rooms.get(data.roomId).data;
  if (!("players" in roomData)) {
    roomData["players"] = [ws];
  } else {
    roomData["players"].push(ws);
  }

  for (const player of roomData["players"]) {
    player.send(
      JSON.stringify({
        type: "JOINED_TO_ROOM",
        status: roomData.gameState,
      })
    );
  }
};

const handleRoomExit = (ws, rooms, data) => {
  if (!rooms.has(data.roomId)) {
    rooms.set(data.roomId, {
      data: {},
      gameState: "GAME_NOT_STARTED",
    });
  }
  const roomData = rooms.get(data.roomId).data;
  if ("players" in roomData) {
    let n = roomData["players"].length;
    for (let i = 0; i < n; i++) {
      if (roomData["players"][i] === ws) {
        roomData["players"].splice(i, 1);
        break;
      }
    }
  }

  if (roomData["players"]) {
    for (const player of roomData["players"]) {
      player.send(
        JSON.stringify({
          type: "EXIT_FROM_ROOM",
          status: roomData.gameState,
        })
      );
    }
  }
};

const messageHandler = (ws, rooms) => {
  function incoming(msg) {
    // console.log(`Message received: ${msg}`);
    const data = JSON.parse(msg);

    switch (data.type) {
      case "JOIN_ROOM": {
        handleRoomJoin(ws, rooms, data);
        break;
      }
      case "EXIT_ROOM": {
        handleRoomExit(ws, rooms, data);
        break;
      }
      case "GAME_START": {
        handleGameStart(ws, rooms, data);
        break;
      }
      case "ANSWER_ROUND_START": {
        handleAnswerRound(ws, rooms, data);
        break;
      }
      case "GAME_END": {
        handleGameEnd(ws, rooms, data);
        break;
      }
      case "GAME_STATUS": {
        handleGameStatus(ws, rooms, data);
        break;
      }
      default:
        ws.send("Unknown command type");
    }
  }

  return incoming;
};

module.exports = messageHandler;
