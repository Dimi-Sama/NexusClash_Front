import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import './GetCharacter.css';

function GetCharacter() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/personnages/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCharacter(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Erreur lors de la récupération du personnage');
        setLoading(false);
        console.error('Erreur:', error);
      });
  }, [id]);

  return (
    <div className="admin-layout">
      <Navbar />
      <main className="admin-main">
        <div className="admin-content">
          <h1 className="page-title">Détails du Personnage</h1>
          {loading && <div className="loading">Chargement...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && !character && <div className="not-found">Personnage non trouvé</div>}
          {character && (
            <div className="character-details">
              <div className="character-image">
                <img src={character.image} alt={character.nom} />
              </div>
              <h2 className="character-name">{character.nom}</h2>
              <p className="character-description">{character.competences}</p>
              <div className="character-actions">
                <Link to={`/admin/characters/${character.id_personnage}/edit`} className="btn-edit">Modifier</Link>
                <Link to="/admin/characters" className="btn-back">Retour à la liste</Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GetCharacter;
