import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Candidates from './pages/Candidates'
import Jobs from './pages/Jobs'
import Applications from './pages/Applications'

function App() {
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-lg font-bold text-white">
              Resume<span className="text-blue-500">Screener</span>
            </div>
            <div className="flex gap-2">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/candidates" className={navLinkClass}>Candidates</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
              <NavLink to="/applications" className={navLinkClass}>Applications</NavLink>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App