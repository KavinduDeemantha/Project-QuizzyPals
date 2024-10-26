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
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameAnswerRound.css";
import ButtonComponent from "../components/ButtonComponent";
import TimerComponent from "../components/TimerComponent";
import axios from "axios";
import { useAuthContext } from "../hook/useAuthContext";
import { useRoomContext } from "../hook/useRoomContext";
import { useGameContext } from "../hook/useGameContext";

const GameAnswerRound = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { room } = useRoomContext();
  const { game, dispatch } = useGameContext();
  const [error, setError] = useState(null);
  const [addedChoices, setAddedChoices] = useState([
    "Choice A",
    "Choice B",
    "Choice C",
    "Choice D",
  ]);
  const [question, setQuestion] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  const [gameStateMessageVisible, setGameStateMessageVisible] = useState(false);
  const [gameStateMessage, setGameStateMessage] = useState({
    title: "Game State",
    message: "Hi!",
  });

  const requestHeaders = {
    headers: {
      Authorization: `Bearer ${user.userJWT}`,
      "Content-Type": "application/json",
    },
  };

  const getAndSetQuestions = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/game/getquizzes/${user.userId}`,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          const questions = [];
          const choices = [];
          console.log(response.data);
          for (let qa of response.data) {
            questions.push(qa.question);
            choices.push(JSON.parse(qa.answer));
          }
          setQuestion(questions);
          setAddedChoices(choices);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDoneClick = () => {
    navigate("/summary");
  };

  const handleGameEnded = () => {
    navigate("/roomlobby");
    dispatch({ game: null });
  };

  const handleGameStateContinueButton = (e) => {
    if (game.type === "ANSWER_ROUND_STARTED") {
      navigate("/answers");
    } else if (game.type === "GAME_ENDED") {
      handleGameEnded();
    }
    setGameStateMessageVisible(false);
  };

  useEffect(() => {
    if (game) {
      if (game.type === "GAME_ENDED") {
        handleGameEnded();
      }
    }
  }, []);

  useEffect(() => {
    if (game) {
      if (game.type === "GAME_ENDED") {
        setGameStateMessage({ title: game.type, message: game.message });
        setGameStateMessageVisible(true);
      }
    }
  }, [game]);

  useEffect(() => {
    // if (!game) {
    //   navigate("/roomlobby");
    // } else {
    //   if (game.type === "GAME_ENDED" || game.type === "GAME_STARTED") {
    //     navigate("/roomlobby");
    //   }
    // }
    getAndSetQuestions();
  }, []);

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
      <div className="game-round-header">
        <div className="game-round-header-left">
          <div className="room-code">Room: {room && room.roomId}</div>
          <div className="round-title">Round: {room && room.gameRound}</div>
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
