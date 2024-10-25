import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import RemoveCircleIcon from "@mui/icons-material/CancelRounded";

import "./GameAnswerRound.css";
import ButtonComponent from "../components/ButtonComponent";

const GameAnswerRound = () => {
  const [addedChoices, setAddedChoices] = useState(["Choice A", "Choice B"]);
  const [freeAnswer, setFreeAnswer] = useState("");
  const [newChoiceVisible, setNewChoiceVisible] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");
  const [question, setQuestion] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );

  const handleAddNewChoice = () => {
    let choiceText = newChoiceText.trim();
    if (choiceText.length != 0 && choiceText != "") {
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
          style={{ margin: 10 }}
          variant="outlined"
          value={newChoiceText}
          onChange={(e) => setNewChoiceText(e.target.value)}
          placeholder="Enter your answer here"
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            style={{ margin: 10, width: 100 }}
            variant="contained"
            color="error"
            onClick={() => setNewChoiceVisible(false)}
          >
            Close
          </Button>
          <Button
            style={{ margin: 10, width: 100 }}
            variant="contained"
            onClick={handleAddNewChoice}
          >
            Add
          </Button>
        </div>
      </Dialog>

      <div className="question-outer-container">
        <div className="topic-label">Answer the question</div>
        <div className="question-inner-container">
          <div className="inner-container-row question-text">{question}</div>
          <div className="inner-container-row choice-box">
            <FormControl>
              {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {addedChoices.map((item, i) => {
                  return (
                    <FormControlLabel
                      key={i}
                      className="choice-item"
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
            <List></List>
          </div>
          <div className="inner-container-row">
            <TextField
              variant="outlined"
              placeholder="Free to type your answer"
              value={freeAnswer}
              onChange={(e) => setFreeAnswer(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <ButtonComponent label={"Done"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAnswerRound;
