import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Home from './components/Home'
import Showdown from './components/Showdown'
import AnimeList from './components/AnimeList'
import LoginPage from './components/LoginPage'
import AnimeDetail from './components/AnimeDetail'
import UserList from './components/UtilisateurList'
import AdminLayout from './components/admin/AdminLayout'
import AdminHome from './components/admin/AdminHome'
import CharactersAdmin from './components/admin/CharactersAdmin'
import BattlesAdmin from './components/admin/BattlesAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import UsersAdmin from './components/admin/UsersAdmin'
import MessagesAdmin from './components/admin/MessagesAdmin'
import SignupPage from './components/SignupPage'

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/showdown" element={<Showdown />} />
        <Route path="/anime" element={<AnimeList />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/utilisateur" element={<UserList />} />
        
        {/* Routes Admin protégées */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminHome />} />
          <Route path="characters" element={<CharactersAdmin />} />
          <Route path="battles" element={<BattlesAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
        </Route>
      </Routes>
    </UserProvider>
  )
}

export default App
