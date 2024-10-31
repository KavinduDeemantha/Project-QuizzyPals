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
import { useNavigate } from "react-router-dom";
import "./GameAnswerRound.css";
import ButtonComponent from "../components/ButtonComponent";
import TimerComponent from "../components/TimerComponent";

const GameAnswerRound = () => {
  const navigate = useNavigate();
  const [addedChoices, setAddedChoices] = useState([
    "Choice A",
    "Choice B",
    "Choice C",
    "Choice D",
  ]);
  const [question, setQuestion] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );

  const handleDoneClick = () => {
    navigate("/summary");
  };

  return (
    <div className="main-container">
      <div className="game-round-header">
        <div className="game-round-header-left">
          <div className="room-code">Room: 0</div>
          <div className="round-title">Round: 0</div>
        </div>
        <div className="game-round-header-right">
          <TimerComponent initialSeconds={60} />
        </div>
      </div>
      <div className="question-outer-container">
        <div className="topic-label">Answer the question</div>
        <div className="question-inner-container">
          <div className="inner-container-row question-text">{question}</div>
          <div className="inner-container-row choice-box">
            <FormControl>
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
          <div style={{ marginTop: 10 }}>
            <ButtonComponent label={"Done"} onClick={handleDoneClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAnswerRound;
