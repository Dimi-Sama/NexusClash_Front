import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Showdown from './components/Showdown'
import AnimeList from './components/AnimeList'
import LoginPage from './components/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/showdown" element={<Showdown />} />
      <Route path="/anime" element={<AnimeList />} />
      <Route path="/login" element={<LoginPage />} />

    </Routes>
  )
}

export default App
