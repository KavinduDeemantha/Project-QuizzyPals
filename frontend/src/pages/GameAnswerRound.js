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
  CircularProgress,
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
import { Label } from "@mui/icons-material";

const GameAnswerRound = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { room } = useRoomContext();
  const { game, dispatch } = useGameContext();
  const [gameTime, setGameTime] = useState(0);
  const [error, setError] = useState(null);
  const [qAndA, setQAndA] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [playerQAndA, setPlayerQAndA] = useState({ question: "answer" });
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
          const tmpQAndA = [];
          const tmpPlayerQAndA = {};
          for (let qa of response.data) {
            // Q&A for rendering
            tmpQAndA.push({
              question: qa.question,
              answers: JSON.parse(qa.answer),
            });
            tmpPlayerQAndA[qa.answer] = "";
          }
          setQAndA(tmpQAndA);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const submitQuizAnswer = async (question, answer) => {
    const answerData = {
      userId: user.userId,
      answers: [
        {
          quizQuestion: question,
          playerAnswer: answer,
        },
      ],
    };

    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/game/submitanswers`,
        answerData,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("Answer submitted successfully!");
        } else {
          // console.log(response);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  };

  const handleDoneClick = (questionIndex) => {
    const tmpPlayerAnswers = playerQAndA;
    const question = qAndA[questionIndex].question;
    tmpPlayerAnswers[qAndA[questionIndex].question] = correctAnswer;
    submitQuizAnswer(question, correctAnswer);
    setPlayerQAndA(tmpPlayerAnswers);
  };

  const handleGameEnded = () => {
    dispatch({
      type: "GAME_ANSWERS",
      payload: { playerAnswers: playerQAndA },
    });
    navigate("/summary");
  };

  const handleGameStateContinueButton = (e) => {
    if (game.type === "GAME_ENDED") {
      handleGameEnded();
    }
    setGameStateMessageVisible(false);
  };

  // useEffect(() => {
  //   if (game) {
  //     if (game.type === "GAME_ENDED") {
  //       handleGameEnded();
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (game) {
      if (game.type === "ANSWER_ROUND_STARTED") {
        // console.log("Timer should work now!");
        setGameTime(Math.floor(game.duration / 1000));
      } else if (game.type === "GAME_ENDED") {
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
    <div className="main-container answers-main">
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
          <div className="round-title">Answer Round</div>
        </div>
        <div className="game-round-header-right">
          {gameTime > 0 ? <TimerComponent initialSeconds={gameTime} /> : <></>}
        </div>
      </div>
      <div className="question-outer-container">
        {qAndA ? (
          qAndA.map((qa, i) => {
            return (
              <div key={i}>
                <div className="topic-label">Answer the question</div>
                <div className="question-inner-container">
                  <div className="inner-container-row question-text">
                    {qa.question}
                  </div>
                  <div className="inner-container-row choice-box">
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                      >
                        {qa.answers.length > 0 ? (
                          qa.answers.map((item, j) => {
                            return (
                              <FormControlLabel
                                key={j}
                                className="choice-item"
                                value={item}
                                control={<Radio />}
                                label={item}
                                onClick={() => setCorrectAnswer(item)}
                              />
                            );
                          })
                        ) : (
                          <TextField
                            className="correct-answer-text"
                            variant="standard"
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                          />
                        )}
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <ButtonComponent
                      label={"Done"}
                      onClick={() => handleDoneClick(i)}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <CircularProgress />
            <div>Fetching data...</div>
          </div>
        )}
      </div>
      <Button
        className="lobby-btn"
        variant="contained"
        color="error"
        onClick={() => navigate("/roomlobby")}
      >
        Lobby
      </Button>
      {/* <Button
        className="submit-and-finish-btn"
        variant="contained"
        color="primary"
        onClick={handleGameEnded}
      >
        Submit & Finish
      </Button> */}
    </div>
  );
};

export default GameAnswerRound;
