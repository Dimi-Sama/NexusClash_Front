import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth';
import './UtilisateurList.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function UserList() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserList = async () => {
      try {
        const response = await fetch(`http://localhost:5000/anime/list/${user.id}`);
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la liste:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, [user, navigate]);

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  if (!user) {
    return <div>Connectez-vous pour voir votre liste</div>;
  }

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="user-list">
      <h1>Ma Liste d'Animés</h1>
      <div className="container">
        {animeList.length > 0 ? (
          <div className="anime-grid">
            {animeList.map((anime) => (
              <div
                key={anime.id}
                className="anime-card"
                onClick={() => handleAnimeClick(anime.id)}
              >
                <img src={anime.image_url} alt={anime.title || anime.title_japanese} />
                <h3>{anime.title || anime.title_japanese}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>Votre liste est vide.</p>
        )}
      </div>
    </div>
  );
}

export default UserList;
