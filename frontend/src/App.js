import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import SignInPage from "./pages/SignInPage";
import RoomLobbyPage from "./pages/RoomLobbyPage";
import GameQuestionRound from "./pages/GameQuestionRound";
import SummaryPage from "./pages/SummaryPage";
import SignUpPage from "./pages/SignUpPage";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/welcomepage" element={<WelcomePage />} />
          <Route path="/roomlobby" element={<RoomLobbyPage />} />
          <Route path="/createquiz" element={<GameQuestionRound />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
