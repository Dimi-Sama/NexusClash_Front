import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/auth';

function UserList() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserList = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const user = await getCurrentUser();
        const response = await fetch(`http://localhost:5000/anime/list/${user.id}`); // Remplacer par l'ID utilisateur réel
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la liste:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="user-list">
      <h1>Ma Liste d'Animés</h1>
      {animeList.length > 0 ? (
        <ul>
          {animeList.map((anime) => (
            <li key={anime.id}>
              <img src={anime.image_url} alt={anime.title_japanese} />
              <h3>{anime.title_japanese}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>Votre liste est vide.</p>
      )}
    </div>
  );
}

export default UserList;
