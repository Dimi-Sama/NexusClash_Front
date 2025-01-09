import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; // Remplacez le chemin par celui de votre Navbar
import NewAnimeList from './NewAnimeList';
import './Home.css';
import PopularAnimeList from './PopularAnimeList';

function Home() {
  return (
    <div className="home-container">
      <Navbar />

      <div className="main-content">
        {/* Prochaines Sorties */}
        <div className="section">
          <h2>Animes Populaires</h2>
          <PopularAnimeList />
        </div>

        {/* Nouveautés */}
        <div className="section">
          <h2>Nouveautés</h2>
          <NewAnimeList />
        </div>
      </div>
    </div>
  );
}

export default Home;
