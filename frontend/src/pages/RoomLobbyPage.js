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
  DialogContent,
  Typography,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../hook/useRoomContext";
import { useEffect } from "react";
import { useAuthContext } from "../hook/useAuthContext";
import { useGameContext } from "../hook/useGameContext";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const RoomLobbyPage = () => {
  const navigate = useNavigate();
  const gameContext = useGameContext();
  const { socket, game, dispatch } = gameContext;

  const [error, setError] = useState(null);
  const [startDialogVisible, setStartDialogVisible] = useState(false);
  const [endDialogVisible, setEndDialogVisible] = useState(false);
  const [saveGameData, setSaveGameData] = useState(false);
  const [gameDurationSeconds, setGameDurationSeconds] = useState(0);
  const [gameAnswerDurationSeconds, setGameAnswerDurationSeconds] = useState(0);
  const [gameDurationMinutes, setGameDurationMinutes] = useState(1);
  const [gameDurationAnswerMinutes, setGameAnswerDurationMinutes] = useState(1);
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
          } else {
            alert(response.data?.message);
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
  };

  const handleEndGameButton = async (e, endType) => {
    // If host is trying to end the game then ask "Ending game for himself or all?"
    if (user.email === room.host) {
      setEndDialogVisible(true);
      if (endType === "") {
        return;
      }
    }

    const endGameRequest = {
      // endType == EXIT_ROOM means the user is exiting from the current game
      // endType == GAME_END means host is end the game for all users
      // endType == "" means EXIT_ROOM
      type: endType || "EXIT_ROOM",
      userId: user.userId,
      roomId: room.roomId,
    };

    if (room.host !== user.email) {
      // I am not the host
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/game/endgame/`,
          endGameRequest,
          requestHeaders
        )
        .then((response) => {
          if (response.status === 200) {
            socket.current.send(JSON.stringify(endGameRequest));
            navigate("/welcome");
          }
        })
        .catch((error) => {
          logError(error);
          navigate("/welcome");
        });
    } else {
      // I am the host
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/game/endgame/`,
          endGameRequest,
          requestHeaders
        )
        .then((response) => {
          if (response.status === 200) {
            socket.current.send(JSON.stringify(endGameRequest));
            navigate("/welcome");
          }
        })
        .catch(logError);
    }
  };

  const deleteUserByHost = async (targetUserEmail) => {
    const getUserRequest = {
      hostId: user.userId,
      targetUserEmail,
    };

    const targetUserId = await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/users/get-user`,
        getUserRequest,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data["userId"];
        }
      })
      .catch(logError);

    const deleteUserRequest = {
      hostId: user.userId,
      targetUserId,
    };

    await axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/users/${targetUserId}`,
        deleteUserRequest,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          const deletedUser = {
            type: "EXIT_ROOM",
            userId: user.userId,
            roomId: room.roomId,
          };

          socket.current.send(JSON.stringify(deletedUser));
        }
      })
      .catch(logError);

    await getAndSetRoomPlayers(room.roomId);
  };

  const handleKickUserButton = async (targetUserEmail) => {
    const getUserRequest = {
      hostId: user.userId,
      targetUserEmail,
    };

    const targetUserId = await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/users/get-user`,
        getUserRequest,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data["userId"];
        }
      })
      .catch(logError);

    const endGameRequest = {
      type: "EXIT_ROOM",
      userId: targetUserId,
      roomId: room.roomId,
    };

    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/game/endgame/`,
        endGameRequest,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          socket.current.send(JSON.stringify(endGameRequest));
        }
      })
      .catch((error) => {
        logError(error);
      });

    await getAndSetRoomPlayers(room.roomId);
  };

  const handleDeleteRoomButton = async (e) => {
    const deleteRoomRequest = {
      type: "DELETE_ROOM",
      userId: user.userId,
      roomId: room.roomId,
    };

    await axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/rooms/deleteroom/${user.userId}`,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          socket.current.send(JSON.stringify(deleteRoomRequest));
          navigate("/welcome");
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
    if (!user) {
      console.error("User context destroyed in client side");
      navigate("/welcome");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!room) {
      console.error("Room context destroyed in client side");
      navigate("/welcome");
      return;
    }
  }, [room, navigate]);

  useEffect(() => {
    if (!game) {
      console.error("Game context destroyed in client side");
      navigate("/welcome");
      return;
    }

    getAndSetRoomPlayers(room.roomId);
  }, [game, navigate]);

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

  if (!game) {
    console.error("Game context destroyed in client side");
    navigate("/welcome");
    return;
  }
  if (!room) {
    console.error("Room context destroyed in client side");
    navigate("/welcome");
    return;
  }

  return (
    <>
      <Dialog
        onClose={() => setEndDialogVisible(false)}
        open={endDialogVisible}
      >
        <DialogTitle>End game settings</DialogTitle>
        <DialogContent>
          <DialogContentText>This game is ending for all</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color={"error"}
            onClick={(e) => handleEndGameButton(e, "GAME_END")}
          >
            All
          </Button>
          <Button onClick={(e) => handleEndGameButton(e, "EXIT_ROOM")}>
            Me
          </Button>
        </DialogActions>
      </Dialog>

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
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: {
            xs: "center",
            sm: "center",
            md: "space-around",
            lg: "space-evenly",
          },
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Grid item>
          <div
            className="header-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              className="header"
              style={{
                paddingBottom: 50,
              }}
            >
              QuizzyPals
            </div>
            <div className="start-btn lobbyBtnContainer">
              {game ? (
                game.type === "GAME_STARTED" ||
                game.type === "TIME_REMAINING" ? (
                  <ButtonComponent
                    label={"Continue Game"}
                    onClick={(e) => {
                      navigate("/createquiz");
                    }}
                  />
                ) : (
                  <ButtonComponent
                    label={"Start Game"}
                    onClick={handleStartGameButton}
                  />
                )
              ) : (
                <ButtonComponent
                  label={"Start Game"}
                  onClick={handleStartGameButton}
                />
              )}
            </div>
            <div className="end-btn lobbyBtnContainer">
              <ButtonComponent
                className={"lobbyBtn"}
                label={"End Game"}
                // Empty game type is used to handle the case when host trying to end the game
                onClick={(e) => handleEndGameButton(e, "")}
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
        <Grid
          item
          sx={{
            width: 2,
            height: { xs: "0", sm: "0", md: "100vh", lg: "100vh" },
            backgroundColor: "#ccc",
          }}
        ></Grid>
        <Grid
          item
          sx={{
            paddingBottom: { xs: 10, lg: 0 },
          }}
        >
          <div className="lobby-container">
            <div className="page-title">LOBBY</div>
            <div className="sub-title">Room Id: {room.roomId}</div>

            <div className="player-list-box-outer">
              <div className="players">Players</div>
              <div className="player-list-box-inner">
                <List>
                  {playersInRoom.map((curUser, index) => {
                    let name = curUser;
                    if (curUser === room.host) {
                      name = name + " (Host)";
                    }
                    if (curUser === user.email) {
                      name += " (Me)";
                    }

                    return (
                      <ListItem key={index}>
                        <ListItemText className="players-list" primary={name} />
                        {curUser !== room.host && user.email === room.host ? (
                          <>
                            <div
                              title="Kick this user"
                              className="clickable-item"
                              onClick={() => handleKickUserButton(curUser)}
                            >
                              <PersonRemoveIcon color="error" />
                            </div>
                            <div
                              title="Delete this user"
                              className="clickable-item"
                              onClick={() => deleteUserByHost(curUser)}
                            >
                              <DeleteIcon color="error" />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomLobbyPage;
