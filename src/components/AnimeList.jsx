import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 14; // Nombre d'animés par page

  useEffect(() => {
    fetchAnimes();
  }, [currentPage]);

  const fetchAnimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/anime/all?limit=${limit}&page=${currentPage}`
      );
      setAnimes(response.data);
    } catch (err) {
      setError('Failed to fetch animes');
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <h1>Liste des Animés</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {animes.map((anime) => (
          <div
            key={anime.id }
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              maxWidth: '200px',
            }}
          >
            <img
              src={anime.image_url} // Utilisation directe de `image_url`
              alt={anime.title}
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <h3>{anime.title}</h3>
            <p>{anime.description.substring(0, 100)}...</p> {/* Tronque la description */}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <span style={{ margin: '0 8px' }}>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={animes.length < limit}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default AnimeList;
