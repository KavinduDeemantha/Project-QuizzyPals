<<<<<<< HEAD
<<<<<<< HEAD
import {
    Button,
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField
} from '@mui/material';
import { useRef, useState } from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/material';
=======
import { Button, Dialog, DialogTitle, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useState } from 'react';
>>>>>>> 5356109 (Added game quiz creation page (#8))
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleOutlined';

import './GameQuestionRound.css'
import ButtonComponent from '../components/ButtonComponent';
<<<<<<< HEAD
import { styled } from '@mui/system';

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);
=======
>>>>>>> 5356109 (Added game quiz creation page (#8))

const GameQuestionRound = () => {
    const [addedChoices, setAddedChoices] = useState(['Choice A', 'Choice B']);
    const [freeAnswer, setFreeAnswer] = useState('');
    const [newChoiceVisible, setNewChoiceVisible] = useState(false);
    const [newChoiceText, setNewChoiceText] = useState('');
<<<<<<< HEAD
    const questionRef = useRef();
=======
>>>>>>> 5356109 (Added game quiz creation page (#8))
=======
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircleOutlined";

import "./GameQuestionRound.css";
import ButtonComponent from "../components/ButtonComponent";

const GameQuestionRound = () => {
  const [addedChoices, setAddedChoices] = useState(["Choice A", "Choice B"]);
  const [freeAnswer, setFreeAnswer] = useState("");
  const [newChoiceVisible, setNewChoiceVisible] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");
>>>>>>> eb27995 (removed inline css and set them in separare css files (#12))

  const handleAddNewChoice = () => {
    let choiceText = newChoiceText.trim();
    if (choiceText.length !== 0 && choiceText !== "") {
      setAddedChoices([...addedChoices, choiceText]);
    }
    setNewChoiceText("");
  };

  const removeChoice = (choice) => {
    const newChoices = addedChoices;
    newChoices.splice(choice, 1);
    setAddedChoices(newChoices);
  };

<<<<<<< HEAD
    return (
        <div className="main-container">
            <div className="game-round-header">
                <div className="game-round-header-left">
                    <div className="room-code">Room: 0</div>
                    <div className="round-title">Round: 0</div>
                </div>
                <div className="game-round-header-right">
                    <div className="game-timer">
                        01
                    </div>
                </div>
            </div>

            <Dialog onClose={() => setNewChoiceVisible(false)} open={newChoiceVisible}>
                <DialogTitle>Add new choice</DialogTitle>
                <TextField style={{ margin: 10 }} variant="outlined" value={newChoiceText} onChange={e => setNewChoiceText(e.target.value)} placeholder="Enter your answer here" />

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Button style={{ margin: 10, width: 100 }} variant="contained" color="error" onClick={() => setNewChoiceVisible(false)}>Close</Button>
                    <Button style={{ margin: 10, width: 100 }} variant="contained" onClick={handleAddNewChoice}>Add</Button>
                </div>
            </Dialog>

            <div className="question-outer-container">
                <div className="topic-label">Write a question to ask from your friends.</div>
                <div className="question-inner-container">
<<<<<<< HEAD
                    <TextareaAutosize ref={questionRef} placeholder='Enter your question here...' />
                    {/* <div className="inner-container-row question-text">{question}</div> */}
=======
                    <div className="inner-container-row question-text">Question Question</div>
>>>>>>> 5356109 (Added game quiz creation page (#8))
                    <div className="inner-container-row">Expected Correct Answer</div>
                    <div className="inner-container-row">
                        <ButtonComponent label={"+ Add New Choice"} onClick={() => setNewChoiceVisible(true)} />
                    </div>
                    <div className="inner-container-row choice-box">
                        <List>
                            {addedChoices.map((item, i) => {
                                return (
                                    // <div className="choice-item">- {item}</div>
                                    <ListItem key={i} className='choice-item'>
                                        <IconButton onClick={() => removeChoice(i)}>
                                            <RemoveCircleIcon />
                                        </IconButton>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                    <div className="inner-container-row">
                        <TextField variant="outlined" placeholder="Free to type your answer" value={freeAnswer} onChange={(e) => setFreeAnswer(e.target.value)} />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <ButtonComponent label={"Done"} />
                    </div>
                </div>
            </div>
=======
  return (
    <div className="main-container">
      <div className="game-round-header">
        <div className="game-round-header-left">
          <div className="room-code">Room: 0</div>
          <div className="round-title">Round: 0</div>
>>>>>>> eb27995 (removed inline css and set them in separare css files (#12))
        </div>
        <div className="game-round-header-right">
          <div className="game-timer">01</div>
        </div>
      </div>

      <Dialog
        onClose={() => setNewChoiceVisible(false)}
        open={newChoiceVisible}
      >
        <DialogTitle>Add new choice</DialogTitle>
        <TextField
          className="choices-list"
          variant="outlined"
          value={newChoiceText}
          onChange={(e) => setNewChoiceText(e.target.value)}
          placeholder="Enter your answer here"
        />

        <div className="yes-no-btn-container">
          <Button
            className="yes-no-btn"
            variant="contained"
            color="error"
            onClick={() => setNewChoiceVisible(false)}
          >
            Close
          </Button>
          <Button
            className="yes-no-btn"
            variant="contained"
            onClick={handleAddNewChoice}
          >
            Add
          </Button>
        </div>
      </Dialog>

      <div className="question-outer-container">
        <div className="topic-label">
          Write a question to ask from your friends.
        </div>
        <div className="question-inner-container">
          <div className="inner-container-row question-text">
            Question Question
          </div>
          <div className="inner-container-row">Expected Correct Answer</div>
          <div className="inner-container-row">
            <ButtonComponent
              label={"+ Add New Choice"}
              onClick={() => setNewChoiceVisible(true)}
            />
          </div>
          <div className="inner-container-row choice-box">
            <List>
              {addedChoices.map((item, i) => {
                return (
                  // <div className="choice-item">- {item}</div>
                  <ListItem key={i} className="choice-item">
                    <IconButton onClick={() => removeChoice(i)}>
                      <RemoveCircleIcon />
                    </IconButton>
                    <ListItemText primary={item} />
                  </ListItem>
                );
              })}
            </List>
          </div>
          <div className="inner-container-row">
            <TextField
              variant="outlined"
              placeholder="Free to type your answer"
              value={freeAnswer}
              onChange={(e) => setFreeAnswer(e.target.value)}
            />
          </div>
          <div className="margin-top-10">
            <ButtonComponent label={"Done"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameQuestionRound;
