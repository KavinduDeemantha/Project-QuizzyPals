const handleAnswerRoundTimesUpNonHost = (ws, duration) => {
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
  console.log("Starting game...");
  const roomData = rooms.get(data.roomId).data;

  const time1 = new Date();
  const time2 = new Date(roomData.endTime);

  const duration = time2 - time1;

  const timerId = setTimeout(() => {
    if (!rooms.has(data.roomId)) {
      return;
    }

    ws.send(
      JSON.stringify({
        type: "ANSWER_ROUND_STARTED",
        message: "Quiz creation time is up! Now answer quizzes!",
      })
    );

    let _time1 = new Date(roomData.startTime);
    let _time2 = new Date(roomData.endTime);
    let _duration = _time2 - _time1;

    handleAnswerRoundTimesUpNonHost(ws, _duration);
  }, duration);

  ws.send(
    JSON.stringify({
      type: "GAME_STARTED",
      duration: duration,
    })
  );
};

const handleAnswerRoundTimesUp = (ws, rooms, data) => {
  const roomData = rooms.get(data.roomId).data;

  const time1 = new Date(roomData.startTime);
  const time2 = new Date(roomData.endTime);
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
  console.log("Starting game...");

  console.log(data);

  // If the roomId is in the rooms datastructure already means that a room is
  // created before and still in use. So we return "You can't create a room with
  // that id".
  if (rooms.has(data.roomId)) {
    console.log("debug: ", data.userId, rooms.get(data.roomId).data.userId);
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

  const time1 = new Date();
  const time2 = new Date(time1);
  time2.setHours(time2.getHours() + data.durationHours);
  time2.setMinutes(time2.getMinutes() + data.durationMinutes);
  time2.setSeconds(time2.getSeconds() + data.durationSeconds);

  const duration = time2 - time1;

  // Start a timer to keep track of the game state. When the time interval is
  // finished we send a ws message to the client to the change its state.
  const timerId = setTimeout(() => {
    ws.send(
      JSON.stringify({
        type: "ANSWER_ROUND_STARTED",
        message: "Quiz creation time is up! Now answer quizzes!",
      })
    );

    let _roomData = rooms.get(data.roomId);
    // We change the game state of the room to answer round started in our rooms
    // datastructure.
    _roomData.gameState = "ANSWER_ROUND_STARTED";
    rooms.set(data.roomId, _roomData);

    // When the answer round ended we send a request to the client to change its
    // state.
    handleAnswerRoundTimesUp(ws, rooms, data);
  }, duration);

  rooms.set(data.roomId, {
    timerId: timerId,
    data: {
      ...data,
      startTime: time1,
      endTime: time2,
    },
    gameState: "GAME_STARTED",
  });

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
  console.log("Game ending...");

  // console.log(rooms);

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

  clearTimeout(roomData.timerId);

  rooms.delete(data.roomId);

  ws.send(
    JSON.stringify({
      type: "GAME_ENDED",
      room: data.roomId,
      message: "Game ended by the host!",
    })
  );
};

const messageHandler = (ws, rooms) => {
  function incoming(msg) {
    console.log(`Message received: ${msg}`);
    const data = JSON.parse(msg);

    switch (data.type) {
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
      default:
        ws.send("Unknown command type");
    }
  }

  return incoming;
};

module.exports = messageHandler;
