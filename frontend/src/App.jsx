import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CompanyDetail from './pages/CompanyDetail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <h1>ReSeek</h1>
              <span className="beta-badge">MVP</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/settings" className="nav-link">Settings</Link>
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/event/:id" element={<CompanyDetail />} />
            <Route path="/settings" element={<div className="page"><h2>Settings (Coming Soon)</h2></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
