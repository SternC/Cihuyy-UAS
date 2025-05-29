import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import App from './pages/start.jsx'
import CustomizationPage from './pages/character.jsx';
import Credit from './pages/credit.jsx'
import InventoryPage from './pages/inventory.jsx';
import InventoryFoodPage from './pages/inventoryfood.jsx';
import TheGame from './pages/game.jsx';
import Home from './pages/gameHome.jsx';
import Temple from './pages/gameBorobudur.jsx';
import { CharacterProvider } from './components/characterContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CharacterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/customChar" element={<CustomizationPage/>}/>  
          <Route path="/inventory" element={<InventoryPage/>}/>
          <Route path="/inventoryfood" element={<InventoryFoodPage/>}/>
          <Route path="/game" element={<TheGame/>}/>
          <Route path="/credit" element={<Credit/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/temple" element={<Temple/>}/>
        </Routes>
      </Router>
      </CharacterProvider>
  </StrictMode>
)
