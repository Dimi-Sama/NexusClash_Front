import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NewAnimeList.css';

const NewAnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewAnimes();
  }, []);

  const fetchNewAnimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/anime/new');
      setAnimes(response.data);
    } catch (err) {
      setError('Failed to fetch new animes');
    }
    setLoading(false);
  };

  return (
    <div className="new-anime">
      <div className="container-new">
        <h1>Nouveautés</h1>
        {loading && <p className="loading-message">Chargement...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="anime-grid">
          {animes.map((anime, index) => (
            <Link 
              to={`/anime/${anime.id}`} 
              key={`${anime.id}-${index}`}
              className="anime-card"
            >
              <img
                src={anime.image_url}
                alt={anime.title || anime.title_japanese}
              />
              <h3>{anime.title || anime.title_japanese}</h3>
              <p>
                {anime.description
                  ? anime.description.substring(0, 100) + '...'
                  : 'Aucune description disponible'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewAnimeList;