import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Showdown from './components/Showdown'
import AnimeList from './components/AnimeList'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/showdown" element={<Showdown />} />
      <Route path="/anime" element={<AnimeList />} />
    </Routes>

  )
}

export default App
