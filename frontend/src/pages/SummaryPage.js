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
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/game/get-all-player-answers/${room.roomId}`,
        requestHeaders
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log("all player answers", response.data);
          const tmpQAndA = [];
          for (let qa of response.data) {
            if (qa.answeredBy === user.email) {
              continue;
            }
            tmpQAndA.push({
              owner: qa.createdBy,
              question: Object.keys(qa.questionAndAnswer)[0],
              answers:
                Object.values(qa.questionAndAnswer)[0] ||
                "No correct answer provided",
              correctAnswer: qa.correctAnswer,
              answeredBy: qa.answeredBy,
            });
          }
          setQuestions(tmpQAndA);
        }
      })
      .catch((error) => {
        console.error(error.message);
        setError(error);
      });
  };

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
          <div className="round-title">SUMMARY</div>
        </div>
      </div>
      {currentQuestion ? (
        <div className="questions-main-container">
          <div className="prev-btn prevStart-btns" onClick={handlePrev}>
            Prev
          </div>
          <div className="question-outer-container">
            <div className="topic-label">
              Question {currentQuestionIndex + 1}{" "}
              {currentQuestion.correctAnswer ===
              currentQuestion.answers
                ? "✅🎉"
                : "❌"}
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
                <div className="answer-list">
                  <p>{currentQuestion.answeredBy}</p>
                  <div className="user-answer-container">
                    <p>{currentQuestion.answers}</p>
                  </div>
                </div>
              </div>
              <div className="margin-top-10">
                <ButtonComponent label={"Done"} onClick={handleDoneBtn} />
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
