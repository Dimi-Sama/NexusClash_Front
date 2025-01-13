import React, { useState } from 'react'

function CharactersCreation() {
  const [formData, setFormData] = useState({
    nom: '',
    competences: '',
    image: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://127.0.0.1:5000/personnages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        console.log('Personnage créé avec succès:', data)
        // Réinitialiser le formulaire ou rediriger l'utilisateur
        setFormData({ nom: '', competences: '', image: '' })
      })
      .catch(error => console.error('Erreur lors de la création du personnage:', error))
  }

  return (
    <div className="characters-creation">
      <h1>Création de Personnage</h1>
      <form onSubmit={handleSubmit} className="character-form">
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="competences">Compétences</label>
          <textarea
            id="competences"
            name="competences"
            value={formData.competences}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          Créer Personnage
        </button>
      </form>
    </div>
  )
}

export default CharactersCreation
