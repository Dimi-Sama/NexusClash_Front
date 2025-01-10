import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


function CharactersEdit() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/personnages/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setCharacters(data))
      .catch(error => console.error('Erreur lors de la récupération des personnages:', error));
  }, []);

  return (
    <div className="characters-list">
      <div className="list-header">
        <h1>Gestion des Personnages</h1>
        <Link to="/admin" className="btn-create">
          Nouveau Personnage
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Compétences</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map(character => (
            <tr key={character.id_personnage}>
              <td>{character.id_personnage}</td>
              <td>{character.nom}</td>
              <td>{character.competences}</td>
              <td>
                <Link to={`/admin/characters/${character.id_personnage}/edit`}>
                  Modifier
                </Link>
                <button onClick={() => console.log('Supprimer', character.id_personnage)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CharactersEdit