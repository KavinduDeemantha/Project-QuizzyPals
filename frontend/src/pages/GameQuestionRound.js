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
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { resolvePath, useNavigate } from "react-router-dom";
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
import { RadioButtonChecked } from "@mui/icons-material";

import SpeedDialComponent from "../components/SpeedDialComponent";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import { makeStringATitle } from "../utils/StringUtils";

const GameQuestionRound = () => {
  const { room } = useRoomContext();
  const { user } = useAuthContext();
  const { game, socket, dispatch } = useGameContext();
  const [addedChoices, setAddedChoices] = useState(() => {
    const storedChoices = localStorage.getItem("storedChoices");
    var res = [];
    try {
      res = JSON.parse(storedChoices);
    } catch (error) {
      console.error(error);
      return [];
    }

    return res || [];
  });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [newChoiceVisible, setNewChoiceVisible] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");
  const [quizQuestion, setQuizQuestion] = useState(() => {
    const storedQuestion = localStorage.getItem("storedQuestion");
    return storedQuestion || "";
  });
  const [gameStateMessageVisible, setGameStateMessageVisible] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [showWaitForOthers, setShowWaitForOthers] = useState(false);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(() => {
    const selectedChoiceIndex = parseInt(
      localStorage.getItem("selectedChoiceIndex")
    );

    return selectedChoiceIndex || 0;
  });
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
      correctAnswer: correctAnswer,
    };
    if (quizData.quizQuestion === "") {
      return;
    }
    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/game/createquiz`,
        quizData,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          setQuizQuestion("");
          setCorrectAnswer("");
          setAddedChoices([]);
        }
      })
      .catch(logError);
  };

  const initializeTimeRemaining = async () => {
    const gameData = {
      userId: user.userId,
      roomId: room.roomId,
    };

    const timeRequest = {
      type: "TIME_REMAINING_CREATION",
      ...gameData,
    };

    socket.current.send(JSON.stringify(timeRequest));
  };

  const handleDoneClick = async (e) => {
    setShowWaitForOthers(true);
  };

  const handleGameStateContinueButton = async (e) => {
    if (game.type === "ANSWER_ROUND_STARTED") {
      navigate("/answers");
    } else if (game.type === "GAME_ENDED" || game.type === "ROOM_DELETED") {
      navigate("/roomlobby");
    }
  };

  const analyzeSentiment = async () => {
    const url1 =
      "https://api.edenai.run/v2/workflow/8fb0d1b7-adcb-48a7-9ca5-747da88e9832/execution/";

    const payload = { text: quizQuestion };
    const launchExecution = async () => {
      const response = await fetch(url1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_EDENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      return result["id"];
    };
    const executionId = await launchExecution();

    const url2 = `https://api.edenai.run/v2/workflow/8fb0d1b7-adcb-48a7-9ca5-747da88e9832/execution/${executionId}/`;
    const getResult = async () => {
      const response = await fetch(url2, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_EDENAI_API_KEY}`,
        },
      });
      const result = await response.json();
      // console.log(result);
      return result["content"]["results"]["text__sentiment_analysis"][
        "results"
      ][0]["items"][0];
    };

    const result = await getResult();
    // console.log(result);

    return result;
  };

  const emojiMapper = {
    "🙄": "1f644",
    "🫢": "1fae2",
    "🫣": "1fae3",
    "🤐": "1f910",
    "🧐": "1f9d0",
  };

  const handleQuizQuestionSentiment = async (e) => {
    try {
      const sentimentResults = await analyzeSentiment();
      if (sentimentResults) {
        if (sentimentResults.sentiment == "Neutral") {
          let items = ["🧐", "🙄"];
          let index = items[Math.floor(Math.random() * items.length)];
          setCurrentEmoji(emojiMapper[index]);
        } else if (sentimentResults.sentiment == "Negative") {
          let items = ["🫣", "🫢", "🤐"];
          let index = items[Math.floor(Math.random() * items.length)];
          setCurrentEmoji(emojiMapper[index]);
        } else {
          setCurrentEmoji(null);
        }
        console.log(sentimentResults);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    if (game) {
      initializeTimeRemaining();
      if (game.type === "ANSWER_ROUND_STARTED") {
        navigate("/answers");
      } else if (game.type === "TIME_REMAINING") {
        // console.log(game);
        setGameTime(Math.floor(game.duration / 1000));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("storedQuestion", quizQuestion);
  }, [quizQuestion]);

  useEffect(() => {
    localStorage.setItem("storedChoices", JSON.stringify(addedChoices));
  }, [addedChoices]);

  useEffect(() => {
    localStorage.setItem("selectedChoiceIndex", correctChoiceIndex);
    setCorrectAnswer(addedChoices[correctChoiceIndex]);
  }, [correctChoiceIndex]);

  useEffect(() => {
    if (game) {
      if (game.type === "GAME_STARTED") {
        initializeTimeRemaining();
      } else if (game.type === "ANSWER_ROUND_STARTED") {
        submitQuiz();
        setGameStateMessage({
          title: makeStringATitle(game.type) + "!",
          message: game.message,
        });
        setGameStateMessageVisible(true);
      } else if (game.type === "GAME_ENDED") {
        setGameStateMessage({
          title: makeStringATitle(game.type) + "!",
          message: game.message,
        });
        setGameStateMessageVisible(true);
      } else if (game.type === "TIME_REMAINING") {
        // console.log(game);
        setGameTime(Math.floor(game.duration / 1000));
      } else if (game.type === "ROOM_DELETED") {
        setGameStateMessage({
          title: makeStringATitle(game.type) + "!",
          message: game.message,
        });
        setGameStateMessageVisible(true);
      }
    }
  }, [game]);

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

  if (!room) {
    navigate("/welcome");
    return;
  }

  return (
    <div className="main-container">
      {/* <div className="game-round-header"> */}
      <div>
        {/* <div className="game-round-header-left"> */}
        {/* <div className="room-code">Room: {room.roomId}</div> */}
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
              Question Round
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
        {/* <div className="round-title">Question Round</div> */}
        {/* </div> */}
      </div>

      <SpeedDialComponent actions={actions} />

      <Dialog
        onClose={() => setShowWaitForOthers(false)}
        open={showWaitForOthers}
      >
        <DialogTitle>Don't hurry! ⌛</DialogTitle>
        <DialogContent>
          <DialogContentText>Wait for others...🫷</DialogContentText>
        </DialogContent>
        <div className="yes-no-btn-container">
          <Button
            className="yes-no-btn"
            variant="contained"
            onClick={() => setShowWaitForOthers(false)}
          >
            Ok
          </Button>
        </div>
      </Dialog>
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
      <div className="question-main-container">
        <div className="question-outer-container">
          {/* <div className="topic-label"> */}
          <Typography>
            Write a question to ask from your friends & wait for duration ends
          </Typography>
          {/* </div> */}
          <div className="question-inner-container">
            <div className="inner-container-row question-text">
              <TextField
                // className="question-field"
                label="Enter your question here"
                variant="outlined"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                onBlur={handleQuizQuestionSentiment}
                sx={{
                  width: "100%",
                }}
              />
              <div className="emoji-reaction">
                {currentEmoji ? (
                  <picture>
                    <source
                      srcSet={`https://fonts.gstatic.com/s/e/notoemoji/latest/${currentEmoji}/512.webp`}
                      type="image/webp"
                    ></source>
                    <img
                      src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${currentEmoji}/512.gif`}
                      width="32"
                      height="32"
                    ></img>
                  </picture>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className="inner-container-row">
              <ButtonComponent
                label={"+ Add New Choice"}
                onClick={() => setNewChoiceVisible(true)}
              />
            </div>
            <div className="inner-container-row choice-box">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <List className="answer-list">
                    {addedChoices.map((item, i) => {
                      if (correctAnswer == "") {
                        setCorrectAnswer(item);
                        console.log(item);
                      }

                      return (
                        <ListItem key={i} className="choice-item">
                          <IconButton onClick={() => removeChoice(i)}>
                            <RemoveCircleIcon />
                          </IconButton>
                          <div
                            style={{
                              overflowX: "auto",
                              width: "70%",
                            }}
                          >
                            {item}
                          </div>
                          {/* <ListItemText primary={item} /> */}
                          <FormControlLabel
                            value={item}
                            style={{
                              marginLeft: 5,
                              width: "24%",
                            }}
                            onClick={(e) => {
                              setCorrectChoiceIndex(i);
                            }}
                            checked={i == correctChoiceIndex}
                            control={<Radio />}
                            label={"make this correct"}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </RadioGroup>
              </FormControl>
            </div>
            {/* <div className="margin-top-10">
              <ButtonComponent
                className={"doneBtn"}
                label={"Done"}
                onClick={handleDoneClick}
              />
            </div> */}
            <div className="lobby-btn-container">
              <Button
                className="lobby-btn"
                variant="contained"
                color="error"
                onClick={() => navigate("/roomlobby")}
              >
                Lobby
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameQuestionRound;
