import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PopularAnimeList = () => {
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
      const response = await axios.get('http://localhost:5000/anime/popular');
      setAnimes(response.data);
    } catch (err) {
      setError('Failed to fetch new animes');
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {animes.map((anime, index) => (
          <Link 
            to={`/anime/${anime.id}`} 
            key={`${anime.id}-${index}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '200px',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <img
                src={anime.image_url}
                alt={anime.title || anime.title_japanese}
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <h3>{anime.title || anime.title_japanese}</h3>
              <p>
                {anime.description
                  ? anime.description.substring(0, 100)
                  : 'Aucune description disponible'}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularAnimeList;
