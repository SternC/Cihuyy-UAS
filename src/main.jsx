import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import MenuComponent from './pages/start.jsx'
import Credit from './pages/credit.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<MenuComponent/>}/>
          <Route path="/credit" element={<Credit/>}/>
        </Routes>
      </Router>
  </StrictMode>,
)
