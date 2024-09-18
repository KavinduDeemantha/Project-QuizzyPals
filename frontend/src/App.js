import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import RoomLobbyPage from './pages/RoomLobbyPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/welcomepage' element={<WelcomePage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/lobby' element={<RoomLobbyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
