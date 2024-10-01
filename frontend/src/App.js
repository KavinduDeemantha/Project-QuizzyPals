import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import RoomLobbyPage from './pages/RoomLobbyPage';
import GameQuestionRound from './pages/GameQuestionRound';
import GameAnswerRound from './pages/GameAnswerRound';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/welcomepage' element={<WelcomePage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/roomlobby' element={<RoomLobbyPage />} />
          <Route path='/createquiz' element={<GameQuestionRound />} />
          <Route path='/answerquiz' element={<GameAnswerRound />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
