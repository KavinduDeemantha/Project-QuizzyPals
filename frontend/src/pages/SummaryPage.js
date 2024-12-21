import * as React from "react";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import "./SummaryPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useRoomContext } from "../hook/useRoomContext";
import { useGameContext } from "../hook/useGameContext";
import { useAuthContext } from "../hook/useAuthContext";
import { useEffect } from "react";
import axios from "axios";

const SummaryPage = () => {
  const { room } = useRoomContext();
  const { game } = useGameContext();
  const { user } = useAuthContext();
  const [questions, setQuestions] = useState([]);
  const [playerAnswers, setPlayerAnswers] = useState(null);
  const [error, setError] = useState(null);

  const requestHeaders = {
    headers: {
      Authorization: `Bearer ${user.userJWT}`,
      "Content-Type": "application/json",
    },
  };

  const getAndSetQuestions = async () => {
    // await axios
    //   .get(
    //     `${process.env.REACT_APP_BASE_URL}/api/game/getquizzes/${user.userId}`,
    //     requestHeaders
    //   )
    //   .then((response) => {
    //     if (response.status === 200) {
    //       const tmpQAndA = [];
    //       for (let qa of response.data) {
    //         // Q&A for rendering
    //         tmpQAndA.push({
    //           owner: user.email,
    //           question: qa.question,
    //           answers: JSON.parse(qa.answer),
    //           correctAnswer: qa.correct || "No correct answer provided",
    //         });
    //       }

    //       setQuestions(tmpQAndA);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     setError(error);
    //   });a

    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/game/get-all-player-answers/${room.roomId}`,
        // `${process.env.REACT_APP_BASE_URL}/api/game/get-all-player-answers/6765cc0fd3ef2d4bbfe1cf45`,
        requestHeaders
      )
      .then((response) => {
        if (response.status === 200) {
          // console.log("all player answers", response.data);
          const qaMap = new Map();
          for (const qa of response.data) {
            qaMap[qa.question] = {
              question: qa.question,
              answers: [],
              correctAnswer: qa.correctAnswer,
              owner: qa.createdBy,
            };
          }

          for (const qa of response.data) {
            qaMap[qa.question].answers.push({
              answer: qa.answer,
              answeredBy: qa.answeredBy,
            });
          }

          const tmpQAndA = [];
          for (let item of Object.keys(qaMap)) {
            tmpQAndA.push(qaMap[item]);
          }

          // console.log(qaMap);
          setQuestions(tmpQAndA);
        }
      })
      .catch((error) => {
        console.error(error.message);
        setError(error);
      });
  };

  // Sample questions data
  // const questions = [
  //   {
  //     owner: "Owner 1",
  //     question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
  //     correctAnswer: "Suspendisse aliquam et augue sit amet euismod",
  //     answers: ["Q1 Answer 1", "Q1 Answer 2", "Q1 Answer 3"],
  //   },
  //   {
  //     owner: "Owner 2",
  //     question: "Quisque non leo at velit commodo suscipit?",
  //     correctAnswer: "Nullam scelerisque turpis a libero vulputate suscipit",
  //     answers: ["Q2 Answer 1", "Q2 Answer 2", "Q2 Answer 3"],
  //   },
  //   {
  //     owner: "Owner 3",
  //     question: "Phasellus sollicitudin quam eget velit feugiat?",
  //     correctAnswer: "Etiam sit amet tortor a mi aliquam tincidunt",
  //     answers: ["Q3 Answer 1", "Q3 Answer 2", "Q3 Answer 3"],
  //   },
  // ];

  // State for the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Handlers for Next and Prev buttons
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const navigate = useNavigate();
  const handleDoneBtn = (e) => {
    e.preventDefault();
    navigate("/leaderboard");
  };

  const initializeSummary = () => {
    if (game) {
      setPlayerAnswers(game.playerAnswers);
      getAndSetQuestions();
    } else {
      console.error("Game destroyed!");
    }
  };

  useEffect(() => {
    initializeSummary();
  }, []);

  const currentQuestion = questions ? questions[currentQuestionIndex] : {};

  return (
    <div className="main-container">
      <div className="summary-header">
        <div className="summary-header-left">
          <div className="room-code">Room: {room && room.roomId}</div>
          {/* <p>I am {user.email}</p> */}
          <div className="round-title">SUMMARY</div>
        </div>
        {/* <div className="summary-right">
          <div className="game-timer">{room && room.gameRound}</div>
        </div> */}
      </div>
      {currentQuestion ? (
        <div className="questions-main-container">
          <div className="prev-btn prevStart-btns" onClick={handlePrev}>
            Prev
          </div>
          <div className="question-outer-container">
            <div className="topic-label">
              Question {currentQuestionIndex + 1}{" "}
            </div>
            <div className="question-inner-container">
              <div className="inner-container-row question-text">
                Question by: {currentQuestion.owner}
              </div>
              <div className="questions margin-top-10">
                {currentQuestion.question}
              </div>
              <div className="correct-answer">
                <b>Correct answer: {currentQuestion.correctAnswer}</b>
              </div>
              <div className="answer-list-container">
                {currentQuestion.answers.map((answer, index) => (
                  <div className="answer-list" key={index}>
                    <p>{answer.answeredBy}</p>
                    <div className="user-answer-container">
                      <p>{answer.answer}</p>
                      {currentQuestion.correctAnswer === answer.answer
                        ? "✅🎉"
                        : "❌"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="margin-top-10">
                <ButtonComponent
                  label={"leaderboard"}
                  onClick={handleDoneBtn}
                />
              </div>
            </div>
          </div>
          <div className="next-btn prevStart-btns" onClick={handleNext}>
            Next
          </div>
        </div>
      ) : (
        <div>
          {!questions ? (
            <div>
              <CircularProgress />
              <div>Fetching data...</div>
            </div>
          ) : (
            <div>
              <h1
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Seems like you don't have any questions and answers{" "}
                <picture>
                  <source
                    srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.webp"
                    type="image/webp"
                  ></source>
                  <img
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f914/512.gif"
                    alt="🤔"
                    width="128"
                    height="128"
                  ></img>
                </picture>
              </h1>
              <ButtonComponent label={"Continue"} onClick={handleDoneBtn} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
