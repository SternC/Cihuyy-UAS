import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import MenuComponent from './pages/start.jsx'
import './main.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<MenuComponent/>}/>
        </Routes>
      </Router>
  </StrictMode>,
)
