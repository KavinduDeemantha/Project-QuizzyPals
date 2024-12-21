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
} from "@mui/material";
import { useState } from "react";
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

const GameQuestionRound = () => {
  const { room } = useRoomContext();
  const { user } = useAuthContext();
  const { game, socket, dispatch } = useGameContext();
  const [addedChoices, setAddedChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [newChoiceVisible, setNewChoiceVisible] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [gameStateMessageVisible, setGameStateMessageVisible] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [showWaitForOthers, setShowWaitForOthers] = useState(false);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(0);
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

  const handleDoneClick = async (e) => {
    setShowWaitForOthers(true);
  };

  const handleGameStateContinueButton = async (e) => {
    if (game.type === "ANSWER_ROUND_STARTED") {
      navigate("/answers");
    } else if (game.type === "GAME_ENDED") {
      navigate("/roomlobby");
    }
    setGameStateMessageVisible(false);
  };

  const analyzeSentiment = async () => {
    const url1 =
      "https://api.edenai.run/v2/workflow/44219089-83df-4366-94bf-b0e4f0b106f2/execution/";

    const payload = { text: quizQuestion };
    const requestHeaders = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_EDENAI_API_KEY}`,
      },
    };

    const executionId = await axios
      .post(url1, payload, requestHeaders)
      .then((response) => {
        if (response.status === 201) {
          return response.data.id;
        }

        return 0;
      })
      .catch((error) => {
        return -1;
      });

    const url2 = `https://api.edenai.run/v2/workflow/44219089-83df-4366-94bf-b0e4f0b106f2/execution/${executionId}/`;

    return await axios
      .get(url2, requestHeaders)
      .then((response) => {
        if (response.status === 200) {
          response = response.data;
          console.log(response);
          const data =
            response["content"]["results"]["text__sentiment_analysis"];
          if (data["status"] === "failed") {
            console.error("AI:", data["errors"][0]["type"]);
            return null;
          }
          const results = data["results"][0];
          const { sentiment, sentiment_rate } = results["items"][0];

          return { sentiment, sentiment_rate };
        }
      })
      .catch((error) => {
        console.warn(error);
      });
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
      if (game.type === "ANSWER_ROUND_STARTED") {
        navigate("/answers");
      }
    }
  }, []);

  useEffect(() => {
    if (game) {
      if (game.type === "GAME_STARTED") {
        setGameTime(Math.floor(game.duration / 1000));
      } else if (game.type === "ANSWER_ROUND_STARTED") {
        submitQuiz();
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
      <div className="game-round-header">
        <div className="game-round-header-left">
          <div className="room-code">Room: {room.roomId}</div>
          <div className="round-title">Question Round</div>
        </div>
        <div className="game-round-header-right">
          {gameTime > 0 ? <TimerComponent initialSeconds={gameTime} /> : <></>}
        </div>
      </div>

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
      <div className="questions-main-container">
        <div className="question-outer-container">
          <div className="topic-label">
            Write a question to ask from your friends & wait for duration ends
          </div>
          <div className="question-inner-container">
            <div className="inner-container-row question-text">
              <TextField
                className="question-field"
                label="Enter your question here"
                variant="outlined"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                onBlur={handleQuizQuestionSentiment}
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
                      console.log(i);
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
                              setCorrectAnswer(e.target.value);
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
