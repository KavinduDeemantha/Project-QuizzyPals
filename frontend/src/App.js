import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import SignInPage from "./pages/SignInPage";
import RoomLobbyPage from "./pages/RoomLobbyPage";
import GameQuestionRound from "./pages/GameQuestionRound";
import SummaryPage from "./pages/SummaryPage";
import SignUpPage from "./pages/SignUpPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GameAnswerRound from "./pages/GameAnswerRound";
import HowToPlay from "./pages/HowToPlay";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/roomlobby" element={<RoomLobbyPage />} />
          <Route path="/createquiz" element={<GameQuestionRound />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/answers" element={<GameAnswerRound />} />
          <Route path="/howToPlay" element={<HowToPlay />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
