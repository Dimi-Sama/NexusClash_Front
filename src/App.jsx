import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Showdown from './components/Showdown'
import AnimeList from './components/AnimeList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/showdown" element={<Showdown />} />
      <Route path="/anime" element={<AnimeList />} />
    </Routes>
  )
}

export default App
