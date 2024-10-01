import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";

import "./RoomLobbyPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RoomLobbyPage = () => {
  const navigate = useNavigate();
  const [playersInRoom, setPlayersInRoom] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
  ]);

<<<<<<< HEAD
    return (
        <Grid container columns={16}>
            <Grid size={8}>
                <div style={{
                    borderRight: '1px solid black',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <div className='bigname'>
                        QuizzyPals
                    </div>
                    <div style={{
                        marginTop: 200
                    }}>
                        <ButtonComponent label={"Start Game"} onClick={() => navigate('/createquiz')} />
                    </div>
                </div>
            </Grid>
            <Grid size={8}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyItems: 'center',
                }}>
                    <div className='pagetitle'>LOBBY</div>
                    <div className='subtitle'>RoomCode</div>
=======
  return (
    <Grid container columns={16}>
      <Grid size={8}>
        <div className="header-container">
          <div className="header">QuizzyPals</div>
          <div className="start-btn">
            <ButtonComponent
              label={"Start Game"}
              onClick={() => navigate("/gameround")}
            />
          </div>
        </div>
      </Grid>
      <Grid size={8}>
        <div className="lobby-container">
          <div className="page-title">LOBBY</div>
          <div className="sub-title">RoomCode</div>
>>>>>>> eb27995 (removed inline css and set them in separare css files (#12))

          <div className="player-list-box-outer">
            <div className="players">Players</div>
            <div className="player-list-box-inner">
              <List>
                {playersInRoom.map((item) => {
                  return (
                    <ListItem>
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
