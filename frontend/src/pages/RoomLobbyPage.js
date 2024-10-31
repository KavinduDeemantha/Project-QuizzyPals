import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";

import "./RoomLobbyPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../hook/useRoomContext";
import { useEffect } from "react";

const RoomLobbyPage = () => {
  const navigate = useNavigate();
  const { room } = useRoomContext();

  const [playersInRoom, setPlayersInRoom] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
  ]);

  useEffect(() => {
    if (!room) {
      navigate("/");
    }
  }, []);

  return (
    <Grid container columns={16}>
      <Grid size={8}>
        <div className="header-container">
          <div className="header">QuizzyPals</div>
          <div className="start-btn">
            <ButtonComponent
              label={"Start Game"}
              onClick={() => navigate("/createquiz")}
            />
          </div>
        </div>
      </Grid>
      <Grid size={8}>
        <div className="lobby-container">
          <div className="page-title">LOBBY</div>
          <div className="sub-title">Room Id: {room._id}</div>

          <div className="player-list-box-outer">
            <div className="players">Players</div>
            <div className="player-list-box-inner">
              <List>
                {playersInRoom.map((item, index) => {
                  return (
                    <ListItem key={index}>
                      <ListItemText className="players-list" primary={item} />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default RoomLobbyPage;
