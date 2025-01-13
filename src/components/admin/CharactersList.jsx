import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CharactersList() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/personnages/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => setCharacters(data))
      .catch(error => console.error('Erreur lors de la récupération des personnages:', error))
  }, [])

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      fetch(`http://127.0.0.1:5000/personnages/delete/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
          }
          return response.json();
        })
        .then(() => {
          setCharacters(characters.filter(character => character.id_personnage !== id));
        })
        .catch(error => console.error('Erreur:', error));
    }
  };

  return (
    <div className="characters-list">
      <div className="list-header">
        <h1>Gestion des Personnages</h1>
        <Link to="/admin/characters/new" className="btn-create">
          Nouveau Personnage beta
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
              <td>
                <Link to={`/characters/${character.id_personnage}`}>
                  {character.nom}
                </Link>
              </td>
              <td>{character.competences}</td>
              <td>
                <Link to={`/admin/characters/${character.id_personnage}/edit`}>
                  Modifier
                </Link>
                <button onClick={() => handleDelete(character.id_personnage)}>
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

export default CharactersList
