import React, { useState } from 'react'
import './AdminForm.css'

function AdminForm() {
  const [formData, setFormData] = useState({
    id_personnage: '',
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
    console.log('Formulaire soumis:', formData)
    // Ici, vous enverriez typiquement les données à votre backend
  }

  return (
    <div className="admin-form-container">
      <h1>Formulaire d'Ajout de Personnage</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="id_personnage">ID Personnage</label>
          <input
            type="number"
            id="id_personnage"
            name="id_personnage"
            value={formData.id_personnage}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="competences">Compétences</label>
          <textarea
            id="competences"
            name="competences"
            value={formData.competences}
            onChange={handleChange}
            className="form-control"
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
            className="form-control"
          />
        </div>

        <button type="submit" className="submit-button">
          Ajouter Personnage
        </button>
      </form>
    </div>
  )
}

export default AdminForm
