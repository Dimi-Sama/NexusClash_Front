import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'; // Remplacez le chemin par celui de votre Navbar
import UpcomingAnimeList from './UpcomingAnimeList';
import NewAnimeList from './NewAnimeList';
import './Home.css';
function Home() {
  return (
    <div>
      {/* Votre contenu de page d'accueil actuel */}
      <div>
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <div style={{ display: 'flex', gap: '32px', padding: '16px' }}>
        {/* Prochaines sorties */}
        <div style={{ flex: 1 }}>
          <h2>Prochaines Sorties</h2>
          <UpcomingAnimeList />
        </div>

        {/* Nouveautés */}
        <div style={{ flex: 1 }}>
          <h2>Nouveautés</h2>
          <NewAnimeList />
        </div>
      </div>
    </div>
    </div>
    
  )
}

export default Home




