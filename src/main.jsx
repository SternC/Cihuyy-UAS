import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import App from './pages/start.jsx'
import CustomizationPage from './pages/character.jsx';
import Credit from './pages/credit.jsx'
import InventoryPage from './pages/inventory.jsx';
import InventoryFoodPage from './pages/inventoryfood.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/customChar" element={<CustomizationPage/>}/>  
          <Route path="/inventory" element={<InventoryPage/>}/>
          <Route path="/inventoryfood" element={<InventoryFoodPage/>}/>
          <Route path="/credit" element={<Credit/>}/>
        </Routes>
      </Router>
  </StrictMode>
)
