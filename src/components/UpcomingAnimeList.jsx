import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingAnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingAnimes();
  }, []);

  const fetchUpcomingAnimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/anime/upcoming');
      setAnimes(response.data);
    } catch (err) {
      setError('Failed to fetch upcoming animes');
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {animes.map((anime,index) => (
          <div
            key={`${anime.mal_id}-${index}`}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              maxWidth: '200px',
            }}
          >
            <img
              src={anime.image_url}
              alt={anime.title}
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <h3>{anime.title}</h3>
            <p>
              {anime.description
                ? anime.description.substring(0, 100)
                : 'Aucune description disponible'}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAnimeList;
