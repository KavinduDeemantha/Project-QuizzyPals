import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import axios from "axios";

import "./RoomLobbyPage.css";
import ButtonComponent from "../components/ButtonComponent";
import {
  List,
  ListItem,
  Dialog,
  DialogTitle,
  ListItemText,
  responsiveFontSizes,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../hook/useRoomContext";
import { useEffect } from "react";
import { useAuthContext } from "../hook/useAuthContext";
import { useGameContext } from "../hook/useGameContext";

const RoomLobbyPage = () => {
  const navigate = useNavigate();
  const gameContext = useGameContext();
  const { socket, game, dispatch } = gameContext;

  const [error, setError] = useState(null);
  const [startDialogVisible, setStartDialogVisible] = useState(false);
  const [saveGameData, setSaveGameData] = useState(false);
  const [gameDurationSeconds, setGameDurationSeconds] = useState(0);
  const [gameAnswerDurationSeconds, setGameAnswerDurationSeconds] = useState(0);
  const [gameDurationMinutes, setGameDurationMinutes] = useState(0);
  const [gameDurationAnswerMinutes, setGameAnswerDurationMinutes] = useState(0);
  const roomContext = useRoomContext();
  const { room } = roomContext;
  const { user } = useAuthContext();

  const [playersInRoom, setPlayersInRoom] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
  ]);

  const requestHeaders = {
    headers: {
      Authorization: `Bearer ${user.userJWT}`,
      "Content-Type": "application/json",
    },
  };

  const handleSaveDataSwitch = (e) => {
    setSaveGameData(e.target.checked);
  };

  const handleSetGameDurationSeconds = (val) => {
    val = parseInt(val);
    if (val < 0 || val > 59) {
      return;
    }

    setGameDurationSeconds(val);
  };
  const handleSetGameDurationMinutes = (val) => {
    val = parseInt(val);
    if (val === "") {
      setGameDurationMinutes(1);
      return;
    }
    if (val < 0 || val > 59) {
      return;
    }

    setGameDurationMinutes(val);
  };

  const handleSetGameAnswerDurationSeconds = (val) => {
    val = parseInt(val);
    if (val < 0 || val > 59) {
      return;
    }

    setGameAnswerDurationSeconds(val);
  };
  const handleSetGameAnswerDurationMinutes = (val) => {
    val = parseInt(val);
    if (val === "") {
      setGameDurationMinutes(1);
      return;
    }
    if (val < 0 || val > 59) {
      return;
    }

    setGameAnswerDurationMinutes(val);
  };

  const getAndSetRoomPlayers = async (roomId) => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/rooms/getroommates/${roomId}`,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          const players = [];
          for (let player of response.data) {
            players.push(player.email);
          }

          setPlayersInRoom(players);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logError = (error) => {
    if (error) {
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            console.log(error.response.data.message);
            setError(error.response.data.message);
          } else if (error.response.data.error) {
            console.log(error.response.data.error);
            setError(error.response.data.error);
          } else {
            console.log(error.response.data);
            setError(error.response.data);
          }
        } else {
          console.log(error.response);
        }
      } else {
        console.log(error);
      }
    }
  };

  const handleStartGameButton = async (e) => {
    if (room.host === user.email) {
      setStartDialogVisible(true);
    } else {
      await startGame();
    }
  };

  const startGameRequest = async (gameData) => {
    await axios
      .post(
        "http://localhost:4000/api/game/startgame",
        gameData,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          if (response.data.message === "Game started") {
            const tmpGameData = gameData;
            const startGameRequest = {
              type: "GAME_START",
              ...tmpGameData,
            };

            startGameRequest.answerDurationSeconds -= 5;
            startGameRequest.durationSeconds -= 5;

            socket.current.send(JSON.stringify(startGameRequest));
            roomContext.dispatch({
              type: "ROOM_UPDATE",
              payload: response.data.room,
            });
            navigate("/createquiz");
          }
        }
      })
      .catch(logError);
  };

  const startGame = async () => {
    // This is because if gameContext keeps previous game states as a cleaning
    // step we clear the payload
    dispatch({ type: "NEW_GAME", payload: null });

    const gameData = {
      userId: user.userId,
      roomId: room.roomId,
      saveData: saveGameData,
      answerDurationMinutes: gameDurationAnswerMinutes,
      answerDurationSeconds: gameAnswerDurationSeconds + 5,
      durationHours: 0,
      durationMinutes: gameDurationMinutes,
      durationSeconds: gameDurationSeconds + 5,
    };

    await startGameRequest(gameData);

    // if (
    //   (gameData.answerDurationMinutes !== 0 ||
    //     gameData.answerDurationSeconds !== 0) &&
    //   (gameData.durationMinutes !== 0 || gameData.answerDurationSeconds !== 0)
    // ) {
    //   await startGameRequest(gameData);
    // } else {
    //   if (room.host === user.email) {
    //     alert("Please select time durations");
    //   } else {
    //     await startGameRequest(gameData);
    //   }
    // }

    // if (
    //   gameData.answerDurationMinutes === "" ||
    //   gameData.durationMinutes === "" ||
    //   gameData.answerDurationMinutes === 0 ||
    //   gameData.durationMinutes === 0
    // ) {
    //   if (room.host === user.email) {
    //     alert("Please select time durations");
    //   }
    // } else {
    //   await startGameRequest(gameData);
    // }
  };

  const handleEndGameButton = async (e) => {
    const endGameRequest = {
      type: "GAME_END",
      userId: user.userId,
      roomId: room.roomId,
    };

    if (room.host !== user.email) {
      // I am not the host
      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/game/endgame/${user.userId}`,
          requestHeaders
        )
        .then((response) => {
          if (response.status === 200) {
            endGameRequest.type = "EXIT_ROOM";
            socket.current.send(JSON.stringify(endGameRequest));
            endGameRequest.type = "GAME_END";
            navigate("/");
          }
        })
        .catch(logError);
    } else {
      // I am the host
      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/game/endgame/${user.userId}`,
          requestHeaders
        )
        .then((response) => {
          if (response.status === 200) {
            socket.current.send(JSON.stringify(endGameRequest));
            navigate("/");
          }
        })
        .catch(logError);
    }
  };

  const handleDeleteRoomButton = async (e) => {
    await axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/rooms/deleteroom/${user.userId}`,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch(logError);
  };

  const validateAndStartGame = () => {
    if (!gameDurationMinutes || !gameDurationAnswerMinutes) {
      alert("Please input time duration");
      return;
    }
    setError("");
    startGame();
  };

  useEffect(() => {
    if (!room) {
      navigate("/");
      return;
    }

    getAndSetRoomPlayers(room.roomId);
  }, []);

  useEffect(() => {
    setSaveGameData(room.saveData);

    if (game) {
      if (game.type === "GAME_STARTED_BY_HOST") {
        alert(
          "Host has started the game click on `START GAME` to join the game!"
        );
      } else if (game.type === "JOINED_TO_ROOM") {
        console.log("A new player has joined to the room!");
        getAndSetRoomPlayers(room.roomId);
      } else if (game.type === "EXIT_FROM_ROOM") {
        console.log("A player has left the room!");
        getAndSetRoomPlayers(room.roomId);
      }
    }
  }, [game]);

  return room ? (
    <div>
      <Dialog
        onClose={() => setStartDialogVisible(false)}
        open={startDialogVisible}
      >
        <DialogTitle>Start game settings</DialogTitle>
        <div style={{ display: "flex" }}>
          <TextField
            value={gameDurationMinutes}
            type="number"
            variant="outlined"
            label={"Question Round Duration (minutes)"}
            onChange={(e) => handleSetGameDurationMinutes(e.target.value)}
            className="startGameDialog"
            required={true}
          />
        </div>
        <div style={{ display: "flex" }}>
          <TextField
            value={gameDurationAnswerMinutes}
            type="number"
            variant="outlined"
            label={"Answer Round Duration (minutes)"}
            onChange={(e) => handleSetGameAnswerDurationMinutes(e.target.value)}
            className="startGameDialog"
            required={true}
          />
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={saveGameData}
              onChange={handleSaveDataSwitch}
              defaultChecked
            />
          }
          label="Save Data"
          className="saveDataLabel"
        />
        <ButtonComponent
          label={"Start Game"}
          onClick={(e) => validateAndStartGame()}
        />
      </Dialog>
      <Grid container columns={16}>
        <Grid size={8}>
          <div className="header-container">
            <div className="header">QuizzyPals</div>
            <div className="start-btn lobbyBtnContainer">
              <ButtonComponent
                className={"lobbyBtn"}
                label={"Start Game"}
                onClick={handleStartGameButton}
              />
            </div>
            <div className="end-btn lobbyBtnContainer">
              <ButtonComponent
                className={"lobbyBtn"}
                label={"End Game"}
                onClick={handleEndGameButton}
              />
            </div>
            {room.host === user.email ? (
              <div className="end-btn lobbyBtnContainer">
                <ButtonComponent
                  className={"lobbyBtn"}
                  label={"Delete Room"}
                  onClick={handleDeleteRoomButton}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="end-btn lobbyBtnContainer">
              <ButtonComponent
                className={"lobbyBtn"}
                label={"How to Play?"}
                onClick={() => navigate("/howToPlay")}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </Grid>
        <Grid size={8}>
          <div className="lobby-container">
            <div className="page-title">LOBBY</div>
            <div className="sub-title">Room Id: {room.roomId}</div>

            <div className="player-list-box-outer">
              <div className="players">Players</div>
              <div className="player-list-box-inner">
                <List>
                  {playersInRoom.map((item, index) => {
                    let name = item;
                    if (item === room.host) {
                      name += " (Host)";
                    }
                    if (item === user.email) {
                      name += " (Me)";
                    }

                    return (
                      <ListItem key={index}>
                        <ListItemText className="players-list" primary={name} />
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  ) : (
    <>Room context destroyed in client side</>
  );
};

export default RoomLobbyPage;
