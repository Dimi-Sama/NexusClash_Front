import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './GetCharacter.css'

function GetCharacter() {
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/personnages/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setCharacter(data)
        setLoading(false)
      })
      .catch(error => {
        setError('Erreur lors de la récupération du personnage')
        setLoading(false)
        console.error('Erreur:', error)
      })
  }, [id])

  if (loading) return <div className="loading">Chargement...</div>
  if (error) return <div className="error">{error}</div>
  if (!character) return <div className="not-found">Personnage non trouvé</div>

  return (
    <div className="character-details">
      <div className="character-image">
        <img src={character.image} alt={character.nom} />
      </div>
      <h1 className="character-name">{character.nom}</h1>
      <p className="character-description">{character.competences}</p>
    </div>
  )
}

export default GetCharacter
