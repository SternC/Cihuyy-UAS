import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './pages/start.jsx'
import CustomizationPage from './pages/character.jsx';
import Credit from './pages/credit.jsx'
import InventoryPage from './pages/inventory.jsx';
import InventoryFoodPage from './pages/inventoryfood.jsx';
import TheGame from './pages/game.jsx';
import Home from './pages/gameHome.jsx';
import Temple from './pages/gameBorobudur.jsx';
import Beach from './pages/gameKuta.jsx';
import Cave from './pages/gamePindul.jsx';
import Village from './pages/gamePenglipuran.jsx';
import GameOverScreen from './components/gameOverScreen.jsx';
import { CharacterProvider } from './components/characterContext.jsx'
import { TimeMoneyProvider } from './components/timeMoneyContext.jsx';

function Root() {
  return (
    <TimeMoneyProvider>
      <Router>
        <CharacterProvider>
          <Routes>
            <Route path="/" element={<App key="app" />} />
            <Route path="/customChar" element={<CustomizationPage key="custom" />} />
            <Route path="/inventory" element={<InventoryPage key="inventory" />} />
            <Route path="/inventoryfood" element={<InventoryFoodPage key="food" />} />
            <Route path="/game" element={<TheGame key="game" />} />
            <Route path="/credit" element={<Credit key="credit" />} />
            <Route path="/home" element={<Home key="home" />} />
            <Route path="/temple" element={<Temple key="temple" />} />
            <Route path="/beach" element={<Beach key="beach" />} />
            <Route path="/cave" element={<Cave key="cave" />} />
            <Route path="/village" element={<Village key="village" />} />
            <Route path="/game-over" element={<GameOverScreen key="game-over" />} />
          </Routes>
        </CharacterProvider>
      </Router>
    </TimeMoneyProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)