import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircleOutlined";
import "./GameQuestionRound.css";
import ButtonComponent from "../components/ButtonComponent";
import TimerComponent from "../components/TimerComponent";
import { useRoomContext } from "../hook/useRoomContext";
import { useAuthContext } from "../hook/useAuthContext";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useGameContext } from "../hook/useGameContext";
import { useEffect } from "react";

const GameQuestionRound = () => {
  const { room } = useRoomContext();
  const { user } = useAuthContext();
  const { game, socket, dispatch } = useGameContext();
  const [addedChoices, setAddedChoices] = useState([]);
  const [freeAnswer, setFreeAnswer] = useState("");
  const [newChoiceVisible, setNewChoiceVisible] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [gameStateMessageVisible, setGameStateMessageVisible] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameStateMessage, setGameStateMessage] = useState({
    title: "Game State",
    message: "Hi!",
  });

  const navigate = useNavigate();

  const requestHeaders = {
    headers: {
      Authorization: `Bearer ${user.userJWT}`,
      "Content-Type": "application/json",
    },
  };

  const handleAddNewChoice = () => {
    let choiceText = newChoiceText.trim();
    if (choiceText.length !== 0 && choiceText !== "") {
      setAddedChoices([...addedChoices, choiceText]);
    }
    setNewChoiceText("");
  };

  const removeChoice = (choice) => {
    const newChoices = [...addedChoices]; // create a copy
    newChoices.splice(choice, 1);
    setAddedChoices(newChoices); // update state with the new array
  };

  const logError = (error) => {
    console.log(error);
    if (error) {
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            alert(error.response.data.message);
          }
        }
      }
    }
  };

  const submitQuiz = async (e) => {
    const quizData = {
      userId: user.userId,
      quizQuestion: quizQuestion,
      quizAnswer: JSON.stringify(addedChoices),
    };

    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/game/createquiz`,
        quizData,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          setQuizQuestion("");
          setAddedChoices([]);
        }
      })
      .catch(logError);
  };

  const handleDoneClick = async (e) => {
    await submitQuiz(e);
  };

  const handleGameStateContinueButton = (e) => {
    if (game.type === "ANSWER_ROUND_STARTED") {
      navigate("/answers");
    } else if (game.type === "GAME_ENDED") {
      navigate("/roomlobby");
    }
    setGameStateMessageVisible(false);
  };

  useEffect(() => {
    if (game) {
      if (game.type === "ANSWER_ROUND_STARTED") {
        navigate("/answers");
      }
    }
  }, []);

  useEffect(() => {
    if (game) {
      if (game.type === "GAME_STARTED") {
        console.log(game);
        setGameTime(Math.floor(game.duration / 1000));
      } else if (game.type === "ANSWER_ROUND_STARTED") {
        setGameStateMessage({ title: game.type, message: game.message });
        setGameStateMessageVisible(true);
      } else if (game.type === "GAME_ENDED") {
        setGameStateMessage({ title: game.type, message: game.message });
        setGameStateMessageVisible(true);
      }
    }
  }, [game]);

  return (
    <div className="main-container">
      <Button
        className="lobby-btn"
        variant="contained"
        color="error"
        onClick={() => navigate("/roomlobby")}
      >
        Lobby
      </Button>
      <div className="game-round-header">
        <div className="game-round-header-left">
          <div className="room-code">Room: {room.roomId}</div>
          <div className="round-title">Round: {room.gameRound}</div>
        </div>
        <div className="game-round-header-right">
          {gameTime > 0 ? <TimerComponent initialSeconds={gameTime} /> : <></>}
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
      <Dialog
        onClose={() => setGameStateMessageVisible(false)}
        open={gameStateMessageVisible}
      >
        <DialogTitle>{gameStateMessage.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{gameStateMessage.message}</DialogContentText>
        </DialogContent>
        <div className="yes-no-btn-container">
          <Button
            className="yes-no-btn"
            variant="contained"
            onClick={handleGameStateContinueButton}
          >
            Continue
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
              <TextField
                className="question-field"
                label="Enter your question here"
                variant="outlined"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
              />
            </div>
            <div className="inner-container-row correct-answer">
              Expected Correct Answer: <p className="correct-answer-text"></p>
            </div>
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
            <div className="margin-top-10">
              <ButtonComponent label={"Done"} onClick={handleDoneClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameQuestionRound;
