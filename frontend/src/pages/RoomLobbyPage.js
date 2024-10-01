import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';

import './RoomLobbyPage.css';
import FormInputComponent from '../components/FormInputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoomLobbyPage = () => {
    const navigate = useNavigate();
    const [playersInRoom, setPlayersInRoom] = useState(['Player 1', 'Player 2', 'Player 3']);

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
                        <ButtonComponent label={"Start Game"} onClick={() => navigate('/gameround')} />
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

                    <div className="player-list-box-outer">
                        <div style={{ fontSize: 24, marginBottom: 10 }}>Players</div>
                        <div className="player-list-box-inner">
                            <List>
                                {
                                    playersInRoom.map((item) => {
                                        return (
                                            <ListItem>
                                                <ListItemText style={{ textAlign: 'center' }} primary={item} />
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default RoomLobbyPage;
