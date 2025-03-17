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
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameAnswerRound.css";
import ButtonComponent from "../components/ButtonComponent";
import TimerComponent from "../components/TimerComponent";
import axios from "axios";
import { useAuthContext } from "../hook/useAuthContext";
import { useRoomContext } from "../hook/useRoomContext";
import { useGameContext } from "../hook/useGameContext";
import { Label } from "@mui/icons-material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import SpeedDialComponent from "../components/SpeedDialComponent";
import { makeStringATitle } from "../utils/StringUtils";

const GameAnswerRound = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { room } = useRoomContext();
  const { socket, game, dispatch } = useGameContext();
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

  const handleSetCorrectAnswer = (value, index) => {
    setCorrectAnswer(value);
    handleDoneClick(index, value);
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
              quizId: qa.quizId,
              question: qa.question,
              answers: JSON.parse(qa.answer),
            });
            tmpPlayerQAndA[qa.answer] = "";
          }
          // console.log(tmpQAndA);
          setQAndA(tmpQAndA);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const submitQuizAnswer = async (quizId, question, answer) => {
    const answerData = {
      userId: user.userId,
      quizId: quizId,
      quizQuestion: question,
      playerAnswer: answer,
    };

    // console.log(answerData);

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

  const handleDoneClick = (questionIndex, value = null) => {
    const playerAnswer = value || correctAnswer;
    const tmpPlayerAnswers = playerQAndA;
    const question = qAndA[questionIndex].question;
    const quizId = qAndA[questionIndex].quizId;
    tmpPlayerAnswers[qAndA[questionIndex].question] = playerAnswer;
    submitQuizAnswer(quizId, question, playerAnswer);
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

  const initializeTimeRemaining = async () => {
    const gameData = {
      userId: user.userId,
      roomId: room.roomId,
    };

    const timeRequest = {
      type: "TIME_REMAINING_ANSWER",
      ...gameData,
    };

    socket.current.send(JSON.stringify(timeRequest));
  };

  useEffect(() => {
    if (game) {
      initializeTimeRemaining();
      if (game.type === "GAME_ENDED") {
        handleGameEnded();
      } else if (game.type === "TIME_REMAINING") {
        // console.log(game);
        setGameTime(Math.floor(game.duration / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (game) {
      if (game.type === "ANSWER_ROUND_STARTED") {
        // console.log("Timer should work now!");
        setGameTime(Math.floor(game.duration / 1000));
      } else if (game.type === "GAME_ENDED") {
        setGameStateMessage({
          title: makeStringATitle(game.type) + "!",
          message: game.message,
        });
        setGameStateMessageVisible(true);
      } else if (game.type === "TIME_REMAINING") {
        setGameTime(Math.floor(game.duration / 1000));
      }
    }
  }, [game]);

  useEffect(() => {
    initializeTimeRemaining();
    localStorage.clear("question");
    localStorage.clear("storedChoices");
    localStorage.clear("storedCorrectAnswer");
    localStorage.clear("storedQuestion");
    // if (!game) {
    //   navigate("/roomlobby");
    // } else {
    //   if (game.type === "GAME_ENDED" || game.type === "GAME_STARTED") {
    //     navigate("/roomlobby");
    //   }
    // }
    getAndSetQuestions();
  }, []);

  const actions = [
    {
      icon: <HomeIcon />,
      name: "Home",
      act: () => {
        navigate("/welcome");
      },
    },
    {
      icon: <ExitToAppIcon />,
      name: "Lobby",
      act: () => {
        navigate("/roomlobby");
      },
    },
  ];

  return (
    <div className="main-container">
      <div>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: { xs: "space-evenly", md: "space-between" },
            // justifyContent: {
            //   xs: "center",
            //   md: "space-between",
            // },
            alignItems: "center",
            paddingTop: 2,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <Typography
              variant="p"
              sx={{
                fontSize: { xs: "24px", md: "36px" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Room: {room.roomId}
            </Typography>
            <Typography
              variant="p"
              sx={{
                fontSize: { xs: "28px", md: "48px" },
                fontWeight: "bold",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Answer Round
            </Typography>
          </Grid>
          <Grid item>
            {/* <div className="game-round-header-right"> */}
            {gameTime > 0 ? (
              <TimerComponent initialSeconds={gameTime} />
            ) : (
              <></>
            )}
            {/* </div> */}
          </Grid>
        </Grid>
      </div>

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

      {/* <div className="game-round-header"> */}
      {/* <div className="game-round-header-left">
          <div className="room-code">Room: {room && room.roomId}</div>
          <div className="round-title">Answer Round</div>
        </div>
        <div className="game-round-header-right">
          {gameTime > 0 ? <TimerComponent initialSeconds={gameTime} /> : <></>}
        </div> */}
      {/* </div> */}

      <SpeedDialComponent actions={actions} />

      <div className="question-main-container">
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
                    <div className="inner-container-row choice-box answers-container">
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
                                  onClick={() =>
                                    handleSetCorrectAnswer(item, i)
                                  }
                                />
                              );
                            })
                          ) : (
                            <TextField
                              className="correct-answer-text"
                              variant="standard"
                              value={correctAnswer}
                              onChange={(e) =>
                                handleSetCorrectAnswer(e.target.value, i)
                              }
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
    </div>
  );
};

export default GameAnswerRound;
