import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";

import "./LeaderboardPage.css";
import FormInputComponent from "../components/FormInputComponent";
import ButtonComponent from "../components/ButtonComponent";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRoomContext } from "../hook/useRoomContext";
import { useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hook/useAuthContext";
import { useGameContext } from "../hook/useGameContext";

function createData(name, score) {
  return { name, score };
}

const rows = [
  createData("Player 1", 100),
  createData("Player 2", 80),
  createData("Player 3", 85),
  createData("Player 4", 85),
  createData("Player 5", 21),
  createData("Player 6", 85),
  createData("Player 7", 40),
  createData("Player 8", 100),
  createData("Player 9", 100),
  createData("Player 9", 100),
  createData("Player 10", 100),
];

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { room } = useRoomContext();
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
            players.push({ name: player.email, score: player.score });
          }

          setPlayersInRoom(players);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (room) {
      getAndSetRoomPlayers(room.roomId);
    } else {
      console.error("Room destroyed");
    }
  }, []);

  return (
    <Grid container columns={16}>
      <Grid size={8}>
        <div className="header-container">
          <div className="header">QuizzyPals</div>
          <div className="three-btn-container ">
            <div className="button-container">
              {/* <ButtonComponent
                className="leaderboard-btns"
                label={"Start new game"}
                onClick={() => navigate("/createquiz")}
              /> */}
            </div>
            <div>
              <ButtonComponent
                className="leaderboard-btns"
                label={"Go to lobby"}
                onClick={() => navigate("/roomlobby")}
              />
            </div>
            <div>
              <ButtonComponent
                className="leaderboard-btns"
                label={"Exit to home"}
                onClick={() => navigate("/")}
              />
            </div>
          </div>
        </div>
      </Grid>
      <Grid size={8}>
        <div className="page-title-container">
          <div className="page-title">LEADERBOARD</div>
          <div className="sub-title">RoomCode: {room && room.roomId}</div>

          <div className="player-list-box-outer">
            <div className="players">Players</div>
            <div className="player-list-box-inner">
              <table className="player-score-table">
                <thead>
                  <tr>
                    <th>Player Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {playersInRoom.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default LeaderboardPage;
