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

  return (
    <div className="main-container">
      <div className="game-round-header">
        <div className="game-round-header-left">
          <div className="room-code">Room: 0</div>
          <div className="round-title">Round: 0</div>
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
      <div className="questions-main-container">
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
    </div>
  );
};

export default GameQuestionRound;
