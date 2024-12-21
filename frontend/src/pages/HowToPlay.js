import React from "react";
import "./HowToPlay.css";

const HowToPlay = () => {
  return (
    <div className="howToPlayMainContainer">
      <h1>QuizzyPals - How to play?</h1>
      <div className="heyPal">
        <p>Hey there pal!</p>
        <p>New to the game?</p>
        <p>Or need to know how to play QuizzyPals?</p>
        <h3>What is QuizzyPals?</h3>
        <p style={{ marginBottom: 15 }}>
          QuizzyPals is fun, interactive and engaging co-op game where you can
          create quizzes and share them with your friends. Unlike regular quiz
          games which are designed mainly for teaching, examinations or tests,
          QuizzyPals is a “Game” which is mainly focused on making a fun,
          interactive co-op experience to have with friends.
        </p>
        <p>
          Please follow the instructions below to learn how to play QuizzyPals
          with friends.
        </p>
        <h3>Starting instructions</h3>
        <h4>Starting the Game - As the Host</h4>
        <ul>
          <li>
            Share your “Room ID” (only) with the players you want to play.
          </li>
          <li>Wait for players to get connected.</li>
          <li>When ready, click the “Start Game” button.</li>
          <li>
            Enter Round Durations when prompted (More info below). Then click
            the “Start Game” button.
          </li>
        </ul>
        <h4>Starting the Game - As the Player</h4>
        <ul>
          <li>Once joined to a room, wait for the “Host” to start the game.</li>
          <li>
            A message will be displayed when the host has started the game.
          </li>
          <li>
            Click on the “Start Game” button once the host starts the game.
          </li>
        </ul>
        <h3>Round instructions</h3>
        <p>There are 5 main pages in the game:</p>
        <ul>
          <li>Lobby: Where players join a room to play.</li>
          <li>Question Round: Where a question is created.</li>
          <li>Answer Round: Where you can answer questions.</li>
          <li>
            Summary Page: Where questions and answers from all players are
            displayed.
          </li>
          <li>
            Leaderboard: Where points gained by answering questions are
            displayed.
          </li>
        </ul>
        <h4>Question Round</h4>
        <p>*You must submit your question before time runs out!</p>
        <ul>
          <li>Enter your question in the box provided.</li>
          <li>
            These are MCQ questions. Click “Add New Choice” to add an answer.
          </li>
          <li>
            Keep adding answers as needed. Then close the prompt and select the
            correct answer by marking it as “correct”.
          </li>
          <li>Click “Submit” before time runs out.</li>
        </ul>
        <h4>Answer Round</h4>
        <p>*You must submit your answers before time runs out!</p>
        <ul>
          <li>Select an answer from the given choices.</li>
          <li>Press “Submit” to save your answer.</li>
          <li>
            You can change your answers after submitting but must press “Submit”
            again to save changes.
          </li>
        </ul>
        <h4>Summary Page</h4>
        <p>
          In this page, all the answers given by all players for a particular
          question will be displayed as a summary.
        </p>
        <h4>Leaderboard (For competitive game modes)</h4>
        <p>
          This shows how many questions you have answered as points. For
          example, if it displays 3 points, it means you’ve answered 3 questions
          correctly.
        </p>
        <p>
          Players can play as many games as they like, and the leaderboard will
          keep counting points until the player leaves the room.
        </p>
        <p className="enjoy">Enjoy!</p>
      </div>
    </div>
  );
};

export default HowToPlay;
