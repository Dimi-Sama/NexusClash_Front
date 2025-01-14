import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Showdown from './components/Showdown'
import AnimeList from './components/AnimeList'
import LoginPage from './components/LoginPage'
import AnimeDetail from './components/AnimeDetail'
import UserList from './components/UtilisateurList'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/showdown" element={<Showdown />} />
      <Route path="/anime" element={<AnimeList />} />
      <Route path="/anime/:id" element={<AnimeDetail />} />
      <Route path="/utilisateur" element={<UserList />} />

    </Routes>

  )
}

export default App
