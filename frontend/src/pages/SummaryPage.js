import * as React from "react";
import { useState } from "react";
import "./SummaryPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";

const SummaryPage = () => {
  // Sample questions data
  const questions = [
    {
      owner: "Owner 1",
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      correctAnswer: "Suspendisse aliquam et augue sit amet euismod",
      answers: ["Q1 Answer 1", "Q1 Answer 2", "Q1 Answer 3"],
    },
    {
      owner: "Owner 2",
      question: "Quisque non leo at velit commodo suscipit?",
      correctAnswer: "Nullam scelerisque turpis a libero vulputate suscipit",
      answers: ["Q2 Answer 1", "Q2 Answer 2", "Q2 Answer 3"],
    },
    {
      owner: "Owner 3",
      question: "Phasellus sollicitudin quam eget velit feugiat?",
      correctAnswer: "Etiam sit amet tortor a mi aliquam tincidunt",
      answers: ["Q3 Answer 1", "Q3 Answer 2", "Q3 Answer 3"],
    },
  ];

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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="main-container">
      <div className="summary-header">
        <div className="summary-header-left">
          <div className="room-code">Room_Code</div>
          <div className="round-title">SUMMARY</div>
        </div>
        <div className="summary-right">
          <div className="game-timer">01</div>
        </div>
      </div>
      <div className="questions-main-container">
        <div className="prev-btn prevStart-btns" onClick={handlePrev}>
          Prev
        </div>
        <div className="question-outer-container">
          <div className="topic-label">Question {currentQuestionIndex + 1}</div>
          <div className="question-inner-container">
            <div className="inner-container-row question-text">
              Question Owner: {currentQuestion.owner}
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
                  <p>Answer {index + 1}</p>
                  <div className="user-answer-container">
                    <p>{answer}</p>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default SummaryPage;
