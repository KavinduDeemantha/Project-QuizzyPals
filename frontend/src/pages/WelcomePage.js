import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';

import './WelcomePage.css';
import FormInputComponent from '../components/FormInputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState();
    const [joinWithRoom, setJoinWithRoom] = useState(false);

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
                </div>
            </Grid>
            <Grid size={8}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyItems: 'center',
                }}>
                    <div className='pagetitle'>WELCOME</div>
                    <div className='subtitle'>Username</div>

                    {joinWithRoom
                        ?
                        <>
                            <FormInputComponent
                                placeholder={"Room Code"}
                                type={"text"}
                                label={"Enter the room code"}
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                            />

                            <div style={{
                                marginTop: 20,
                            }}>
                                <ButtonComponent label={"Join Game"} onClick={() => navigate('/roomlobby')} />
                            </div>
                        </>
                        :
                        <>
                        <div style={{
                            marginTop: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 20,
                        }}>
                            <ButtonComponent label={"Create a Room"} />
                            <ButtonComponent label={"Join a Room"} onClick={() => setJoinWithRoom(true)} />
                        </div>
                        </>
                    }
                </div>
            </Grid>
        </Grid>
    );
};

export default WelcomePage;
