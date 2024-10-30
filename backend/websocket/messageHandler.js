const handleGameStart = (ws, rooms, data) => {
  if (rooms.has(data.roomId)) {
    ws.send("Error: game has already started!");
    return;
  }

  const time1 = new Date(data.startTime);
  const time2 = new Date(data.endTime);

  const duration = time2 - time1;

  const timerId = setTimeout(() => {
    ws.send(
      JSON.stringify({
        type: "ANSWER_ROUND_STARTED",
        message: "Quiz creation time is up! Now answer quizzes!",
      })
    );
  }, duration);

  rooms.set(data.roomId, { timerId, data });

  ws.send(
    JSON.stringify({
      type: "GAME_STARTED",
      duration: duration,
    })
  );
};

const handleAnswerRound = (ws, rooms, data) => {
  if (!rooms.has(data.roomId)) {
    ws.send("Error: game has not started!");
    return;
  }

  const room = rooms.get(data.roomId);
  const roomData = room.data;

  const time1 = new Date(roomData.startTime);
  const time2 = new Date(roomData.endTime);

  const duration = time2 - time1;

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        type: "GAME_ENDED",
        message: "Time's up! Game over!",
      })
    );

    rooms.delete(data.roomId);
  }, duration);

  ws.send(
    JSON.stringify({
      type: "ANSWER_ROUND_STARTED",
      duration: duration,
    })
  );
};

const handleGameEnd = (ws, rooms, data) => {
  if (!rooms.has(data.roomId)) {
    ws.send("Error: game has not started!");
    return;
  }

  const roomData = rooms.get(data.roomId);
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
