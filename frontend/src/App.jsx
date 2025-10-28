import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import CompanyDetail from './pages/CompanyDetail'
import Watchlist from './pages/Watchlist'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/event/:id" element={<CompanyDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/events" element={<div className="p-6"><h2 className="text-2xl font-bold">Events (Coming Soon)</h2></div>} />
            <Route path="/transcripts" element={<div className="p-6"><h2 className="text-2xl font-bold">Transcripts (Coming Soon)</h2></div>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
