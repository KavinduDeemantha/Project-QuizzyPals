import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import RoomLobbyPage from './pages/RoomLobbyPage';
import GameQuestionRound from './pages/GameQuestionRound';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/welcomepage' element={<WelcomePage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/roomlobby' element={<RoomLobbyPage />} />
          <Route path='/question' element={<GameQuestionRound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
