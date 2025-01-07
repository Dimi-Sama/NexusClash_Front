import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Showdown from './components/Showdown'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/showdown" element={<Showdown />} />
    </Routes>
  )
}

export default App
