# QuizzyPals

*QuizzyPals* is a multiplayer quiz-based game built with the MERN (MongoDB, Express, React, Node.js) stack. Players create quizzes with answers, and after the round's timeout, other players must answer the quizzes made by their peers.

## Features
- Multiplayer game environment
- Players create custom quizzes with multiple-choice answers
- Timed game rounds for creating and answering quizzes
- Real-time leaderboard updates
- Interactive and user-friendly interface

## Tech Stack
- *Frontend*: React, CSS
- *Backend*: Node.js, Express.js
- *Database*: MongoDB
- *Real-time communication*: Socket.IO (optional for multiplayer game synchronization)
  
## Installation

1. *Clone the repository*:
    ```
    git clone https://github.com/yourusername/quizzypals.git
    cd quizzypals
    ```

2. *Install server dependencies*:
    ```
    cd backend
    npm install
    ```
   

3. *Install client dependencies*:
    ```
    cd ../frontend
    npm install
    ```
   

4. *Set up environment variables*: Create a .env file in the backend directory with the following:
    ```
    PORT=4000
    MONGO_URI=mongodb+srv://quizzy_user:<password>@cluster0.vdjkclq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```
   

5. *Run the server*:
    ```
    cd backend
    npm start
    ```

6. *Run the client*:
    ```
    cd ../frontend
    npm start
    ```

## Gameplay
1. Join a game lobby with other players.
2. In each round, every player creates a quiz with multiple-choice answers.
3. After a set timeout, the quizzes are swapped, and players must answer each other’s quizzes.
4. Scores are updated in real-time based on the accuracy and speed of responses.
5. At the end summary of who scored more and less will be shown.
