import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';

import './RoomLobbyPage.css';
import FormInputComponent from '../components/FormInputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, score) {
    return { name, score };
}

const rows = [
    createData('Player 1', 100),
    createData('Player 2', 80),
    createData('Player 3', 85),
    createData('Player 4', 85),
    createData('Player 5', 21),
    createData('Player 6', 85),
    createData('Player 7', 40),
    createData('Player 8', 100),
    createData('Player 9', 100)
];


const LeaderboardPage = () => {
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
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 10,
                        marginTop: 190
                    }}>
                        <div className='button-container'>
                            <ButtonComponent label={"Start new game"} onClick={() => navigate('/createquiz')} />
                        </div>
                        <div>
                            <ButtonComponent label={"Go to lobby"} onClick={() => navigate('/roomlobby')} />
                        </div>
                        <div>
                            <ButtonComponent label={"Exit to home"} onClick={() => navigate('/welcomepage')} />
                        </div>
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
                    <div className='pagetitle'>LEADERBOARD</div>
                    <div className='subtitle'>RoomCode</div>

                    <div className="player-list-box-outer">
                        <div style={{ fontSize: 24, marginBottom: 10 }}>Players</div>
                        <div className="player-list-box-inner">
                            <table className='player-score-table' border='1'>
                                <tr>
                                    <th>Player Name</th>
                                    <th>Score</th>
                                </tr>
                                {rows.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.score}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default LeaderboardPage;
