import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import axios from "axios";

import "./RoomLobbyPage.css";
import ButtonComponent from "../components/ButtonComponent";
import {
  List,
  ListItem,
  ListItemText,
  responsiveFontSizes,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../hook/useRoomContext";
import { useEffect } from "react";
import { useAuthContext } from "../hook/useAuthContext";
import { useGameContext } from "../hook/useGameContext";

const RoomLobbyPage = () => {
  const navigate = useNavigate();
  const gameContext = useGameContext();
  const { socket } = gameContext;

  const [error, setError] = useState(null);
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

  // const getRoomId = async () => {
  //   return axios
  //     .get(`${process.env.REACT_APP_BASE_URL}/api/users/roomid/${user.email}`)
  //     .then((response) => {
  //       return response.data;
  //     });
  // };

  const handleStartGameButton = async (e) => {
    const gameData = {
      userId: user.userId,
      durationHours: 0,
      durationMinutes: 0,
      durationSeconds: 6,
    };

    await axios
      .post(
        "http://localhost:4000/api/game/startgame",
        gameData,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          if (response.data.message == "Game started") {
            const startGameRequest = {
              type: "GAME_START",
              ...gameData,
            };

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

  const handleEndGameButton = async (e) => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/game/endgame/${user.userId}`,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          const endGameRequest = {
            type: "GAME_END",
            host: user.userId,
            roomId: room.roomId,
          };

          socket.current.send(JSON.stringify(endGameRequest));
          navigate("/");
        }
      })
      .catch(logError);
  };

  const handleDeleteRoomButton = async (e) => {
    const deleteRoomRequest = {
      userId: user.userID,
    };

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

  // useEffect(() => {
  //   console.log(socket);
  //   if (socket == null) return;

  //   socket.current.onmessage = (msg) => {
  //     const data = JSON.parse(msg.data);
  //     dispatch({ type: data.type, payload: data });
  //     console.log(game);
  //     console.log("Received", msg);
  //   };
  // }, []);

  useEffect(() => {
    if (!room) {
      navigate("/");
      return;
    }

    getAndSetRoomPlayers(room.roomId);
  }, []);

  return room ? (
    <Grid container columns={16}>
      <Grid size={8}>
        <div className="header-container">
          <div className="header">QuizzyPals</div>
          <div className="start-btn">
            <ButtonComponent
              label={"Start Game"}
              onClick={handleStartGameButton}
            />
          </div>
          {room.host === user.email ? (
            <div className="end-btn">
              <ButtonComponent
                label={"End Game"}
                onClick={handleEndGameButton}
              />
            </div>
          ) : (
            <></>
          )}
          {room.host === user.email ? (
            <div className="end-btn">
              <ButtonComponent
                label={"Delete Room"}
                onClick={handleDeleteRoomButton}
              />
            </div>
          ) : (
            <></>
          )}
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
  ) : (
    <>Room context destroyed in client side</>
  );
};

export default RoomLobbyPage;
